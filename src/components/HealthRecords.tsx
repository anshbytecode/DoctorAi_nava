import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Calendar, Stethoscope, Pill, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ImageUpload } from './ImageUpload';
import { useWeb3 } from '@/contexts/Web3Context';

interface HealthRecord {
  id: string;
  type: 'visit' | 'lab' | 'prescription' | 'vaccination';
  title: string;
  date: string;
  doctor?: string;
  description: string;
  notes?: string;
  images?: string[];
}

export const HealthRecords = () => {
  const { isConnected } = useWeb3();
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      type: 'visit',
      title: 'Annual Checkup',
      date: '2024-01-10',
      doctor: 'Dr. Anand Shinde',
      description: 'Routine annual health checkup',
      notes: 'All vitals normal. Recommended to continue current exercise routine.'
    },
    {
      id: '2',
      type: 'lab',
      title: 'Blood Test Results',
      date: '2024-01-08',
      description: 'Complete blood count and lipid panel',
      notes: 'All values within normal range'
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'visit' as HealthRecord['type'],
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    description: '',
    notes: '',
    images: [] as string[]
  });

  const getRecordTypeIcon = (type: HealthRecord['type']) => {
    switch (type) {
      case 'visit': return Stethoscope;
      case 'lab': return FileText;
      case 'prescription': return Pill;
      default: return FileText;
    }
  };

  const getRecordTypeColor = (type: HealthRecord['type']) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'vaccination': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      ...formData
    };
    setRecords([newRecord, ...records]);
    setIsDialogOpen(false);
    setFormData({
      type: 'visit',
      title: '',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      description: '',
      notes: '',
      images: []
    });
  };

  const handleImageUpload = (result: { url: string }) => {
    setFormData({
      ...formData,
      images: [...formData.images, result.url]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
          <p className="text-gray-600">Manage your medical history and records</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
              <DialogDescription>
                Record a new medical visit, lab result, prescription, or vaccination
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Record Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value as HealthRecord['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visit">Medical Visit</SelectItem>
                    <SelectItem value="lab">Lab Result</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual Checkup, Blood Test"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                {formData.type === 'visit' && (
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor Name</Label>
                    <Input
                      id="doctor"
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      placeholder="Dr. Name"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the record"
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or observations"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Attach Images (Optional)</Label>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  label="Upload document/image"
                  useWeb3={isConnected}
                  maxSize={10}
                />
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 border rounded">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== idx)
                            });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No health records yet</p>
              <p className="text-sm text-gray-400 mt-2">Add your first record to get started</p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => {
            const Icon = getRecordTypeIcon(record.type);
            return (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getRecordTypeColor(record.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{record.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(record.date), 'PPP')}</span>
                          {record.doctor && (
                            <>
                              <span>•</span>
                              <span>{record.doctor}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getRecordTypeColor(record.type)}>
                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">{record.description}</p>
                  {record.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  )}
                  {record.images && record.images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Attached Images ({record.images.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {record.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Record ${idx + 1}`}
                            className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};


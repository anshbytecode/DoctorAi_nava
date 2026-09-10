import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Heart, TrendingUp, Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface VitalsEntry {
  id: string;
  date: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  weight: number;
  temperature?: number;
  notes?: string;
}

export const VitalsTracker = () => {
  const [entries, setEntries] = useState<VitalsEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      weight: 70,
      temperature: 98.6,
    },
    {
      id: '2',
      date: '2024-01-10',
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 70,
      weight: 70.5,
      temperature: 98.4,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: '',
    diastolic: '',
    heartRate: '',
    weight: '',
    temperature: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: VitalsEntry = {
      id: Date.now().toString(),
      date: formData.date,
      bloodPressure: {
        systolic: Number(formData.systolic),
        diastolic: Number(formData.diastolic),
      },
      heartRate: Number(formData.heartRate),
      weight: Number(formData.weight),
      temperature: formData.temperature ? Number(formData.temperature) : undefined,
      notes: formData.notes || undefined,
    };
    setEntries([newEntry, ...entries]);
    setIsDialogOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      systolic: '',
      diastolic: '',
      heartRate: '',
      weight: '',
      temperature: '',
      notes: '',
    });
    toast({
      title: 'Vitals recorded',
      description: 'Your vitals have been saved successfully.',
    });
  };

  const getLatestVitals = () => {
    if (entries.length === 0) return null;
    return entries[0];
  };

  const getStatusColor = (value: number, type: 'bp' | 'hr' | 'weight') => {
    if (type === 'bp') {
      if (value > 140) return 'text-red-600';
      if (value > 120) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'hr') {
      if (value > 100 || value < 60) return 'text-red-600';
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  const chartData = entries
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.date), 'MMM dd'),
      'Blood Pressure': entry.bloodPressure.systolic,
      'Heart Rate': entry.heartRate,
      Weight: entry.weight,
    }));

  const latest = getLatestVitals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vitals Tracker</h2>
          <p className="text-gray-600">Track your health metrics over time</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record New Vitals</DialogTitle>
              <DialogDescription>Enter your current health metrics</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic BP</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    placeholder="120"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic BP</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    placeholder="72"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F) - Optional</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="98.6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Vitals
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {latest && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(latest.bloodPressure.systolic, 'bp')}`}>
                {latest.bloodPressure.systolic}/{latest.bloodPressure.diastolic}
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(latest.heartRate, 'hr')}`}>
                {latest.heartRate}
              </div>
              <p className="text-xs text-muted-foreground">bpm</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latest.weight}</div>
              <p className="text-xs text-muted-foreground">kg</p>
            </CardContent>
          </Card>

          {latest.temperature && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latest.temperature}</div>
                <p className="text-xs text-muted-foreground">°F</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vitals Trend</CardTitle>
            <CardDescription>Track your health metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Blood Pressure" stroke="#8884d8" />
                <Line type="monotone" dataKey="Heart Rate" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Weight" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No vitals recorded yet</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{format(new Date(entry.date), 'PPP')}</p>
                      <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                        <span>BP: {entry.bloodPressure.systolic}/{entry.bloodPressure.diastolic}</span>
                        <span>HR: {entry.heartRate} bpm</span>
                        <span>Weight: {entry.weight} kg</span>
                        {entry.temperature && <span>Temp: {entry.temperature}°F</span>}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Recorded</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


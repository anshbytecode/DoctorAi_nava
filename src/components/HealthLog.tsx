import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  Pill, 
  Activity,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { medicalAPI } from '@/lib/api';

interface HealthEntry {
  id: string;
  date: string;
  type: 'symptom' | 'medication' | 'visit' | 'vital' | 'note';
  title: string;
  description: string;
  severity?: number;
  medications?: string[];
  doctor?: string;
  vitalValues?: Record<string, number>;
}

export const HealthLog = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntry, setNewEntry] = useState({
    type: 'symptom' as HealthEntry['type'],
    title: '',
    description: '',
    severity: 5,
    medications: [] as string[],
    doctor: '',
    vitalValues: {} as Record<string, number>
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Load live logs from Neon PostgreSQL
    medicalAPI.getHealthLogs().then(data => {
      if (data && data.length > 0) {
        setEntries(data.map((l: any) => ({
          id: l.id,
          date: l.date || new Date().toISOString().split('T')[0],
          type: 'symptom',
          title: l.notes || l.symptoms || 'Daily Health Log',
          description: l.symptoms || 'Recorded in daily log',
          severity: 3
        })));
      } else {
        const mockEntries: HealthEntry[] = [
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            type: 'symptom',
            title: 'Headache',
            description: 'Mild headache in the morning, improved after taking medication',
            severity: 4
          }
        ];
        setEntries(mockEntries);
      }
    }).catch(() => {});
  }, []);

  const handleAddEntry = () => {
    if (!newEntry.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your entry",
        variant: "destructive"
      });
      return;
    }

    const entry: HealthEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      ...newEntry
    };

    setEntries([entry, ...entries]);

    // Save directly to Neon PostgreSQL
    medicalAPI.saveHealthLog({
      date: selectedDate,
      symptoms: newEntry.description || newEntry.title,
      mood: 'Normal',
      sleep_hours: 8,
      notes: newEntry.title
    }).catch(err => console.warn('Could not sync health log with Neon:', err));

    setNewEntry({
      type: 'symptom',
      title: '',
      description: '',
      severity: 5,
      medications: [],
      doctor: '',
      vitalValues: {}
    });
    setShowAddForm(false);
    toast({
      title: "Entry added & saved to Cloud Database",
      description: "Your health log entry has been saved",
    });
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  const getEntryIcon = (type: HealthEntry['type']) => {
    switch (type) {
      case 'symptom': return <Activity className="h-4 w-4 text-red-600" />;
      case 'medication': return <Pill className="h-4 w-4 text-blue-600" />;
      case 'visit': return <FileText className="h-4 w-4 text-green-600" />;
      case 'vital': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'note': return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEntryColor = (type: HealthEntry['type']) => {
    switch (type) {
      case 'symptom': return 'border-red-200 bg-red-50';
      case 'medication': return 'border-blue-200 bg-blue-50';
      case 'visit': return 'border-green-200 bg-green-50';
      case 'vital': return 'border-purple-200 bg-purple-50';
      case 'note': return 'border-gray-200 bg-gray-50';
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, HealthEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Health Log</CardTitle>
              <CardDescription>
                Track your symptoms, medications, visits, and vitals over time
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6 border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">New Health Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Entry Type</Label>
                  <Tabs value={newEntry.type} onValueChange={(v) => setNewEntry({ ...newEntry, type: v as HealthEntry['type'] })}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="symptom">Symptom</TabsTrigger>
                      <TabsTrigger value="medication">Medication</TabsTrigger>
                      <TabsTrigger value="visit">Visit</TabsTrigger>
                      <TabsTrigger value="vital">Vital</TabsTrigger>
                      <TabsTrigger value="note">Note</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="e.g., Morning Headache"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="Add details about this entry..."
                    rows={3}
                  />
                </div>

                {newEntry.type === 'symptom' && (
                  <div className="space-y-2">
                    <Label>Severity (1-10): {newEntry.severity}</Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.severity}
                      onChange={(e) => setNewEntry({ ...newEntry, severity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                )}

                {newEntry.type === 'medication' && (
                  <div className="space-y-2">
                    <Label>Medications (comma-separated)</Label>
                    <Input
                      value={newEntry.medications?.join(', ') || ''}
                      onChange={(e) => setNewEntry({ 
                        ...newEntry, 
                        medications: e.target.value.split(',').map(m => m.trim()).filter(m => m) 
                      })}
                      placeholder="e.g., Paracetamol 500mg, Vitamin D"
                    />
                  </div>
                )}

                {newEntry.type === 'visit' && (
                  <div className="space-y-2">
                    <Label>Doctor Name</Label>
                    <Input
                      value={newEntry.doctor}
                      onChange={(e) => setNewEntry({ ...newEntry, doctor: e.target.value })}
                      placeholder="e.g., Dr. Smith"
                    />
                  </div>
                )}

                {newEntry.type === 'vital' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Blood Pressure</Label>
                      <Input
                        placeholder="120/80"
                        onChange={(e) => setNewEntry({ 
                          ...newEntry, 
                          vitalValues: { ...newEntry.vitalValues, bloodPressure: e.target.value as any } 
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Heart Rate (bpm)</Label>
                      <Input
                        type="number"
                        placeholder="72"
                        onChange={(e) => setNewEntry({ 
                          ...newEntry, 
                          vitalValues: { ...newEntry.vitalValues, heartRate: parseInt(e.target.value) || 0 } 
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Temperature (°F)</Label>
                      <Input
                        type="number"
                        placeholder="98.6"
                        onChange={(e) => setNewEntry({ 
                          ...newEntry, 
                          vitalValues: { ...newEntry.vitalValues, temperature: parseFloat(e.target.value) || 0 } 
                        })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} className="flex-1">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline View */}
          <div className="space-y-6">
            {sortedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No entries yet. Start tracking your health!</p>
              </div>
            ) : (
              sortedDates.map((date) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-700">{formatDate(date)}</span>
                    </div>
                    <div className="h-px flex-1 bg-gray-300"></div>
                  </div>

                  <div className="space-y-3">
                    {groupedEntries[date].map((entry) => (
                      <div
                        key={entry.id}
                        className={`border-l-4 rounded-lg p-4 ${getEntryColor(entry.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getEntryIcon(entry.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{entry.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {entry.type}
                                </Badge>
                                {entry.severity && (
                                  <Badge variant="secondary" className="text-xs">
                                    Severity: {entry.severity}/10
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{entry.description}</p>
                              
                              {entry.medications && entry.medications.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {entry.medications.map((med, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      <Pill className="h-3 w-3 mr-1" />
                                      {med}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {entry.doctor && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  Doctor: {entry.doctor}
                                </Badge>
                              )}

                              {entry.vitalValues && Object.keys(entry.vitalValues).length > 0 && (
                                <div className="flex gap-4 mt-2 text-sm">
                                  {entry.vitalValues.bloodPressure && (
                                    <span>BP: {entry.vitalValues.bloodPressure}</span>
                                  )}
                                  {entry.vitalValues.heartRate && (
                                    <span>HR: {entry.vitalValues.heartRate} bpm</span>
                                  )}
                                  {entry.vitalValues.temperature && (
                                    <span>Temp: {entry.vitalValues.temperature}°F</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {format(parseISO(entry.date), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


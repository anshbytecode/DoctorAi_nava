import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Bell, Calendar, Pill, Activity, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'vitals' | 'general';
  title: string;
  description: string;
  time: string;
  days: string[];
  enabled: boolean;
  lastTriggered?: Date;
}

export const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Take Aspirin',
      description: '100mg daily',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      enabled: true,
    },
    {
      id: '2',
      type: 'vitals',
      title: 'Record Vitals',
      description: 'Weekly health check',
      time: '09:00',
      days: ['Monday'],
      enabled: true,
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Appointment Reminder',
      description: 'Dr. Anand Shinde - Tomorrow',
      time: '10:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      enabled: false,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'general' as Reminder['type'],
    title: '',
    description: '',
    time: '09:00',
    days: [] as string[],
    enabled: true,
  });
  const { toast } = useToast();

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'vitals': return Activity;
      default: return Bell;
    }
  };

  const getReminderColor = (type: Reminder['type']) => {
    switch (type) {
      case 'medication': return 'bg-purple-100 text-purple-800';
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'vitals': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...formData,
    };
    setReminders([...reminders, newReminder]);
    setIsDialogOpen(false);
    setFormData({
      type: 'general',
      title: '',
      description: '',
      time: '09:00',
      days: [],
      enabled: true,
    });
    toast({
      title: 'Reminder created',
      description: 'Your reminder has been set up successfully.',
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: 'Reminder deleted',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>
          <p className="text-gray-600">Set up reminders for medications, appointments, and health checks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
              <DialogDescription>Set up a reminder for your health activities</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Reminder Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value as Reminder['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="vitals">Vitals Check</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Take medication"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Repeat Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDays = formData.days.includes(day)
                          ? formData.days.filter(d => d !== day)
                          : [...formData.days, day];
                        setFormData({ ...formData, days: newDays });
                      }}
                      className={`p-2 text-xs rounded border ${
                        formData.days.includes(day)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enable Reminder</Label>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Reminder
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reminders set</p>
              <p className="text-sm text-gray-400 mt-2">Create your first reminder to get started</p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => {
            const Icon = getReminderIcon(reminder.type);
            return (
              <Card key={reminder.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${getReminderColor(reminder.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{reminder.title}</h3>
                          <Badge className={getReminderColor(reminder.type)}>
                            {reminder.type}
                          </Badge>
                          {reminder.enabled ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{reminder.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{reminder.days.length === 7 ? 'Daily' : reminder.days.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};


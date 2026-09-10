import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { appointmentAPI, Appointment } from '@/lib/api';
import { 
  Calendar, 
  Heart, 
  Activity, 
  Pill, 
  MessageSquare, 
  FileText,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DoctorRecommendations } from '@/components/DoctorRecommendations';
import { HealthEducation } from '@/components/HealthEducation';
import { AIChat } from '@/components/AIChat';
import { HealthRecords } from '@/components/HealthRecords';
import { MedicationTracker } from '@/components/MedicationTracker';
import { VitalsTracker } from '@/components/VitalsTracker';
import { Web3Badges } from '@/components/Web3Badges';
import { Reminders } from '@/components/Reminders';
import { Notifications } from '@/components/Notifications';
import { MedicineSafetyChecker } from '@/components/MedicineSafetyChecker';
import { HospitalLocator } from '@/components/HospitalLocator';
import { DiseasePredictor } from '@/components/DiseasePredictor';
import { TreatmentPlanGenerator } from '@/components/TreatmentPlanGenerator';
import { MentalHealthScanner } from '@/components/MentalHealthScanner';
import { PersonalHealthProfile } from '@/components/PersonalHealthProfile';
import { HealthLog } from '@/components/HealthLog';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';
import { AdvancedChatbot } from '@/components/AdvancedChatbot';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentAPI.getAppointments();
        if (data && data.length > 0) {
          setAppointmentsList(data);
          return;
        }
      } catch (e) {
        console.warn('Failed to load appointments:', e);
      }
      // Initial demo entries if no appointments exist yet
      setAppointmentsList([
        {
          id: 'demo-1',
          doctorId: '1',
          doctorName: 'Dr. Anand Shinde',
          specialty: 'Family Medicine',
          date: '2025-01-15',
          time: '10:00 AM',
          status: 'confirmed'
        },
        {
          id: 'demo-2',
          doctorId: '2',
          doctorName: 'Dr. Dhruv Bhilare',
          specialty: 'Veterinary',
          date: '2025-01-20',
          time: '2:30 PM',
          status: 'pending'
        }
      ]);
    };

    loadAppointments();
    window.addEventListener('doctorai_appointment_updated', loadAppointments);
    return () => window.removeEventListener('doctorai_appointment_updated', loadAppointments);
  }, [isAuthenticated]);

  const handleCancelAppointment = async (id: string, name: string) => {
    try {
      await appointmentAPI.cancelAppointment(id);
      setAppointmentsList(prev => prev.filter(apt => apt.id !== id));
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${name} was cancelled and updated in your database.`,
      });
    } catch (e) {
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel appointment at this time.",
        variant: "destructive"
      });
    }
  };

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'normal', icon: Activity },
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: Heart },
    { label: 'Weight', value: '70 kg', status: 'normal', icon: TrendingUp }
  ];

  const medications = [
    { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', nextDose: '8:00 AM' },
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', nextDose: '9:00 AM' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {!isAuthenticated && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  Welcome to DoctorAI
                </h2>
                <p className="mt-2 text-slate-600">
                  Sign up or log in to unlock your personalized dashboard, saved records, and AI tools.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span>Track vitals and symptoms over time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span>Get risk insights and next best actions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>Chat with AI for health guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-1 text-slate-600">Here’s your health overview</p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:w-[420px]">
              {healthMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-slate-600">{metric.label}</p>
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Scrollable navigation tabs with all features */}
          <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200/70 bg-slate-50/80 px-4 py-3 backdrop-blur">
            <div className="relative rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <div 
              className="overflow-x-auto custom-scrollbar"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                overflowX: 'auto',
                overflowY: 'hidden'
              }}
            >
              <TabsList className="inline-flex h-auto w-max gap-1.5 bg-transparent p-0" style={{ minWidth: 'max-content', flexWrap: 'nowrap' }}>
                <TabsTrigger 
                  value="overview" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="doctors" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Find Doctors
                </TabsTrigger>
                <TabsTrigger 
                  value="appointments" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Appointments
                </TabsTrigger>
                <TabsTrigger 
                  value="health" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Health Records
                </TabsTrigger>
                <TabsTrigger 
                  value="medications" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Medications
                </TabsTrigger>
                <TabsTrigger 
                  value="medicine-safety" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Medicine Safety
                </TabsTrigger>
                <TabsTrigger 
                  value="disease-predictor" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Risk Predictor
                </TabsTrigger>
                <TabsTrigger 
                  value="hospitals" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Hospitals
                </TabsTrigger>
                <TabsTrigger 
                  value="treatment-plan" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Treatment Plan
                </TabsTrigger>
                <TabsTrigger 
                  value="mental-health" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Mental Health
                </TabsTrigger>
                <TabsTrigger 
                  value="health-profile" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Health Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="vitals" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Vitals
                </TabsTrigger>
                <TabsTrigger 
                  value="reminders" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Reminders
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  AI Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="health-log" 
                  className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Health Log
                </TabsTrigger>
          </TabsList>
            </div>
          </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {!isAuthenticated && (
              <div className="grid gap-4 md:grid-cols-3">
                {healthMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.label} className="border-slate-200 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          {metric.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Appointments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointmentsList.length > 0 ? (
                    appointmentsList.map((appointment) => (
                      <div key={appointment.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{appointment.doctorName || (appointment as any).doctor}</h4>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.date} at {appointment.time}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          className={appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  )}
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('appointments')}
                  >
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Pill className="h-5 w-5" />
                    <span>Current Medications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medications.length > 0 ? (
                    medications.map((med, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{med.name}</h4>
                            <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                            <p className="text-xs text-gray-500 mt-1">Next dose: {med.nextDose}</p>
                          </div>
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No medications recorded</p>
                  )}
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('medications')}
                  >
                    Manage Medications
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('doctors')}
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      Find Doctors
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('appointments')}
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Book Appointment
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('health')}
                    >
                      <Heart className="h-6 w-6 mb-2" />
                      Health Records
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('vitals')}
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Track Vitals
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageSquare className="h-6 w-6 mb-2" />
                      AI Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('medicine-safety')}
                    >
                      <Pill className="h-6 w-6 mb-2" />
                      Medicine Safety
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('disease-predictor')}
                    >
                      <Activity className="h-6 w-6 mb-2" />
                      Risk Predictor
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-white"
                      onClick={() => setActiveTab('hospitals')}
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Find Hospitals
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Web3Badges />
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-6">
            <div className="w-full">
            <DoctorRecommendations analysisResult={null} />
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentsList.map((appointment) => {
                    const docName = appointment.doctorName || (appointment as any).doctor || 'Doctor';
                    return (
                      <div key={appointment.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{docName}</h4>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.date} at {appointment.time}
                            </p>
                            {appointment.reason && (
                              <p className="text-xs text-slate-500 mt-1 italic">
                                Reason: {appointment.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {appointment.status || 'pending'}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleCancelAppointment(appointment.id, docName)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <div className="w-full">
            <HealthRecords />
            </div>
          </TabsContent>

          <TabsContent value="medications" className="mt-6">
            <div className="w-full">
            <MedicationTracker />
            </div>
          </TabsContent>

          <TabsContent value="mental-health" className="mt-6">
            <div className="w-full">
            <MentalHealthScanner />
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="mt-6">
            <div className="w-full">
            <VitalsTracker />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="max-w-4xl mx-auto w-full">
              <AdvancedChatbot />
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="w-full">
            <HealthEducation />
            </div>
          </TabsContent>

          <TabsContent value="health-log" className="mt-6">
            <div className="w-full">
            <HealthLog />
            </div>
          </TabsContent>

          <TabsContent value="medicine-safety" className="mt-6">
            <div className="w-full">
              <MedicineSafetyChecker />
            </div>
          </TabsContent>

          <TabsContent value="disease-predictor" className="mt-6">
            <div className="w-full">
              <DiseasePredictor />
            </div>
          </TabsContent>

          <TabsContent value="hospitals" className="mt-6">
            <div className="w-full">
              <HospitalLocator />
            </div>
          </TabsContent>

          <TabsContent value="treatment-plan" className="mt-6">
            <div className="w-full">
              <TreatmentPlanGenerator />
            </div>
          </TabsContent>

          <TabsContent value="health-profile" className="mt-6">
            <div className="w-full">
              <PersonalHealthProfile />
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <div className="w-full">
              <Reminders />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="w-full">
              <Notifications />
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;


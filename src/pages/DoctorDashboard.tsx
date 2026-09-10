import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { MedicineInventory } from '@/components/MedicineInventory';
import { PatientDocuments } from '@/components/PatientDocuments';
import { VisitSummarySheet } from '@/components/VisitSummarySheet';
import { ConsultCopilot } from '@/components/ConsultCopilot';
import { QueueOptimizer } from '@/components/QueueOptimizer';
import { EHRIntegration } from '@/components/EHRIntegration';
import { ClinicalTrialMatcher } from '@/components/ClinicalTrialMatcher';
import { OnchainHealthProofs } from '@/components/OnchainHealthProofs';
import { TokenRewards } from '@/components/TokenRewards';

interface Patient {
  id: string;
  name: string;
  email: string;
  lastVisit?: string;
  upcomingAppointments?: number;
  status: 'active' | 'inactive';
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
  visitSummary?: any;
}

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0
  });

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    setPatients([
      { id: '1', name: 'Ananya Deshpande', email: 'ananya.d@gmail.com', lastVisit: '2025-01-14', upcomingAppointments: 2, status: 'active' },
      { id: '2', name: 'Rohan Verma', email: 'rohan.verma@outlook.com', lastVisit: '2025-01-12', upcomingAppointments: 1, status: 'active' },
      { id: '3', name: 'Meera Nair', email: 'meera.nair@yahoo.com', lastVisit: '2025-01-09', upcomingAppointments: 1, status: 'active' },
      { id: '4', name: 'Vikram Joshi', email: 'vikram.j@corp.in', lastVisit: '2025-01-04', upcomingAppointments: 0, status: 'active' },
      { id: '5', name: 'Sunita Patil', email: 'sunita.patil@rediffmail.com', lastVisit: '2024-12-28', upcomingAppointments: 1, status: 'active' },
      { id: '6', name: 'Arjun Kulkarni', email: 'arjun.k@tech.org', lastVisit: '2024-12-22', upcomingAppointments: 0, status: 'inactive' },
      { id: '7', name: 'Zoya Siddiqui', email: 'zoya.siddiqui@gmail.com', lastVisit: '2024-12-15', upcomingAppointments: 1, status: 'active' },
      { id: '8', name: 'Devendra Shinde', email: 'd.shinde@pune.gov.in', lastVisit: '2024-12-08', upcomingAppointments: 1, status: 'active' }
    ]);

    setAppointments([
      { 
        id: '1', 
        patientId: '1', 
        patientName: 'Ananya Deshpande', 
        date: todayStr, 
        time: '10:00 AM', 
        reason: 'Hypertension follow-up & medication review',
        status: 'confirmed',
        symptoms: 'Mild dizziness, BP 138/88'
      },
      { 
        id: '2', 
        patientId: '2', 
        patientName: 'Rohan Verma', 
        date: todayStr, 
        time: '11:30 AM', 
        reason: 'Type 2 Diabetes HbA1c review',
        status: 'confirmed',
        symptoms: 'Fasting blood glucose elevated (135 mg/dL)'
      },
      { 
        id: '3', 
        patientId: '3', 
        patientName: 'Meera Nair', 
        date: todayStr, 
        time: '02:00 PM', 
        reason: 'Post-viral fatigue & routine blood work',
        status: 'pending',
        symptoms: 'General weakness, muscle aches'
      },
      { 
        id: '4', 
        patientId: '5', 
        patientName: 'Sunita Patil', 
        date: todayStr, 
        time: '03:30 PM', 
        reason: 'Chronic migraine & vision sensitivity',
        status: 'pending',
        symptoms: 'Throbbing frontal headache, photophobia'
      },
      { 
        id: '5', 
        patientId: '7', 
        patientName: 'Zoya Siddiqui', 
        date: '2025-01-22', 
        time: '10:30 AM', 
        reason: 'Seasonal asthma exacerbation',
        status: 'confirmed',
        symptoms: 'Wheezing, nocturnal cough'
      },
      { 
        id: '6', 
        patientId: '8', 
        patientName: 'Devendra Shinde', 
        date: '2025-01-24', 
        time: '04:00 PM', 
        reason: 'Knee joint osteoarthritis evaluation',
        status: 'confirmed',
        symptoms: 'Bilateral knee stiffness upon walking'
      }
    ]);

    setStats({
      totalPatients: 8,
      todayAppointments: 4,
      pendingAppointments: 2,
      completedToday: 1
    });
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0] && 
    apt.status !== 'cancelled'
  );

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' as const } : apt
    ));
    toast({
      title: "Appointment completed",
      description: "Visit summary can now be generated",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, Dr. {user?.name}
            </p>
            {user?.specialty && (
              <Badge variant="outline" className="mt-2">
                {user.specialty}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="documents">Patient Documents</TabsTrigger>
            <TabsTrigger value="inventory">Medicine Inventory</TabsTrigger>
            <TabsTrigger value="copilot">Consult Copilot</TabsTrigger>
            <TabsTrigger value="queue">Queue Optimizer</TabsTrigger>
            <TabsTrigger value="ehr">EHR Sync</TabsTrigger>
            <TabsTrigger value="trials">Trial Matcher</TabsTrigger>
            <TabsTrigger value="web3">On-chain Proofs</TabsTrigger>
            <TabsTrigger value="rewards">Adherence Rewards</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Manage your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No appointments scheduled for today</p>
                  ) : (
                    todayAppointments.map((apt) => (
                      <div key={apt.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{apt.patientName}</h3>
                            <p className="text-sm text-gray-600">{apt.time}</p>
                            <p className="text-sm text-gray-500">{apt.reason}</p>
                            {apt.symptoms && (
                              <p className="text-sm text-gray-500 mt-1">
                                Symptoms: {apt.symptoms}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={
                              apt.status === 'confirmed' ? 'default' :
                              apt.status === 'completed' ? 'secondary' :
                              apt.status === 'pending' ? 'outline' : 'destructive'
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleViewPatient(patients.find(p => p.id === apt.patientId)!)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Patient
                          </Button>
                          {apt.status !== 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCompleteAppointment(apt.id)}
                            >
                              Mark Complete
                            </Button>
                          )}
                          {apt.status === 'completed' && (
                            <VisitSummarySheet appointment={apt} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>Search and manage your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredPatients.map((patient) => (
                      <div key={patient.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                          {patient.lastVisit && (
                            <p className="text-xs text-gray-500 mt-1">
                              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                            {patient.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <PatientDocuments />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <MedicineInventory />
          </TabsContent>

          <TabsContent value="copilot">
            <ConsultCopilot />
          </TabsContent>

          <TabsContent value="queue">
            <QueueOptimizer />
          </TabsContent>

          <TabsContent value="ehr">
            <EHRIntegration />
          </TabsContent>

          <TabsContent value="trials">
            <ClinicalTrialMatcher />
          </TabsContent>

          <TabsContent value="web3">
            <OnchainHealthProofs />
          </TabsContent>

          <TabsContent value="rewards">
            <TokenRewards />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;


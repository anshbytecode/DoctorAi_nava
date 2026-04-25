import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Activity, AlertTriangle, TimerReset, CheckCircle2 } from 'lucide-react';

interface QueuePatient {
  id: string;
  name: string;
  reason: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  predictedDuration: number; // minutes
  waitingTime: number; // minutes
  doctorAssigned?: string;
}

const MOCK_QUEUE: QueuePatient[] = [
  { id: 'P001', name: 'John Doe', reason: 'Chest pain', severity: 'critical', predictedDuration: 20, waitingTime: 5 },
  { id: 'P002', name: 'Sarah Lee', reason: 'Diabetes follow-up', severity: 'medium', predictedDuration: 15, waitingTime: 10 },
  { id: 'P003', name: 'Michael Chen', reason: 'Asthma flare', severity: 'high', predictedDuration: 25, waitingTime: 2 },
  { id: 'P004', name: 'Emily White', reason: 'Medication refill', severity: 'low', predictedDuration: 10, waitingTime: 15 },
  { id: 'P005', name: 'Raj Patel', reason: 'Hypertension spike', severity: 'high', predictedDuration: 20, waitingTime: 8 },
];

export const QueueOptimizer = () => {
  const { toast } = useToast();

  const prioritizedQueue = useMemo(() => {
    return [...MOCK_QUEUE].sort((a, b) => {
      const severityScore = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityA = severityScore[b.severity] - severityScore[a.severity];
      if (priorityA !== 0) return priorityA;
      return a.waitingTime - b.waitingTime;
    });
  }, []);

  const totalPredictedMinutes = prioritizedQueue.reduce((total, patient) => total + patient.predictedDuration, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" />
          AI Queue Optimizer
        </CardTitle>
        <CardDescription>Prioritize patients by severity, predicted consult duration, and waiting time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertTriangle className="h-4 w-4 text-emerald-600" />
          <AlertDescription>
            Average predicted consult time: <strong>{Math.round(totalPredictedMinutes / prioritizedQueue.length)} min</strong>.
            Queue automatically reorders when new clinical data arrives.
          </AlertDescription>
        </Alert>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Predicted Duration</TableHead>
                <TableHead>Waiting Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prioritizedQueue.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="font-semibold">{patient.name}</div>
                    <div className="text-xs text-gray-500">{patient.id}</div>
                  </TableCell>
                  <TableCell className="text-sm">{patient.reason}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        patient.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : patient.severity === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : patient.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {patient.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{patient.predictedDuration} min</div>
                    <Progress value={(patient.predictedDuration / 30) * 100} className="h-1" />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{patient.waitingTime} min</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      <TimerReset className="mr-1 h-3 w-3" />
                      SLA {patient.waitingTime > 10 ? 'at risk' : 'good'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Select defaultValue={patient.doctorAssigned || 'auto'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto assign</SelectItem>
                          <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                          <SelectItem value="dr-lee">Dr. Lee</SelectItem>
                          <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: 'Patient prioritized',
                            description: `${patient.name} moved to consult room.`,
                          })
                        }
                      >
                        Start Consult
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gray-50">
            <CardContent className="space-y-2 p-4">
              <div className="text-sm text-gray-500">Total queue length</div>
              <div className="text-2xl font-bold">{prioritizedQueue.length} patients</div>
              <p className="text-xs text-gray-500">Updated in real-time as patients join or leave.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="space-y-2 p-4">
              <div className="text-sm text-gray-500">Critical & high priority</div>
              <div className="text-2xl font-bold">
                {prioritizedQueue.filter((p) => p.severity === 'critical' || p.severity === 'high').length}
              </div>
              <p className="text-xs text-gray-500">Escalated in queue automatically.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="space-y-2 p-4">
              <div className="text-sm text-gray-500">Estimated total time</div>
              <div className="text-2xl font-bold">{totalPredictedMinutes} min</div>
              <p className="text-xs text-gray-500">Based on predicted consult durations.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          AI queue optimizer reduces waiting time by balancing severity with doctor availability.
        </div>
      </CardContent>
    </Card>
  );
};


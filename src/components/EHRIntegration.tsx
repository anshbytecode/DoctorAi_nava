import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileStack, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

const MOCK_RECORDS = [
  {
    type: 'Labs',
    source: 'Epic Health',
    status: 'synced',
    details: ['CBC (normal)', 'HbA1C 7.2%', 'Lipid profile (LDL 120)'],
    lastUpdated: 'Today 09:00',
  },
  {
    type: 'Medications',
    source: 'Cerner Health',
    status: 'synced',
    details: ['Metformin 500mg BID', 'Lisinopril 10mg daily', 'Montelukast 10mg QHS'],
    lastUpdated: 'Yesterday 16:30',
  },
  {
    type: 'Allergies',
    source: 'Regional Hospital',
    status: 'partial',
    details: ['Penicillin (rash)', 'Peanuts'],
    lastUpdated: 'Pending confirmation',
  },
];

export const EHRIntegration = () => {
  const { toast } = useToast();
  const completeness = (MOCK_RECORDS.filter((r) => r.status === 'synced').length / MOCK_RECORDS.length) * 100;

  const handleSync = () => {
    toast({
      title: 'Sync in progress',
      description: 'Pulling latest meds, allergies, and labs from connected EHRs.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileStack className="h-5 w-5 text-blue-600" />
          Automatic EHR Integration
        </CardTitle>
        <CardDescription>Pull meds, allergies, and lab results from connected systems and pre-fill case sheets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-gray-50 p-4">
          <div>
            <p className="text-sm text-gray-600">Record completeness</p>
            <p className="text-2xl font-bold">{completeness.toFixed(0)}%</p>
            <Progress value={completeness} className="mt-2 h-2" />
          </div>
          <Button onClick={handleSync} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Records
          </Button>
        </div>

        <ScrollArea className="max-h-[420px] rounded-lg border">
          <div className="divide-y">
            {MOCK_RECORDS.map((record, idx) => (
              <div key={idx} className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{record.type}</p>
                    <p className="text-sm text-gray-500">Source: {record.source}</p>
                  </div>
                  <Badge
                    className={
                      record.status === 'synced'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {record.status.toUpperCase()}
                  </Badge>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {record.details.map((detail, i) => (
                    <li key={i}>• {detail}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last updated: {record.lastUpdated}</span>
                  <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            Connected systems: Epic, Cerner, Athena. FHIR and HL7 feeds normalize data into structured visit-ready notes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};


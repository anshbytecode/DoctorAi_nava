import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Globe, Sparkles } from 'lucide-react';

const MOCK_TRIALS = [
  {
    id: 'NCT0589012',
    name: 'Smart Insulin Patch Study',
    condition: 'Type 2 Diabetes',
    phase: 'Phase III',
    location: 'Multi-center (US, EU)',
    status: 'Recruiting',
    matchScore: 92,
    inclusion: ['Age 30-70', 'HbA1c 7-10%', 'Metformin stable dose'],
  },
  {
    id: 'NCT0573341',
    name: 'Digital Twin for Hypertension',
    condition: 'Hypertension',
    phase: 'Phase II',
    location: 'Stanford, CA',
    status: 'Recruiting',
    matchScore: 80,
    inclusion: ['Stage 2 hypertension', 'No heart failure', 'BMI < 35'],
  },
  {
    id: 'NCT0550987',
    name: 'AI-Guided Asthma Therapy',
    condition: 'Moderate Asthma',
    phase: 'Phase II',
    location: 'Remote + Boston',
    status: 'Waitlist',
    matchScore: 74,
    inclusion: ['FEV1 60-80%', 'No hospitalizations last 6 months'],
  },
];

export const ClinicalTrialMatcher = () => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Clinical Trial Matcher
        </CardTitle>
        <CardDescription>Find anonymized trial matches for complex or chronic patients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="matches">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matches">Suggested Matches</TabsTrigger>
            <TabsTrigger value="search">Search Trials</TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <ScrollArea className="h-72 rounded-lg border">
              <div className="divide-y">
                {MOCK_TRIALS.map((trial) => (
                  <div key={trial.id} className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold">{trial.name}</p>
                        <p className="text-sm text-gray-500">{trial.condition}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">{trial.phase}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline">{trial.status}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {trial.location}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">Match {trial.matchScore}%</Badge>
                    </div>
                    <ul className="text-sm text-gray-600">
                      {trial.inclusion.map((criteria, idx) => (
                        <li key={idx}>• {criteria}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: 'Trial referral sent',
                            description: `${trial.name} coordinator notified.`,
                          })
                        }
                      >
                        Refer Patient
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex gap-2">
                <input className="flex-1 rounded-md border px-3 py-2" placeholder="Search by condition or trial ID..." />
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              <p classname="text-sm text-gray-500">
                Coming soon: direct search across ClinicalTrials.gov plus in-house precision medicine studies.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


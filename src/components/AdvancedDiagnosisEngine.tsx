import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TestTube, 
  Scan,
  CheckCircle2,
  XCircle,
  Activity,
  FileText
} from 'lucide-react';

interface DifferentialDiagnosis {
  condition: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  reasoning: string;
  suggestedInvestigations: {
    type: 'lab' | 'imaging' | 'procedure';
    name: string;
    priority: 'urgent' | 'routine' | 'optional';
    reason: string;
  }[];
  treatmentConsiderations: string[];
}

interface DiagnosisResult {
  differentialDiagnoses: DifferentialDiagnosis[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedNextSteps: string[];
  suggestedInvestigations: {
    type: 'lab' | 'imaging' | 'procedure';
    name: string;
    priority: 'urgent' | 'routine' | 'optional';
    reason: string;
  }[];
}

export const AdvancedDiagnosisEngine = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    oxygenSaturation: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Enter symptoms to get a differential diagnosis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate advanced AI analysis
    setTimeout(() => {
      const mockDiagnoses: DifferentialDiagnosis[] = [
        {
          condition: 'Acute Upper Respiratory Infection',
          confidence: 85,
          riskLevel: 'low',
          probability: 75,
          reasoning: 'Symptoms align with common viral infection. Low-grade fever and cough are consistent.',
          suggestedInvestigations: [
            {
              type: 'lab',
              name: 'Complete Blood Count (CBC)',
              priority: 'routine',
              reason: 'To rule out bacterial infection'
            },
            {
              type: 'lab',
              name: 'C-Reactive Protein (CRP)',
              priority: 'routine',
              reason: 'To assess inflammation level'
            }
          ],
          treatmentConsiderations: ['Symptomatic treatment', 'Rest and hydration', 'Monitor for complications']
        },
        {
          condition: 'Seasonal Allergic Rhinitis',
          confidence: 70,
          riskLevel: 'low',
          probability: 60,
          reasoning: 'Symptoms may be allergy-related, especially if seasonal pattern exists.',
          suggestedInvestigations: [
            {
              type: 'lab',
              name: 'Allergy Panel',
              priority: 'optional',
              reason: 'To identify specific allergens'
            }
          ],
          treatmentConsiderations: ['Antihistamines', 'Nasal corticosteroids', 'Allergen avoidance']
        },
        {
          condition: 'Early Pneumonia',
          confidence: 45,
          riskLevel: 'medium',
          probability: 30,
          reasoning: 'Lower probability but should be ruled out given persistent symptoms.',
          suggestedInvestigations: [
            {
              type: 'imaging',
              name: 'Chest X-Ray',
              priority: 'urgent',
              reason: 'To rule out pulmonary infection'
            },
            {
              type: 'lab',
              name: 'Sputum Culture',
              priority: 'routine',
              reason: 'To identify causative organism if present'
            }
          ],
          treatmentConsiderations: ['Antibiotics if bacterial', 'Supportive care', 'Close monitoring']
        }
      ];

      const result: DiagnosisResult = {
        differentialDiagnoses: mockDiagnoses,
        overallRiskLevel: 'medium',
        recommendedNextSteps: [
          'Monitor symptoms closely for 24-48 hours',
          'Complete suggested investigations',
          'Follow up if symptoms worsen',
          'Consider telemedicine consultation'
        ],
        suggestedInvestigations: mockDiagnoses.flatMap(d => d.suggestedInvestigations)
          .filter((inv, index, self) => 
            index === self.findIndex(i => i.name === inv.name)
          )
      };

      setDiagnosisResult(result);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Differential diagnosis generated with confidence scores",
      });
    }, 3000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getInvestigationIcon = (type: string) => {
    switch (type) {
      case 'lab': return <TestTube className="h-4 w-4" />;
      case 'imaging': return <Scan className="h-4 w-4" />;
      case 'procedure': return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Advanced AI Differential Diagnosis Engine
          </CardTitle>
          <CardDescription>
            Get comprehensive differential diagnosis with confidence scores, risk levels, and suggested investigations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symptoms</label>
              <textarea
                className="w-full min-h-32 p-3 border rounded-md"
                placeholder="Describe symptoms in detail..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient History</label>
              <textarea
                className="w-full min-h-32 p-3 border rounded-md"
                placeholder="Relevant medical history, medications, allergies..."
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature (°F)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="98.6"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Pressure</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="120/80"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Heart Rate (bpm)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="72"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">O2 Saturation (%)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={analyzeSymptoms} 
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with Advanced AI...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Differential Diagnosis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {diagnosisResult && (
        <div className="space-y-6">
          {/* Overall Risk Assessment */}
          <Alert className={`border-2 ${getRiskColor(diagnosisResult.overallRiskLevel)}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-lg font-bold">
              Overall Risk Level: {diagnosisResult.overallRiskLevel.toUpperCase()}
            </AlertTitle>
            <AlertDescription>
              Based on comprehensive analysis of symptoms, history, and vitals
            </AlertDescription>
          </Alert>

          {/* Differential Diagnoses */}
          <Card>
            <CardHeader>
              <CardTitle>Differential Diagnoses</CardTitle>
              <CardDescription>
                Ranked by probability with confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="diagnoses" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                  <TabsTrigger value="investigations">Investigations</TabsTrigger>
                  <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
                </TabsList>

                <TabsContent value="diagnoses" className="space-y-4">
                  {diagnosisResult.differentialDiagnoses.map((diagnosis, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{diagnosis.condition}</CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getRiskColor(diagnosis.riskLevel)}>
                                {diagnosis.riskLevel.toUpperCase()} RISK
                              </Badge>
                              <Badge variant="outline">
                                {diagnosis.probability}% Probability
                              </Badge>
                              <Badge variant="secondary">
                                {diagnosis.confidence}% Confidence
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">AI Reasoning:</h4>
                          <p className="text-sm text-gray-700">{diagnosis.reasoning}</p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Confidence Score</span>
                            <span className="text-sm">{diagnosis.confidence}%</span>
                          </div>
                          <Progress value={diagnosis.confidence} className="h-2" />
                        </div>

                        {diagnosis.suggestedInvestigations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Suggested Investigations:</h4>
                            <div className="space-y-2">
                              {diagnosis.suggestedInvestigations.map((inv, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                  {getInvestigationIcon(inv.type)}
                                  <span className="flex-1 text-sm">{inv.name}</span>
                                  <Badge className={getPriorityColor(inv.priority)}>
                                    {inv.priority}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {diagnosis.treatmentConsiderations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Treatment Considerations:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {diagnosis.treatmentConsiderations.map((consideration, idx) => (
                                <li key={idx}>{consideration}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="investigations">
                  <div className="space-y-3">
                    {diagnosisResult.suggestedInvestigations.map((inv, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getInvestigationIcon(inv.type)}
                              <div>
                                <h4 className="font-semibold">{inv.name}</h4>
                                <p className="text-sm text-gray-600">{inv.reason}</p>
                              </div>
                            </div>
                            <Badge className={getPriorityColor(inv.priority)}>
                              {inv.priority}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="next-steps">
                  <div className="space-y-3">
                    {diagnosisResult.recommendedNextSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                        <span className="flex-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};


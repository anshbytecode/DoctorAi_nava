import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Target
} from 'lucide-react';

interface DiseasePlan {
  disease: 'diabetes' | 'hypertension' | 'asthma';
  currentStatus: 'well-controlled' | 'moderate' | 'poorly-controlled';
  trends: {
    metric: string;
    trend: 'improving' | 'stable' | 'worsening';
    value: string;
    target: string;
  }[];
  adjustments: {
    type: 'medication' | 'lifestyle' | 'monitoring';
    recommendation: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  adherenceScore: number;
}

export const ChronicDiseaseCoach = () => {
  const { toast } = useToast();
  const [selectedDisease, setSelectedDisease] = useState<'diabetes' | 'hypertension' | 'asthma'>('diabetes');
  const [plan, setPlan] = useState<DiseasePlan | null>(null);
  const [recentData, setRecentData] = useState<any>({});

  useEffect(() => {
    // Simulate fetching recent data from wearables/IoT
    const mockData = {
      diabetes: {
        glucose: [120, 115, 130, 125, 118],
        medicationAdherence: 85,
        exercise: [30, 45, 20, 35, 40],
        sleep: [7, 6.5, 8, 7.5, 7]
      },
      hypertension: {
        bloodPressure: ['130/85', '128/82', '135/88', '125/80', '132/85'],
        medicationAdherence: 90,
        stress: [6, 5, 7, 4, 6],
        sodium: [2300, 2100, 2500, 2000, 2400]
      },
      asthma: {
        peakFlow: [450, 460, 440, 470, 455],
        medicationAdherence: 80,
        symptoms: [2, 1, 3, 1, 2],
        triggers: ['pollen', 'none', 'dust', 'none', 'pollen']
      }
    };
    setRecentData(mockData[selectedDisease]);
    generatePlan(selectedDisease, mockData[selectedDisease]);
  }, [selectedDisease]);

  const generatePlan = (disease: string, data: any) => {
    let mockPlan: DiseasePlan;

    if (disease === 'diabetes') {
      const avgGlucose = data.glucose.reduce((a: number, b: number) => a + b, 0) / data.glucose.length;
      const status = avgGlucose < 130 ? 'well-controlled' : avgGlucose < 180 ? 'moderate' : 'poorly-controlled';
      
      mockPlan = {
        disease: 'diabetes',
        currentStatus: status,
        trends: [
          {
            metric: 'Blood Glucose',
            trend: avgGlucose < 130 ? 'improving' : 'stable',
            value: `${avgGlucose.toFixed(0)} mg/dL`,
            target: '<130 mg/dL'
          },
          {
            metric: 'Medication Adherence',
            trend: data.medicationAdherence > 80 ? 'improving' : 'stable',
            value: `${data.medicationAdherence}%`,
            target: '>90%'
          },
          {
            metric: 'Exercise',
            trend: 'stable',
            value: `${Math.round(data.exercise.reduce((a: number, b: number) => a + b, 0) / data.exercise.length)} min/day`,
            target: '30+ min/day'
          }
        ],
        adjustments: [
          {
            type: 'medication',
            recommendation: 'Consider adjusting metformin timing if glucose spikes after meals',
            reason: 'Post-meal glucose readings show slight elevation',
            priority: 'medium'
          },
          {
            type: 'lifestyle',
            recommendation: 'Increase exercise consistency - aim for daily 30-minute walks',
            reason: 'Exercise patterns show irregularity',
            priority: 'high'
          },
          {
            type: 'monitoring',
            recommendation: 'Check glucose before meals and 2 hours after',
            reason: 'More frequent monitoring will help identify patterns',
            priority: 'high'
          }
        ],
        adherenceScore: data.medicationAdherence
      };
    } else if (disease === 'hypertension') {
      const avgSystolic = 130; // Simplified
      const status = avgSystolic < 130 ? 'well-controlled' : avgSystolic < 140 ? 'moderate' : 'poorly-controlled';
      
      mockPlan = {
        disease: 'hypertension',
        currentStatus: status,
        trends: [
          {
            metric: 'Blood Pressure',
            trend: 'stable',
            value: '130/85 mmHg',
            target: '<130/80 mmHg'
          },
          {
            metric: 'Medication Adherence',
            trend: 'improving',
            value: `${data.medicationAdherence}%`,
            target: '>90%'
          },
          {
            metric: 'Stress Level',
            trend: 'stable',
            value: `${Math.round(data.stress.reduce((a: number, b: number) => a + b, 0) / data.stress.length)}/10`,
            target: '<5/10'
          }
        ],
        adjustments: [
          {
            type: 'lifestyle',
            recommendation: 'Reduce sodium intake - current average is 2300mg, target is <2000mg',
            reason: 'Sodium levels slightly elevated',
            priority: 'high'
          },
          {
            type: 'lifestyle',
            recommendation: 'Practice stress reduction techniques - meditation or yoga',
            reason: 'Stress levels fluctuate',
            priority: 'medium'
          },
          {
            type: 'monitoring',
            recommendation: 'Monitor BP twice daily at consistent times',
            reason: 'Consistent monitoring helps track effectiveness',
            priority: 'high'
          }
        ],
        adherenceScore: data.medicationAdherence
      };
    } else {
      const avgPeakFlow = data.peakFlow.reduce((a: number, b: number) => a + b, 0) / data.peakFlow.length;
      const status = avgPeakFlow > 450 ? 'well-controlled' : avgPeakFlow > 400 ? 'moderate' : 'poorly-controlled';
      
      mockPlan = {
        disease: 'asthma',
        currentStatus: status,
        trends: [
          {
            metric: 'Peak Flow',
            trend: 'improving',
            value: `${Math.round(avgPeakFlow)} L/min`,
            target: '>450 L/min'
          },
          {
            metric: 'Medication Adherence',
            trend: data.medicationAdherence > 80 ? 'stable' : 'worsening',
            value: `${data.medicationAdherence}%`,
            target: '>90%'
          },
          {
            metric: 'Symptom Frequency',
            trend: 'improving',
            value: `${Math.round(data.symptoms.reduce((a: number, b: number) => a + b, 0) / data.symptoms.length)}/10`,
            target: '<2/10'
          }
        ],
        adjustments: [
          {
            type: 'medication',
            recommendation: 'Ensure rescue inhaler is always accessible',
            reason: 'Peak flow readings show some variability',
            priority: 'high'
          },
          {
            type: 'lifestyle',
            recommendation: 'Avoid known triggers - pollen detected on 2 days',
            reason: 'Trigger exposure may cause flare-ups',
            priority: 'high'
          },
          {
            type: 'monitoring',
            recommendation: 'Record peak flow morning and evening',
            reason: 'Daily monitoring helps detect early changes',
            priority: 'medium'
          }
        ],
        adherenceScore: data.medicationAdherence
      };
    }

    setPlan(mockPlan);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'well-controlled': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'worsening': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-600" />
            Smart Chronic Disease Coach
          </CardTitle>
          <CardDescription>
            Continuous plan adjustments based on trends from wearables, IoT devices, and app logs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedDisease} onValueChange={(v) => setSelectedDisease(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
              <TabsTrigger value="hypertension">Hypertension</TabsTrigger>
              <TabsTrigger value="asthma">Asthma</TabsTrigger>
            </TabsList>
          </Tabs>

          {plan && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{plan.disease.charAt(0).toUpperCase() + plan.disease.slice(1)} Management</h3>
                  <p className="text-sm text-gray-600">Current Status</p>
                </div>
                <Badge className={`${getStatusColor(plan.currentStatus)} text-lg px-4 py-2`}>
                  {plan.currentStatus.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Medication Adherence Score</span>
                  <span className="font-bold">{plan.adherenceScore}%</span>
                </div>
                <Progress value={plan.adherenceScore} className="h-3" />
              </div>

              <div>
                <h4 className="font-semibold mb-3">Trends & Metrics</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {plan.trends.map((trend, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{trend.metric}</span>
                          {getTrendIcon(trend.trend)}
                        </div>
                        <div className="text-2xl font-bold mb-1">{trend.value}</div>
                        <div className="text-xs text-gray-600">Target: {trend.target}</div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {trend.trend}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI-Generated Plan Adjustments</h4>
                <div className="space-y-3">
                  {plan.adjustments.map((adjustment, idx) => (
                    <Card key={idx} className={`border-l-4 ${
                      adjustment.priority === 'high' ? 'border-l-red-500' :
                      adjustment.priority === 'medium' ? 'border-l-yellow-500' :
                      'border-l-blue-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{adjustment.type}</Badge>
                              <Badge className={
                                adjustment.priority === 'high' ? 'bg-red-100 text-red-800' :
                                adjustment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {adjustment.priority} priority
                              </Badge>
                            </div>
                            <h5 className="font-semibold mb-1">{adjustment.recommendation}</h5>
                            <p className="text-sm text-gray-600">{adjustment.reason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Next Review</h4>
                    <p className="text-sm text-blue-800">
                      Plan will be automatically updated based on new data from your devices and logs.
                      Review scheduled in 7 days or if significant changes detected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Heart,
  Droplet,
  Calendar,
  Bell
} from 'lucide-react';

interface RiskPrediction {
  riskType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
  alertThreshold: number;
}

export const PredictiveRiskScoring = () => {
  const { toast } = useToast();
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    conditions: [] as string[],
    currentMedications: '',
    vitals: {
      bloodPressure: '',
      heartRate: '',
      bloodSugar: '',
      weight: '',
      height: ''
    },
    lifestyle: {
      exercise: '',
      sleep: '',
      stress: '',
      smoking: '',
      alcohol: ''
    }
  });
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateRisks = async () => {
    setIsAnalyzing(true);

    // Simulate AI risk prediction
    setTimeout(() => {
      const predictions: RiskPrediction[] = [];

      // Blood Pressure Risk
      const bp = parseInt(patientData.vitals.bloodPressure.split('/')[0]);
      if (bp > 140 || patientData.conditions.includes('Hypertension')) {
        predictions.push({
          riskType: 'Hypertension Spike',
          riskLevel: bp > 160 ? 'high' : 'medium',
          probability: bp > 160 ? 75 : 45,
          timeframe: 'Next 7-14 days',
          factors: [
            'Current BP readings elevated',
            'Stress levels may contribute',
            'Medication adherence needed'
          ],
          recommendations: [
            'Monitor BP daily',
            'Reduce sodium intake',
            'Ensure medication compliance',
            'Consider stress management techniques'
          ],
          alertThreshold: 140
        });
      }

      // Blood Sugar Risk (if diabetic)
      if (patientData.conditions.includes('Diabetes')) {
        const sugar = parseFloat(patientData.vitals.bloodSugar);
        if (sugar > 180 || sugar < 70) {
          predictions.push({
            riskType: 'Blood Sugar Out of Range',
            riskLevel: sugar > 250 || sugar < 50 ? 'critical' : 'high',
            probability: sugar > 250 || sugar < 50 ? 85 : 60,
            timeframe: 'Next 24-48 hours',
            factors: [
              'Current glucose levels abnormal',
              'Dietary patterns may affect',
              'Medication timing important'
            ],
            recommendations: [
              'Check blood sugar more frequently',
              'Review meal timing and content',
              'Ensure proper medication dosing',
              'Have emergency glucose available'
            ],
            alertThreshold: sugar > 180 ? 180 : 70
          });
        }
      }

      // Asthma Flare Risk
      if (patientData.conditions.includes('Asthma')) {
        const stress = parseInt(patientData.lifestyle.stress) || 5;
        const exercise = parseInt(patientData.lifestyle.exercise) || 3;
        if (stress > 7 || exercise < 2) {
          predictions.push({
            riskType: 'Asthma Flare',
            riskLevel: stress > 8 ? 'high' : 'medium',
            probability: stress > 8 ? 65 : 40,
            timeframe: 'Next 3-7 days',
            factors: [
              'High stress levels detected',
              'Reduced exercise may affect lung function',
              'Environmental triggers possible'
            ],
            recommendations: [
              'Carry rescue inhaler at all times',
              'Practice stress reduction techniques',
              'Monitor peak flow daily',
              'Avoid known triggers'
            ],
            alertThreshold: 7
          });
        }
      }

      // Heart Rate Risk
      const hr = parseInt(patientData.vitals.heartRate);
      if (hr > 100 || hr < 50) {
        predictions.push({
          riskType: 'Cardiac Arrhythmia Risk',
          riskLevel: hr > 120 || hr < 40 ? 'high' : 'medium',
          probability: hr > 120 || hr < 40 ? 55 : 35,
          timeframe: 'Next 1-3 days',
          factors: [
            'Abnormal heart rate detected',
            'May indicate underlying condition',
            'Stress or medication effects possible'
          ],
          recommendations: [
            'Monitor heart rate regularly',
            'Avoid excessive caffeine',
            'Ensure adequate hydration',
            'Consult if symptoms worsen'
          ],
          alertThreshold: hr > 100 ? 100 : 50
        });
      }

      setRiskPredictions(predictions);
      setIsAnalyzing(false);
      toast({
        title: "Risk analysis complete",
        description: `${predictions.length} risk predictions generated`,
      });
    }, 2500);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Predictive Risk Scoring
          </CardTitle>
          <CardDescription>
            AI-powered short-term risk prediction using history, vitals, and lifestyle data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chronic Conditions</Label>
                <div className="flex flex-wrap gap-2">
                  {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease'].map(condition => (
                    <Badge
                      key={condition}
                      variant={patientData.conditions.includes(condition) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const conditions = patientData.conditions.includes(condition)
                          ? patientData.conditions.filter(c => c !== condition)
                          : [...patientData.conditions, condition];
                        setPatientData({ ...patientData, conditions });
                      }}
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Current Vitals</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Pressure</Label>
                  <Input
                    value={patientData.vitals.bloodPressure}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      vitals: { ...patientData.vitals, bloodPressure: e.target.value }
                    })}
                    placeholder="120/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={patientData.vitals.heartRate}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      vitals: { ...patientData.vitals, heartRate: e.target.value }
                    })}
                    placeholder="72"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Sugar (mg/dL)</Label>
                  <Input
                    type="number"
                    value={patientData.vitals.bloodSugar}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      vitals: { ...patientData.vitals, bloodSugar: e.target.value }
                    })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={patientData.vitals.weight}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      vitals: { ...patientData.vitals, weight: e.target.value }
                    })}
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Lifestyle Factors</h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Exercise (hrs/week)</Label>
                <Input
                  type="number"
                  value={patientData.lifestyle.exercise}
                  onChange={(e) => setPatientData({
                    ...patientData,
                    lifestyle: { ...patientData.lifestyle, exercise: e.target.value }
                  })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label>Sleep (hrs/night)</Label>
                <Input
                  type="number"
                  value={patientData.lifestyle.sleep}
                  onChange={(e) => setPatientData({
                    ...patientData,
                    lifestyle: { ...patientData.lifestyle, sleep: e.target.value }
                  })}
                  placeholder="7"
                />
              </div>
              <div className="space-y-2">
                <Label>Stress (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={patientData.lifestyle.stress}
                  onChange={(e) => setPatientData({
                    ...patientData,
                    lifestyle: { ...patientData.lifestyle, stress: e.target.value }
                  })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label>Smoking</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={patientData.lifestyle.smoking}
                  onChange={(e) => setPatientData({
                    ...patientData,
                    lifestyle: { ...patientData.lifestyle, smoking: e.target.value }
                  })}
                >
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Alcohol</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={patientData.lifestyle.alcohol}
                  onChange={(e) => setPatientData({
                    ...patientData,
                    lifestyle: { ...patientData.lifestyle, alcohol: e.target.value }
                  })}
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateRisks} 
            disabled={isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Risks...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Calculate Predictive Risks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {riskPredictions.length > 0 && (
        <div className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertTitle>Risk Predictions Generated</AlertTitle>
            <AlertDescription>
              {riskPredictions.length} potential risk(s) identified. Review recommendations below.
            </AlertDescription>
          </Alert>

          {riskPredictions.map((risk, idx) => (
            <Card key={idx} className={`border-l-4 ${
              risk.riskLevel === 'critical' ? 'border-l-red-500' :
              risk.riskLevel === 'high' ? 'border-l-orange-500' :
              risk.riskLevel === 'medium' ? 'border-l-yellow-500' :
              'border-l-green-500'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {risk.riskType}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline">
                        {risk.probability}% Probability
                      </Badge>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {risk.timeframe}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Risk Probability</span>
                    <span className="text-sm">{risk.probability}%</span>
                  </div>
                  <Progress value={risk.probability} className="h-2" />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contributing Factors:</h4>
                  <ul className="space-y-1">
                    {risk.factors.map((factor, fidx) => (
                      <li key={fidx} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <div className="space-y-2">
                    {risk.recommendations.map((rec, ridx) => (
                      <div key={ridx} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm flex-1">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Brain,
  Droplet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RiskPrediction {
  disease: string;
  risk: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
  recommendations: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const DiseasePredictor = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    bloodPressure: '',
    bloodSugar: '',
    cholesterol: '',
    familyHistory: '',
    lifestyle: '',
    exercise: '',
    smoking: '',
    alcohol: '',
  });
  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const calculateRisk = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const age = parseInt(formData.age) || 30;
      const bp = parseInt(formData.bloodPressure) || 120;
      const sugar = parseInt(formData.bloodSugar) || 100;
      const chol = parseInt(formData.cholesterol) || 200;
      const bmi = formData.weight && formData.height 
        ? parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)
        : 22;

      const predictions: RiskPrediction[] = [];

      // Diabetes Risk
      let diabetesScore = 0;
      const diabetesFactors: string[] = [];
      if (age > 45) { diabetesScore += 20; diabetesFactors.push('Age > 45'); }
      if (bmi > 25) { diabetesScore += 25; diabetesFactors.push('Overweight (BMI > 25)'); }
      if (sugar > 100) { diabetesScore += 30; diabetesFactors.push('Elevated blood sugar'); }
      if (formData.familyHistory?.toLowerCase().includes('diabetes')) { 
        diabetesScore += 15; 
        diabetesFactors.push('Family history of diabetes'); 
      }
      if (formData.exercise === 'none') { diabetesScore += 10; diabetesFactors.push('No regular exercise'); }

      predictions.push({
        disease: 'Type 2 Diabetes',
        risk: diabetesScore > 60 ? 'high' : diabetesScore > 40 ? 'medium' : 'low',
        score: Math.min(diabetesScore, 100),
        factors: diabetesFactors,
        recommendations: [
          'Maintain healthy weight',
          'Regular exercise (30 min daily)',
          'Monitor blood sugar levels',
          'Eat balanced diet',
          'Annual health checkup'
        ],
        icon: Droplet,
      });

      // Heart Disease Risk
      let heartScore = 0;
      const heartFactors: string[] = [];
      if (age > 50) { heartScore += 20; heartFactors.push('Age > 50'); }
      if (bp > 140) { heartScore += 30; heartFactors.push('High blood pressure'); }
      if (chol > 240) { heartScore += 25; heartFactors.push('High cholesterol'); }
      if (formData.smoking === 'yes') { heartScore += 25; heartFactors.push('Smoking'); }
      if (formData.familyHistory?.toLowerCase().includes('heart')) { 
        heartScore += 15; 
        heartFactors.push('Family history of heart disease'); 
      }
      if (formData.exercise === 'none') { heartScore += 10; heartFactors.push('Sedentary lifestyle'); }

      predictions.push({
        disease: 'Heart Disease',
        risk: heartScore > 60 ? 'high' : heartScore > 40 ? 'medium' : 'low',
        score: Math.min(heartScore, 100),
        factors: heartFactors,
        recommendations: [
          'Control blood pressure',
          'Lower cholesterol levels',
          'Quit smoking',
          'Regular cardiovascular exercise',
          'Heart-healthy diet',
          'Annual cardiac screening'
        ],
        icon: Heart,
      });

      // Hypertension Risk
      let hypertensionScore = 0;
      const hypertensionFactors: string[] = [];
      if (bp > 130) { hypertensionScore += 40; hypertensionFactors.push('Elevated blood pressure'); }
      if (bmi > 25) { hypertensionScore += 20; hypertensionFactors.push('Overweight'); }
      if (formData.smoking === 'yes') { hypertensionScore += 15; hypertensionFactors.push('Smoking'); }
      if (formData.alcohol === 'daily') { hypertensionScore += 15; hypertensionFactors.push('Regular alcohol consumption'); }
      if (formData.exercise === 'none') { hypertensionScore += 10; hypertensionFactors.push('No exercise'); }

      predictions.push({
        disease: 'Hypertension',
        risk: hypertensionScore > 50 ? 'high' : hypertensionScore > 30 ? 'medium' : 'low',
        score: Math.min(hypertensionScore, 100),
        factors: hypertensionFactors,
        recommendations: [
          'Reduce sodium intake',
          'Maintain healthy weight',
          'Regular exercise',
          'Limit alcohol',
          'Stress management',
          'Regular BP monitoring'
        ],
        icon: Activity,
      });

      setPredictions(predictions);
      setIsAnalyzing(false);
      toast({
        title: "Risk assessment complete",
        description: "Review your disease risk predictions below",
      });
    }, 2000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Disease Risk Predictor</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Assess your risk for common diseases using AI-powered prediction models
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
            <CardDescription>Enter your health metrics for risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="cm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure (Systolic)</Label>
              <Input
                id="bloodPressure"
                type="number"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                placeholder="e.g., 120"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                  placeholder="mg/dL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  value={formData.cholesterol}
                  onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })}
                  placeholder="mg/dL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHistory">Family History</Label>
              <Input
                id="familyHistory"
                value={formData.familyHistory}
                onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                placeholder="e.g., Diabetes, Heart disease"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise Frequency</Label>
              <Select value={formData.exercise} onValueChange={(value) => setFormData({ ...formData, exercise: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">3-4 times/week</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smoking">Smoking</Label>
                <Select value={formData.smoking} onValueChange={(value) => setFormData({ ...formData, smoking: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol">Alcohol</Label>
                <Select value={formData.alcohol} onValueChange={(value) => setFormData({ ...formData, alcohol: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={calculateRisk}
              disabled={isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Calculate Risk'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {predictions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Fill in your health information and calculate risk</p>
              </CardContent>
            </Card>
          ) : (
            predictions.map((prediction, index) => {
              const Icon = prediction.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-purple-600" />
                        <CardTitle>{prediction.disease}</CardTitle>
                      </div>
                      <Badge className={getRiskColor(prediction.risk)}>
                        {prediction.risk.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{prediction.score}%</span>
                      </div>
                      <Progress value={prediction.score} className="h-2" />
                    </div>

                    {prediction.factors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                        <div className="space-y-1">
                          {prediction.factors.map((factor, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {prediction.risk === 'high' && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900">High Risk Detected</AlertTitle>
                        <AlertDescription className="text-red-800">
                          Please consult with a healthcare provider for proper evaluation and management.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Mic,
  Image as ImageIcon,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';
import { useWeb3 } from '@/contexts/Web3Context';

interface FollowUpQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'slider' | 'yesno';
  options?: string[];
  answer?: string | number;
}

interface SymptomAnalysis {
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    timeToRecover?: string;
  }>;
  recommendations: string[];
  urgency: 'immediate' | '24-48hrs' | 'routine';
  flag: 'red' | 'yellow' | 'green';
  followUpQuestions: FollowUpQuestion[];
  confidence: number;
}

interface EnhancedSymptomCheckerProps {
  onAnalysisComplete: (result: any) => void;
  onNavigateToDoctor: () => void;
}

export const EnhancedSymptomChecker = ({ 
  onAnalysisComplete, 
  onNavigateToDoctor 
}: EnhancedSymptomCheckerProps) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'followup' | 'results'>('symptoms');
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, any>>({});
  const [painLevel, setPainLevel] = useState([5]);
  const { toast } = useToast();
  const { isConnected } = useWeb3();

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Sore throat',
    'Back pain', 'Stomach pain', 'Dizziness', 'Chest pain', 'Shortness of breath'
  ];

  const generateFollowUpQuestions = (symptoms: string): FollowUpQuestion[] => {
    const questions: FollowUpQuestion[] = [];
    
    // Always ask these core questions
    questions.push({
      id: 'days-unwell',
      question: 'How many days have you been unwell?',
      type: 'select',
      options: ['Less than 1 day', '1-2 days', '3-5 days', '6-7 days', 'More than a week', 'More than 2 weeks']
    });

    questions.push({
      id: 'outside-exposure',
      question: 'Have you been exposed to anyone with similar symptoms or illness in the past 2 weeks?',
      type: 'yesno',
    });

    questions.push({
      id: 'allergies',
      question: 'Do you have any known allergies?',
      type: 'select',
      options: ['None', 'Food allergies', 'Medication allergies', 'Environmental allergies (pollen, dust)', 'Other']
    });

    // Pain-related questions
    if (symptoms.toLowerCase().includes('pain')) {
      questions.push({
        id: 'pain-level',
        question: 'What is your pain level? (1-10)',
        type: 'slider',
      });
      questions.push({
        id: 'pain-duration',
        question: 'How long have you been experiencing this pain?',
        type: 'select',
        options: ['Less than 24 hours', '1-3 days', '3-7 days', 'More than a week']
      });
      questions.push({
        id: 'pain-location',
        question: 'Where is the pain located?',
        type: 'select',
        options: ['Head', 'Chest', 'Abdomen', 'Back', 'Joints', 'Muscles', 'Multiple locations', 'Other']
      });
      questions.push({
        id: 'pain-type',
        question: 'What type of pain is it?',
        type: 'select',
        options: ['Sharp', 'Dull', 'Throbbing', 'Burning', 'Aching', 'Stabbing', 'Other']
      });
    }

    // Fever-related questions
    if (symptoms.toLowerCase().includes('fever')) {
      questions.push({
        id: 'fever-temp',
        question: 'What is your temperature?',
        type: 'select',
        options: ['Below 100°F (37.8°C)', '100-101°F (37.8-38.3°C)', '101-102°F (38.3-38.9°C)', 'Above 102°F (38.9°C)', 'Not measured']
      });
      questions.push({
        id: 'fever-duration',
        question: 'How many days have you had fever?',
        type: 'select',
        options: ['Less than 1 day', '1-2 days', '3-5 days', 'More than 5 days']
      });
      questions.push({
        id: 'fever-pattern',
        question: 'When does the fever occur?',
        type: 'select',
        options: ['Constant', 'Intermittent', 'Worse in evening', 'Worse in morning', 'Not sure']
      });
    }

    // Respiratory symptoms
    if (symptoms.toLowerCase().includes('cough') || symptoms.toLowerCase().includes('breath')) {
      questions.push({
        id: 'cough-type',
        question: 'What type of cough do you have?',
        type: 'select',
        options: ['Dry cough', 'Wet/productive cough', 'Persistent cough', 'Cough with blood', 'Not applicable']
      });
      questions.push({
        id: 'breathing-difficulty',
        question: 'How would you rate your breathing difficulty?',
        type: 'select',
        options: ['No difficulty', 'Mild difficulty', 'Moderate difficulty', 'Severe difficulty', 'Cannot breathe']
      });
    }

    // Gastrointestinal symptoms
    if (symptoms.toLowerCase().includes('stomach') || symptoms.toLowerCase().includes('nausea') || symptoms.toLowerCase().includes('vomit')) {
      questions.push({
        id: 'appetite',
        question: 'How is your appetite?',
        type: 'select',
        options: ['Normal', 'Reduced', 'No appetite', 'Increased']
      });
      questions.push({
        id: 'bowel-movements',
        question: 'Any changes in bowel movements?',
        type: 'select',
        options: ['Normal', 'Diarrhea', 'Constipation', 'Blood in stool', 'Not applicable']
      });
    }

    // Additional standard questions
    questions.push({
      id: 'medications',
      question: 'Are you currently taking any medications?',
      type: 'text',
    });

    questions.push({
      id: 'chronic-conditions',
      question: 'Do you have any chronic conditions?',
      type: 'select',
      options: ['None', 'Diabetes', 'Heart disease', 'Hypertension', 'Asthma', 'Kidney disease', 'Liver disease', 'Other']
    });

    questions.push({
      id: 'recent-travel',
      question: 'Have you traveled recently? (Last 2 weeks)',
      type: 'yesno',
    });

    questions.push({
      id: 'activity-level',
      question: 'How has this affected your daily activities?',
      type: 'select',
      options: ['No impact', 'Mild impact', 'Moderate impact', 'Severe impact', 'Cannot perform daily activities']
    });

    questions.push({
      id: 'sleep-quality',
      question: 'How has your sleep been affected?',
      type: 'select',
      options: ['No change', 'Slightly affected', 'Moderately affected', 'Severely affected', 'Cannot sleep']
    });

    return questions;
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your symptoms to get an AI analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with enhanced features
    setTimeout(() => {
      const followUpQuestions = generateFollowUpQuestions(symptoms);
      
      // Determine severity and flag
      let severity: SymptomAnalysis['severity'] = 'low';
      let flag: SymptomAnalysis['flag'] = 'green';
      let urgency: SymptomAnalysis['urgency'] = 'routine';
      
      const symptomsLower = symptoms.toLowerCase();
      if (symptomsLower.includes('chest pain') || 
          symptomsLower.includes('shortness of breath') ||
          symptomsLower.includes('severe') ||
          symptomsLower.includes('unconscious')) {
        severity = 'critical';
        flag = 'red';
        urgency = 'immediate';
      } else if (symptomsLower.includes('fever') && symptomsLower.includes('high') ||
                 symptomsLower.includes('persistent') ||
                 symptomsLower.includes('severe pain')) {
        severity = 'high';
        flag = 'yellow';
        urgency = '24-48hrs';
      } else if (symptomsLower.includes('moderate') || symptomsLower.includes('few days')) {
        severity = 'medium';
        flag = 'yellow';
        urgency = 'routine';
      }

      const mockAnalysis: SymptomAnalysis = {
        symptoms: symptoms,
        severity,
        conditions: [
          { 
            name: 'Common Cold', 
            probability: 75, 
            description: 'Viral upper respiratory infection',
            timeToRecover: '7-10 days'
          },
          { 
            name: 'Seasonal Allergies', 
            probability: 60, 
            description: 'Allergic reaction to environmental factors',
            timeToRecover: 'Varies with exposure'
          },
          { 
            name: 'Stress/Anxiety', 
            probability: 40, 
            description: 'Physical symptoms related to stress',
            timeToRecover: 'With stress management'
          }
        ],
        recommendations: [
          'Rest and stay hydrated',
          'Monitor symptoms for 24-48 hours',
          'Consider over-the-counter medications',
          'Consult a healthcare provider if symptoms worsen'
        ],
        urgency,
        flag,
        followUpQuestions,
        confidence: 75
      };
      
      setAnalysis(mockAnalysis);
      setCurrentStep('followup');
      setIsAnalyzing(false);
      // Call onAnalysisComplete with initial analysis
      onAnalysisComplete(mockAnalysis);
    }, 2000);
  };

  const handleFollowUpAnswer = (questionId: string, answer: any) => {
    setFollowUpAnswers({ ...followUpAnswers, [questionId]: answer });
  };

  const completeAnalysis = () => {
    if (analysis) {
      const enhancedAnalysis = {
        ...analysis,
        followUpAnswers,
        painLevel: painLevel[0]
      };
      setAnalysis(enhancedAnalysis);
      setCurrentStep('results');
      onAnalysisComplete(enhancedAnalysis);
    }
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Enhanced AI Symptom Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe your symptoms and get intelligent insights with follow-up questions for accurate diagnosis
        </p>
      </div>

      {currentStep === 'symptoms' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Describe Your Symptoms</span>
              </CardTitle>
              <CardDescription>
                Be as detailed as possible. Include when symptoms started, their intensity, and any relevant context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: I've had a persistent headache for 2 days, along with mild fever and fatigue. The headache gets worse in bright light..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-32 resize-none"
              />
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Common symptoms (click to add):</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full">
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Input
                </Button>
                <div>
                  <ImageUpload
                    onUploadComplete={(result) => {
                      toast({
                        title: "Image uploaded",
                        description: "Image will be analyzed for skin conditions, rashes, or visible symptoms",
                      });
                    }}
                    label="Upload Symptom Image"
                    useWeb3={isConnected}
                    maxSize={5}
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
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>💡 Tips for Better Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm">Include when symptoms started</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm">Describe pain level and location</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm">Mention any triggers or patterns</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm">Upload images of visible symptoms</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 'followup' && analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Follow-Up Questions</span>
            </CardTitle>
            <CardDescription>
              Answer these questions to improve the accuracy of your diagnosis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.followUpQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label>{question.question}</Label>
                {question.type === 'text' && (
                  <Input
                    value={followUpAnswers[question.id] || ''}
                    onChange={(e) => handleFollowUpAnswer(question.id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}
                {question.type === 'select' && question.options && (
                  <Select
                    value={followUpAnswers[question.id] || ''}
                    onValueChange={(value) => handleFollowUpAnswer(question.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {question.type === 'slider' && (
                  <div className="space-y-2">
                    <Slider
                      value={painLevel}
                      onValueChange={setPainLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1 (Mild)</span>
                      <span className="font-bold text-blue-600">{painLevel[0]}</span>
                      <span>10 (Severe)</span>
                    </div>
                  </div>
                )}
                {question.type === 'yesno' && (
                  <div className="flex space-x-2">
                    <Button
                      variant={followUpAnswers[question.id] === 'yes' ? 'default' : 'outline'}
                      onClick={() => handleFollowUpAnswer(question.id, 'yes')}
                      className="flex-1"
                    >
                      Yes
                    </Button>
                    <Button
                      variant={followUpAnswers[question.id] === 'no' ? 'default' : 'outline'}
                      onClick={() => handleFollowUpAnswer(question.id, 'no')}
                      className="flex-1"
                    >
                      No
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('symptoms')}>
                Back
              </Button>
              <Button onClick={completeAnalysis} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Complete Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'results' && analysis && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Analysis Results</span>
                </CardTitle>
                <Badge className={`${getFlagColor(analysis.flag)} border-2`}>
                  {analysis.flag.toUpperCase()} FLAG
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.flag === 'red' && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-900">EMERGENCY - Seek Immediate Care</AlertTitle>
                  <AlertDescription className="text-red-800">
                    Based on your symptoms, you should seek emergency medical attention immediately. 
                    Call 108 or visit the nearest emergency room.
                  </AlertDescription>
                </Alert>
              )}

              {analysis.flag === 'yellow' && (
                <Alert className="border-yellow-500 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-900">See Doctor Soon</AlertTitle>
                  <AlertDescription className="text-yellow-800">
                    You should consult a healthcare provider within 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Confidence Score</h4>
                  <span className="text-sm font-medium text-blue-600">{analysis.confidence}%</span>
                </div>
                <Progress value={analysis.confidence} className="h-2" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Possible Conditions:</h4>
                <div className="space-y-3">
                  {analysis.conditions.map((condition, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-gray-900">{condition.name}</h5>
                        <span className="text-sm font-medium text-blue-600">{condition.probability}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{condition.description}</p>
                      {condition.timeToRecover && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Expected recovery: {condition.timeToRecover}</span>
                        </div>
                      )}
                      <Progress value={condition.probability} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={onNavigateToDoctor}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Find Recommended Doctors
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Severity</p>
                <Badge className={getSeverityColor(analysis.severity)}>
                  {analysis.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Urgency</p>
                <p className="text-sm text-gray-600">{analysis.urgency}</p>
              </div>
              {painLevel[0] && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Pain Level</p>
                  <p className="text-sm text-gray-600">{painLevel[0]}/10</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};


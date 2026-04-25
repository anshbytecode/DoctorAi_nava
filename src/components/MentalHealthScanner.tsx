import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  Heart, 
  Smile, 
  AlertTriangle, 
  CheckCircle2,
  Wind,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  options: Array<{ value: string; label: string; score: number }>;
}

interface MentalHealthResult {
  score: number;
  level: 'low' | 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
  exercises: Array<{
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export const MentalHealthScanner = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MentalHealthResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const questions: Question[] = [
    {
      id: 'mood',
      question: 'How would you rate your overall mood over the past week?',
      options: [
        { value: 'excellent', label: 'Excellent', score: 0 },
        { value: 'good', label: 'Good', score: 1 },
        { value: 'okay', label: 'Okay', score: 2 },
        { value: 'poor', label: 'Poor', score: 3 },
        { value: 'very-poor', label: 'Very Poor', score: 4 }
      ]
    },
    {
      id: 'sleep',
      question: 'How has your sleep been?',
      options: [
        { value: 'great', label: 'Great (7-9 hours)', score: 0 },
        { value: 'good', label: 'Good (6-7 hours)', score: 1 },
        { value: 'irregular', label: 'Irregular', score: 2 },
        { value: 'poor', label: 'Poor (trouble sleeping)', score: 3 },
        { value: 'insomnia', label: 'Insomnia', score: 4 }
      ]
    },
    {
      id: 'energy',
      question: 'How is your energy level?',
      options: [
        { value: 'high', label: 'High', score: 0 },
        { value: 'normal', label: 'Normal', score: 1 },
        { value: 'low', label: 'Low', score: 2 },
        { value: 'very-low', label: 'Very Low', score: 3 },
        { value: 'exhausted', label: 'Exhausted', score: 4 }
      ]
    },
    {
      id: 'anxiety',
      question: 'How often do you feel anxious or worried?',
      options: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'rarely', label: 'Rarely', score: 1 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
        { value: 'always', label: 'Always', score: 4 }
      ]
    },
    {
      id: 'concentration',
      question: 'How is your ability to concentrate?',
      options: [
        { value: 'excellent', label: 'Excellent', score: 0 },
        { value: 'good', label: 'Good', score: 1 },
        { value: 'moderate', label: 'Moderate', score: 2 },
        { value: 'poor', label: 'Poor', score: 3 },
        { value: 'very-poor', label: 'Very Poor', score: 4 }
      ]
    },
    {
      id: 'interest',
      question: 'How interested are you in activities you usually enjoy?',
      options: [
        { value: 'very-interested', label: 'Very Interested', score: 0 },
        { value: 'interested', label: 'Interested', score: 1 },
        { value: 'somewhat', label: 'Somewhat', score: 2 },
        { value: 'little', label: 'Little Interest', score: 3 },
        { value: 'none', label: 'No Interest', score: 4 }
      ]
    },
    {
      id: 'stress',
      question: 'How would you rate your stress level?',
      options: [
        { value: 'none', label: 'No Stress', score: 0 },
        { value: 'low', label: 'Low', score: 1 },
        { value: 'moderate', label: 'Moderate', score: 2 },
        { value: 'high', label: 'High', score: 3 },
        { value: 'extreme', label: 'Extreme', score: 4 }
      ]
    },
    {
      id: 'support',
      question: 'Do you feel you have adequate social support?',
      options: [
        { value: 'excellent', label: 'Excellent Support', score: 0 },
        { value: 'good', label: 'Good Support', score: 1 },
        { value: 'some', label: 'Some Support', score: 2 },
        { value: 'little', label: 'Little Support', score: 3 },
        { value: 'none', label: 'No Support', score: 4 }
      ]
    }
  ];

  const calculateResult = async () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < questions.length) {
      toast({
        title: "Please answer all questions",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      let totalScore = 0;
      questions.forEach(q => {
        const answer = answers[q.id];
        const option = q.options.find(o => o.value === answer);
        if (option) totalScore += option.score;
      });

      const maxScore = questions.length * 4;
      const percentage = (totalScore / maxScore) * 100;

      let level: MentalHealthResult['level'];
      let description: string;
      let recommendations: string[];
      let exercises: MentalHealthResult['exercises'];

      if (percentage < 25) {
        level = 'low';
        description = 'Your mental health appears to be in good shape. Keep maintaining healthy habits!';
        recommendations = [
          'Continue practicing self-care',
          'Maintain regular sleep schedule',
          'Stay connected with loved ones',
          'Engage in activities you enjoy'
        ];
        exercises = [
          {
            name: 'Gratitude Journaling',
            description: 'Write down 3 things you\'re grateful for each day',
            icon: BookOpen
          },
          {
            name: 'Mindful Breathing',
            description: 'Practice 5 minutes of deep breathing daily',
            icon: Wind
          }
        ];
      } else if (percentage < 50) {
        level = 'mild';
        description = 'You may be experiencing mild stress or mood changes. Some self-care practices can help.';
        recommendations = [
          'Practice stress management techniques',
          'Ensure adequate sleep (7-9 hours)',
          'Regular physical exercise',
          'Consider talking to someone you trust'
        ];
        exercises = [
          {
            name: 'Deep Breathing',
            description: '4-7-8 breathing technique: Inhale 4s, Hold 7s, Exhale 8s',
            icon: Wind
          },
          {
            name: 'Progressive Muscle Relaxation',
            description: 'Tense and relax each muscle group for 10 seconds',
            icon: Heart
          },
          {
            name: 'Mindfulness Meditation',
            description: '10 minutes of guided meditation daily',
            icon: Brain
          }
        ];
      } else if (percentage < 75) {
        level = 'moderate';
        description = 'You may be experiencing moderate mental health concerns. Professional support may be beneficial.';
        recommendations = [
          'Consider speaking with a mental health professional',
          'Practice regular self-care routines',
          'Maintain social connections',
          'Consider therapy or counseling',
          'Monitor your symptoms'
        ];
        exercises = [
          {
            name: 'Daily Journaling',
            description: 'Write about your thoughts and feelings for 15 minutes',
            icon: BookOpen
          },
          {
            name: 'Breathing Exercises',
            description: 'Practice breathing exercises 2-3 times daily',
            icon: Wind
          },
          {
            name: 'Physical Activity',
            description: '30 minutes of moderate exercise daily',
            icon: Heart
          }
        ];
      } else {
        level = 'severe';
        description = 'You may be experiencing significant mental health concerns. Professional help is strongly recommended.';
        recommendations = [
          'Seek professional mental health support immediately',
          'Contact a therapist or counselor',
          'Reach out to mental health helplines',
          'Consider speaking with your doctor',
          'Don\'t hesitate to ask for help'
        ];
        exercises = [
          {
            name: 'Crisis Support',
            description: 'Contact mental health helpline: 1800-599-0019 (India)',
            icon: Heart
          },
          {
            name: 'Grounding Techniques',
            description: '5-4-3-2-1 technique: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste',
            icon: Brain
          }
        ];
      }

      setResult({
        score: Math.round(percentage),
        level,
        description,
        recommendations,
        exercises
      });
      setIsAnalyzing(false);
      toast({
        title: "Assessment complete",
        description: "Review your mental health assessment results",
      });
    }, 1500);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Brain className="h-16 w-16 text-pink-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Scanner</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Assess your mental wellbeing with a quick, confidential screening
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Assessment</CardTitle>
            <CardDescription>
              Answer these questions honestly. Your responses are confidential.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">{question.question}</Label>
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <Button
              onClick={calculateResult}
              disabled={isAnalyzing || Object.keys(answers).length < questions.length}
              className="w-full bg-pink-600 hover:bg-pink-700"
              size="lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Complete Assessment'}
            </Button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Confidential:</strong> Your responses are private and not stored. 
                This is a screening tool, not a diagnosis.
              </p>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assessment Results</CardTitle>
                <Badge className={getLevelColor(result.level)}>
                  {result.level.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stress Score</span>
                  <span className="text-sm font-bold">{result.score}%</span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>

              <Alert className={result.level === 'severe' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}>
                {result.level === 'severe' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <Smile className="h-4 w-4 text-blue-600" />
                )}
                <AlertTitle className={result.level === 'severe' ? 'text-red-900' : 'text-blue-900'}>
                  {result.level === 'severe' ? 'Professional Help Recommended' : 'Assessment Summary'}
                </AlertTitle>
                <AlertDescription className={result.level === 'severe' ? 'text-red-800' : 'text-blue-800'}>
                  {result.description}
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Helpful Exercises</h4>
                <div className="space-y-3">
                  {result.exercises.map((exercise, idx) => {
                    const Icon = exercise.icon;
                    return (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Icon className="h-4 w-4 text-pink-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{exercise.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{exercise.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {result.level === 'severe' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Seek Professional Help</AlertTitle>
                  <AlertDescription>
                    If you're in crisis, contact:
                    <br />
                    <strong>Mental Health Helpline (India): 1800-599-0019</strong>
                    <br />
                    <strong>Emergency: 108</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {!result && (
          <Card className="bg-gray-50">
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Answer the questions and complete the assessment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


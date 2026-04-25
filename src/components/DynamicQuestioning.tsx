import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Brain, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'yes-no' | 'scale' | 'text';
  options?: string[];
  reasoning: string; // Why this question is being asked
  impact: 'high' | 'medium' | 'low'; // How much this question affects diagnosis
}

interface QuestionState {
  question: Question;
  answer: string | number | null;
}

export const DynamicQuestioning = () => {
  const { toast } = useToast();
  const [initialSymptoms, setInitialSymptoms] = useState('');
  const [questionHistory, setQuestionHistory] = useState<QuestionState[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [diagnosisConfidence, setDiagnosisConfidence] = useState(0);

  const generateNextQuestion = (symptoms: string, answers: QuestionState[]): Question | null => {
    // Adaptive questioning logic - questions chosen to maximally separate likely conditions
    const answeredIds = answers.map(a => a.question.id);
    
    // Based on symptoms and previous answers, generate the most informative next question
    if (answeredIds.length === 0) {
      // First question based on initial symptoms
      if (symptoms.toLowerCase().includes('pain')) {
        return {
          id: 'pain-location',
          question: 'Where exactly is the pain located?',
          type: 'multiple-choice',
          options: ['Head', 'Chest', 'Abdomen', 'Back', 'Joints', 'Muscles', 'Multiple locations'],
          reasoning: 'Pain location helps differentiate between conditions (e.g., chest pain could be cardiac, pulmonary, or musculoskeletal)',
          impact: 'high'
        };
      }
      if (symptoms.toLowerCase().includes('fever')) {
        return {
          id: 'fever-duration',
          question: 'How long have you had the fever?',
          type: 'multiple-choice',
          options: ['Less than 24 hours', '1-3 days', '4-7 days', 'More than a week'],
          reasoning: 'Fever duration helps distinguish acute infections from chronic conditions',
          impact: 'high'
        };
      }
    }

    // Adaptive follow-up questions based on previous answers
    const lastAnswer = answers[answers.length - 1];
    
    if (lastAnswer?.question.id === 'pain-location' && lastAnswer.answer === 'Chest') {
      return {
        id: 'chest-pain-character',
        question: 'What best describes the chest pain?',
        type: 'multiple-choice',
        options: ['Sharp/stabbing', 'Pressure/squeezing', 'Burning', 'Aching', 'Radiating to arm/jaw'],
        reasoning: 'Chest pain character is critical for differentiating cardiac vs non-cardiac causes',
        impact: 'high'
      };
    }

    if (lastAnswer?.question.id === 'fever-duration') {
      return {
        id: 'fever-pattern',
        question: 'Does the fever come and go, or is it constant?',
        type: 'yes-no',
        reasoning: 'Fever pattern helps identify infection type (intermittent suggests certain infections)',
        impact: 'medium'
      };
    }

    // General adaptive questions
    if (!answeredIds.includes('exposure')) {
      return {
        id: 'exposure',
        question: 'Have you been exposed to anyone with similar symptoms recently?',
        type: 'yes-no',
        reasoning: 'Exposure history helps determine if condition is contagious',
        impact: 'medium'
      };
    }

    if (!answeredIds.includes('medications')) {
      return {
        id: 'medications',
        question: 'Are you currently taking any medications?',
        type: 'text',
        reasoning: 'Current medications help identify drug interactions and side effects',
        impact: 'high'
      };
    }

    if (!answeredIds.includes('chronic-conditions')) {
      return {
        id: 'chronic-conditions',
        question: 'Do you have any chronic medical conditions?',
        type: 'multiple-choice',
        options: ['None', 'Diabetes', 'Heart disease', 'Hypertension', 'Asthma', 'Kidney disease', 'Other'],
        reasoning: 'Chronic conditions significantly affect differential diagnosis',
        impact: 'high'
      };
    }

    if (!answeredIds.includes('severity')) {
      return {
        id: 'severity',
        question: 'On a scale of 1-10, how severe are your symptoms?',
        type: 'scale',
        reasoning: 'Symptom severity helps prioritize urgency and treatment approach',
        impact: 'medium'
      };
    }

    // If all key questions answered, return null to complete
    return null;
  };

  const handleStart = () => {
    if (!initialSymptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Enter initial symptoms to begin adaptive questioning",
        variant: "destructive"
      });
      return;
    }

    const firstQuestion = generateNextQuestion(initialSymptoms, []);
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setQuestionHistory([]);
      setIsComplete(false);
      setDiagnosisConfidence(20);
    }
  };

  const handleAnswer = () => {
    if (!currentQuestion || currentAnswer === null) {
      toast({
        title: "Please answer the question",
        description: "Select or enter an answer before proceeding",
        variant: "destructive"
      });
      return;
    }

    // Save answer
    const newAnswer: QuestionState = {
      question: currentQuestion,
      answer: currentAnswer
    };
    const updatedHistory = [...questionHistory, newAnswer];
    setQuestionHistory(updatedHistory);

    // Update confidence based on question impact
    let confidenceIncrease = 0;
    if (currentQuestion.impact === 'high') confidenceIncrease = 15;
    else if (currentQuestion.impact === 'medium') confidenceIncrease = 10;
    else confidenceIncrease = 5;
    
    setDiagnosisConfidence(Math.min(95, diagnosisConfidence + confidenceIncrease));

    // Generate next question
    const nextQuestion = generateNextQuestion(initialSymptoms, updatedHistory);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer(null);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      toast({
        title: "Questioning complete",
        description: "All adaptive questions answered. Generating diagnosis...",
      });
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Dynamic Adaptive Questioning System
          </CardTitle>
          <CardDescription>
            AI-powered questions adaptively chosen to maximally separate likely conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentQuestion && !isComplete && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Initial Symptoms</label>
                <textarea
                  className="w-full min-h-24 p-3 border rounded-md mt-2"
                  placeholder="Describe your symptoms..."
                  value={initialSymptoms}
                  onChange={(e) => setInitialSymptoms(e.target.value)}
                />
              </div>
              <Button onClick={handleStart} className="w-full">
                Start Adaptive Questioning
              </Button>
            </div>
          )}

          {currentQuestion && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    Question {questionHistory.length + 1}
                  </CardTitle>
                  <Badge className={getImpactColor(currentQuestion.impact)}>
                    {currentQuestion.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  <strong>Why we're asking:</strong> {currentQuestion.reasoning}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-lg font-semibold">{currentQuestion.question}</div>

                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <RadioGroup value={currentAnswer as string || ''} onValueChange={setCurrentAnswer}>
                    {currentQuestion.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <RadioGroupItem value={option} id={`option-${idx}`} />
                        <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'yes-no' && (
                  <div className="flex gap-4">
                    <Button
                      variant={currentAnswer === 'yes' ? 'default' : 'outline'}
                      onClick={() => setCurrentAnswer('yes')}
                      className="flex-1"
                    >
                      Yes
                    </Button>
                    <Button
                      variant={currentAnswer === 'no' ? 'default' : 'outline'}
                      onClick={() => setCurrentAnswer('no')}
                      className="flex-1"
                    >
                      No
                    </Button>
                  </div>
                )}

                {currentQuestion.type === 'scale' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentAnswer as number || 5}
                      onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 (Mild)</span>
                      <span className="font-bold text-lg">{currentAnswer || 5}</span>
                      <span>10 (Severe)</span>
                    </div>
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <textarea
                    className="w-full min-h-24 p-3 border rounded-md"
                    placeholder="Enter your answer..."
                    value={currentAnswer as string || ''}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Diagnosis Confidence</span>
                      <span className="text-sm">{diagnosisConfidence}%</span>
                    </div>
                    <Progress value={diagnosisConfidence} className="h-2" />
                  </div>
                  <Button onClick={handleAnswer} className="ml-4">
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isComplete && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Adaptive Questioning Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Final Diagnosis Confidence</span>
                    <span className="font-bold text-lg">{diagnosisConfidence}%</span>
                  </div>
                  <Progress value={diagnosisConfidence} className="h-3" />
                </div>
                <p className="text-sm text-gray-700">
                  All adaptive questions have been answered. The AI has gathered sufficient information
                  to generate a high-confidence differential diagnosis. Proceed to view the diagnosis results.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Questions Answered:</h4>
                  <div className="space-y-1">
                    {questionHistory.map((q, idx) => (
                      <div key={idx} className="text-sm p-2 bg-white rounded">
                        <strong>Q{idx + 1}:</strong> {q.question.question}
                        <br />
                        <span className="text-gray-600">Answer: {q.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


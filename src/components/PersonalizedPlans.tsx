import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  UtensilsCrossed, 
  Activity,
  Moon,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface PersonalizedPlan {
  type: 'diet' | 'exercise' | 'sleep';
  plan: {
    title: string;
    description: string;
    dailySchedule: {
      time: string;
      activity: string;
      notes?: string;
    }[];
    weeklyGoals: string[];
    personalizedTips: string[];
  };
  rationale: string;
}

export const PersonalizedPlans = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    conditions: [] as string[],
    preferences: {
      dietary: [] as string[],
      exercise: [] as string[],
      schedule: ''
    },
    goals: ''
  });
  const [selectedPlanType, setSelectedPlanType] = useState<'diet' | 'exercise' | 'sleep'>('diet');
  const [generatedPlan, setGeneratedPlan] = useState<PersonalizedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      let plan: PersonalizedPlan;

      if (selectedPlanType === 'diet') {
        plan = {
          type: 'diet',
          plan: {
            title: 'Personalized Nutrition Plan',
            description: 'AI-generated meal plan tailored to your health conditions, preferences, and goals',
            dailySchedule: [
              { time: '7:00 AM', activity: 'Breakfast: Oatmeal with berries and nuts', notes: 'High fiber, low glycemic index' },
              { time: '10:00 AM', activity: 'Snack: Greek yogurt with almonds', notes: 'Protein boost' },
              { time: '12:30 PM', activity: 'Lunch: Grilled chicken salad with olive oil dressing', notes: 'Lean protein, healthy fats' },
              { time: '3:30 PM', activity: 'Snack: Apple with peanut butter', notes: 'Sustained energy' },
              { time: '6:30 PM', activity: 'Dinner: Baked salmon with quinoa and vegetables', notes: 'Omega-3, complete protein' }
            ],
            weeklyGoals: [
              'Consume 5+ servings of vegetables daily',
              'Limit processed foods to <2 meals per week',
              'Maintain consistent meal timing',
              'Stay hydrated: 8-10 glasses water daily'
            ],
            personalizedTips: [
              'Given your diabetes, focus on low-glycemic foods',
              'Include protein with every meal to stabilize blood sugar',
              'Consider Mediterranean diet principles',
              'Track carbohydrate intake for better glucose control'
            ]
          },
          rationale: 'Plan designed based on diabetes management needs, incorporating low-glycemic foods and consistent meal timing to help stabilize blood glucose levels.'
        };
      } else if (selectedPlanType === 'exercise') {
        plan = {
          type: 'exercise',
          plan: {
            title: 'Personalized Fitness Plan',
            description: 'Exercise routine adapted to your fitness level, health conditions, and preferences',
            dailySchedule: [
              { time: '6:00 AM', activity: 'Morning: 20-min brisk walk', notes: 'Cardio warm-up' },
              { time: '12:00 PM', activity: 'Lunch break: 10-min stretching', notes: 'Flexibility' },
              { time: '6:00 PM', activity: 'Evening: Strength training (30 min)', notes: 'Upper body focus' },
              { time: '8:00 PM', activity: 'Post-dinner: 15-min yoga', notes: 'Relaxation' }
            ],
            weeklyGoals: [
              '150 minutes moderate-intensity cardio',
              '2-3 strength training sessions',
              'Daily flexibility exercises',
              '10,000+ steps daily'
            ],
            personalizedTips: [
              'Start gradually if you\'re new to exercise',
              'Monitor heart rate during cardio (target: 50-70% max)',
              'Include rest days between strength training',
              'Listen to your body and adjust intensity as needed'
            ]
          },
          rationale: 'Balanced program combining cardiovascular health, strength building, and flexibility, tailored to support diabetes management and overall wellness.'
        };
      } else {
        plan = {
          type: 'sleep',
          plan: {
            title: 'Personalized Sleep Optimization Plan',
            description: 'Sleep schedule and habits customized for your lifestyle and health needs',
            dailySchedule: [
              { time: '9:00 PM', activity: 'Begin wind-down routine', notes: 'Dim lights, reduce screen time' },
              { time: '9:30 PM', activity: 'Relaxation: Reading or meditation', notes: 'Calm the mind' },
              { time: '10:00 PM', activity: 'Prepare bedroom: Cool, dark, quiet', notes: 'Optimal sleep environment' },
              { time: '10:15 PM', activity: 'Lights out - Target sleep time', notes: '7-8 hours recommended' },
              { time: '6:15 AM', activity: 'Wake up - Consistent wake time', notes: 'Even on weekends' }
            ],
            weeklyGoals: [
              'Maintain consistent sleep schedule (±30 min)',
              '7-8 hours sleep per night',
              'No screens 1 hour before bed',
              'Create relaxing bedtime routine'
            ],
            personalizedTips: [
              'Consistent sleep schedule helps regulate blood sugar',
              'Avoid caffeine after 2 PM',
              'Keep bedroom temperature 65-68°F',
              'Limit alcohol before bed (disrupts sleep quality)'
            ]
          },
          rationale: 'Sleep plan designed to support diabetes management, as quality sleep is crucial for glucose regulation and overall metabolic health.'
        };
      }

      setGeneratedPlan(plan);
      setIsGenerating(false);
      toast({
        title: "Plan generated",
        description: `Your personalized ${selectedPlanType} plan is ready!`,
      });
    }, 2000);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'diet': return <UtensilsCrossed className="h-6 w-6 text-green-600" />;
      case 'exercise': return <Activity className="h-6 w-6 text-blue-600" />;
      case 'sleep': return <Moon className="h-6 w-6 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-600" />
            Hyper-Personalized Health Plans
          </CardTitle>
          <CardDescription>
            AI-generated diet, exercise, and sleep plans tailored to your history, preferences, and health conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={userProfile.age}
                onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={userProfile.gender}
                onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                value={userProfile.weight}
                onChange={(e) => setUserProfile({ ...userProfile, weight: e.target.value })}
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={userProfile.height}
                onChange={(e) => setUserProfile({ ...userProfile, height: e.target.value })}
                placeholder="170"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Health Goals</Label>
            <textarea
              className="w-full min-h-20 p-3 border rounded-md"
              placeholder="e.g., Manage diabetes, lose weight, improve fitness..."
              value={userProfile.goals}
              onChange={(e) => setUserProfile({ ...userProfile, goals: e.target.value })}
            />
          </div>

          <Tabs value={selectedPlanType} onValueChange={(v) => setSelectedPlanType(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diet">Diet Plan</TabsTrigger>
              <TabsTrigger value="exercise">Exercise Plan</TabsTrigger>
              <TabsTrigger value="sleep">Sleep Plan</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            onClick={generatePlan} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Personalized Plan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {selectedPlanType.charAt(0).toUpperCase() + selectedPlanType.slice(1)} Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPlanIcon(generatedPlan.type)}
              {generatedPlan.plan.title}
            </CardTitle>
            <CardDescription>{generatedPlan.plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Why This Plan?</h4>
              <p className="text-sm text-blue-800">{generatedPlan.rationale}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Schedule
              </h4>
              <div className="space-y-2">
                {generatedPlan.plan.dailySchedule.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-blue-600 min-w-[80px]">{item.time}</div>
                    <div className="flex-1">
                      <div className="font-medium">{item.activity}</div>
                      {item.notes && (
                        <div className="text-sm text-gray-600 mt-1">{item.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Weekly Goals</h4>
              <div className="space-y-2">
                {generatedPlan.plan.weeklyGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm flex-1">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Personalized Tips</h4>
              <div className="space-y-2">
                {generatedPlan.plan.personalizedTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                    <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span className="text-sm flex-1">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


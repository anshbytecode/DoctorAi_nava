import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Utensils, 
  Pill, 
  Droplet, 
  Activity,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TreatmentPlan {
  condition: string;
  duration: string;
  diet: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  hydration: string;
  rest: string;
  activities: string[];
  prevention: string[];
  followUp: string;
}

export const TreatmentPlanGenerator = () => {
  const [selectedCondition, setSelectedCondition] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const conditions = [
    'Common Cold',
    'Fever',
    'Body Pain',
    'Stomach Infection',
    'Headache',
    'Cough',
    'Sore Throat',
    'Diarrhea',
    'Constipation',
    'Acid Reflux'
  ];

  const generatePlan = async () => {
    if (!selectedCondition) {
      toast({
        title: "Please select a condition",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const plans: Record<string, TreatmentPlan> = {
        'Common Cold': {
          condition: 'Common Cold',
          duration: '7-10 days',
          diet: [
            'Warm soups and broths',
            'Plenty of fluids (water, herbal teas)',
            'Vitamin C rich foods (oranges, lemons)',
            'Avoid cold and processed foods',
            'Light, easily digestible meals'
          ],
          medications: [
            {
              name: 'Paracetamol',
              dosage: '500mg',
              frequency: 'Every 6-8 hours',
              duration: '3-5 days (as needed)'
            }
          ],
          hydration: 'Drink 8-10 glasses of water daily. Include warm fluids like ginger tea.',
          rest: 'Get 7-9 hours of sleep. Rest as much as possible to help recovery.',
          activities: [
            'Avoid strenuous exercise',
            'Light walking is okay',
            'Avoid crowded places',
            'Practice good hygiene'
          ],
          prevention: [
            'Wash hands frequently',
            'Avoid close contact with sick people',
            'Cover mouth when coughing/sneezing',
            'Maintain good immune health'
          ],
          followUp: 'If symptoms persist beyond 10 days or worsen, consult a doctor.'
        },
        'Fever': {
          condition: 'Fever',
          duration: '3-5 days',
          diet: [
            'Light, easily digestible foods',
            'Plenty of fluids',
            'Coconut water for electrolytes',
            'Avoid heavy, oily foods'
          ],
          medications: [
            {
              name: 'Paracetamol',
              dosage: '500-1000mg',
              frequency: 'Every 6-8 hours',
              duration: 'Until fever subsides'
            }
          ],
          hydration: 'Drink plenty of water, oral rehydration solution if needed. Monitor fluid intake.',
          rest: 'Complete rest. Stay in bed if temperature is high.',
          activities: [
            'Avoid physical activity',
            'Keep cool with light clothing',
            'Use cold compress on forehead',
            'Monitor temperature regularly'
          ],
          prevention: [
            'Identify and treat underlying cause',
            'Maintain good hygiene',
            'Stay hydrated',
            'Get adequate rest'
          ],
          followUp: 'If fever persists beyond 3 days or exceeds 103°F, seek medical attention immediately.'
        },
        'Body Pain': {
          condition: 'Body Pain',
          duration: '2-7 days',
          diet: [
            'Anti-inflammatory foods (ginger, turmeric)',
            'Magnesium-rich foods (nuts, seeds)',
            'Stay hydrated',
            'Avoid processed foods'
          ],
          medications: [
            {
              name: 'Ibuprofen',
              dosage: '200-400mg',
              frequency: 'Every 6-8 hours',
              duration: '3-5 days (with food)'
            }
          ],
          hydration: 'Drink adequate water. Dehydration can worsen muscle pain.',
          rest: 'Rest the affected area. Avoid overexertion.',
          activities: [
            'Gentle stretching',
            'Warm compress on painful areas',
            'Light massage if helpful',
            'Avoid heavy lifting'
          ],
          prevention: [
            'Regular exercise',
            'Proper posture',
            'Adequate sleep',
            'Stress management'
          ],
          followUp: 'If pain is severe, persistent, or accompanied by other symptoms, consult a doctor.'
        },
        'Stomach Infection': {
          condition: 'Stomach Infection',
          duration: '3-7 days',
          diet: [
            'BRAT diet (Banana, Rice, Applesauce, Toast)',
            'Clear broths',
            'Avoid dairy, spicy, and fatty foods',
            'Small, frequent meals',
            'Probiotic foods (yogurt after recovery)'
          ],
          medications: [
            {
              name: 'Oral Rehydration Solution',
              dosage: 'As directed',
              frequency: 'After each loose stool',
              duration: 'Until diarrhea stops'
            }
          ],
          hydration: 'Critical: Drink ORS or electrolyte solutions. Sip water frequently.',
          rest: 'Rest is important. Avoid physical exertion.',
          activities: [
            'Stay home to prevent spread',
            'Maintain hygiene',
            'Avoid sharing utensils',
            'Wash hands frequently'
          ],
          prevention: [
            'Wash hands before eating',
            'Cook food thoroughly',
            'Avoid contaminated water',
            'Practice food safety'
          ],
          followUp: 'If symptoms persist, dehydration occurs, or blood in stool, seek immediate medical care.'
        }
      };

      const plan = plans[selectedCondition] || {
        condition: selectedCondition,
        duration: '5-7 days',
        diet: ['Balanced diet', 'Plenty of fluids', 'Avoid processed foods'],
        medications: [{
          name: 'Consult doctor for prescription',
          dosage: 'As prescribed',
          frequency: 'As directed',
          duration: 'As per doctor\'s advice'
        }],
        hydration: 'Drink 8-10 glasses of water daily',
        rest: 'Get adequate rest and sleep',
        activities: ['Light activities only', 'Avoid strenuous exercise'],
        prevention: ['Maintain good hygiene', 'Follow healthy lifestyle'],
        followUp: 'Consult a healthcare provider for proper diagnosis and treatment.'
      };

      setTreatmentPlan(plan);
      setIsGenerating(false);
      toast({
        title: "Treatment plan generated",
        description: `Plan for ${selectedCondition} is ready`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <ClipboardList className="h-16 w-16 text-teal-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Treatment Plan Generator</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized treatment plans for common health conditions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Condition</CardTitle>
            <CardDescription>Choose a condition to generate a treatment plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select a condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generatePlan}
              disabled={isGenerating || !selectedCondition}
              className="w-full bg-teal-600 hover:bg-teal-700"
              size="lg"
            >
              {isGenerating ? 'Generating Plan...' : 'Generate Treatment Plan'}
            </Button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These are general treatment plans. Always consult a healthcare provider 
                for proper diagnosis and personalized treatment.
              </p>
            </div>
          </CardContent>
        </Card>

        {treatmentPlan && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{treatmentPlan.condition} Treatment Plan</CardTitle>
                <Badge variant="outline">Duration: {treatmentPlan.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                  Diet Recommendations
                </h4>
                <ul className="space-y-1">
                  {treatmentPlan.diet.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Pill className="h-4 w-4 mr-2 text-purple-600" />
                  Medications (OTC)
                </h4>
                {treatmentPlan.medications.map((med, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg mb-2">
                    <p className="font-medium text-sm">{med.name}</p>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>{med.dosage} • {med.frequency}</span>
                      <br />
                      <span>Duration: {med.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Droplet className="h-4 w-4 mr-2 text-blue-600" />
                  Hydration
                </h4>
                <p className="text-sm text-gray-600">{treatmentPlan.hydration}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-600" />
                  Rest & Activities
                </h4>
                <p className="text-sm text-gray-600 mb-2">{treatmentPlan.rest}</p>
                <ul className="space-y-1">
                  {treatmentPlan.activities.map((activity, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle2 className="h-3 w-3 text-blue-600 mr-2 mt-0.5" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Prevention</h4>
                <ul className="space-y-1">
                  {treatmentPlan.prevention.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle2 className="h-3 w-3 text-teal-600 mr-2 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-yellow-600" />
                  Follow-Up
                </h4>
                <p className="text-sm text-yellow-800">{treatmentPlan.followUp}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!treatmentPlan && (
          <Card className="bg-gray-50">
            <CardContent className="py-12 text-center">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a condition and generate a treatment plan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


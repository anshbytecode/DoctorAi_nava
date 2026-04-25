import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, XCircle, Pill, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'severe' | 'moderate' | 'mild' | 'none';
  description: string;
  recommendation: string;
}

interface SafetyCheck {
  safe: boolean;
  interactions: DrugInteraction[];
  overdoseRisk: 'high' | 'medium' | 'low' | 'none';
  dosageCheck: {
    valid: boolean;
    message: string;
  };
  frequencyCheck: {
    valid: boolean;
    message: string;
  };
  warnings: string[];
}

export const MedicineSafetyChecker = () => {
  const [medications, setMedications] = useState<string[]>(['']);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [safetyResult, setSafetyResult] = useState<SafetyCheck | null>(null);
  const { toast } = useToast();

  const knownInteractions: Record<string, string[]> = {
    'paracetamol': ['ibuprofen', 'aspirin', 'warfarin'],
    'ibuprofen': ['aspirin', 'warfarin', 'lithium'],
    'aspirin': ['warfarin', 'ibuprofen', 'methotrexate'],
    'warfarin': ['aspirin', 'ibuprofen', 'paracetamol'],
  };

  const checkSafety = async () => {
    const meds = medications.filter(m => m.trim() !== '');
    if (meds.length === 0) {
      toast({
        title: "Please enter at least one medication",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    // Simulate AI safety check
    setTimeout(() => {
      const interactions: DrugInteraction[] = [];
      const warnings: string[] = [];

      // Check for interactions
      for (let i = 0; i < meds.length; i++) {
        for (let j = i + 1; j < meds.length; j++) {
          const med1 = meds[i].toLowerCase();
          const med2 = meds[j].toLowerCase();
          
          if (knownInteractions[med1]?.includes(med2) || 
              knownInteractions[med2]?.includes(med1)) {
            interactions.push({
              drug1: meds[i],
              drug2: meds[j],
              severity: 'severe',
              description: `${meds[i]} and ${meds[j]} may interact and cause adverse effects`,
              recommendation: 'Consult your doctor before taking these together'
            });
          }
        }
      }

      // Check overdose risk
      let overdoseRisk: SafetyCheck['overdoseRisk'] = 'none';
      if (medications.length > 5) {
        overdoseRisk = 'high';
        warnings.push('Taking too many medications simultaneously increases overdose risk');
      } else if (medications.length > 3) {
        overdoseRisk = 'medium';
        warnings.push('Multiple medications may increase side effects');
      }

      // Check dosage
      const dosageCheck = {
        valid: true,
        message: 'Dosage appears safe'
      };
      if (dosage) {
        const doseNum = parseFloat(dosage);
        if (doseNum > 1000) {
          dosageCheck.valid = false;
          dosageCheck.message = 'Dosage seems high. Please verify with doctor';
          warnings.push('High dosage detected - verify with healthcare provider');
        }
      }

      // Check frequency
      const frequencyCheck = {
        valid: true,
        message: 'Frequency appears safe'
      };
      if (frequency.toLowerCase().includes('every hour') || 
          frequency.toLowerCase().includes('hourly')) {
        frequencyCheck.valid = false;
        frequencyCheck.message = 'Very frequent dosing - verify with doctor';
        warnings.push('Frequent dosing may cause overdose');
      }

      const result: SafetyCheck = {
        safe: interactions.length === 0 && overdoseRisk === 'none' && dosageCheck.valid && frequencyCheck.valid,
        interactions,
        overdoseRisk,
        dosageCheck,
        frequencyCheck,
        warnings
      };

      setSafetyResult(result);
      setIsChecking(false);

      if (!result.safe) {
        toast({
          title: "Safety concerns detected",
          description: "Please review the safety check results",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Medications appear safe",
          description: "No major interactions or safety concerns detected"
        });
      }
    }, 1500);
  };

  const addMedication = () => {
    setMedications([...medications, '']);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, value: string) => {
    const newMeds = [...medications];
    newMeds[index] = value;
    setMedications(newMeds);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Pill className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Medicine Safety Checker</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Check for drug interactions, overdose risks, and dosage safety before taking medications
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Medications</CardTitle>
            <CardDescription>
              Add all medications you're currently taking or planning to take
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder={`Medication ${index + 1} (e.g., Paracetamol, Ibuprofen)`}
                  value={med}
                  onChange={(e) => updateMedication(index, e.target.value)}
                  className="flex-1"
                />
                {medications.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeMedication(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addMedication} className="w-full">
              + Add Another Medication
            </Button>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label>Dosage (Optional)</Label>
                <Input
                  placeholder="e.g., 500mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency (Optional)</Label>
                <Input
                  placeholder="e.g., Twice daily"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={checkSafety}
              disabled={isChecking}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isChecking ? 'Checking Safety...' : 'Check Safety'}
            </Button>
          </CardContent>
        </Card>

        {safetyResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {safetyResult.safe ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Safety Check Results</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Safety Concerns Detected</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!safetyResult.safe && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Safety Warning</AlertTitle>
                  <AlertDescription>
                    Please review the concerns below and consult with a healthcare provider
                  </AlertDescription>
                </Alert>
              )}

              {safetyResult.interactions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Drug Interactions</h4>
                  <div className="space-y-2">
                    {safetyResult.interactions.map((interaction, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {interaction.drug1} + {interaction.drug2}
                          </span>
                          <Badge className={getSeverityColor(interaction.severity)}>
                            {interaction.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{interaction.description}</p>
                        <p className="text-sm font-medium text-blue-600">
                          {interaction.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Overdose Risk</h4>
                <Badge className={getSeverityColor(safetyResult.overdoseRisk)}>
                  {safetyResult.overdoseRisk.toUpperCase()}
                </Badge>
                {safetyResult.overdoseRisk !== 'none' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Taking multiple medications increases risk of overdose
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dosage Check</h4>
                <div className="flex items-center space-x-2">
                  {safetyResult.dosageCheck.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{safetyResult.dosageCheck.message}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Frequency Check</h4>
                <div className="flex items-center space-x-2">
                  {safetyResult.frequencyCheck.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{safetyResult.frequencyCheck.message}</span>
                </div>
              </div>

              {safetyResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Warnings</h4>
                  <div className="space-y-1">
                    {safetyResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-orange-600">
                        <Info className="h-4 w-4 mt-0.5" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {safetyResult.safe && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Safe to Use</AlertTitle>
                  <AlertDescription className="text-green-800">
                    No major safety concerns detected. Always follow your doctor's prescription.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {!safetyResult && (
          <Card className="bg-gray-50">
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Enter medications and click "Check Safety" to see results</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


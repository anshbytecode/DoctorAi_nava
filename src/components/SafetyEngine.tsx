import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle,
  Pill,
  XCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'severe' | 'moderate' | 'mild' | 'none';
  interaction: string;
  recommendation: string;
  alternative?: string;
}

interface DiseaseInteraction {
  drug: string;
  condition: string;
  severity: 'contraindicated' | 'caution' | 'monitor' | 'safe';
  issue: string;
  recommendation: string;
  doseAdjustment?: string;
}

interface SafetyCheck {
  drugInteractions: DrugInteraction[];
  diseaseInteractions: DiseaseInteraction[];
  doseRecommendations: {
    drug: string;
    currentDose: string;
    recommendedDose: string;
    reason: string;
  }[];
  warnings: string[];
}

export const SafetyEngine = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<string[]>(['']);
  const [conditions, setConditions] = useState<string[]>(['']);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    weight: '',
    kidneyFunction: '',
    liverFunction: ''
  });
  const [safetyCheck, setSafetyCheck] = useState<SafetyCheck | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const addMedication = () => {
    setMedications([...medications, '']);
  };

  const updateMedication = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    setConditions([...conditions, '']);
  };

  const updateCondition = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const checkSafety = async () => {
    const meds = medications.filter(m => m.trim());
    const conds = conditions.filter(c => c.trim());

    if (meds.length === 0) {
      toast({
        title: "No medications entered",
        description: "Please enter at least one medication",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      const interactions: DrugInteraction[] = [];
      const diseaseInteractions: DiseaseInteraction[] = [];
      const doseRecommendations: any[] = [];
      const warnings: string[] = [];

      // Simulate drug-drug interactions
      if (meds.some(m => m.toLowerCase().includes('warfarin')) && 
          meds.some(m => m.toLowerCase().includes('aspirin'))) {
        interactions.push({
          drug1: 'Warfarin',
          drug2: 'Aspirin',
          severity: 'severe',
          interaction: 'Increased risk of bleeding',
          recommendation: 'Avoid concurrent use. If necessary, monitor INR closely and consider lower aspirin dose.',
          alternative: 'Consider clopidogrel as alternative antiplatelet'
        });
      }

      if (meds.some(m => m.toLowerCase().includes('metformin')) && 
          meds.some(m => m.toLowerCase().includes('contrast'))) {
        interactions.push({
          drug1: 'Metformin',
          drug2: 'Contrast dye',
          severity: 'moderate',
          interaction: 'Risk of lactic acidosis',
          recommendation: 'Discontinue metformin 48 hours before contrast study and resume 48 hours after if kidney function normal'
        });
      }

      // Simulate drug-disease interactions
      if (meds.some(m => m.toLowerCase().includes('nsaid')) && 
          conds.some(c => c.toLowerCase().includes('kidney'))) {
        diseaseInteractions.push({
          drug: 'NSAIDs',
          condition: 'Kidney Disease',
          severity: 'contraindicated',
          issue: 'NSAIDs can worsen kidney function',
          recommendation: 'Avoid NSAIDs. Use acetaminophen or other alternatives.',
          doseAdjustment: 'Not recommended'
        });
      }

      if (meds.some(m => m.toLowerCase().includes('metformin')) && 
          conds.some(c => c.toLowerCase().includes('kidney'))) {
        const kidneyFunction = parseFloat(patientInfo.kidneyFunction) || 60;
        if (kidneyFunction < 30) {
          diseaseInteractions.push({
            drug: 'Metformin',
            condition: 'Kidney Disease',
            severity: 'contraindicated',
            issue: 'Metformin contraindicated in severe renal impairment (eGFR <30)',
            recommendation: 'Discontinue metformin. Consider alternative diabetes medications.',
            doseAdjustment: 'Contraindicated'
          });
        } else if (kidneyFunction < 45) {
          diseaseInteractions.push({
            drug: 'Metformin',
            condition: 'Kidney Disease',
            severity: 'caution',
            issue: 'Metformin requires dose adjustment in moderate renal impairment',
            recommendation: 'Reduce metformin dose. Monitor kidney function regularly.',
            doseAdjustment: 'Reduce to 50% of normal dose'
          });
        }
      }

      // Simulate dose adjustments for elderly
      const age = parseInt(patientInfo.age) || 0;
      if (age >= 65) {
        meds.forEach(med => {
          if (med.toLowerCase().includes('warfarin')) {
            doseRecommendations.push({
              drug: med,
              currentDose: '5mg daily',
              recommendedDose: '2.5-3mg daily',
              reason: 'Elderly patients may require lower doses due to increased sensitivity'
            });
          }
        });
        warnings.push('Elderly patients may be more sensitive to medications. Start with lower doses.');
      }

      // Simulate liver function considerations
      if (patientInfo.liverFunction && parseFloat(patientInfo.liverFunction) < 50) {
        warnings.push('Impaired liver function detected. Some medications may require dose adjustment or avoidance.');
      }

      setSafetyCheck({
        drugInteractions: interactions,
        diseaseInteractions: diseaseInteractions,
        doseRecommendations: doseRecommendations,
        warnings: warnings
      });

      setIsChecking(false);
      toast({
        title: "Safety check complete",
        description: `${interactions.length + diseaseInteractions.length} interaction(s) found`,
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
      case 'contraindicated':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
      case 'caution':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'mild':
      case 'monitor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Drug Safety Engine
          </CardTitle>
          <CardDescription>
            Drug-drug and drug-disease interaction alerts with individualized dose suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Current Medications</Label>
              {medications.map((med, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={med}
                    onChange={(e) => updateMedication(idx, e.target.value)}
                    placeholder="e.g., Metformin 500mg twice daily"
                    className="flex-1"
                  />
                  {medications.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeMedication(idx)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addMedication} className="mt-2">
                <Pill className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </div>

            <div>
              <Label className="mb-2 block">Medical Conditions</Label>
              {conditions.map((cond, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={cond}
                    onChange={(e) => updateCondition(idx, e.target.value)}
                    placeholder="e.g., Diabetes, Kidney Disease"
                    className="flex-1"
                  />
                  {conditions.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCondition(idx)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addCondition} className="mt-2">
                <Info className="mr-2 h-4 w-4" />
                Add Condition
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                  placeholder="65"
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  value={patientInfo.weight}
                  onChange={(e) => setPatientInfo({ ...patientInfo, weight: e.target.value })}
                  placeholder="70"
                />
              </div>
              <div className="space-y-2">
                <Label>Kidney Function (eGFR)</Label>
                <Input
                  type="number"
                  value={patientInfo.kidneyFunction}
                  onChange={(e) => setPatientInfo({ ...patientInfo, kidneyFunction: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label>Liver Function (%)</Label>
                <Input
                  type="number"
                  value={patientInfo.liverFunction}
                  onChange={(e) => setPatientInfo({ ...patientInfo, liverFunction: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <Button 
              onClick={checkSafety} 
              disabled={isChecking}
              className="w-full"
              size="lg"
            >
              {isChecking ? (
                <>
                  <Shield className="mr-2 h-4 w-4 animate-spin" />
                  Checking Safety...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Check Drug Safety
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {safetyCheck && (
        <div className="space-y-4">
          {safetyCheck.drugInteractions.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Drug-Drug Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safetyCheck.drugInteractions.map((interaction, idx) => (
                    <Alert key={idx} className={`border-2 ${getSeverityColor(interaction.severity)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {interaction.drug1} + {interaction.drug2}
                        <Badge className={`ml-2 ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="font-semibold mb-1">Interaction: {interaction.interaction}</p>
                        <p className="mb-1">{interaction.recommendation}</p>
                        {interaction.alternative && (
                          <p className="text-sm italic">Alternative: {interaction.alternative}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {safetyCheck.diseaseInteractions.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Drug-Disease Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safetyCheck.diseaseInteractions.map((interaction, idx) => (
                    <Alert key={idx} className={`border-2 ${getSeverityColor(interaction.severity)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {interaction.drug} + {interaction.condition}
                        <Badge className={`ml-2 ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="font-semibold mb-1">Issue: {interaction.issue}</p>
                        <p className="mb-1">{interaction.recommendation}</p>
                        {interaction.doseAdjustment && (
                          <p className="text-sm font-medium">Dose Adjustment: {interaction.doseAdjustment}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {safetyCheck.doseRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dose Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safetyCheck.doseRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{rec.drug}</span>
                        <Badge variant="outline">Dose Adjustment</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>Current: {rec.currentDose}</p>
                        <p className="font-semibold text-blue-700">Recommended: {rec.recommendedDose}</p>
                        <p className="text-gray-600">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {safetyCheck.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>General Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safetyCheck.warnings.map((warning, idx) => (
                    <Alert key={idx}>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{warning}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {safetyCheck.drugInteractions.length === 0 && 
           safetyCheck.diseaseInteractions.length === 0 && 
           safetyCheck.doseRecommendations.length === 0 && 
           safetyCheck.warnings.length === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">No Safety Issues Detected</AlertTitle>
              <AlertDescription className="text-green-700">
                No significant drug interactions or contraindications found. Continue monitoring as prescribed.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};


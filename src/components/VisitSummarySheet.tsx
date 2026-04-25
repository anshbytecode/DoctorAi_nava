import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Copy, CheckCircle2 } from 'lucide-react';

interface VisitSummarySheetProps {
  appointment: {
    id: string;
    patientName: string;
    date: string;
    time: string;
    reason: string;
    symptoms?: string;
  };
}

export const VisitSummarySheet = ({ appointment }: VisitSummarySheetProps) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState({
    chiefComplaint: appointment.reason || '',
    historyOfPresentIllness: appointment.symptoms || '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    medications: [] as string[],
    followUp: '',
    questionsForDoctor: [] as string[]
  });
  const [isOpen, setIsOpen] = useState(false);
  const [newMedication, setNewMedication] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const generateSummary = () => {
    // Auto-generate summary based on appointment data
    setSummary({
      ...summary,
      historyOfPresentIllness: `Patient presents with ${appointment.reason}. ${appointment.symptoms || 'Symptoms reported during consultation.'}`,
      assessment: `Based on the consultation, the patient's condition appears to be [condition]. Further evaluation may be needed.`,
      plan: `1. Continue current treatment plan\n2. Monitor symptoms\n3. Follow-up appointment scheduled if needed`,
      questionsForDoctor: [
        'What are the possible causes of my symptoms?',
        'What tests or further evaluation might be needed?',
        'When should I follow up?'
      ]
    });
    toast({
      title: "Summary generated",
      description: "Visit summary has been auto-generated",
    });
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setSummary({
        ...summary,
        medications: [...summary.medications, newMedication]
      });
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setSummary({
      ...summary,
      medications: summary.medications.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setSummary({
        ...summary,
        questionsForDoctor: [...summary.questionsForDoctor, newQuestion]
      });
      setNewQuestion('');
    }
  };

  const removeQuestion = (index: number) => {
    setSummary({
      ...summary,
      questionsForDoctor: summary.questionsForDoctor.filter((_, i) => i !== index)
    });
  };

  const exportSummary = () => {
    const content = `
VISIT SUMMARY SHEET
===================

Patient: ${appointment.patientName}
Date: ${new Date(appointment.date).toLocaleDateString()}
Time: ${appointment.time}

CHIEF COMPLAINT
${summary.chiefComplaint}

HISTORY OF PRESENT ILLNESS
${summary.historyOfPresentIllness}

PHYSICAL EXAMINATION
${summary.physicalExamination || 'Not documented'}

ASSESSMENT
${summary.assessment}

PLAN
${summary.plan}

MEDICATIONS
${summary.medications.length > 0 ? summary.medications.map((m, i) => `${i + 1}. ${m}`).join('\n') : 'None prescribed'}

FOLLOW-UP
${summary.followUp || 'As needed'}

QUESTIONS FOR DOCTOR
${summary.questionsForDoctor.length > 0 ? summary.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'None'}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-summary-${appointment.patientName}-${appointment.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Summary exported",
      description: "Visit summary has been downloaded",
    });
  };

  const copySummary = () => {
    const content = `Visit Summary for ${appointment.patientName}\n\n${JSON.stringify(summary, null, 2)}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visit Summary Sheet</DialogTitle>
          <DialogDescription>
            Create a structured summary for {appointment.patientName}'s visit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Button onClick={generateSummary} variant="outline" size="sm">
              Auto-Generate
            </Button>
            <Button onClick={exportSummary} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={copySummary} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chief Complaint</Label>
              <Textarea
                value={summary.chiefComplaint}
                onChange={(e) => setSummary({ ...summary, chiefComplaint: e.target.value })}
                placeholder="Main reason for visit"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>History of Present Illness</Label>
              <Textarea
                value={summary.historyOfPresentIllness}
                onChange={(e) => setSummary({ ...summary, historyOfPresentIllness: e.target.value })}
                placeholder="Detailed symptom history"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Physical Examination</Label>
              <Textarea
                value={summary.physicalExamination}
                onChange={(e) => setSummary({ ...summary, physicalExamination: e.target.value })}
                placeholder="Examination findings"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Assessment</Label>
              <Textarea
                value={summary.assessment}
                onChange={(e) => setSummary({ ...summary, assessment: e.target.value })}
                placeholder="Clinical assessment and diagnosis"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Plan</Label>
              <Textarea
                value={summary.plan}
                onChange={(e) => setSummary({ ...summary, plan: e.target.value })}
                placeholder="Treatment plan and recommendations"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Medications</Label>
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add medication"
                  onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                />
                <Button onClick={addMedication} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {summary.medications.map((med, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {med}
                    <button
                      onClick={() => removeMedication(idx)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Follow-up</Label>
              <Textarea
                value={summary.followUp}
                onChange={(e) => setSummary({ ...summary, followUp: e.target.value })}
                placeholder="Follow-up instructions"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Questions for Doctor</Label>
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add question"
                  onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                />
                <Button onClick={addQuestion} size="sm">Add</Button>
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {summary.questionsForDoctor.map((q, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span>{q}</span>
                    <button
                      onClick={() => removeQuestion(idx)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Summary saved",
                description: "Visit summary has been saved",
              });
              setIsOpen(false);
            }}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save Summary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


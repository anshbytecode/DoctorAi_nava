import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  FileText,
  ClipboardList,
  Stethoscope,
  Type,
  CheckCircle2,
  AlertTriangle,
  Hash,
} from 'lucide-react';

interface TranscriptEntry {
  speaker: 'doctor' | 'patient' | 'copilot';
  text: string;
  timestamp: string;
}

interface CopilotNote {
  title: string;
  content: string;
}

const MOCK_TRANSCRIPT: TranscriptEntry[] = [
  { speaker: 'patient', text: 'Doctor, I have been having chest tightness for the last 2 days.', timestamp: '10:00' },
  { speaker: 'doctor', text: 'Does it worsen with exertion or while resting?', timestamp: '10:01' },
  { speaker: 'patient', text: 'Yes, mostly when I walk up the stairs.', timestamp: '10:02' },
  { speaker: 'copilot', text: 'Possible angina symptoms. Recommend ECG order and cardiac enzymes.', timestamp: '10:02' },
];

const MOCK_NOTES: CopilotNote[] = [
  {
    title: 'Chief Complaint',
    content: 'Chest tightness for 2 days, worse with exertion, relieved with rest.',
  },
  {
    title: 'Assessment',
    content: 'Likely unstable angina. Consider ECG, troponin, cardiology referral.',
  },
  {
    title: 'Plan',
    content: 'Order ECG + troponin, start aspirin 81mg, schedule stress test, educate patient on warning signs.',
  },
];

const MOCK_CODES = [
  { code: 'I20.0', description: 'Unstable angina' },
  { code: '99214', description: 'Established patient office visit (moderate complexity)' },
  { code: '93000', description: 'Electrocardiogram' },
];

export const ConsultCopilot = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(MOCK_TRANSCRIPT);
  const [draftPrescription, setDraftPrescription] = useState('Aspirin 81mg PO daily');
  const [newNote, setNewNote] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'doctor',
        text: newNote,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewNote('');
  };

  const handleToggleListening = () => {
    setIsListening((prev) => !prev);
    toast({
      title: isListening ? 'Transcription paused' : 'Transcription started',
      description: isListening
        ? 'Copilot stopped listening.'
        : 'Copilot is transcribing conversation in real time.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          Real-time Consult Copilot
        </CardTitle>
        <CardDescription>
          Live transcription, auto-notes, billing codes, and prescription drafts during teleconsults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="transcript">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transcript">Live Transcript</TabsTrigger>
            <TabsTrigger value="notes">Auto Notes</TabsTrigger>
            <TabsTrigger value="codes">Billing & Codes</TabsTrigger>
            <TabsTrigger value="rx">Prescription Draft</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript">
            <Card className="border border-blue-100 bg-blue-50">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base font-semibold">Live Transcript</CardTitle>
                <Button
                  variant={isListening ? 'destructive' : 'default'}
                  size="sm"
                  onClick={handleToggleListening}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 rounded-md border bg-white p-4">
                  <div className="space-y-3">
                    {transcript.map((entry, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-semibold capitalize">{entry.speaker}</span>
                          <span>{entry.timestamp}</span>
                        </div>
                        <div
                          className={`rounded-lg p-3 text-sm ${
                            entry.speaker === 'copilot'
                              ? 'bg-purple-50 text-purple-800'
                              : entry.speaker === 'doctor'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-gray-50 text-gray-800'
                          }`}
                        >
                          {entry.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add manual note..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote}>Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-3">
              {MOCK_NOTES.map((note, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">{note.content}</CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="codes">
            <div className="space-y-3">
              {MOCK_CODES.map((code) => (
                <Card key={code.code}>
                  <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{code.code}</p>
                      <p className="text-sm text-gray-600">{code.description}</p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Suggested
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-gray-500">
                Double-check codes before submitting claims. Copilot suggestions are for drafting only.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="rx">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prescription Draft</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={draftPrescription}
                  onChange={(e) => setDraftPrescription(e.target.value)}
                  rows={4}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Diagnosis / ICD code" defaultValue="I20.0" />
                  <Input placeholder="Follow-up instructions" defaultValue="Monitor symptoms and follow up in 1 week." />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    <Type className="mr-1 h-3 w-3" />
                    Draft ready
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Hash className="mr-1 h-3 w-3" />
                    Rx # TEMP-12345
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button variant="outline" className="order-2 sm:order-1">
                    Save Draft
                  </Button>
                  <Button className="order-1 bg-blue-600 text-white sm:order-2">
                    Send to Pharmacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


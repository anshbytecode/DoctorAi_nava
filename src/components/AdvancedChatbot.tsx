import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Activity, Calendar, Repeat, Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  intent: 'triage' | 'followup' | 'appointment' | 'general';
  content: string;
  timestamp: string;
}

const PREDEFINED_RESPONSES = {
  triage: [
    'Based on your symptoms, this appears to be moderate. Please monitor closely and seek urgent care if symptoms worsen.',
    'Please record your temperature and oxygen saturation twice today. Notify us if values are abnormal.',
  ],
  followup: [
    'Reminder: Your next check-in is tomorrow at 9AM. Do you want to reschedule?',
    'Please confirm if you started the new medication prescribed last week.',
  ],
  appointment: [
    'I can connect you to Dr. Singh today at 4 PM. Shall I book it?',
    'There is an open slot tomorrow morning at 9:30 AM with our cardiologist.',
  ],
};

export const AdvancedChatbot = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      intent: 'system',
      content: 'Hi, I am your 24/7 health assistant. I can triage symptoms, handle follow-ups, and manage appointments.',
      timestamp: '09:00',
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'triage' | 'followup' | 'appointment' | 'general'>('triage');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      intent: mode,
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantResponse = PREDEFINED_RESPONSES[mode][Math.floor(Math.random() * PREDEFINED_RESPONSES[mode].length)];

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      intent: mode,
      content: assistantResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');

    toast({
      title: 'Assistant responded',
      description: 'Conversation updated with AI triage context.',
    });
  };

  const getIntentBadge = (intent: ChatMessage['intent']) => {
    switch (intent) {
      case 'triage':
        return <Badge variant="outline" className="bg-red-50 text-red-800">Triage</Badge>;
      case 'followup':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">Follow-up</Badge>;
      case 'appointment':
        return <Badge variant="outline" className="bg-green-50 text-green-800">Appointments</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          Advanced AI Assistant
        </CardTitle>
        <CardDescription>
          Context-aware chatbot handling triage, follow-up instructions, and appointment changes with full history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(val) => setMode(val as typeof mode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="triage" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Triage Mode
            </TabsTrigger>
            <TabsTrigger value="followup" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Follow-up Mode
            </TabsTrigger>
            <TabsTrigger value="appointment" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-80 rounded-lg border">
          <div className="space-y-4 p-4">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{msg.role}</span>
                    {msg.intent !== 'system' && getIntentBadge(msg.intent)}
                  </div>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    msg.role === 'assistant' ? 'bg-purple-50 text-purple-900' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="flex items-center gap-2 self-start sm:self-auto">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


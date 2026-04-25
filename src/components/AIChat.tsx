import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I can help you understand symptoms, provide general health information, and guide you on when to seek medical care. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('headache') || lowerInput.includes('head pain')) {
      return 'Headaches can have various causes. Common ones include tension, dehydration, or lack of sleep. Try resting in a quiet, dark room, staying hydrated, and applying a cold compress. If your headache is severe, persistent, or accompanied by other symptoms like vision changes or fever, please consult a healthcare provider immediately.';
    }
    
    if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      return 'A fever is usually a sign that your body is fighting an infection. For adults, a temperature above 100.4°F (38°C) is considered a fever. Stay hydrated, rest, and you can take over-the-counter medications like acetaminophen or ibuprofen (if not contraindicated). If your fever is above 103°F, persists for more than 3 days, or is accompanied by severe symptoms, seek medical attention.';
    }
    
    if (lowerInput.includes('cough') || lowerInput.includes('coughing')) {
      return 'Coughs can be caused by infections, allergies, or irritants. Stay hydrated, use a humidifier, and consider honey (for adults) or cough drops. If your cough persists for more than 2 weeks, is accompanied by blood, chest pain, or difficulty breathing, please see a healthcare provider.';
    }
    
    if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
      return 'Pain can indicate various conditions. For mild pain, rest, ice/heat therapy, and over-the-counter pain relievers may help. However, if you experience severe pain, pain that doesn\'t improve, or pain accompanied by other concerning symptoms, it\'s important to consult with a healthcare professional for proper evaluation.';
    }
    
    if (lowerInput.includes('appointment') || lowerInput.includes('doctor')) {
      return 'I can help you find a doctor! You can use the "Find Doctors" section to search for healthcare providers by specialty and location. Based on your symptoms, I can also recommend which type of specialist might be most appropriate for your needs.';
    }
    
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent')) {
      return 'If you\'re experiencing a medical emergency with symptoms like chest pain, difficulty breathing, severe injury, or signs of stroke, please call emergency services (108 in India) immediately. For urgent but non-life-threatening concerns, you can visit an urgent care center or contact your healthcare provider.';
    }
    
    return 'Thank you for sharing that information. While I can provide general health guidance, I\'m not a replacement for professional medical advice. For specific concerns, persistent symptoms, or if you\'re unsure about your condition, I recommend consulting with a qualified healthcare provider. Would you like me to help you find a doctor or provide more information about a specific symptom?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">AI Health Assistant</CardTitle>
              <p className="text-xs text-gray-500">Powered by advanced AI</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Online
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex-1 rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-12'
                  : 'bg-gray-100 text-gray-900 mr-12'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-3 mr-12">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This AI assistant provides general health information only. Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </Card>
  );
};


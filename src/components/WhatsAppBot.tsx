import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WhatsAppBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your chocolate assistant. Ask me anything about our products, place orders, or get help with your queries!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // WhatsApp direct link
  const whatsappNumber = '918042781962'; // Your WhatsApp business number
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi! I'd like to know more about your chocolates.`;

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-assistant', {
        body: { 
          messages: [...messages, userMessage],
          query: input 
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'View Products', action: 'Show me all available chocolates' },
    { label: 'Place Order', action: 'I want to place an order' },
    { label: 'Offers', action: 'What offers are currently available?' },
    { label: 'Delivery Info', action: 'Tell me about delivery and shipping' },
  ];

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Chat with AI */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl gradient-luxury text-white hover:scale-110 transition-transform"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>

        {/* WhatsApp Direct */}
        {!isOpen && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white hover:scale-110 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </Button>
          </a>
        )}
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] z-50 shadow-2xl border-2 flex flex-col">
          <div className="gradient-luxury text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Chocolate Assistant</h3>
                  <p className="text-xs opacity-90">Powered by AI</p>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-secondary text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setInput(action.action);
                  }}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="gradient-luxury text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2"
            >
              <Button variant="outline" className="w-full text-xs" size="sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366] mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp Directly
              </Button>
            </a>
          </div>
        </Card>
      )}
    </>
  );
};

export default WhatsAppBot;

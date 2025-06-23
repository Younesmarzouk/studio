"use client";

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Dummy data for the chat
const chatPartner = {
  name: "أحمد العلوي",
  avatar: "https://placehold.co/40x40.png",
  online: true,
};

const initialMessages = [
  { id: 1, sender: 'other', text: 'مرحباً، هل يمكننا مناقشة تفاصيل المشروع؟', time: '10:45 ص' },
  { id: 2, sender: 'me', text: 'أهلاً بك. بالتأكيد، أنا جاهز.', time: '10:46 ص' },
  { id: 3, sender: 'other', text: 'ممتاز. المشروع هو تصميم وتركيب خزانة ملابس كبيرة.', time: '10:47 ص' },
  { id: 4, sender: 'me', text: 'فهمت. هل لديك أبعاد معينة أو تصميم في ذهنك؟', time: '10:48 ص' },
  { id: 5, sender: 'other', text: 'نعم، سأرسل لك المخطط الآن.', time: '10:48 ص' },
];


export default function ChatPage() {
    const [messages, setMessages] = React.useState(initialMessages);
    const [newMessage, setNewMessage] = React.useState("");
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;
        
        const newMsg = {
            id: messages.length + 1,
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages([...messages, newMsg]);
        setNewMessage("");
    }

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b shadow-sm sticky top-0 bg-card z-10">
        <div className="flex items-center gap-3">
            <Link href="/messages" passHref>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <Avatar>
                <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} />
                <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-bold text-lg">{chatPartner.name}</h2>
                <p className="text-xs text-green-500">{chatPartner.online ? 'متصل الآن' : 'غير متصل'}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
            </Button>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={cn(
                    "flex items-end gap-2 max-w-[80%]",
                    msg.sender === 'me' ? 'flex-row-reverse ml-auto' : 'flex-row'
                )}>
                    <div className={cn(
                        "rounded-lg px-4 py-2",
                        msg.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                    )}>
                        <p>{msg.text}</p>
                        <p className={cn(
                            "text-xs mt-1 text-right",
                             msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>{msg.time}</p>
                    </div>
                </div>
            ))}
        </div>
      </ScrollArea>
      <Separator/>

      {/* Input Form */}
      <div className="p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..." 
                className="flex-1"
                dir="rtl"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
                <Send className="h-5 w-5" />
            </Button>
        </form>
      </div>
    </div>
  );
}

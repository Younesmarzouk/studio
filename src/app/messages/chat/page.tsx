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
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export default function ChatPage() {
    const { toast } = useToast();
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState("");
    const [user, setUser] = React.useState<User | null>(null);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    // This is a placeholder for the chat partner. 
    // In a real app, this would be dynamic based on which user you select to chat with.
    const chatPartner = {
      id: "mockPartnerId123", // A unique mock ID for the chat partner
      name: "أحمد العلوي",
      avatar: "https://placehold.co/40x40.png",
      online: true,
    };

    React.useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(currentUser => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, []);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages]);

    React.useEffect(() => {
        if (!user) return;

        // Create a consistent chat ID by sorting the user IDs
        const chatId = [user.uid, chatPartner.id].sort().join('_');
        const messagesCollection = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesCollection, orderBy('time', 'asc'));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    sender: data.senderId === user.uid ? 'me' : 'other',
                    text: data.text,
                    time: data.time?.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) || ''
                } as Message;
            });
            setMessages(fetchedMessages);
        });

        return () => unsubscribeMessages();
    }, [user, chatPartner.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !user) {
          if (!user) {
            toast({ variant: 'destructive', title: 'يجب تسجيل الدخول لإرسال رسالة' });
          }
          return;
        }
        
        const chatId = [user.uid, chatPartner.id].sort().join('_');
        const messagesCollection = collection(db, 'chats', chatId, 'messages');

        try {
            await addDoc(messagesCollection, {
                text: newMessage,
                senderId: user.uid,
                receiverId: chatPartner.id,
                time: serverTimestamp(),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
            toast({ variant: 'destructive', title: 'فشل إرسال الرسالة' });
        }
    }

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
            <Button type="submit" size="icon" className="flex-shrink-0" disabled={!user}>
                <Send className="h-5 w-5" />
            </Button>
        </form>
      </div>
    </div>
  );
}

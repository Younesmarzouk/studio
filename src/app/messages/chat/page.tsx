"use client";

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Video, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const ChatPageContent = () => {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const partnerId = searchParams.get('partnerId');
    const partnerName = searchParams.get('partnerName') || 'مستخدم';
    const partnerAvatar = searchParams.get('partnerAvatar') || `https://placehold.co/40x40.png`;

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState("");
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                toast({ variant: 'destructive', title: 'يرجى تسجيل الدخول للمتابعة' });
                router.replace('/login');
            } else {
                setUser(currentUser);
            }
        });
        return () => unsubscribeAuth();
    }, [router, toast]);
    
    React.useEffect(() => {
        if (!partnerId) {
            toast({ variant: 'destructive', title: 'خطأ', description: 'لم يتم تحديد المستخدم الآخر.' });
            router.push('/messages');
        }
    }, [partnerId, router, toast]);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages]);

    React.useEffect(() => {
        if (!user || !partnerId) return;
        setLoading(true);

        const chatId = [user.uid, partnerId].sort().join('_');
        const messagesCollection = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesCollection, orderBy('time', 'asc'));

        const unsubscribeMessages = onSnapshot(q, (msgSnapshot) => {
            const fetchedMessages = msgSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    senderId: data.senderId,
                    text: data.text,
                    time: data.time?.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) || ''
                } as Message;
            });
            setMessages(fetchedMessages);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            toast({ variant: 'destructive', title: 'فشل تحميل الرسائل', description: "حدث خطأ أثناء جلب الرسائل. قد يكون بسبب قواعد الأمان." });
            setLoading(false);
        });

        return () => unsubscribeMessages();
    }, [user, partnerId, toast]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !user || !partnerId) {
          if (!user) toast({ variant: 'destructive', title: 'يجب تسجيل الدخول لإرسال رسالة' });
          return;
        }
        
        const chatId = [user.uid, partnerId].sort().join('_');
        const messagesCollection = collection(db, 'chats', chatId, 'messages');
        const chatDocRef = doc(db, 'chats', chatId);

        try {
            await addDoc(messagesCollection, {
                text: newMessage,
                senderId: user.uid,
                receiverId: partnerId,
                time: serverTimestamp(),
            });

            await setDoc(chatDocRef, {
                lastMessage: newMessage,
                lastMessageTimestamp: serverTimestamp(),
            }, { merge: true });

            setNewMessage("");
        } catch (error: any) {
            console.error("Error sending message: ", error);
            let description = "فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.";
             if (error.code === 'permission-denied') {
                description = "فشل إرسال الرسالة بسبب قواعد الأمان. يرجى مراجعة إعدادات Firebase.";
            }
            toast({ variant: 'destructive', title: 'فشل إرسال الرسالة', description });
        }
    }

    if (!partnerId) {
      return (
          <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
          </div>
      );
    }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-3 border-b shadow-sm sticky top-0 bg-card z-10">
        <div className="flex items-center gap-3">
            <Link href="/messages" passHref>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <Avatar>
                <AvatarImage src={partnerAvatar} alt={partnerName} data-ai-hint="person face" />
                <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-bold text-lg">{partnerName}</h2>
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

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 pb-4">
            {loading ? (
                <div className="flex justify-center items-center h-full pt-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : messages.length > 0 ? messages.map(msg => (
                <div key={msg.id} className={cn(
                    "flex items-end gap-2 max-w-[80%]",
                    msg.senderId === user?.uid ? 'flex-row-reverse ml-auto' : 'flex-row'
                )}>
                    <div className={cn(
                        "rounded-lg px-4 py-2",
                        msg.senderId === user?.uid ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                    )}>
                        <p>{msg.text}</p>
                        <p className={cn(
                            "text-xs mt-1 text-right",
                             msg.senderId === user?.uid ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>{msg.time}</p>
                    </div>
                </div>
            )) : (
              <div className="text-center text-muted-foreground pt-20">
                <p>لا توجد رسائل. ابدأ المحادثة!</p>
              </div>
            )}
        </div>
      </ScrollArea>
      
      <div className="p-4 bg-background border-t sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..." 
                className="flex-1"
                dir="rtl"
                disabled={!user}
            />
            <Button type="submit" size="icon" className="flex-shrink-0" disabled={!user || newMessage.trim() === ""}>
                <Send className="h-5 w-5" />
            </Button>
        </form>
      </div>
    </div>
  );
}


export default function ChatPage() {
    return (
        <React.Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>}>
            <ChatPageContent />
        </React.Suspense>
    )
}

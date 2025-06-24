"use client";

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Video, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

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
    const [currentUserProfile, setCurrentUserProfile] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                toast({ variant: 'destructive', title: 'يرجى تسجيل الدخول للمتابعة' });
                router.replace('/login');
            } else {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setCurrentUserProfile(userDocSnap.data() as UserProfile);
                }
            }
        });
        return () => unsubscribeAuth();
    }, [router, toast]);
    
    React.useEffect(() => {
        if (!partnerId && !loading) {
            toast({ variant: 'destructive', title: 'خطأ', description: 'لم يتم تحديد المستخدم الآخر.' });
            router.push('/messages');
        }
    }, [partnerId, router, toast, loading]);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages]);

    React.useEffect(() => {
        if (!user || !partnerId) return;
        setLoading(true);

        const chatId = [user.uid, partnerId].sort().join('_');
        const chatDocRef = doc(db, 'chats', chatId);
        
        // This is the listener for the parent chat document.
        const unsubscribeChat = onSnapshot(chatDocRef, (chatSnap) => {
            // If the chat document exists, we can safely listen for messages.
            if (chatSnap.exists()) {
                const messagesCollection = collection(db, 'chats', chatId, 'messages');
                const q = query(messagesCollection, orderBy('time', 'asc'));

                // This is the listener for the messages subcollection.
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

                // Return the function to unsubscribe from messages when the parent listener re-runs.
                return () => unsubscribeMessages();
            } else {
                // Chat doesn't exist yet. Clear any existing messages and stop loading.
                setMessages([]);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error subscribing to chat document:", error);
            toast({ variant: 'destructive', title: 'خطأ في المحادثة', description: "لا يمكن الوصول إلى بيانات المحادثة." });
            setLoading(false);
        });

        // Return the main unsubscribe function for the chat document.
        return () => unsubscribeChat();
    }, [user, partnerId, toast]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !user || !partnerId || !currentUserProfile) {
          if (!user) toast({ variant: 'destructive', title: 'يجب تسجيل الدخول لإرسال رسالة' });
          return;
        }
        
        const chatId = [user.uid, partnerId].sort().join('_');
        const messagesCollection = collection(db, 'chats', chatId, 'messages');
        const chatDocRef = doc(db, 'chats', chatId);

        try {
            // First, ensure the chat document exists by setting it.
            // Using set with merge:true is safe and will create or update.
            await setDoc(chatDocRef, {
                members: [user.uid, partnerId],
                lastMessage: newMessage,
                lastMessageTimestamp: serverTimestamp(),
                participants: {
                    [user.uid]: {
                        name: currentUserProfile.name,
                        avatar: currentUserProfile.avatar
                    },
                    [partnerId]: {
                        name: partnerName,
                        avatar: partnerAvatar
                    }
                }
            }, { merge: true });

            // Then, add the message to the subcollection.
            await addDoc(messagesCollection, {
                text: newMessage,
                senderId: user.uid,
                receiverId: partnerId,
                time: serverTimestamp(),
            });


            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
            toast({ variant: 'destructive', title: 'فشل إرسال الرسالة', description: 'تأكد من تحديث قواعد الأمان في Firebase.' });
        }
    }

    if (!partnerId && loading) {
      return (
          <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
          </div>
      );
    }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
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

      {/* Messages Area */}
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
      
      {/* Input Form */}
      <div className="p-4 bg-background border-t sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..." 
                className="flex-1"
                dir="rtl"
                disabled={!user || !currentUserProfile}
            />
            <Button type="submit" size="icon" className="flex-shrink-0" disabled={!user || !currentUserProfile || newMessage.trim() === ""}>
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

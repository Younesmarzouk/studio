"use client";

import * as React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageHeader from '@/components/page-header';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageTimestamp?: { toDate: () => Date };
  participants: {
    [key: string]: {
      name: string;
      avatar: string;
    }
  };
  members: string[];
}

const MessageSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
  </div>
);

export default function MessagesPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      if (!loadingAuth) {
        setLoadingChats(false);
      }
      return;
    }

    setLoadingChats(true);
    const chatsCollection = collection(db, 'chats');
    const q = query(
      chatsCollection,
      where('members', 'array-contains', user.uid),
      orderBy('lastMessageTimestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      setChats(fetchedChats);
      setLoadingChats(false);
    }, (error) => {
      console.error("Error fetching chats: ", error);
      // This is a common error if the index is not created.
      if (error.code === 'failed-precondition') {
        console.error("Firestore index not found. Please create the required composite index in your Firebase console. The link is usually provided in the browser's console error message.");
      }
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [user, loadingAuth]);

  const getPartnerInfo = (chat: Chat) => {
    if (!user) return null;
    const partnerId = chat.members.find(id => id !== user.uid);
    if (!partnerId || !chat.participants[partnerId]) {
      return { name: "مستخدم محذوف", avatar: "" };
    }
    return chat.participants[partnerId];
  };

  const getPartnerId = (chat: Chat) => {
    if (!user) return null;
    return chat.members.find(id => id !== user.uid);
  }

  return (
    <div>
      <PageHeader title="الرسائل" />
      <div className="p-4">
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {loadingAuth || loadingChats ? (
                <>
                  <MessageSkeleton />
                  <Separator />
                  <MessageSkeleton />
                  <Separator />
                  <MessageSkeleton />
                </>
              ) : chats.length > 0 ? (
                chats.map((chat, index) => {
                  const partnerInfo = getPartnerInfo(chat);
                  const partnerId = getPartnerId(chat);
                  if (!partnerInfo || !partnerId) return null;

                  const partnerAvatar = partnerInfo.avatar || `https://placehold.co/40x40.png`;

                  return (
                    <React.Fragment key={chat.id}>
                      <Link href={`/messages/chat?partnerId=${partnerId}&partnerName=${encodeURIComponent(partnerInfo.name)}&partnerAvatar=${encodeURIComponent(partnerAvatar)}`} className="block hover:bg-accent cursor-pointer">
                        <div className="flex items-center gap-4 p-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={partnerAvatar} alt={partnerInfo.name} data-ai-hint="person face" />
                            <AvatarFallback>{partnerInfo.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{partnerInfo.name}</h3>
                              {chat.lastMessageTimestamp && (
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(chat.lastMessageTimestamp.toDate(), { addSuffix: true, locale: ar })}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-muted-foreground truncate w-4/5">{chat.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index < chats.length - 1 && <Separator />}
                    </React.Fragment>
                  )
                })
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {!user ? (
                      <>
                        <p>الرجاء تسجيل الدخول لعرض رسائلك.</p>
                         <Link href="/login">
                            <Button className="mt-4">تسجيل الدخول</Button>
                         </Link>
                      </>
                  ) : (
                    <p>لا توجد لديك أي محادثات حتى الآن.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

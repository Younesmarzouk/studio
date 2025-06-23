import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const messages = [
  {
    id: 1,
    name: "أحمد العلوي",
    avatar: "https://placehold.co/40x40.png",
    lastMessage: "مرحباً، هل يمكننا مناقشة تفاصيل المشروع؟",
    time: "10:45 ص",
    unread: 2,
  },
  {
    id: 2,
    name: "سارة محمد",
    avatar: "https://placehold.co/40x40.png",
    lastMessage: "بالتأكيد، سأرسل لك عرض السعر.",
    time: "9:30 ص",
    unread: 0,
  },
  {
    id: 3,
    name: "كريم يوسفي",
    avatar: "https://placehold.co/40x40.png",
    lastMessage: "شكراً لك، العمل كان ممتازاً!",
    time: "أمس",
    unread: 0,
  },
   {
    id: 4,
    name: "فاطمة الزهراء",
    avatar: "https://placehold.co/40x40.png",
    lastMessage: "تم إنجاز المهمة بنجاح.",
    time: "منذ يومين",
    unread: 0,
  },
];

export default function MessagesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">الرسائل</h1>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-accent cursor-pointer">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.avatar} alt={message.name} data-ai-hint="person face" />
                    <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{message.name}</h3>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-muted-foreground truncate w-4/5">{message.lastMessage}</p>
                      {message.unread > 0 && (
                        <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {message.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < messages.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

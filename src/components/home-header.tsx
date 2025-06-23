import { Handshake, LogIn } from "lucide-react";
import Link from 'next/link';
import { Button } from "./ui/button";

export default function HomeHeader() {
  return (
    <header className="bg-white dark:bg-card text-foreground p-4 rounded-b-3xl shadow-lg border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="logo-icon p-2 bg-primary rounded-lg">
            <Handshake className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="logo-text">
            <h1 className="text-xl font-bold font-headline text-primary">زافاي</h1>
            <p className="text-xs text-muted-foreground">منصة الربط بين العمال وأصحاب العمل</p>
          </div>
        </div>
        <Link href="/login" passHref>
            <Button variant="outline">
                <LogIn className="h-4 w-4 ml-2" />
                دخول
            </Button>
        </Link>
      </div>
    </header>
  );
}

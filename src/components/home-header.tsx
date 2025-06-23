import { Handshake, LogIn } from "lucide-react";
import Link from 'next/link';
import { Button } from "./ui/button";

export default function HomeHeader() {
  return (
    <header className="bg-primary p-4 shadow-lg text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="logo-icon p-2 bg-background rounded-lg">
            <Handshake className="h-8 w-8 text-primary" />
          </div>
          <div className="logo-text">
            <h1 className="text-xl font-bold font-headline">ZafayLink</h1>
            <p className="text-xs text-background/80">منصة الربط بين العمال وأصحاب العمل</p>
          </div>
        </div>
        <Link href="/login" passHref>
            <Button variant="secondary">
                <LogIn className="h-4 w-4 ml-2" />
                دخول
            </Button>
        </Link>
      </div>
    </header>
  );
}

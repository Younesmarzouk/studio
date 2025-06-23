import { Handshake } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="bg-gradient-to-l from-primary to-accent text-primary-foreground p-5 rounded-b-3xl shadow-lg">
      <div className="flex items-center gap-4">
        <div className="logo-icon">
          <Handshake className="h-10 w-10 text-white" />
        </div>
        <div className="logo-text">
          <h1 className="text-2xl font-bold font-headline">زافاي</h1>
          <p className="text-sm opacity-90">منصة الربط بين العمال وأصحاب العمل</p>
        </div>
      </div>
    </header>
  );
}

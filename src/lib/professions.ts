
import { Hammer, Zap, Wrench, HardHat, PaintRoller, Car, Scissors, Utensils, Cake, Sprout, Trash2, BookUser, Code, PenTool, ClipboardList, Baby, HeartHandshake, User, ShoppingCart, Tractor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Profession = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const professions: Profession[] = [
  { value: "carpentry", label: "نجار", icon: Hammer },
  { value: "electricity", label: "كهربائي", icon: Zap },
  { value: "plumbing", label: "سباك", icon: Wrench },
  { value: "construction", label: "بنّاء", icon: HardHat },
  { value: "painting", label: "صباغ", icon: PaintRoller },
  { value: "mechanics", label: "ميكانيكي", icon: Car },
  { value: "tailoring", label: "خياط/خياطة", icon: Scissors },
  { value: "cooking", label: "طباخ/طباخة", icon: Utensils },
  { value: "pastry", label: "حلواني", icon: Cake },
  { value: "hairdressing", label: "حلاق", icon: Scissors },
  { value: "gardening", label: "بستاني", icon: Sprout },
  { value: "cleaning", label: "عامل نظافة", icon: Trash2 },
  { value: "driving", label: "سائق", icon: Car },
  { value: "tutoring", label: "مدرس(ة) خاص", icon: BookUser },
  { value: "development", label: "مطور ويب", icon: Code },
  { value: "design", label: "مصمم جرافيك", icon: PenTool },
  { value: "admin_assistant", label: "مساعد إداري", icon: ClipboardList },
  { value: "childcare", label: "رعاية أطفال", icon: Baby },
  { value: "elderly_care", label: "رعاية كبار السن", icon: HeartHandshake },
  { value: "delivery", label: "عامل توصيل", icon: ShoppingCart },
  { value: "agriculture", label: "فلاحة", icon: Tractor },
  { value: "other", label: "أخرى", icon: User },
];

export const iconMap: { [key: string]: LucideIcon } = professions.reduce((acc, prof) => {
  acc[prof.value] = prof.icon;
  return acc;
}, {} as { [key:string]: LucideIcon });


export const getProfessionByValue = (value: string): Profession | undefined => {
    return professions.find(p => p.value === value);
}

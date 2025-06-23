export type SliderItem = {
  title: string;
  description: string;
  image: string;
};

export type Job = {
  id: number;
  title: string;
  city: string;
  price: string;
  rating: number;
  featured: boolean;
};

export type Worker = {
  id: number;
  name: string;
  title: string;
  city: string;
  rating: number;
};

export const sliderItems: SliderItem[] = [
  {
    title: "وظائف مميزة",
    description: "أفضل العروض في مجالك",
    image: "https://placehold.co/800x450.png",
    "data-ai-hint": "job opportunity",
  },
  {
    title: "عمال محترفون",
    description: "خبراء معتمدون في جميع المجالات",
    image: "https://placehold.co/800x450.png",
    "data-ai-hint": "professional workers",
  },
  {
    title: "خدمات سريعة",
    description: "احصل على خدمتك في أسرع وقت",
    image: "https://placehold.co/800x450.png",
    "data-ai-hint": "fast service",
  },
];

export const jobs: Job[] = [
  {
    id: 1,
    title: "نجار محترف",
    city: "الدار البيضاء",
    price: "200 درهم/اليوم",
    rating: 4.7,
    featured: true,
  },
  {
    id: 2,
    title: "كهربائي متخصص",
    city: "الرباط",
    price: "حسب الخدمة",
    rating: 4.5,
    featured: false,
  },
   {
    id: 3,
    title: "سباك",
    city: "مراكش",
    price: "150 درهم/اليوم",
    rating: 4.2,
    featured: false,
  },
   {
    id: 4,
    title: "مطور تطبيقات",
    city: "طنجة",
    price: "500 درهم/اليوم",
    rating: 4.9,
    featured: true,
  },
];

export const workers: Worker[] = [
  {
    id: 1,
    name: "سارة محمد",
    title: "مربية أطفال - خبرة 5 سنوات",
    city: "الرباط",
    rating: 4.2,
  },
  {
    id: 2,
    name: "أحمد العلوي",
    title: "مصمم جرافيك",
    city: "فاس",
    rating: 4.9,
  },
  {
    id: 3,
    name: "كريم يوسفي",
    title: "سائق خاص",
    city: "الدار البيضاء",
    rating: 4.6,
  },
   {
    id: 4,
    name: "فاطمة الزهراء",
    title: "طباخة منزلية",
    city: "أكادير",
    rating: 4.8,
  },
];

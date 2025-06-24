
export type SliderItem = {
  title: string;
  description: string;
  image: string;
  "data-ai-hint": string;
};

export type Job = {
  id: string | number;
  title: string;
  city: string;
  price: string;
  rating: number;
  featured: boolean;
  icon: string;
};

export type Worker = {
  id: string | number;
  name: string;
  title: string;
  city: string;
  rating: number;
  icon: string;
};


export const sliderItems: SliderItem[] = [
  {
    title: "وظائف مميزة",
    description: "أفضل العروض في مجالك",
    image: "https://placehold.co/800x400.png",
    "data-ai-hint": "job opportunity",
  },
  {
    title: "عمال محترفون",
    description: "خبراء معتمدون في جميع المجالات",
    image: "https://placehold.co/800x400.png",
    "data-ai-hint": "professional workers",
  },
  {
    title: "خدمات سريعة",
    description: "احصل على خدمتك في أسرع وقت",
    image: "https://placehold.co/800x400.png",
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
    icon: "carpentry",
  },
  {
    id: 2,
    title: "كهربائي متخصص",
    city: "الرباط",
    price: "حسب الخدمة",
    rating: 4.5,
    featured: false,
    icon: "electricity",
  },
   {
    id: 3,
    title: "سباك",
    city: "مراكش",
    price: "150 درهم/اليوم",
    rating: 4.2,
    featured: false,
    icon: "plumbing",
  },
   {
    id: 4,
    title: "مطور تطبيقات",
    city: "طنجة",
    price: "500 درهم/اليوم",
    rating: 4.9,
    featured: true,
    icon: "development",
  },
];

export const workers: Worker[] = [
  {
    id: 1,
    name: "يوسف حمدي",
    title: "مصمم جرافيك",
    city: "الدار البيضاء",
    rating: 4.8,
    icon: "design",
  },
  {
    id: 2,
    name: "فاطمة العلوي",
    title: "مترجمة",
    city: "الرباط",
    rating: 4.9,
    icon: "other", // No specific icon for translator in the new list
  },
  {
    id: 3,
    name: "محمد أمين",
    title: "مساعد إداري",
    city: "عن بعد",
    rating: 4.6,
    icon: "admin_assistant",
  },
  {
    id: 4,
    name: "ليلى بناني",
    title: "طباخة منزلية",
    city: "مراكش",
    rating: 4.7,
    icon: "cooking",
  },
];

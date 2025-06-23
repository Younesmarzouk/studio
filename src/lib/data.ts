export type SliderItem = {
  title: string;
  description: string;
  image: string;
  "data-ai-hint": string;
};

export type Job = {
  id: number;
  title: string;
  city: string;
  price: string;
  rating: number;
  featured: boolean;
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

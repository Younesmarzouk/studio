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
  icon: string;
  image?: string;
  "data-ai-hint"?: string;
};

export type Worker = {
  id: number;
  name: string;
  title: string;
  city: string;
  rating: number;
  avatar: string;
  'data-ai-hint': string;
};


export const sliderItems: SliderItem[] = [
  {
    title: "وظائف مميزة",
    description: "أفضل العروض في مجالك",
    image: "https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg",
    "data-ai-hint": "job opportunity",
  },
  {
    title: "عمال محترفون",
    description: "خبراء معتمدون في جميع المجالات",
    image: "https://i.postimg.cc/BbSqbdmv/images-2021-09-02-T035936-467.jpg",
    "data-ai-hint": "professional workers",
  },
  {
    title: "خدمات سريعة",
    description: "احصل على خدمتك في أسرع وقت",
    image: "https://i.postimg.cc/4x7XYvQp/image.jpg",
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
    icon: "Hammer",
    image: "https://placehold.co/600x400.png",
    "data-ai-hint": "carpentry tools",
  },
  {
    id: 2,
    title: "كهربائي متخصص",
    city: "الرباط",
    price: "حسب الخدمة",
    rating: 4.5,
    featured: false,
    icon: "Zap",
  },
   {
    id: 3,
    title: "سباك",
    city: "مراكش",
    price: "150 درهم/اليوم",
    rating: 4.2,
    featured: false,
    icon: "Wrench",
  },
   {
    id: 4,
    title: "مطور تطبيقات",
    city: "طنجة",
    price: "500 درهم/اليوم",
    rating: 4.9,
    featured: true,
    icon: "Code",
    image: "https://placehold.co/600x400.png",
    "data-ai-hint": "laptop code",
  },
];

export const workers: Worker[] = [
  {
    id: 1,
    name: "يوسف حمدي",
    title: "مصمم جرافيك",
    city: "الدار البيضاء",
    rating: 4.8,
    avatar: "https://placehold.co/100x100.png",
    'data-ai-hint': 'graphic designer face',
  },
  {
    id: 2,
    name: "فاطمة العلوي",
    title: "مترجمة",
    city: "الرباط",
    rating: 4.9,
    avatar: "https://placehold.co/100x100.png",
    'data-ai-hint': 'translator woman face',
  },
  {
    id: 3,
    name: "محمد أمين",
    title: "مساعد افتراضي",
    city: "عن بعد",
    rating: 4.6,
    avatar: "https://placehold.co/100x100.png",
    'data-ai-hint': 'man face',
  },
  {
    id: 4,
    name: "ليلى بناني",
    title: "طباخة منزلية",
    city: "مراكش",
    rating: 4.7,
    avatar: "https://placehold.co/100x100.png",
    'data-ai-hint': 'cook woman face',
  },
];

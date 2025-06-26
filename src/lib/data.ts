
export type SliderItem = {
  title: string;
  description: string;
  image: string;
  "data-ai-hint": string;
};

export type Ad = {
  id: string | number;
  type: 'job' | 'worker';
  title: string;
  description: string;
  responsibilities?: string[];
  category: string;
  icon: string;
  city: string;
  price?: string;
  rating: number;
  featured: boolean;
  workType?: 'daily' | 'part-time' | 'seasonal' | 'full-time';
  userId: string;
  userName: string;
  userAvatar?: string;
  userPhone?: string;
  likes: number;
  likedBy: string[];
};

export type Job = {
  id: string | number;
  title: string;
  city: string;
  price: string;
  rating: number;
  featured: boolean;
  icon: string;
  workType?: "daily" | "part-time" | "seasonal" | "full-time";
  likes?: number;
};

export type Worker = {
  id: string | number;
  name: string;
  title: string;
  city: string;
  rating: number;
  icon: string;
  likes?: number;
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

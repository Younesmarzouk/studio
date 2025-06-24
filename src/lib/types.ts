export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    phone: string;
    title: string;
    location: string;
    bio: string;
    avatar: string;
    skills: string[];
    experience: { title: string; company: string; period: string; }[];
    certifications: { name:string; authority: string; year: string; }[];
    portfolio: { src: string; hint: string; }[];
}

import aisha from "@/assets/aisha.png";
import daniel from "@/assets/Daniel.png";
import rahul from "@/assets/rahul.png";
import sophia from "@/assets/Sophia.png";

export interface Testimonial {
  id: number;
  message: string;
  name: string;
  role?: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aisha Khan",
    role: "Entrepreneur",
    message:
      "My birth chart reading was incredibly accurate and detailed!",
    image: aisha,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    role: "Software Engineer",
    message:
      "The predictions helped me make important career decisions.",
    image: rahul,
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "Content Creator",
    message:
      "Very uplifting and spiritually insightful session.",
    image: sophia,
  },
  {
    id: 4,
    name: "Daniel Roberts",
    role: "Business Analyst",
    message:
      "Highly recommended for anyone curious about astrology.",
    image: daniel,
  },
];

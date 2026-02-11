import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Search, Calendar, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";
import { motion } from "framer-motion";
import AboutSection from "@/components/AboutSection";
import Hero from "@/components/Hero"
import heroBg from "@/assets/bg_astrochandra.png";
import poojaImg from "@/assets/pooja.jpeg";
import Astrologers from "./Astrologers";
import TestimonialSlider from "@/components/TestimonialSlider";
import { testimonials } from "@/data/testimonials";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const trainings = [
  {
    title: "Tarot Card Reading Training",
    desc: "Learn professional tarot reading with guided practice.",
  },
  {
    title: "Guided Meditation",
    desc: "Discover inner peace through structured meditation techniques.",
  },
  {
    title: "Vastu Training",
    desc: "Learn Vastu principles to create balanced and harmonious spaces.",
  },
  {
    title: "Numerology Training",
    desc: "Understand the power of numbers and their influence on life.",
  },
];

// Generate random twinkling stars
const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 2 + 2,
}));

const Index = () => (
  <div>
    {/* Hero Section */}
    <Hero/>

    {/* How It Works */}
    <section className="container py-20">
      <h2 className="font-heading text-3xl font-bold text-center mb-12">
        How It <span className="text-primary">Works</span>
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { icon: Search, title: "Select Your Problem", desc: "Choose from career, marriage, health, finance, or other life concerns." },
          { icon: Calendar, title: "Book Consultation", desc: "Pick a time slot and connect with a verified astrologer." },
          { icon: BookOpen, title: "Get Remedies", desc: "Receive personalized remedies and pooja guidance for your situation." },
        ].map((step, i) => (
          <motion.div
            key={step.title}
            className="rounded-xl border bg-card p-8 text-center shadow-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-7 w-7 text-primary" />
            </div>
            <div className="text-sm font-medium text-gold mb-1">Step {i + 1}</div>
            <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Astrologers */}
    <Astrologers/>
    
    {/* Priest & Pooja Support */}
    <section className="py-24">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl border border-black/20 bg-black/5 backdrop-blur-md px-8 py-10 md:px-12 md:py-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4 text-black">
              Priest & Pooja Support
            </h2>

            <p className="mb-6 text-black/80 leading-relaxed">
              After your consultation, if our astrologer recommends a specific
              pooja or remedy, we can arrange an experienced priest to perform
              it for you — either at your home or at a temple.
            </p>

            <Link to="/pooja">
              <Button
                size="lg"
                className="bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-lg"
              >
                Learn About Pooja Services
              </Button>
            </Link>

          </div>
        </motion.div>
      </div>
    </section>

    {/* Training & Workshops */}
    <section className="container py-20">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-sm font-medium tracking-wide"
          style={{ color: "#B8962E" }}
        >
          <GraduationCap className="h-4 w-4 text-[#D4AF37]" />
          Future Programs
        </div>
      </motion.div>

      <h2 className="font-heading text-3xl font-bold text-center mb-2">
        Training & <span className="text-primary">Workshops</span>
      </h2>

      <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
        Learn ancient spiritual sciences with structured training and guidance
        from experienced mentors.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trainings.map((t, i) => (
          <motion.div
            key={t.title}
            className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <h3 className="font-heading text-lg font-semibold mb-2">
              {t.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {t.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* About Section */}
    <AboutSection />

    {/* Testimonials */}
    <TestimonialSlider testimonials={testimonials} speed={15} />;
  
  </div>
);

export default Index;

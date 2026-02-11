import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Search, Calendar, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";
import { motion } from "framer-motion";
import tarotCard from "@/assets/tarot-card.jpg";
import heroBg from "@/assets/bg_AstroChandra.jpeg";
import poojaImg from "@/assets/pooja.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    {/* Hero */}
    <section className="relative overflow-hidden min-h-[75vh] md:min-h-[100vh] flex items-end pb-6 md:pb-14">
      {/* Soft spiritual gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #FFF7E6 0%, #FDECC8 40%, #F6D88C 100%)" }}
      />
      {/* Radial golden glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.15) 0%, transparent 70%)" }}
      />
      {/* Subtle star dots */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: "rgba(212,175,55,0.35)",
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background" />

      <div className="relative container py-8 md:py-0">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-2xl px-6 py-10 md:px-10 md:py-12 backdrop-blur-md border border-[#D4AF37]/20"
            style={{ background: "rgba(255,255,255,0.35)" }}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-sm text-[#B8962E] mb-8 tracking-wide font-medium">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" /> Trusted Astrology Guidance Platform
            </div>

            {/* Gold glow behind heading */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                <div className="w-72 h-32 rounded-full bg-[#D4AF37]/15 blur-3xl" />
              </div>
              <h1 className="relative font-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style={{ color: "#2B2B2B" }}>
                Clarity when life feels uncertain.
                <br />
                <span style={{ color: "#D4AF37" }}>Guidance when decisions matter.</span>
              </h1>
            </div>

            <p className="max-w-xl mx-auto text-lg mb-10 leading-relaxed" style={{ color: "#4A4A4A" }}>
              Real astrologers. Real conversations. Real direction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book">
                <Button
                  size="lg"
                  className="text-base px-8 text-white border-0 rounded-xl shadow-md"
                  style={{ background: "#EC2227" }}
                >
                  Book Consultation
                </Button>
              </Link>
              <Link to="/pooja">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold bg-gold/10 hover:bg-gold/20 hover:text-red-600"
                >
                  Book Pooja
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

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
    <section className="bg-muted/50 py-20">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-4">
          Verified <span className="text-primary">Astrologers</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Experienced and trusted astrologers ready to guide you through life's challenges.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {astrologers.map((a) => (
            <AstrologerCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>
    
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
    <section className="py-24" style={{ background: "linear-gradient(135deg, #FFF7E6 0%, #FDECC8 40%, #F6D88C 100%)" }}>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/35 backdrop-blur-md px-8 py-10 md:px-12 md:py-12 shadow-[0_20px_60px_-20px_rgba(212,175,55,0.15)]">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4" style={{ color: "#2B2B2B" }}>
              Training & Workshops
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: "#4A4A4A" }}>
              We are preparing guided training programs in spiritual sciences to help you learn and grow with proper guidance.
            </p>
            <ul className="space-y-3 mb-8">
              {["Meditation Guidance", "Tarot Reading Training", "Psychic Development", "Numerology Training"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium" style={{ color: "#2B2B2B" }}>
                  <Sparkles className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <span className="inline-block rounded-full px-5 py-1.5 text-xs font-bold text-white tracking-wider uppercase" style={{ background: "#D4AF37" }}>
                Coming Soon
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Tarot Training */}
    <section className="container py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-3xl font-bold text-center mb-12">
          Tarot Card Reading <span className="text-primary">Training</span>
        </h2>
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 md:p-10 shadow-sm opacity-90">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Tarot illustration */}
            <div className="relative flex-shrink-0">
              <img
                src={tarotCard}
                alt="Tarot card illustration"
                className="h-56 w-44 rounded-xl object-cover shadow-md"
              />
              {/* Coming Soon badge */}
              <div className="absolute -top-3 -right-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground shadow-md uppercase tracking-wider">
                Coming Soon
              </div>
            </div>
            {/* Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-4 uppercase tracking-wider">
                <GraduationCap className="h-3.5 w-3.5" /> Future Program
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">
                Learn Professional Tarot Reading
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Professional tarot card reading training program will be available soon. Master the art of tarot interpretation with guidance from experienced practitioners — from card meanings to intuitive reading techniques.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {["Card Meanings", "Spreads & Layouts", "Intuitive Reading", "Practice Sessions"].map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  </div>
);

export default Index;

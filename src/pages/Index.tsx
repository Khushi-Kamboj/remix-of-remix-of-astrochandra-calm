import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Search, Calendar, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";
import { motion } from "framer-motion";
import tarotCard from "@/assets/tarot-card.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Soft dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Bottom fade into page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative container py-32 md:py-40">
        <motion.div
          className="max-w-2xl mx-auto text-center md:text-left md:mx-0"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm text-[#D4AF37] mb-8 tracking-wide">
            <Sparkles className="h-4 w-4" /> Trusted Astrology Guidance Platform
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            Astrology Guidance<br />
            <span className="text-[#D4AF37]">You Can Trust</span>
          </h1>

          <p className="max-w-xl text-lg text-white/75 mb-10 leading-relaxed">
            Consult verified astrologers and receive remedy guidance, including pooja support when needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
            <Link to="/book">
              <Button
                size="lg"
                className="text-base px-8 shadow-lg bg-[#C62828] hover:bg-[#B71C1C] text-white border-0"
              >
                Book Consultation
              </Button>
            </Link>
            <Link to="/astrologers">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-white/5 backdrop-blur-sm"
              >
                View Astrologers
              </Button>
            </Link>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {astrologers.map((a) => (
            <AstrologerCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>

    {/* Pooja Support */}
    <section className="container py-20 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-10 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <Star className="h-7 w-7 text-gold" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">
            Priest & Pooja Support
          </h2>
          <p className="text-muted-foreground mb-6">
            After your consultation, if our astrologer recommends a specific pooja or remedy, we can arrange an experienced priest to perform it for you — either at your home or at a temple.
          </p>
          <Link to="/pooja">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
              Learn About Pooja Services
            </Button>
          </Link>
        </div>
      </motion.div>
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

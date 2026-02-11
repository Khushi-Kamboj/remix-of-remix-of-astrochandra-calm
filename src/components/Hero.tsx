import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/bg_astrochandra.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

     {/* Content */}
    <div className="relative container min-h-[90vh] flex items-center justify-center">

    <motion.div
    className="max-w-2xl text-center md:-ml-20"
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    transition={{ duration: 0.7 }}
    >
    {/* Badge */}
    <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-black/25 px-4 py-1.5 text-xs text-[#E6D08A] mb-6 tracking-wide font-medium">
        <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        Trusted Astrology Guidance Platform
    </div>

    {/* Heading */}
    <h1
        className="font-heading text-3xl md:text-5xl lg:text-6xl leading-tight mb-5"
        style={{ textShadow: "0px 4px 18px rgba(0,0,0,0.45)" }}
    >
        <span className="text-white/80 font-light block">
        Clarity when life feels uncertain.
        </span>

        <span className="text-[#D4AF37] font-bold block text-[1.05em]">
        Guidance when decisions matter.
        </span>
    </h1>

    {/* Subtitle */}
    <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
    Real astrologers. Real conversations. Real directions.
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/book">
        <Button
            size="lg"
            className="px-8 text-white rounded-xl shadow-lg"
            style={{ background: "#EC2227" }}
        >
            Book Consultation
        </Button>
        </Link>

        <Link to="/pooja">
        <Button
            size="lg"
            className="px-8 rounded-xl border border-[#D4AF37] text-[#D4AF37] bg-black/30 hover:bg-black/50"
        >
            Book Pooja
        </Button>
        </Link>
    </div>
    </motion.div>
    </div>

    </section>
  );
};

export default Hero;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/bg_astrochandra.png";
import heroBgMobile from "@/assets/bg_astrochandra_mobile.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section className="relative h-[90vh] md:min-h-screen overflow-hidden">
      
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Mobile Background */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url(${heroBgMobile})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
        <div className="relative container h-full flex flex-col justify-between md:justify-center py-8 md:py-0 text-center">

        {/* Badge — moves to top on mobile */}
        <div className="md:hidden pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-black/30 px-4 py-1.5 text-[11px] text-[#E6D08A] tracking-wide font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            Trusted Astrology Guidance Platform
        </div>
        </div>

        <motion.div
        className="max-w-xs sm:max-w-sm md:max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        >
        {/* Badge for desktop */}
        <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-black/30 px-4 py-1.5 text-xs text-[#E6D08A] mb-6 tracking-wide font-medium">
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
            Trusted Astrology Guidance Platform
        </div>

        {/* Heading */}
        <h1 className="font-heading text-xl sm:text-2xl md:text-5xl lg:text-6xl leading-snug md:leading-tight mb-4">
            <span className="text-white/85 block font-light">
            Clarity when life feels uncertain.
            </span>

            <span className="text-[#D4AF37] font-bold block">
            Guidance when decisions matter.
            </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-sm md:text-lg mb-6 max-w-md mx-auto">
            Real astrologers. Real conversations. Real direction.
        </p>

        {/* Buttons — one row on mobile */}
        <div className="flex flex-row gap-3 justify-center">
            <Link to="/book">
            <Button
                size="sm"
                className="px-5 py-2 text-sm text-white rounded-lg shadow-lg"
                style={{ background: "#EC2227" }}
            >
                Book Consultation
            </Button>
            </Link>

            <Link to="/pooja">
            <Button
                size="sm"
                className="px-5 py-2 text-sm rounded-lg border border-[#D4AF37] text-[#D4AF37] bg-black/30"
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

import { GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const trainings = [
  { title: "Tarot Card Reading Training", desc: "Learn professional tarot reading with guided practice." },
  { title: "Meditation Guidance", desc: "Discover inner peace through structured meditation techniques." },
  { title: "Psychic Development", desc: "Develop your intuitive abilities with expert mentorship." },
  { title: "Numerology Training", desc: "Understand the power of numbers and their influence on life." },
];

const TrainingWorkshops = () => (
  <div className="bg-white min-h-screen">
    <div className="container py-16 md:py-24">
      {/* Header */}
      <motion.div
        className="text-center mb-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-sm font-medium tracking-wide mb-6" style={{ color: "#B8962E" }}>
          <GraduationCap className="h-4 w-4 text-[#D4AF37]" /> Future Programs
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3" style={{ color: "#2B2B2B" }}>
          Training & Workshops
        </h1>
        <p className="max-w-lg mx-auto text-base" style={{ color: "#4A4A4A" }}>
          Guided learning programs in spiritual sciences.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
        {trainings.map((t, i) => (
          <motion.div
            key={t.title}
            className="rounded-xl border border-border bg-white p-6 shadow-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <h3 className="font-heading text-lg font-semibold" style={{ color: "#2B2B2B" }}>{t.title}</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A4A4A" }}>{t.desc}</p>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white tracking-wider uppercase"
              style={{ background: "#D4AF37" }}
            >
              Coming Soon
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default TrainingWorkshops;

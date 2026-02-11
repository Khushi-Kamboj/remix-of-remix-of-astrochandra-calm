import { GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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


const TrainingWorkshops = () => (
  <div className="bg-white min-h-screen">
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
  </div>
);

export default TrainingWorkshops;

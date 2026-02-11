import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  return (
    <section className="container py-24">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          About <span className="text-primary">Us</span>
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          AstroChandra is a guidance platform that connects people with
          experienced astrologers for meaningful conversations about life,
          decisions, and direction. We believe astrology is not just about
          prediction — it is about clarity, self-understanding, and making
          better choices with confidence.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="rounded-2xl border bg-card p-8 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-heading text-xl font-semibold mb-3">
            Our <span className="text-primary">Mission</span>
          </h3>
          <p className="text-muted-foreground">
            To provide honest, practical, and accessible astrology guidance
            that helps people make confident life decisions while preserving
            the authenticity of traditional spiritual knowledge.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border bg-card p-8 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="font-heading text-xl font-semibold mb-3">
            Our <span className="text-primary">Vision</span>
          </h3>
          <p className="text-muted-foreground">
            To become a trusted platform for spiritual guidance and learning,
            where astrology, remedies, and ancient wisdom are delivered with
            clarity, responsibility, and human connection.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

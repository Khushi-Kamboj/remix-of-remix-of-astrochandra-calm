import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const Astrologers = () => (
  <div className="container py-16">
    <div className="text-center mb-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
        Our <span className="text-primary">Astrologers</span>
      </h1>
      <p className="text-muted-foreground max-w-lg mx-auto">
        Each astrologer is verified for experience, accuracy, and commitment to helping you find real solutions.
      </p>
    </div>

    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {astrologers.map((a) => (
        <motion.div key={a.name} variants={card}>
          <AstrologerCard {...a} />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default Astrologers;

import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologers";

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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {astrologers.map((a) => (
        <AstrologerCard key={a.name} {...a} />
      ))}
    </div>
  </div>
);

export default Astrologers;

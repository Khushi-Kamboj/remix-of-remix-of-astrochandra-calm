import { Star, Clock, Globe, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AstrologerCardProps {
  name: string;
  experience: string;
  specialization: string;
  languages: string;
  availability: string;
  imageUrl?: string;
}

const AstrologerCard = ({
  name,
  experience,
  specialization,
  languages,
  availability,
  imageUrl,
}: AstrologerCardProps) => {
  const { role } = useAuth();
  const canBookServices = role === "user";

  return (
  <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
    {imageUrl ? (
      <div className="mb-4 mx-auto h-24 w-24 rounded-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
        <Star className="h-8 w-8 text-gold" />
      </div>
    )}
    <h3 className="font-heading text-lg font-semibold text-center">{name}</h3>
    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        {experience}
      </p>
      <p className="flex items-center gap-2">
        <Star className="h-4 w-4 text-gold" />
        {specialization}
      </p>
      <p className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        {languages}
      </p>
      <p className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gold" />
        {availability}
      </p>
    </div>
    {canBookServices && (
      <Link to="/book" className="block mt-4">
        <Button className="w-full" size="sm">Book Consultation</Button>
      </Link>
    )}
  </div>
  );
};

export default AstrologerCard;

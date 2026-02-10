import { Star, Clock, Globe, Calendar } from "lucide-react";
import { priests } from "@/data/priests";
import BookingForm from "@/components/BookingForm";
import pooja from "@/assets/pooja.jpeg";

const PoojaServices = () => {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="mx-auto mb-4 flex w-[45%] max-w-[260px] aspect-square items-center justify-center overflow-hidden rounded-lg bg-gold/10">
          <img className="h-full w-full object-cover" src={pooja} alt="Pooja Services" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
          Pooja <span className="text-primary">Services</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          After your consultation, if our astrologer recommends a specific pooja or remedy, we can arrange an experienced priest to perform it — at your home or a temple.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-16 max-w-3xl mx-auto">
        {[
          { title: "Personalized Remedies", desc: "Pooja is only recommended when our astrologer finds it necessary for your situation." },
          { title: "Experienced Priests", desc: "Our trusted priests follow proper Vedic rituals and traditions with sincerity." },
          { title: "Home or Temple", desc: "Choose to have the pooja performed at your home or at a temple, as per your convenience." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-6 shadow-sm text-center">
            <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Priest Profiles */}
      <div className="mb-16 max-w-4xl mx-auto">
        <h2 className="font-heading text-2xl font-bold text-center mb-8">
          Our Trusted <span className="text-primary">Priests</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {priests.map((priest) => (
            <div key={priest.name} className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
                <Star className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-center">{priest.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {priest.experience}
                </p>
                <p className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gold" />
                  {priest.specialization}
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  {priest.languages}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  {priest.availability}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl">
        <h2 className="font-heading text-2xl font-bold text-center mb-6">
          Request a Pooja
        </h2>
        <BookingForm serviceType="pooja" />
      </div>
    </div>
  );
};

export default PoojaServices;

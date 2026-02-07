import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PoojaServices = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Pooja request submitted!");
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <Star className="h-7 w-7 text-gold" />
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

      {/* Form */}
      <div className="mx-auto max-w-lg">
        <h2 className="font-heading text-2xl font-bold text-center mb-6">
          Request a Pooja
        </h2>

        {submitted ? (
          <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <CheckCircle className="mx-auto h-16 w-16 text-gold mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">Request Received!</h3>
            <p className="text-muted-foreground">
              We will review your request and get in touch shortly. Thank you for trusting AstroChandra.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-card p-8 shadow-sm space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" required placeholder="Your name" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input id="mobile" required placeholder="+91 98765 43210" type="tel" maxLength={15} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem / Reason *</Label>
              <Textarea id="problem" required placeholder="Describe your concern..." rows={3} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poojaType">Pooja Type (optional)</Label>
              <Input id="poojaType" placeholder="e.g. Navagraha Shanti, Rudra Abhishek" maxLength={200} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PoojaServices;

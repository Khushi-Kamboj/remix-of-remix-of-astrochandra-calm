import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { astrologers } from "@/data/astrologers";
import { toast } from "sonner";

const problemCategories = [
  "Career",
  "Marriage",
  "Finance",
  "Health",
  "Graha Dosha",
  "General Guidance",
];

const timeSlots = ["10:00 AM", "12:00 PM", "4:00 PM", "7:00 PM"];

const BookConsultation = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission (replace with Google Sheets integration)
    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSubmitted(true);
    toast.success("Booking submitted successfully!");
  };

  if (submitted) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-gold mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-3">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Our astrologer will contact you on your mobile number shortly. Thank you for trusting AstroChandra.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Book a <span className="text-primary">Consultation</span>
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and we'll connect you with the right astrologer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-card p-8 shadow-sm space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" required placeholder="Your name" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input id="mobile" required placeholder="+91 98765 43210" type="tel" maxLength={15} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Problem Category *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {problemCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input id="dob" required type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tob">Time of Birth</Label>
              <Input id="tob" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pob">Place of Birth *</Label>
              <Input id="pob" required placeholder="City" maxLength={100} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Astrologer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any astrologer" />
                </SelectTrigger>
                <SelectContent>
                  {astrologers.map((a) => (
                    <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Time Slot *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Problem Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe your concern..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookConsultation;

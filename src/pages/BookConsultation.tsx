import BookingForm from "@/components/BookingForm";

const BookConsultation = () => {
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
        <BookingForm serviceType="consultation" />
      </div>
    </div>
  );
};

export default BookConsultation;

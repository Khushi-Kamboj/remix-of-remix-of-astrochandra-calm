import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img src={logo} alt="AstroChandra" className="h-10 w-10 object-contain" />
            <span className="font-heading text-lg font-bold">
              Astro<span className="text-primary">Chandra</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trusted astrology guidance with real remedies. From consultation to pooja — we are here to help you.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/astrologers" className="hover:text-primary transition-colors">Astrologers</Link>
            <Link to="/book" className="hover:text-primary transition-colors">Book Consultation</Link>
            <Link to="/pooja" className="hover:text-primary transition-colors">Pooja Services</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Contact Us</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> contact@astrochandra.com
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AstroChandra. All rights reserved. Your trust is our foundation.
      </div>
    </div>
  </footer>
);

export default Footer;

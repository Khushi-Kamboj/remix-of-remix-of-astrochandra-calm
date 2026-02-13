import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.webp";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Astrologers", path: "/astrologers" },
  { label: "Book Consultation", path: "/book" },
  { label: "Pooja Services", path: "/pooja" },
  { label: "Training & Workshops", path: "/training" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const getDashboardPath = () => {
    switch (role) {
      case "admin": return "/admin";
      case "astrologer": return "/astrologer-dashboard";
      case "priest": return "/priest-dashboard";
      default: return "/dashboard";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="AstroChandra" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  isActive ? "text-red-600" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link to={getDashboardPath()}>
                <Button size="sm" variant="outline">
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/login">
                <Button size="sm" variant="outline">Login</Button>
              </Link>
              <Link to="/book">
                <Button size="sm">Book Now</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                  isActive ? "text-red-600" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setOpen(false)}>
                <Button className="mt-2 w-full" variant="outline">Dashboard</Button>
              </Link>
              <Button className="mt-2 w-full" variant="ghost" onClick={() => { handleSignOut(); setOpen(false); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button className="mt-2 w-full" variant="outline">Login</Button>
              </Link>
              <Link to="/book" onClick={() => setOpen(false)}>
                <Button className="mt-2 w-full">Book Now</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

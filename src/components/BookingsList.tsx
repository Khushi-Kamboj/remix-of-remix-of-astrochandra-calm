import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  service_type: "consultation" | "pooja";
  name: string;
  problem_category: string;
  preferred_slot: string;
  status: string;
  created_at: string;
  dob: string | null;
  family_profile_id: string | null;
}

interface FamilyProfile {
  id: string;
  full_name: string;
}

const BookingsList = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [familyProfiles, setFamilyProfiles] = useState<Map<string, FamilyProfile>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch family profiles first
    const fetchFamilyProfiles = async () => {
      const { data } = await supabase
        .from("family_profiles")
        .select("id, full_name")
        .eq("user_id", user.id);

      if (data) {
        const profileMap = new Map(data.map((p) => [p.id, p]));
        setFamilyProfiles(profileMap);
      }
    };

    // Fetch initial bookings
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookings(data as Booking[]);
      }
      setLoading(false);
    };

    fetchFamilyProfiles();
    fetchBookings();

    // Subscribe to real-time updates for bookings
    const channel = supabase
      .channel("bookings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) => (b.id === payload.new.id ? (payload.new as Booking) : b))
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (!user) return null;

  const getProfileName = (familyProfileId: string | null): string => {
    if (!familyProfileId) return "You";
    const profile = familyProfiles.get(familyProfileId);
    return profile?.full_name || "Family Member";
  };

  const getServiceTypeLabel = (type: string): string => {
    return type === "consultation" ? "Consultation" : "Pooja";
  };

  const getServiceTypeColor = (type: string): string => {
    return type === "consultation" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No bookings yet. Visit the consultation or pooja pages to create your first booking.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getServiceTypeColor(booking.service_type)}>
                        {getServiceTypeLabel(booking.service_type)}
                      </Badge>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        <Users className="h-4 w-4 inline mr-1" />
                        For: {getProfileName(booking.family_profile_id)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.problem_category}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        {booking.dob && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(booking.dob), "MMM d, yyyy")}
                          </span>
                        )}
                        {booking.preferred_slot && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.preferred_slot}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Booked on {format(new Date(booking.created_at), "PPp")}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsList;

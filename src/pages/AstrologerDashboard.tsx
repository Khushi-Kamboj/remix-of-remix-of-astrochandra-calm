import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  fetchBookings
} from "@/integrations/supabase/bookingHelpers";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

const AstrologerDashboard = () => {
  const { profile, user, role, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    specialization: "",
    experience_years: 0,
    consultation_fee: 0,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        specialization: profile.specialization || "",
        experience_years: profile.experience_years || 0,
        consultation_fee: Number(profile.consultation_fee) || 0,
      });
    }
  }, [profile]);

  const loadBookings = useCallback(async () => {
    if (!user || !role) return;
    setBookingsLoading(true);
    const data = await fetchBookings(user.id, role);
    setBookings((data || []) as Booking[]);
    setBookingsLoading(false);
  }, [user, role]);

  useEffect(() => {
    loadBookings();
    if (!user) return;
    const channel = supabase
      .channel("astrologer_bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        loadBookings();
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user, loadBookings]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        bio: form.bio,
        specialization: form.specialization,
        experience_years: form.experience_years,
        consultation_fee: form.consultation_fee,
      })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      await refreshProfile();
      setEditing(false);
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="container max-w-4xl py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#2B2B2B" }}>Astrologer Dashboard</h1>
        {profile?.is_verified && <Badge className="bg-green-600">Verified</Badge>}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={form.full_name} disabled={!editing} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={form.bio} disabled={!editing} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <Input value={form.specialization} disabled={!editing} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input type="number" value={form.experience_years} disabled={!editing} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Consultation Fee (â‚¹)</Label>
              <Input type="number" value={form.consultation_fee} disabled={!editing} onChange={(e) => setForm({ ...form, consultation_fee: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          {editing && <Button onClick={handleSave} className="w-full">Save Changes</Button>}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Consultation Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedBooking === null ? (
            bookingsLoading ? (
              <p className="text-muted-foreground text-sm">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No consultation bookings available.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-lg border p-4 cursor-pointer hover:border-primary transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.name || "-"}</p>
                        <p className="text-sm text-muted-foreground">service_type: {booking.service_type || "-"}</p>
                        <p className="text-sm text-muted-foreground">preferred_slot: {booking.preferred_slot || "-"}</p>
                      </div>
                      <Badge className={statusBadgeColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      booking_date: {booking.created_at ? format(new Date(booking.created_at), "MMM d, yyyy") : "-"}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              <Button onClick={() => setSelectedBooking(null)}>
                Back to bookings
              </Button>

              {selectedBooking.assigned_to === user?.id ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">User Information</h3>
                    <p className="text-sm"><span className="text-muted-foreground">Name:</span> {selectedBooking.name || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Email:</span> {selectedBooking.email || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {selectedBooking.phone || "-"}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Birth Details</h3>
                    <p className="text-sm"><span className="text-muted-foreground">DOB:</span> {selectedBooking.dob ? format(new Date(selectedBooking.dob), "PPP") : "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Birth time:</span> {selectedBooking.birth_time || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Birth state:</span> {selectedBooking.birth_state || "-"}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Consultation Details</h3>
                    <p className="text-sm"><span className="text-muted-foreground">Problem category:</span> {selectedBooking.problem_category || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Dependent category:</span> {selectedBooking.dependent_category || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Description:</span> {selectedBooking.description || "-"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Preferred slot:</span> {selectedBooking.preferred_slot || "-"}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">AI Summary</h3>
                    <p className="text-sm">{selectedBooking.ai_summary || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">You are not assigned to this consultation.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AstrologerDashboard;

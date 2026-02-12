import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  problem_category: string;
  preferred_slot: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
  dob: string | null;
}

const AstrologerDashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
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

  const fetchBookings = async () => {
    if (!user) return;
    setBookingsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("service_type", "consultation")
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
    setBookingsLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    if (!user) return;
    const channel = supabase
      .channel("astrologer_bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [user]);

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

  const handleBookingAction = async (bookingId: string, action: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: action })
      .eq("id", bookingId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Booking ${action}` });
      fetchBookings();
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
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
              <Label>Consultation Fee (₹)</Label>
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
          {bookingsLoading ? (
            <p className="text-muted-foreground text-sm">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No consultation bookings available.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell>{b.problem_category}</TableCell>
                      <TableCell className="text-sm">{b.preferred_slot}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeColor(b.status)}>{b.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(b.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {b.assigned_to === user?.id && b.status === "assigned" ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleBookingAction(b.id, "accepted")}>
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleBookingAction(b.id, "rejected")}>
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AstrologerDashboard;

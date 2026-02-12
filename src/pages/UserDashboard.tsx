import { useState, useEffect } from "react";
import FamilyProfiles from "@/components/FamilyProfiles";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    zodiac_sign: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        zodiac_sign: profile.zodiac_sign || "",
        birth_date: profile.birth_date || "",
        birth_time: profile.birth_time || "",
        birth_place: profile.birth_place || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      await refreshProfile();
      setEditing(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#2B2B2B" }}>My Dashboard</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
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
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zodiac Sign</Label>
              <Input value={form.zodiac_sign} disabled={!editing} onChange={(e) => setForm({ ...form, zodiac_sign: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Input type="date" value={form.birth_date} disabled={!editing} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Birth Time</Label>
              <Input value={form.birth_time} disabled={!editing} onChange={(e) => setForm({ ...form, birth_time: e.target.value })} placeholder="e.g. 10:30 AM" />
            </div>
            <div className="space-y-2">
              <Label>Birth Place</Label>
              <Input value={form.birth_place} disabled={!editing} onChange={(e) => setForm({ ...form, birth_place: e.target.value })} />
            </div>
          </div>
          {editing && (
            <Button onClick={handleSave} className="w-full">Save Changes</Button>
          )}
        </CardContent>
      </Card>

      <FamilyProfiles />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No bookings yet. This feature is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;

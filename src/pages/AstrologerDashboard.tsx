import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AstrologerDashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
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

  return (
    <div className="container max-w-2xl py-12">
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
        <CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No bookings yet. This feature is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AstrologerDashboard;

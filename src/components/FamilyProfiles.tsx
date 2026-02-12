import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, Plus, Pencil, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { indianStates } from "@/data/booking-constants";
import { useToast } from "@/hooks/use-toast";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const relations = ["Spouse", "Child", "Parent", "Sibling", "Other"];

interface FamilyProfile {
  id: string;
  user_id: string;
  full_name: string;
  relation: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileFormData {
  full_name: string;
  relation: string;
  dob: Date | undefined;
  birthHour: string;
  birthMinute: string;
  birthAmpm: string;
  birthState: string;
}

const emptyForm: ProfileFormData = {
  full_name: "",
  relation: "",
  dob: undefined,
  birthHour: "",
  birthMinute: "",
  birthAmpm: "",
  birthState: "",
};

const FamilyProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProfiles = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("family_profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (!error && data) setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const parseBirthTime = (birthTime: string | null) => {
    if (!birthTime) return { hour: "", minute: "", ampm: "" };
    const match = birthTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return { hour: "", minute: "", ampm: "" };
    return { hour: match[1], minute: match[2], ampm: match[3].toUpperCase() };
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: FamilyProfile) => {
    const bt = parseBirthTime(p.birth_time);
    setEditingId(p.id);
    setForm({
      full_name: p.full_name,
      relation: p.relation || "",
      dob: p.birth_date ? new Date(p.birth_date) : undefined,
      birthHour: bt.hour,
      birthMinute: bt.minute,
      birthAmpm: bt.ampm,
      birthState: p.birth_place || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.full_name.trim()) return;
    setSaving(true);

    const birthTime = form.birthHour && form.birthMinute && form.birthAmpm
      ? `${form.birthHour}:${form.birthMinute} ${form.birthAmpm}`
      : null;

    const payload = {
      user_id: user.id,
      full_name: form.full_name.trim(),
      relation: form.relation || null,
      birth_date: form.dob ? format(form.dob, "yyyy-MM-dd") : null,
      birth_time: birthTime,
      birth_place: form.birthState || null,
    };

    if (editingId) {
      const { error } = await supabase.from("family_profiles").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile updated" });
      }
    } else {
      const { error } = await supabase.from("family_profiles").insert(payload);
      if (error) {
        toast({ title: "Error adding profile", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile added" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchProfiles();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("family_profiles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile removed" });
      fetchProfiles();
    }
  };

  if (!user) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Profiles
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Family Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Name" />
              </div>
              <div className="space-y-2">
                <Label>Relation</Label>
                <Select value={form.relation} onValueChange={(v) => setForm({ ...form, relation: v })}>
                  <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                  <SelectContent>
                    {relations.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !form.dob && "text-muted-foreground")}>
                      {form.dob ? format(form.dob, "PPP") : "Pick date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.dob} onSelect={(d) => setForm({ ...form, dob: d })} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Time of Birth</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={form.birthHour} onValueChange={(v) => setForm({ ...form, birthHour: v })}>
                    <SelectTrigger><SelectValue placeholder="Hr" /></SelectTrigger>
                    <SelectContent>{hours.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.birthMinute} onValueChange={(v) => setForm({ ...form, birthMinute: v })}>
                    <SelectTrigger><SelectValue placeholder="Min" /></SelectTrigger>
                    <SelectContent>{minutes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.birthAmpm} onValueChange={(v) => setForm({ ...form, birthAmpm: v })}>
                    <SelectTrigger><SelectValue placeholder="AM/PM" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Birth Place (State)</Label>
                <Select value={form.birthState} onValueChange={(v) => setForm({ ...form, birthState: v })}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={saving || !form.full_name.trim()}>
                {saving ? "Saving..." : editingId ? "Update" : "Add Profile"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : profiles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No family profiles yet. Add profiles for your family members to book consultations on their behalf.</p>
        ) : (
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{p.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[p.relation, p.birth_date, p.birth_place].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyProfiles;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { indianStates } from "@/data/booking-constants";
import { useToast } from "@/hooks/use-toast";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const FirstLoginModal = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [dob, setDob] = useState<Date | undefined>();
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [birthAmpm, setBirthAmpm] = useState("");
  const [birthState, setBirthState] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Dismissal key to avoid immediately re-opening the modal after user clicks X
  const dismissalKey = user ? `complete_profile_dismissed_${user.id}` : "complete_profile_dismissed";

  // Profile considered incomplete when missing key fields
  const needsData = !!user && (
    !profile || !profile.full_name || !profile.birth_date || !profile.birth_time || !profile.birth_place
  );

  // Reopen logic: if user dismissed recently, wait for an hour before reopening
  useEffect(() => {
    if (!user) return;

    const dismissed = localStorage.getItem(dismissalKey);
    const dismissedAt = dismissed ? Number(dismissed) : 0;
    const oneHour = 1000 * 60 * 60;

    if (needsData) {
      // Open if not dismissed recently
      if (!dismissedAt || Date.now() - dismissedAt > oneHour) {
        setOpen(true);
      }
    } else {
      // Profile complete -> clear dismissal and close
      localStorage.removeItem(dismissalKey);
      setOpen(false);
    }
  }, [needsData, user, dismissalKey]);

  const handleSubmit = async () => {
    if (!dob || !birthHour || !birthMinute || !birthAmpm || !birthState || !user) return;

    setLoading(true);
    const birthTime = `${birthHour}:${birthMinute} ${birthAmpm}`;

    // Use upsert so we handle missing profile rows as well as updates
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        birth_date: format(dob, "yyyy-MM-dd"),
        birth_time: birthTime,
        birth_place: birthState,
      })
      .select();

    setLoading(false);
    if (error) {
      toast({ title: "Error saving details", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Details saved!", description: "Your birth details have been saved." });
      // Clear dismissal and refresh
      localStorage.removeItem(dismissalKey);
      await refreshProfile();
      setOpen(false);
    }
  };

  if (!needsData && !open) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription>
                Please provide your birth details for personalized astrological recommendations.
              </DialogDescription>
            </div>
            {/* Close button */}
            <button
              aria-label="Close"
              className="ml-4 rounded p-1 text-foreground hover:bg-muted"
              onClick={() => {
                setOpen(false);
                // record dismissal timestamp so modal can reappear later
                if (user) localStorage.setItem(dismissalKey, String(Date.now()));
              }}
            >
              {/* <X className="h-5 w-5" /> */}
            </button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {/* DOB */}
          <div className="flex flex-col gap-2">
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left", !dob && "text-muted-foreground")}>
                  {dob ? format(dob, "PPP") : "Pick date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={setDob}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Birth Time */}
          <div className="flex flex-col gap-2">
            <Label>Time of Birth *</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select onValueChange={setBirthHour} value={birthHour}>
                <SelectTrigger><SelectValue placeholder="Hr" /></SelectTrigger>
                <SelectContent>
                  {hours.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={setBirthMinute} value={birthMinute}>
                <SelectTrigger><SelectValue placeholder="Min" /></SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={setBirthAmpm} value={birthAmpm}>
                <SelectTrigger><SelectValue placeholder="AM/PM" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Birth State */}
          <div className="flex flex-col gap-2">
            <Label>Place of Birth (State) *</Label>
            <Select onValueChange={setBirthState} value={birthState}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !dob || !birthHour || !birthMinute || !birthAmpm || !birthState}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FirstLoginModal;

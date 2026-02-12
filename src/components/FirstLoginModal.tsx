import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
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

  // Show modal only if user is logged in and profile is missing birth data
  const needsData = user && profile && !profile.birth_date && !profile.birth_time && !profile.birth_place;

  const handleSubmit = async () => {
    if (!dob || !birthHour || !birthMinute || !birthAmpm || !birthState || !user) return;

    setLoading(true);
    const birthTime = `${birthHour}:${birthMinute} ${birthAmpm}`;
    const { error } = await supabase
      .from("profiles")
      .update({
        birth_date: format(dob, "yyyy-MM-dd"),
        birth_time: birthTime,
        birth_place: birthState,
      })
      .eq("id", user.id);

    setLoading(false);
    if (error) {
      toast({ title: "Error saving details", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Details saved!", description: "Your birth details have been saved." });
      await refreshProfile();
    }
  };

  if (!needsData) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your birth details for personalized astrological recommendations.
          </DialogDescription>
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

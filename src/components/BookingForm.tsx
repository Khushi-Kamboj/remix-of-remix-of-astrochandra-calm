import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  problemCategories,
  dependentCategories,
  indianStates,
  preferredTimeSlots,
  poojaTypes,
} from "@/data/booking-constants";

export type ServiceType = "consultation" | "pooja";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const bookingSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
    problemCategory: z.string().min(1, "Select a problem category"),
    dependentCategory: z.string().optional(),
    otherCategory: z.string().max(200).optional(),
    dob: z.date({ required_error: "Date of birth is required" }),
    birthHour: z.string().min(1, "Select hour"),
    birthMinute: z.string().min(1, "Select minute"),
    birthAmpm: z.string().min(1, "Select AM/PM"),
    birthState: z.string().min(1, "Select your birth state"),
    preferredSlot: z.string().min(1, "Select a time slot"),
    description: z.string().max(1000).optional(),
    poojaType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.problemCategory !== "Other" && !data.dependentCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a sub-category",
        path: ["dependentCategory"],
      });
    }
  });

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  serviceType: ServiceType;
}

const BookingForm = ({ serviceType }: BookingFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const [familyProfiles, setFamilyProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("self");

  // Fetch family profiles for the logged-in user
  useEffect(() => {
    if (!user) return;
    supabase
      .from("family_profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setFamilyProfiles(data);
      });
  }, [user]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      problemCategory: "",
      dependentCategory: "",
      otherCategory: "",
      birthHour: "",
      birthMinute: "",
      birthAmpm: "",
      birthState: "",
      preferredSlot: "",
      description: "",
      poojaType: "",
    },
  });

  // Auto-fill from selected profile
  useEffect(() => {
    if (selectedProfileId === "self" && profile) {
      form.setValue("name", profile.full_name || "");
      if (profile.birth_date) {
        form.setValue("dob", new Date(profile.birth_date));
      }
      if (profile.birth_time) {
        const match = profile.birth_time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
          form.setValue("birthHour", match[1]);
          form.setValue("birthMinute", match[2]);
          form.setValue("birthAmpm", match[3].toUpperCase());
        }
      }
      if (profile.birth_place) form.setValue("birthState", profile.birth_place);
    } else {
      const fp = familyProfiles.find((p) => p.id === selectedProfileId);
      if (fp) {
        form.setValue("name", fp.full_name || "");
        if (fp.birth_date) form.setValue("dob", new Date(fp.birth_date));
        if (fp.birth_time) {
          const match = fp.birth_time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (match) {
            form.setValue("birthHour", match[1]);
            form.setValue("birthMinute", match[2]);
            form.setValue("birthAmpm", match[3].toUpperCase());
          }
        }
        if (fp.birth_place) form.setValue("birthState", fp.birth_place);
      }
    }
    if (user) {
      form.setValue("email", user.email || "");
    }
  }, [selectedProfileId, profile, familyProfiles, user]);

  const watchedCategory = form.watch("problemCategory");
  const isOther = watchedCategory === "Other";
  const dependentOptions = dependentCategories[watchedCategory] || [];

  const handleCategoryChange = (value: string) => {
    form.setValue("problemCategory", value);
    form.setValue("dependentCategory", "");
    form.setValue("otherCategory", "");
  };

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);

    const birthTime = `${data.birthHour}:${data.birthMinute} ${data.birthAmpm}`;

    try {
      const { error: dbError } = await supabase.from("bookings").insert({
        user_id: user?.id ?? null,
        family_profile_id: user && selectedProfileId !== "self" ? selectedProfileId : null,
        service_type: serviceType,
        status: "pending",
        name: data.name,
        email: data.email,
        phone: data.phone,
        problem_category: data.problemCategory,
        dependent_category: isOther ? (data.otherCategory || null) : (data.dependentCategory || null),
        other_category: isOther ? (data.otherCategory || null) : null,
        dob: format(data.dob, "yyyy-MM-dd"),
        birth_time: birthTime,
        birth_state: data.birthState,
        preferred_slot: data.preferredSlot,
        description: data.description || null,
        pooja_type: data.poojaType || null,
      });

      if (dbError) {
        throw dbError;
      }

      setSubmitted(true);
      form.reset();
      toast.success("Your booking request has been received.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Supabase insert error:", message, error);
      toast.error(`Something went wrong: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center shadow-sm">
        <CheckCircle className="mx-auto h-16 w-16 text-gold mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-3">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Your booking request has been received. Our team will contact you shortly. Thank you for trusting AstroChandra.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
          Book Another
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-5"
      >
        {/* Profile Selector - only shown for logged-in users with family profiles */}
        {user && familyProfiles.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Booking For</FormLabel>
            <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
              <SelectTrigger>
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Myself ({profile?.full_name || user.email})</SelectItem>
                {familyProfiles.map((fp) => (
                  <SelectItem key={fp.id} value={fp.id}>
                    {fp.full_name} {fp.relation ? `(${fp.relation})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Name & Phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" maxLength={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" maxLength={255} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10-digit number"
                    maxLength={10}
                    inputMode="numeric"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Problem Category & Dependent / Other */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="problemCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Category *</FormLabel>
                <Select onValueChange={handleCategoryChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {problemCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isOther ? (
            <FormField
              control={form.control}
              name="otherCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe your concern" maxLength={200} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="dependentCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={dependentOptions.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={dependentOptions.length === 0 ? "Select category first" : "Select sub-category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dependentOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* DOB & Time of Birth (Hour / Minute / AM-PM) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col">
            <FormLabel className="mb-2">Time of Birth *</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="birthHour"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Hr" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthMinute"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {minutes.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthAmpm"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Birth State & Preferred Slot */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="birthState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth (State) *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time Slot *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {preferredTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pooja Type (only for pooja service) */}
        {serviceType === "pooja" && (
          <FormField
            control={form.control}
            name="poojaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pooja Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pooja type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {poojaTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe your concern..."
                  rows={4}
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Submitting..." : "Submit Booking"}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;

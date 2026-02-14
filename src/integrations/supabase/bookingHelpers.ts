import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected" | "assigned" | "accepted";

/**
 * Check if the given user is the astrologer assigned to this consultation booking.
 * Uses assigned_to as the astrologer id for consultations.
 */
export function isAssignedAstrologer(
  booking: Pick<Booking, "assigned_to" | "service_type">,
  userId: string
): boolean {
  return booking.service_type === "consultation" && booking.assigned_to === userId;
}

/** User-like shape for visibility checks (id + role) */
export type ViewingUser = { id: string; role: string | null };

/**
 * Test/debug: can this user view full consultation details (user details, problem description, AI summary)?
 * Admin always can; otherwise only the assigned astrologer (assigned_to === user.id) for consultations.
 * DB uses assigned_to as astrologer_id for consultations.
 */
export function canViewConsultationDetails(
  booking: Pick<Booking, "assigned_to" | "service_type">,
  user: ViewingUser
): boolean {
  if (booking.service_type !== "consultation") return false;
  return user.role === "admin" || booking.assigned_to === user.id;
}

/**
 * Generate a short AI summary from problem text using Gemini.
 * Returns null if no API key or on error. Set VITE_GEMINI_API_KEY in .env for production.
 * Logs for test/debug: "AI SUMMARY GENERATED" on success, safe error logs on failure.
 */
export async function generateGeminiSummary(problemText: string): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!apiKey || !problemText?.trim()) {
    if (import.meta.env.DEV) console.log("[Gemini] Skipped: no API key or empty problem text");
    return null;
  }

  try {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    const requestBody = {
      contents: [{
        parts: [{
          text: `Summarize this consultation request in 2-4 short sentences for an astrologer. Keep it professional and focused on key concerns.\n\nRequest:\n${problemText.trim()}`
        }]
      }],
      generationConfig: { maxOutputTokens: 256, temperature: 0.3 }
    };

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn("[Gemini] API error", { model, status: res.status, body: errText });
        // Model id may be unavailable for the account/project; try next candidate.
        if (res.status === 404) continue;
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const summary = typeof text === "string" ? text.trim() : null;
      if (summary) {
        console.log("AI SUMMARY GENERATED", { model, length: summary.length });
        return summary;
      }
    }

    console.warn("[Gemini] No summary text returned from available models");
    return null;
  } catch (err) {
    console.warn("[Gemini] generateGeminiSummary error:", err);
    return null;
  }
}

/**
 * Confirm a consultation booking: set status to "confirmed" and assign the astrologer.
 * Generates and stores AI summary from problem description. Only the assigned astrologer (and admin) can see details afterward.
 * Test/debug: logs booking.id, status, astrologer_id (assigned_to), loggedInUser.id, ai_summary; "AI SUMMARY GENERATED" when summary is saved.
 * Returns summaryGenerated so UI can show a message if confirmation succeeded but Gemini failed.
 */
export async function confirmBooking(
  bookingId: string,
  astrologerId: string
): Promise<{ success: boolean; data?: Booking; error?: string; summaryGenerated?: boolean }> {
  try {
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("service_type", "consultation")
      .single<Booking>();

    if (fetchErr || !booking) {
      return { success: false, error: "Booking not found or not a consultation" };
    }
    if (booking.assigned_to != null) {
      return { success: false, error: "This consultation is already confirmed by another astrologer" };
    }

    // Debug: before confirm
    console.log("[Consultation confirm] before", {
      "booking.id": booking.id,
      "booking.status": booking.status,
      "booking.astrologer_id": booking.assigned_to,
      "loggedInUser.id": astrologerId,
      "booking.ai_summary": booking.ai_summary ?? null
    });

    const problemText = booking.description ?? booking.problem_category ?? "";
    console.log("[Consultation confirm] Problem text source: ", { description: booking.description, problem_category: booking.problem_category, problemText: problemText });
    console.log("[Consultation confirm] Generating AI summary...");
    let aiSummary: string | null = null;
    try {
      aiSummary = await generateGeminiSummary(problemText);
      if (aiSummary) console.log("[Consultation confirm] AI SUMMARY GENERATED, saving to booking");
    } catch (geminiErr) {
      console.warn("[Consultation confirm] Gemini error (continuing without summary):", geminiErr);
    }

    const { data: updated, error: updateErr } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        assigned_to: astrologerId,
        ...(aiSummary != null ? { ai_summary: aiSummary } : {})
      })
      .eq("id", bookingId)
      .select()
      .single<Booking>();

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Debug: after confirm
    console.log("[Consultation confirm] after", {
      "booking.id": updated.id,
      "booking.status": updated.status,
      "booking.astrologer_id": updated.assigned_to,
      "loggedInUser.id": astrologerId,
      "booking.ai_summary": updated.ai_summary ?? null
    });

    return { success: true, data: updated, summaryGenerated: aiSummary != null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to confirm booking";
    return { success: false, error: msg };
  }
}

/**
 * Fetch bookings based on user's role
 * - admin: all bookings
 * - astrologer: consultation bookings (assigned to them or unassigned/pending)
 * - priest: pooja bookings (assigned to them or unassigned/pending)
 * - user: their own bookings
 */
export const fetchBookings = async (userId: string, userRole: string | null) => {
  try {
    if (!userRole) {
      console.warn("fetchBookings: no user role");
      return [];
    }

    const baseQuery = supabase.from("bookings").select("*");
    let query;

    switch (userRole) {
      case "admin":
        // Admin sees all bookings
        query = baseQuery;
        break;
      case "astrologer":
        // Astrologer sees consultation bookings: assigned to them OR unassigned (pending)
        query = baseQuery
          .eq("service_type", "consultation")
          .or(`assigned_to.eq.${userId},assigned_to.is.null`);
        break;
      case "priest":
        // Priest sees pooja bookings: assigned to them OR unassigned (pending)
        query = baseQuery
          .eq("service_type", "pooja")
          .or(`assigned_to.eq.${userId},assigned_to.is.null`);
        break;
      case "user":
        // User sees their own bookings
        query = baseQuery.eq("user_id", userId);
        break;
      default:
        return [];
    }

    const { data, error } = await query;
    if (error) {
      console.error("fetchBookings error:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("fetchBookings exception:", err);
    return [];
  }
};

/**
 * Update booking status. Only astrologer/priest/admin can update.
 * If astrologer/priest confirms or changes status on an unassigned booking, auto-assign to self.
 */
export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus,
  userRole: string | null,
  userId?: string
): Promise<{ success: boolean; data?: Booking; error?: string }> => {
  try {
    if (!userRole || !["astrologer", "priest", "admin"].includes(userRole)) {
      return { success: false, error: "Only astrologer, priest, or admin can update booking status" };
    }

    // Get current booking to check if it's unassigned
    const { data: bookingData, error: fetchError } = await supabase
      .from("bookings")
      .select("assigned_to")
      .eq("id", bookingId)
      .single();

    if (fetchError) {
      console.error("fetchBooking error:", fetchError);
      return { success: false, error: "Failed to fetch booking details" };
    }

    // Prepare update object
    const updateObj: Record<string, unknown> = { status: newStatus };

    // If astrologer/priest is updating an unassigned booking, assign to them
    if ((userRole === "astrologer" || userRole === "priest") && bookingData?.assigned_to === null && userId) {
      updateObj.assigned_to = userId;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updateObj)
      .eq("id", bookingId)
      .select()
      .single<Booking>();

    if (error) {
      console.error("updateBookingStatus error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update booking status";
    console.error("updateBookingStatus exception:", err);
    return { success: false, error: errorMsg };
  }
};

/**
 * Check if the current user can update a booking's status
 */
export const canUpdateBookingStatus = (
  userRole: string | null,
  userId: string,
  booking: Booking
): boolean => {
  if (!userRole) return false;

  // Admin can update any booking
  if (userRole === "admin") return true;

  // Astrologer can update consultation bookings (assigned to them OR unassigned)
  if (
    userRole === "astrologer" &&
    booking.service_type === "consultation" &&
    (booking.assigned_to === userId || booking.assigned_to === null)
  ) {
    return true;
  }

  // Priest can update pooja bookings (assigned to them OR unassigned)
  if (
    userRole === "priest" &&
    booking.service_type === "pooja" &&
    (booking.assigned_to === userId || booking.assigned_to === null)
  ) {
    return true;
  }

  return false;
};

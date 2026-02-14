import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

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

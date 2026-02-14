import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateBookingStatus, canUpdateBookingStatus } from "@/integrations/supabase/bookingHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "./StatusBadge";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

interface BookingStatusManagerProps {
  booking: Booking;
  onStatusChange?: (updatedBooking: Booking) => void;
}

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

/**
 * BookingStatusManager: dropdown for astrologer/priest/admin to update booking status
 * Provides optimistic UI updates for immediate feedback while request completes
 */
const BookingStatusManager = ({ booking, onStatusChange }: BookingStatusManagerProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<BookingStatus | null>(null);

  // Check if current user can update this booking's status
  const canUpdate = user && role && canUpdateBookingStatus(role, user.id, booking);
  const displayStatus = optimisticStatus || booking.status;

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!canUpdate) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update this booking status.",
        variant: "destructive",
      });
      return;
    }

    if (newStatus === booking.status) {
      return; // No change
    }

    // Optimistic update: show new status immediately
    setOptimisticStatus(newStatus);
    setIsUpdating(true);

    const { success, data, error } = await updateBookingStatus(booking.id, newStatus, role, user?.id);
    setIsUpdating(false);

    if (success && data) {
      // Server update succeeded, update with actual data
      setOptimisticStatus(null);
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      });
      onStatusChange?.(data);
    } else {
      // Server update failed, revert optimistic change
      setOptimisticStatus(null);
      toast({
        title: "Error",
        description: error || "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  // For users, show read-only badge
  if (!canUpdate) {
    return <StatusBadge status={booking.status} />;
  }

  // For astrologer/priest/admin, show dropdown with optimistic updates
  return (
    <div className="flex items-center gap-2">
      <Select
        value={displayStatus}
        onValueChange={(value) => handleStatusChange(value as BookingStatus)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isUpdating && (
        <span className="text-xs text-muted-foreground animate-pulse">
          {optimisticStatus ? "Updating..." : "Saving..."}
        </span>
      )}
    </div>
  );
};

export default BookingStatusManager;


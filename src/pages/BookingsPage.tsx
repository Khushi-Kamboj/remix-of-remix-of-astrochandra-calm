import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchBookings } from "@/integrations/supabase/bookingHelpers";
import BookingStatusManager from "@/components/BookingStatusManager";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

/**
 * BookingsPage: displays bookings relevant to the logged-in user's role
 * - Admin: sees all bookings
 * - Astrologer: sees consultation bookings assigned to them
 * - Priest: sees pooja bookings assigned to them
 * - User: sees their own bookings (read-only status)
 */
const BookingsPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user || !role) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      const data = await fetchBookings(user.id, role);
      if (data && data.length > 0) {
        setBookings(data);
      } else if (!Array.isArray(data)) {
        setError("Failed to load bookings");
      }
      setIsLoading(false);
    })();
  }, [user, role, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>You must be logged in to view bookings.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookings</h1>
        <p className="text-muted-foreground">
          {role === "admin" && "Viewing all bookings"}
          {role === "astrologer" && "Viewing consultation bookings assigned to you"}
          {role === "priest" && "Viewing pooja bookings assigned to you"}
          {role === "user" && "Viewing your bookings"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p>Loading bookings...</p>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <Alert>
          <AlertDescription>No bookings found.</AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Preferred Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                  <TableCell className="capitalize">{booking.service_type}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell className="text-sm">{booking.email}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{booking.preferred_slot}</TableCell>
                  <TableCell>
                    <BookingStatusManager
                      booking={booking}
                      onStatusChange={(updated) => {
                        setBookings((prev) =>
                          prev.map((b) => (b.id === updated.id ? updated : b))
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Status legend */}
      <div className="mt-8 p-4 rounded-lg bg-muted">
        <h2 className="font-semibold mb-3">Status Reference</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge status="pending" />
            <span className="text-sm">New booking waiting for acceptance</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="confirmed" />
            <span className="text-sm">Booking accepted and scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="completed" />
            <span className="text-sm">Service delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="cancelled" />
            <span className="text-sm">User cancelled the booking</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="rejected" />
            <span className="text-sm">Professional rejected the booking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

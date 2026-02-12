
-- Add assigned_to column to bookings for assignment workflow
ALTER TABLE public.bookings
ADD COLUMN assigned_to UUID DEFAULT NULL;

-- Drop existing restrictive RLS policies that need updating
DROP POLICY IF EXISTS "Astrologers can view consultation bookings" ON public.bookings;
DROP POLICY IF EXISTS "Priests can view pooja bookings" ON public.bookings;

-- Astrologers can view consultations assigned to them OR unassigned (pending)
CREATE POLICY "Astrologers can view consultation bookings"
ON public.bookings
FOR SELECT
USING (
  (service_type = 'consultation')
  AND (get_user_role(auth.uid()) = 'astrologer')
  AND (assigned_to = auth.uid() OR assigned_to IS NULL)
);

-- Priests can view pooja bookings assigned to them OR unassigned (pending)
CREATE POLICY "Priests can view pooja bookings"
ON public.bookings
FOR SELECT
USING (
  (service_type = 'pooja')
  AND (get_user_role(auth.uid()) = 'priest')
  AND (assigned_to = auth.uid() OR assigned_to IS NULL)
);

-- Astrologers can update bookings assigned to them (accept/reject)
CREATE POLICY "Astrologers can update assigned bookings"
ON public.bookings
FOR UPDATE
USING (
  (service_type = 'consultation')
  AND (get_user_role(auth.uid()) = 'astrologer')
  AND (assigned_to = auth.uid())
);

-- Priests can update bookings assigned to them (accept/reject)
CREATE POLICY "Priests can update assigned bookings"
ON public.bookings
FOR UPDATE
USING (
  (service_type = 'pooja')
  AND (get_user_role(auth.uid()) = 'priest')
  AND (assigned_to = auth.uid())
);

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

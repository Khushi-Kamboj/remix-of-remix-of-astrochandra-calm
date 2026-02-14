-- Fix RLS policies to allow astrologers/priests to update bookings with proper permissions

-- Drop the restrictive UPDATE policies
DROP POLICY IF EXISTS "Astrologers can update assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Priests can update assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update any booking (bookings)" ON public.bookings;

-- Allow astrologers to update consultation bookings (assigned to them or unassigned)
-- They can set status and assigned_to (for accepting bookings)
CREATE POLICY "Astrologers can update consultation bookings"
ON public.bookings
FOR UPDATE
USING (
  (service_type = 'consultation')
  AND (get_user_role(auth.uid()) = 'astrologer')
  AND (assigned_to = auth.uid() OR assigned_to IS NULL)
)
WITH CHECK (
  (service_type = 'consultation')
  AND (get_user_role(auth.uid()) = 'astrologer')
);

-- Allow priests to update pooja bookings (assigned to them or unassigned)
-- They can set status and assigned_to (for accepting bookings)
CREATE POLICY "Priests can update pooja bookings"
ON public.bookings
FOR UPDATE
USING (
  (service_type = 'pooja')
  AND (get_user_role(auth.uid()) = 'priest')
  AND (assigned_to = auth.uid() OR assigned_to IS NULL)
)
WITH CHECK (
  (service_type = 'pooja')
  AND (get_user_role(auth.uid()) = 'priest')
);

-- Allow admins to update any booking
CREATE POLICY "Admins can update any booking (bookings)" ON public.bookings
FOR UPDATE
USING (is_admin(auth.uid()));



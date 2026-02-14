-- Migration: extend booking status to include 'rejected'
-- Add 'rejected' status to bookings for astrologer/priest to reject bookings

-- First, update the CHECK constraint to include 'rejected'
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected'));

-- Optionally: create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

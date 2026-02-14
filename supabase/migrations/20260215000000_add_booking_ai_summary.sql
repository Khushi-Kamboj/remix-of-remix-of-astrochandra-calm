-- Add ai_summary column for Gemini-generated summary (visible to assigned astrologer and admin)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS ai_summary text;

COMMENT ON COLUMN public.bookings.ai_summary IS 'AI-generated summary from problem description; visible to assigned astrologer and admin only';

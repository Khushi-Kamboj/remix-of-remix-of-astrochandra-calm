
-- Fix: Re-create the handle_new_user trigger (it was missing)
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create family_profiles table for multi-profile support
CREATE TABLE public.family_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  relation TEXT, -- e.g. 'Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Other'
  birth_date DATE,
  birth_time TEXT,
  birth_place TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;

-- Users can CRUD their own family profiles
CREATE POLICY "Users can view own family profiles"
  ON public.family_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own family profiles"
  ON public.family_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family profiles"
  ON public.family_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own family profiles"
  ON public.family_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Admin can see all family profiles
CREATE POLICY "Admin can view all family profiles"
  ON public.family_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Add profile_id to bookings (nullable, for backward compatibility)
ALTER TABLE public.bookings
  ADD COLUMN family_profile_id UUID REFERENCES public.family_profiles(id);

-- Trigger for updated_at on family_profiles
CREATE TRIGGER update_family_profiles_updated_at
  BEFORE UPDATE ON public.family_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Also insert missing profiles/roles for existing auth users who don't have them
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'avatar_url', '')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id);

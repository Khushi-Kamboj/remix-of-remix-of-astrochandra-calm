
-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('consultation', 'pooja')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  problem_category TEXT NOT NULL,
  dependent_category TEXT,
  other_category TEXT,
  dob DATE,
  birth_time TEXT,
  birth_state TEXT,
  preferred_slot TEXT NOT NULL,
  description TEXT,
  pooja_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update any booking" ON public.bookings FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Astrologers can view consultation bookings" ON public.bookings FOR SELECT USING (service_type = 'consultation' AND public.get_user_role(auth.uid()) = 'astrologer');
CREATE POLICY "Priests can view pooja bookings" ON public.bookings FOR SELECT USING (service_type = 'pooja' AND public.get_user_role(auth.uid()) = 'priest');

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Security Enhancement: Remove redundant PII from profiles table
-- The email column duplicates auth.users.email, increasing attack surface
-- RLS policies are correct but we should minimize PII storage

-- Add security documentation
COMMENT ON TABLE public.profiles IS 'User profile data. Protected by RLS - users can only access their own profile. Email is stored in auth.users, not here, to minimize PII exposure.';

-- Add performance index for RLS policy checks
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Update handle_new_user function to NOT insert email (it's already in auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$;

-- Remove the redundant email column from profiles
-- This reduces PII exposure - email is already in auth.users
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Add security comment on RLS policies
COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS 'Ensures users can only view their own profile data. Uses auth.uid() for secure user identification.';
COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS 'Ensures users can only modify their own profile. Prevents unauthorized data tampering.';
COMMENT ON POLICY "Users can insert their own profile" ON public.profiles IS 'Ensures users can only create their own profile during signup. Part of the authentication flow.';
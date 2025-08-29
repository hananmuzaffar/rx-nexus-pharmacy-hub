-- Update profiles table to match userStore structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create a trigger to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, email, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'Pharmacy Technician'),
    new.email,
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for profiles to allow inserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_permissions table for role-based permissions
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module, action)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own permissions"
  ON public.user_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions"
  ON public.user_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrator'
    )
  );

-- Function to check user permissions
CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, module_name TEXT, action_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  has_perm BOOLEAN;
BEGIN
  -- Get user role
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Administrators have all permissions
  IF user_role = 'Administrator' THEN
    RETURN TRUE;
  END IF;
  
  -- Check custom permissions first
  SELECT allowed INTO has_perm
  FROM public.user_permissions
  WHERE user_permissions.user_id = has_permission.user_id
    AND user_permissions.module = module_name
    AND user_permissions.action = action_name;
  
  IF FOUND THEN
    RETURN has_perm;
  END IF;
  
  -- Default role-based permissions for Pharmacist
  IF user_role = 'Pharmacist' THEN
    CASE module_name
      WHEN 'inventory' THEN
        RETURN action_name IN ('view', 'add', 'edit');
      WHEN 'sales' THEN
        RETURN action_name IN ('view', 'add', 'edit');
      WHEN 'customers' THEN
        RETURN action_name IN ('view', 'add', 'edit');
      WHEN 'prescriptions' THEN
        RETURN action_name IN ('view', 'add', 'edit');
      WHEN 'returns' THEN
        RETURN action_name IN ('view', 'add', 'edit');
      ELSE
        RETURN FALSE;
    END CASE;
  END IF;
  
  -- Default deny
  RETURN FALSE;
END;
$$;
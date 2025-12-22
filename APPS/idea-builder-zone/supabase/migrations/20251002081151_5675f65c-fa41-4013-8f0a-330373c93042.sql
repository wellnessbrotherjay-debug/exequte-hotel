-- Add custom_boat_class field to races table
ALTER TABLE public.races 
ADD COLUMN custom_boat_class TEXT;
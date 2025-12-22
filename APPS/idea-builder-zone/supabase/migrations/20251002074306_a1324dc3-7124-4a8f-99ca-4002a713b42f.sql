-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Boat Classes table
CREATE TABLE public.boat_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_crew_size INTEGER,
  hull_length_meters DECIMAL,
  sail_area_sqm DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sail Makers table
CREATE TABLE public.sail_makers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maker_name TEXT NOT NULL UNIQUE,
  website_url TEXT,
  contact_email TEXT,
  specialty TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sails Inventory table
CREATE TABLE public.sails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  boat_class_id UUID REFERENCES public.boat_classes(id) ON DELETE CASCADE,
  sail_maker_id UUID REFERENCES public.sail_makers(id) ON DELETE SET NULL,
  sail_type TEXT NOT NULL, -- e.g., "Main", "Jib", "Spinnaker", "Genoa"
  sail_name TEXT, -- Custom name/identifier
  purchase_date DATE,
  material TEXT,
  size_sqm DECIMAL,
  condition TEXT, -- e.g., "Excellent", "Good", "Fair", "Poor"
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Races table
CREATE TABLE public.races (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  boat_class_id UUID REFERENCES public.boat_classes(id) ON DELETE SET NULL,
  race_name TEXT NOT NULL,
  race_date DATE NOT NULL,
  location TEXT,
  duration_minutes INTEGER,
  distance_nm DECIMAL, -- nautical miles
  avg_speed_knots DECIMAL,
  max_speed_knots DECIMAL,
  wind_speed_knots DECIMAL,
  wind_direction TEXT,
  conditions TEXT,
  placement INTEGER, -- finishing position
  total_boats INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Race GPS Tracks table (for route tracking)
CREATE TABLE public.race_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed_knots DECIMAL,
  heading_degrees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Race Performance / Sail Setup table
CREATE TABLE public.race_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  sail_id UUID REFERENCES public.sails(id) ON DELETE SET NULL,
  what_worked TEXT,
  what_didnt_work TEXT,
  improvements TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.boat_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sail_makers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boat_classes (public readable, admin writable)
CREATE POLICY "Boat classes are viewable by everyone"
ON public.boat_classes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert boat classes"
ON public.boat_classes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for sail_makers (public readable, admin writable)
CREATE POLICY "Sail makers are viewable by everyone"
ON public.sail_makers FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert sail makers"
ON public.sail_makers FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for sails (user-specific)
CREATE POLICY "Users can view their own sails"
ON public.sails FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sails"
ON public.sails FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sails"
ON public.sails FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sails"
ON public.sails FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for races (user-specific)
CREATE POLICY "Users can view their own races"
ON public.races FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own races"
ON public.races FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own races"
ON public.races FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own races"
ON public.races FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for race_tracks (user-specific via race)
CREATE POLICY "Users can view their own race tracks"
ON public.race_tracks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_tracks.race_id
  AND races.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own race tracks"
ON public.race_tracks FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_tracks.race_id
  AND races.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own race tracks"
ON public.race_tracks FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_tracks.race_id
  AND races.user_id = auth.uid()
));

-- RLS Policies for race_performance (user-specific via race)
CREATE POLICY "Users can view their own race performance"
ON public.race_performance FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_performance.race_id
  AND races.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own race performance"
ON public.race_performance FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_performance.race_id
  AND races.user_id = auth.uid()
));

CREATE POLICY "Users can update their own race performance"
ON public.race_performance FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_performance.race_id
  AND races.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own race performance"
ON public.race_performance FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.races
  WHERE races.id = race_performance.race_id
  AND races.user_id = auth.uid()
));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_boat_classes_updated_at
  BEFORE UPDATE ON public.boat_classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sail_makers_updated_at
  BEFORE UPDATE ON public.sail_makers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sails_updated_at
  BEFORE UPDATE ON public.sails
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_races_updated_at
  BEFORE UPDATE ON public.races
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_race_performance_updated_at
  BEFORE UPDATE ON public.race_performance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some common boat classes
INSERT INTO public.boat_classes (class_name, description, typical_crew_size, hull_length_meters, sail_area_sqm) VALUES
('Laser', 'Single-handed dinghy, Olympic class', 1, 4.2, 7.06),
('470', 'Two-person dinghy, Olympic class', 2, 4.7, 12.7),
('49er', 'High-performance skiff, Olympic class', 2, 4.99, 59.2),
('J/70', 'Sportboat keelboat', 3, 6.93, 39.0),
('Melges 24', 'Performance racing keelboat', 5, 7.3, 53.7),
('Etchells', 'One-design keelboat', 3, 9.3, 29.3);

-- Insert some common sail makers
INSERT INTO public.sail_makers (maker_name, website_url, specialty) VALUES
('North Sails', 'https://www.northsails.com', 'Full range of racing and cruising sails'),
('Quantum Sails', 'https://www.quantumsails.com', 'Performance racing sails'),
('UK Sailmakers', 'https://uksailmakers.com', 'Custom racing and cruising sails'),
('Doyle Sails', 'https://www.doylesails.com', 'High-performance racing sails'),
('Elvstrøm Sails', 'https://elvstromsails.com', 'Olympic and performance racing'),
('Hyde Sails', 'https://hydesails.com', 'One-design racing specialists');
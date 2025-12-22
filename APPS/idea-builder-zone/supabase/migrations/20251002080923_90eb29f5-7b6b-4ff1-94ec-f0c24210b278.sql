-- Insert top 50 sailing boat classes worldwide
INSERT INTO public.boat_classes (class_name, description, typical_crew_size, hull_length_meters, sail_area_sqm) VALUES
('Laser', 'Olympic single-handed dinghy', 1, 4.2, 7.06),
('Laser Radial', 'Smaller rig variant of Laser', 1, 4.2, 5.76),
('470', 'Olympic two-person dinghy', 2, 4.7, 12.7),
('49er', 'Olympic high-performance skiff', 2, 4.99, 59.2),
('49erFX', 'Women''s Olympic skiff', 2, 4.99, 52.0),
('Nacra 17', 'Olympic mixed catamaran', 2, 5.25, 21.0),
('RS Feva', 'Youth development dinghy', 2, 3.64, 9.25),
('Optimist', 'Beginner youth dinghy', 1, 2.3, 3.3),
('420', 'Youth/junior racing dinghy', 2, 4.2, 10.25),
('29er', 'Youth high-performance skiff', 2, 4.45, 24.0),
('Finn', 'Single-handed heavyweight dinghy', 1, 4.5, 10.0),
('RS Aero', 'Modern single-handed dinghy', 1, 4.0, 10.2),
('J/70', 'One-design keelboat', 3, 6.93, 38.7),
('J/24', 'Popular keelboat', 5, 7.32, 24.2),
('Melges 24', 'Fast sportboat', 3, 7.32, 37.0),
('Etchells', 'Olympic keelboat class', 3, 9.27, 28.5),
('Star', 'Olympic keelboat', 2, 6.92, 26.5),
('Soling', 'Three-person keelboat', 3, 8.15, 21.7),
('Flying Dutchman', 'Two-person high-performance', 2, 6.05, 18.6),
('505', 'High-performance dinghy', 2, 5.05, 15.3),
('International 14', 'Development class dinghy', 2, 4.27, 14.0),
('Fireball', 'Two-person racing dinghy', 2, 4.93, 12.0),
('GP14', 'General purpose dinghy', 2, 4.27, 10.4),
('Enterprise', 'Popular training dinghy', 2, 4.04, 10.22),
('Mirror', 'Youth training dinghy', 2, 3.3, 6.4),
('Topper', 'Single-handed beginner', 1, 3.41, 5.3),
('RS Tera', 'Youth training dinghy', 1, 2.87, 5.35),
('Byte', 'Youth single-handed', 1, 3.5, 5.5),
('Cadet', 'Junior two-person', 2, 3.22, 5.62),
('Hobie 16', 'Popular beach catamaran', 2, 5.03, 21.0),
('Tornado', 'Olympic catamaran', 2, 6.1, 21.8),
('A-Class', 'Single-handed catamaran', 1, 5.49, 13.94),
('F18', 'Formula 18 catamaran', 2, 5.52, 21.0),
('Dart 18', 'Popular catamaran', 2, 5.5, 17.8),
('Wayfarer', 'Cruising/racing dinghy', 2, 4.82, 14.0),
('National 12', 'Development class', 2, 3.66, 10.2),
('Merlin Rocket', 'Development class', 2, 4.27, 10.8),
('RS100', 'Single-handed skiff', 1, 3.5, 9.0),
('RS200', 'Two-person skiff', 2, 4.0, 11.9),
('RS400', 'High-performance skiff', 2, 4.45, 14.9),
('RS500', 'Development skiff', 2, 4.5, 15.0),
('RS700', 'Single-handed skiff', 1, 4.5, 13.5),
('RS800', 'Two-person skiff', 2, 4.8, 18.0),
('Contender', 'Single-handed trapeze', 1, 4.88, 10.0),
('Europe', 'Women''s single-handed', 1, 3.35, 7.0),
('Moth', 'Foiling single-handed', 1, 3.35, 8.25),
('Waszp', 'Foiling single-handed', 1, 3.26, 8.5),
('iQFoil', 'Olympic windsurfer', 1, 2.32, 9.0),
('Sunfish', 'Recreational single-handed', 1, 4.2, 7.0),
('Dragon', 'Classic keelboat', 3, 8.9, 27.5)
ON CONFLICT (class_name) DO NOTHING;

-- Create boat_setups table for wind range and configuration tracking
CREATE TABLE public.boat_setups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  boat_class_id UUID REFERENCES public.boat_classes(id),
  custom_boat_class TEXT,
  sailmaker TEXT,
  wind_band TEXT NOT NULL,
  mast_rake TEXT,
  shroud_tension TEXT,
  forestay TEXT,
  backstay TEXT,
  jib_lead TEXT,
  outhaul TEXT,
  cunningham TEXT,
  vang TEXT,
  traveler TEXT,
  mainsheet TEXT,
  rig_tension_inner_pt INTEGER,
  rig_tension_inner_kg INTEGER,
  rig_tension_outer_pt INTEGER,
  rig_tension_outer_kg INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.boat_setups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boat_setups
CREATE POLICY "Users can view their own boat setups"
ON public.boat_setups FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boat setups"
ON public.boat_setups FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boat setups"
ON public.boat_setups FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boat setups"
ON public.boat_setups FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_boat_setups_updated_at
  BEFORE UPDATE ON public.boat_setups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
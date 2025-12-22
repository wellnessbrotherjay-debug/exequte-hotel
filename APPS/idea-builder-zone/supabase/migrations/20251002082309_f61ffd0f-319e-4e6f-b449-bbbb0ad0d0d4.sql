-- Add rig setup fields to races table for performance tracking
ALTER TABLE public.races
ADD COLUMN mast_rake text,
ADD COLUMN shroud_tension text,
ADD COLUMN forestay text,
ADD COLUMN backstay text,
ADD COLUMN jib_lead text,
ADD COLUMN outhaul text,
ADD COLUMN cunningham text,
ADD COLUMN vang text,
ADD COLUMN traveler text,
ADD COLUMN mainsheet text,
ADD COLUMN rig_tension_inner_pt integer,
ADD COLUMN rig_tension_inner_kg integer,
ADD COLUMN rig_tension_outer_pt integer,
ADD COLUMN rig_tension_outer_kg integer,
ADD COLUMN sailmaker text;
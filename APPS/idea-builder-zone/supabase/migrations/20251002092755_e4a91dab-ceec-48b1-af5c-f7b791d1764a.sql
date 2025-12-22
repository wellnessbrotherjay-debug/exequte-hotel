-- Add reference link field to boat_setups for documentation sources
ALTER TABLE public.boat_setups 
ADD COLUMN IF NOT EXISTS reference_link text;

COMMENT ON COLUMN public.boat_setups.reference_link IS 'URL or reference to the source documentation for this setup configuration';
-- Seed initial data for testing

-- Create a default hotel
INSERT INTO public.hotels (id, name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo Hotel');

-- Create some test rooms
INSERT INTO public.rooms (hotel_id, name) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Room 101'),
  ('00000000-0000-0000-0000-000000000000', 'Room 102'),
  ('00000000-0000-0000-0000-000000000000', 'Room 103');
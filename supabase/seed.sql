-- Seed initial data for testing

-- Create a default hotel
INSERT INTO public.hotels (id, name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo Hotel');

-- Create some test rooms
INSERT INTO public.rooms (hotel_id, name) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Room 101'),
  ('00000000-0000-0000-0000-000000000000', 'Room 102'),
  ('00000000-0000-0000-0000-000000000000', 'Room 103');

INSERT INTO public.venues (id, name, city, country, logo_url, hero_image_url, story)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'TS Suites Skyline',
  'Bali',
  'Indonesia',
  '/assets/logo.png',
  '/assets/hotel-bg.jpg',
  'Residences engineered with HotelFit labs, thermal suites, and private gyms.'
)
ON CONFLICT (id) DO NOTHING;

-- Default brand
INSERT INTO public.brand_settings (slug, name, logo_url, background_url, video_url, primary_color, secondary_color, accent_color, font_family)
VALUES (
  'default',
  'GLVT by TS Suites',
  '/assets/logo.png',
  '/assets/hotel-bg.jpg',
  'https://watch.cloudflarestream.com/jPokBIILUKYwWLcJwmuCV_bvQgKJfdnqqivRGJi5',
  '#00CFFF',
  '#1AE6B5',
  '#FFB400',
  'Inter, sans-serif'
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  background_url = EXCLUDED.background_url,
  video_url = EXCLUDED.video_url,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  font_family = EXCLUDED.font_family;

-- Sample workouts
INSERT INTO public.workouts (name, slug, description, duration, workout_type, thumbnail_url, video_url, station_lineup, equipment)
VALUES
  (
    'Skyline Warrior',
    'skyline-warrior',
    'Signature HIIT pairing inspired by TS Suites rooftop labs.',
    45,
    'HIIT',
  '/assets/workouts/skyline-warrior.jpg',
  '/assets/workouts/skyline-warrior.mp4',
    jsonb_build_array(
      jsonb_build_object('station', 1, 'title', 'Air Bike Sprints', 'focus', 'Power'),
      jsonb_build_object('station', 2, 'title', 'Kettlebell Complex', 'focus', 'Strength'),
      jsonb_build_object('station', 3, 'title', 'Core Slings', 'focus', 'Stability')
    ),
    jsonb_build_array('assault bike', 'kettlebell set', 'trx')
  ),
  (
    'Hydra Flow',
    'hydra-flow',
    'Low impact metabolic flow with strength waves and tempo holds.',
    50,
    'Strength',
    '/assets/workouts/hydra-flow.jpg',
    '/assets/workouts/hydra-flow.mp4',
    jsonb_build_array(
      jsonb_build_object('station', 1, 'title', 'Tempo Goblet Squat', 'focus', 'Legs'),
      jsonb_build_object('station', 2, 'title', 'Ring Rows', 'focus', 'Back'),
      jsonb_build_object('station', 3, 'title', 'Slider Crawls', 'focus', 'Core')
    ),
    jsonb_build_array('kettlebell', 'rings', 'sliders')
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.hotel_services (name, description, price_cents, duration_minutes, booking_url)
VALUES
  ('Signature Personal Training', 'Private in-suite coaching with biometric tracking.', 24000, 60, 'https://booking.hotelfit.com/pt'),
  ('Thermal Reset Ritual', 'Cold plunge + infrared + breathwork concierge.', 28000, 75, 'https://booking.hotelfit.com/thermal'),
  ('Room Recovery Upgrade', 'Normatec compression + guided mobility kit.', 18000, 45, 'https://booking.hotelfit.com/recovery')
ON CONFLICT DO NOTHING;

INSERT INTO public.facilities (name, description, hours, icon, booking_url, image_url)
VALUES
  ('Skyline Pool Deck', 'Heated infinity pools with DJ sunsets + cabanas.', '6am – 11pm', '🏖️', 'https://booking.hotelfit.com/cabana', '/assets/facilities/pool.jpg'),
  ('Recovery Lab', 'Infrared, cold plunge, compression boots, and lab techs.', '7am – 10pm', '❄️', 'https://booking.hotelfit.com/recovery-lab', '/assets/facilities/recovery.jpg'),
  ('Movement Studio', 'Reformers, yoga, and functional circuits overlooking the bay.', '24/7', '🧘', 'https://booking.hotelfit.com/studio', '/assets/facilities/studio.jpg')
ON CONFLICT DO NOTHING;

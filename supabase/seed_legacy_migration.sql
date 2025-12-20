-- Legacy Data Migration from Exequte Mini Program
-- Maps 'Trainings' -> 'studio_classes' and creates schedules

-- 1. LEGACY COACHES
-- "Mr. Instructor" from seeds.rb
INSERT INTO coaches (name, specialty, bio, certifications, image_url) VALUES
('Mr. Instructor', 'General Fitness', 'Experienced instructor from Exequte original program.', ARRAY['Legacy Certified'], 'https://i.pinimg.com/originals/b1/94/82/b19482a076bc6a51f713c37a54e7b615.jpg');

-- 2. LEGACY CLASSES
-- Yoga, Body Pump, Stretching, Abs, Weight Lifting
INSERT INTO studio_classes (slug, name, description, duration_minutes, intensity, max_spots, cover_image_url, focus_area) VALUES
('yoga', 'Yoga', 'Stretch your body and mind with us. Hot Yoga style.', 60, 'Low', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('body-pump', 'Body Pump', 'Go crazy with Body Pump. Light Weight high reps.', 60, 'High', 15, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('stretching', 'Stretching', 'Same like yoga but without Zen.', 45, 'Low', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('abs-workout', 'Abs Workout', 'Go get that 6-pack.', 30, 'High', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Core'),
('weight-lifting', 'Weight Lifting', 'Free and powerful workout session.', 90, 'High', 30, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body')
ON CONFLICT (slug) DO NOTHING;

-- 3. GENERATE SCHEDULES FOR LEGACY CLASSES (Next 14 days)
DO $$
DECLARE
  coach_id uuid;
  class_yoga uuid;
  class_pump uuid;
  class_stretch uuid;
  class_abs uuid;
  class_lift uuid;
  
  day_offset integer;
  current_date date;
BEGIN
  -- Get IDs
  SELECT id INTO coach_id FROM coaches WHERE name = 'Mr. Instructor' LIMIT 1;
  SELECT id INTO class_yoga FROM studio_classes WHERE slug = 'yoga';
  SELECT id INTO class_pump FROM studio_classes WHERE slug = 'body-pump';
  SELECT id INTO class_stretch FROM studio_classes WHERE slug = 'stretching';
  SELECT id INTO class_abs FROM studio_classes WHERE slug = 'abs-workout';
  SELECT id INTO class_lift FROM studio_classes WHERE slug = 'weight-lifting';

  -- Generate 14 days of schedules matching legacy logic
  FOR day_offset IN 0..13 LOOP
    current_date := CURRENT_DATE + day_offset;
    
    -- Morning Yoga
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_yoga, coach_id, current_date + TIME '07:00:00', 'Studio A', 20);
    
    -- Lunch Abs
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_abs, coach_id, current_date + TIME '12:00:00', 'Studio B', 20);
    
    -- Evening Pump
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_pump, coach_id, current_date + TIME '18:00:00', 'Studio A', 15);
    
    -- Night Lifting
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_lift, coach_id, current_date + TIME '20:00:00', 'Gym Floor', 30);
    
  END LOOP;
END $$;

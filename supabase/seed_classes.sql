-- Seed Data for Studio Booking System
-- Populates coaches, classes, and generates 7 days of schedules

-- ============================================================================
-- COACHES
-- ============================================================================
INSERT INTO coaches (name, specialty, bio, certifications, image_url) VALUES
('Coach Mike Chen', 'Glute Activation & Power', '10+ years specializing in lower body biomechanics and glute development. Former Olympic weightlifting coach.', 
  ARRAY['NASM-CPT', 'CSCS', 'Olympic Lifting L2'], '/coaches/mike-chen.png'),

('Sarah Liu', 'Core Stability & Pilates', 'Pilates master instructor with expertise in core rehabilitation and functional movement patterns.', 
  ARRAY['Pilates Master', 'Physical Therapy', 'Yoga RYT-500'], '/coaches/sarah-liu.png'),

('Coach Alex Wong', 'Functional Core Training', 'Sports performance specialist focusing on core strength for athletic performance and injury prevention.', 
  ARRAY['CSCS', 'FMS', 'TRX Master'], '/coaches/alex-wong.png'),

('Emma Park', 'Glute Sculpting', 'Body composition expert specializing in glute hypertrophy and aesthetic development.', 
  ARRAY['NASM-CPT', 'Nutrition Coach', 'Bodybuilding Specialist'], '/coaches/emma-park.png'),

('Coach Danny Kim', 'High-Intensity Core', 'Former MMA fighter bringing explosive core training techniques to maximize power and endurance.', 
  ARRAY['CrossFit L2', 'Kettlebell Master', 'MMA Conditioning'], '/coaches/danny-kim.png'),

('Jessica Tan', 'Lower Body Power', 'Powerlifting champion with focus on glute and hamstring strength development.', 
  ARRAY['USAPL Coach', 'Starting Strength', 'Biomechanics Specialist'], '/coaches/jessica-tan.png');

-- ============================================================================
-- STUDIO CLASSES (Templates)
-- ============================================================================
INSERT INTO studio_classes (slug, name, description, duration_minutes, intensity, max_spots, cover_image_url, focus_area) VALUES
('glute-activation', 'Glute Activation', 'Wake up dormant glutes with targeted activation exercises. Perfect for building mind-muscle connection and preparing for heavier lifts.', 
  60, 'Medium', 12, '/class-covers/glutes-workout.png', 'Glutes'),

('core-foundation', 'Core Foundation', 'Build a rock-solid core foundation with controlled movements. Focus on stability, breathing, and proper engagement.', 
  75, 'Low', 15, '/class-covers/core-strength.png', 'Core'),

('pilates-core', 'Pilates Core', 'Classical pilates movements targeting deep core muscles. Improve posture, stability, and body awareness.', 
  60, 'Medium', 12, '/class-covers/pilates-core.png', 'Core'),

('glute-sculpt', 'Glute Sculpt', 'Hypertrophy-focused glute training with progressive overload. Build rounder, stronger glutes.', 
  50, 'High', 10, '/class-covers/glute-sculpt.png', 'Glutes'),

('abs-blast', 'Abs Blast', 'High-intensity core workout combining static holds and dynamic movements. Get shredded abs.', 
  45, 'High', 15, '/class-covers/abs-blast.png', 'Core'),

('lower-body-power', 'Lower Body Power', 'Build explosive glute and hamstring power with compound lifts. Deadlifts, hip thrusts, and more.', 
  60, 'High', 10, '/class-covers/lower-body-power.png', 'Glutes');

-- ============================================================================
-- CLASS SCHEDULES (7 days, morning & evening)
-- ============================================================================
-- This generates a week of classes starting from today
-- Morning: 6am, 8am, 10am | Evening: 5pm, 6:30pm, 8pm

DO $$
DECLARE
  coach_mike uuid;
  coach_sarah uuid;
  coach_alex uuid;
  coach_emma uuid;
  coach_danny uuid;
  coach_jessica uuid;
  
  class_glute_activation uuid;
  class_core_foundation uuid;
  class_pilates_core uuid;
  class_glute_sculpt uuid;
  class_abs_blast uuid;
  class_lower_body_power uuid;
  
  day_offset integer;
  current_date date;
BEGIN
  -- Get coach IDs
  SELECT id INTO coach_mike FROM coaches WHERE name = 'Coach Mike Chen';
  SELECT id INTO coach_sarah FROM coaches WHERE name = 'Sarah Liu';
  SELECT id INTO coach_alex FROM coaches WHERE name = 'Coach Alex Wong';
  SELECT id INTO coach_emma FROM coaches WHERE name = 'Emma Park';
  SELECT id INTO coach_danny FROM coaches WHERE name = 'Coach Danny Kim';
  SELECT id INTO coach_jessica FROM coaches WHERE name = 'Jessica Tan';
  
  -- Get class IDs
  SELECT id INTO class_glute_activation FROM studio_classes WHERE slug = 'glute-activation';
  SELECT id INTO class_core_foundation FROM studio_classes WHERE slug = 'core-foundation';
  SELECT id INTO class_pilates_core FROM studio_classes WHERE slug = 'pilates-core';
  SELECT id INTO class_glute_sculpt FROM studio_classes WHERE slug = 'glute-sculpt';
  SELECT id INTO class_abs_blast FROM studio_classes WHERE slug = 'abs-blast';
  SELECT id INTO class_lower_body_power FROM studio_classes WHERE slug = 'lower-body-power';
  
  -- Generate 7 days of schedules
  FOR day_offset IN 0..6 LOOP
    current_date := CURRENT_DATE + day_offset;
    
    -- MORNING CLASSES (6am, 8am, 10am)
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_core_foundation, coach_sarah, current_date + TIME '06:00:00', 'Studio B', 15),
    (class_glute_activation, coach_mike, current_date + TIME '08:00:00', 'Studio A', 12),
    (class_pilates_core, coach_sarah, current_date + TIME '10:00:00', 'Studio A', 12);
    
    -- EVENING CLASSES (5pm, 6:30pm, 8pm)
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_lower_body_power, coach_jessica, current_date + TIME '17:00:00', 'Studio A', 10),
    (class_abs_blast, coach_danny, current_date + TIME '18:30:00', 'Studio B', 15),
    (class_glute_sculpt, coach_emma, current_date + TIME '20:00:00', 'Studio A', 10);
  END LOOP;
END $$;

-- Studio Booking System Schema
-- Implements real database-backed class scheduling and booking system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- COACHES TABLE
-- ============================================================================
CREATE TABLE coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  bio text,
  certifications text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- STUDIO CLASSES (Templates)
-- ============================================================================
CREATE TABLE studio_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  intensity text CHECK (intensity IN ('Low', 'Medium', 'High')) NOT NULL,
  max_spots integer NOT NULL DEFAULT 12,
  cover_image_url text,
  focus_area text CHECK (focus_area IN ('Core', 'Glutes', 'Full Body')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CLASS SCHEDULES (Specific instances on calendar)
-- ============================================================================
CREATE TABLE class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES studio_classes(id) ON DELETE CASCADE NOT NULL,
  coach_id uuid REFERENCES coaches(id) ON DELETE SET NULL,
  scheduled_time timestamptz NOT NULL,
  location text DEFAULT 'Studio A',
  available_spots integer NOT NULL,
  status text CHECK (status IN ('scheduled', 'cancelled', 'completed')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CLASS BOOKINGS (User reservations)
-- ============================================================================
CREATE TABLE class_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  schedule_id uuid REFERENCES class_schedules(id) ON DELETE CASCADE NOT NULL,
  booking_status text CHECK (booking_status IN ('confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'confirmed',
  booked_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, schedule_id) -- Prevent double booking same class
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_class_schedules_time ON class_schedules(scheduled_time);
CREATE INDEX idx_class_schedules_status ON class_schedules(status);
CREATE INDEX idx_class_bookings_user ON class_bookings(user_id);
CREATE INDEX idx_class_bookings_schedule ON class_bookings(schedule_id);
CREATE INDEX idx_class_bookings_status ON class_bookings(booking_status);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_coaches 
  BEFORE UPDATE ON coaches 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_studio_classes 
  BEFORE UPDATE ON studio_classes 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_class_schedules 
  BEFORE UPDATE ON class_schedules 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_class_bookings 
  BEFORE UPDATE ON class_bookings 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for coaches and classes
CREATE POLICY "Public read coaches" ON coaches FOR SELECT USING (true);
CREATE POLICY "Public read studio_classes" ON studio_classes FOR SELECT USING (true);
CREATE POLICY "Public read class_schedules" ON class_schedules FOR SELECT USING (true);

-- Users can read all bookings (for leaderboards, class capacity, etc.)
CREATE POLICY "Public read bookings" ON class_bookings FOR SELECT USING (true);

-- Users can only insert/update/delete their own bookings
CREATE POLICY "Users manage own bookings" ON class_bookings 
  FOR ALL USING (auth.uid() = user_id);

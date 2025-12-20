-- HRM System Schema Integration
-- Implements the "Golden Rule" workflow for Heart Rate Monitoring

-- 1. BOOKING & ASSIGNMENTS
-- Links a user's intent to join a class with a specific device reservation

CREATE TABLE hrm_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  class_id text NOT NULL, -- Logical ID from the class schedule/cms
  booking_time timestamptz DEFAULT now(),
  status text CHECK (status IN ('confirmed', 'cancelled', 'checked_in', 'no_show')) DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hrm_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES hrm_bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  class_id text NOT NULL,
  device_id text NOT NULL, -- The physical ID of the band (e.g., 'HRM-101')
  device_number int, -- The visual number on the band/wall (e.g., 12)
  status text CHECK (status IN ('reserved', 'active', 'completed', 'cancelled')) DEFAULT 'reserved',
  reserved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. LIVE SESSION MANAGEMENT
-- The actual running instance of a class that collects data

CREATE TABLE hrm_class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id text NOT NULL,
  location text DEFAULT 'Studio A',
  instructor_name text,
  status text CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')) DEFAULT 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz, -- NULL until finished
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hrm_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  booking_id uuid REFERENCES hrm_bookings(id),
  assignment_id uuid REFERENCES hrm_assignments(id),
  device_id text NOT NULL,
  status text CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Note: hrm_samples are high-frequency and likely stored in a different time-series DB or 
-- a partitioned table. For this schema, we will assume they are handled by the separate 
-- HRM API service or a dedicated hypertable if using TimescaleDB.

-- 3. POST-CLASS RESULTS & RECAPS
-- Computed data for persistent history and UI display

CREATE TABLE hrm_session_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  
  -- Performance Metrics
  avg_hr int,
  max_hr int,
  min_hr int,
  calories_est int,
  points int, -- Gamification points
  effort_score numeric, -- Computed score (e.g., weighted zones)
  
  -- Time in Zones (seconds)
  zone_1_sec int DEFAULT 0,
  zone_2_sec int DEFAULT 0,
  zone_3_sec int DEFAULT 0,
  zone_4_sec int DEFAULT 0,
  zone_5_sec int DEFAULT 0,
  
  -- Ranks
  rank_overall int,
  rank_gender int,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- User-facing recap object (Pre-computed for fast UI load)
CREATE TABLE hrm_user_class_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  
  -- JSON blob for flexible UI rendering
  -- Contains: { rank, stats, comparison_to_avg, graph_data_points, awards }
  recap_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Class-wide recap (Leaderboards, aggregates)
CREATE TABLE hrm_class_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  
  total_calories int,
  avg_effort_score numeric,
  participant_count int,
  
  -- JSON blob for leaderboard and distribution charts
  -- Contains: { top_performers: [], zone_distribution: {}, class_averages: {} }
  summary_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id)
);

-- 4. INDEXES & TRIGGERS
CREATE INDEX idx_hrm_assignments_booking ON hrm_assignments(booking_id);
CREATE INDEX idx_hrm_assignments_device ON hrm_assignments(device_id);
CREATE INDEX idx_hrm_sessions_status ON hrm_class_sessions(status);
CREATE INDEX idx_hrm_results_session ON hrm_session_results(session_id);
CREATE INDEX idx_hrm_results_user ON hrm_session_results(user_id);

-- Updated_at triggers
CREATE TRIGGER set_timestamp_hrm_bookings BEFORE UPDATE ON hrm_bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_assignments BEFORE UPDATE ON hrm_assignments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_sessions BEFORE UPDATE ON hrm_class_sessions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_participants BEFORE UPDATE ON hrm_session_participants FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_results BEFORE UPDATE ON hrm_session_results FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- 5. RLS POLICIES
ALTER TABLE hrm_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_session_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_user_class_recaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_class_recaps ENABLE ROW LEVEL SECURITY;

-- Simple policies (Refine as needed for production roles)
CREATE POLICY "Public read hrm_sessions" ON hrm_class_sessions FOR SELECT USING (true);
CREATE POLICY "Public read hrm_results" ON hrm_session_results FOR SELECT USING (true);
CREATE POLICY "Users read own bookings" ON hrm_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own assignments" ON hrm_assignments FOR SELECT USING (auth.uid() = user_id);

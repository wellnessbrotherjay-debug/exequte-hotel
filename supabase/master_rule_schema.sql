-- MASTER RULE SCHEMA EXTENSION
-- Adds support for "Mode 2: Online Program Experience" and unifies the Result Pipeline

-- 1. PROGRAMS STRUCTURE
CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('beginner','intermediate','advanced')),
  duration_weeks int DEFAULT 4,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE program_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  week_number int NOT NULL,
  day_number int NOT NULL, -- 1-7
  workout_template_id uuid REFERENCES workout_templates(id),
  day_label text, -- e.g. "Leg Day"
  created_at timestamptz DEFAULT now(),
  UNIQUE(program_id, week_number, day_number)
);

-- 2. USER ENROLLMENT & PROGRESS
CREATE TABLE program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  status text CHECK (status IN ('active', 'completed', 'paused', 'dropped')) DEFAULT 'active',
  start_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE program_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES program_enrollments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Stats
  workouts_completed int DEFAULT 0,
  current_streak_days int DEFAULT 0,
  last_workout_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id)
);

-- 3. UNIFIED RESULTS PIPELINE (For Mode 2)
-- Matches the "session_results" concept for generic workouts

CREATE TABLE workout_session_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  
  -- The Computed Metrics (Extraction Job Output)
  duration_min int,
  total_volume_kg int, -- specific to lifting
  total_reps int,
  calories_est int,
  avg_hr int,
  max_hr int,
  
  -- Scoring
  effort_score numeric,
  completion_rate numeric, -- % of prescribed exercises done
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id)
);

-- 4. RAW DATA CAPTURE (For live streams)
CREATE TABLE hrm_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  user_id uuid REFERENCES user_profiles(id), -- Optional connection if known
  session_id uuid, -- Polymorphic ID (could be class or workout) or separate columns
  session_type text CHECK (session_type IN ('class', 'workout')),
  
  heart_rate int NOT NULL,
  timestamp timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_program_schedule_program ON program_schedules(program_id);
CREATE INDEX idx_enrollments_user ON program_enrollments(user_id);
CREATE INDEX idx_workout_results_user ON workout_session_results(user_id);
CREATE INDEX idx_hrm_samples_device ON hrm_samples(device_id);
CREATE INDEX idx_hrm_samples_ts ON hrm_samples(timestamp DESC);

-- RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_session_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_samples ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read program_schedules" ON program_schedules FOR SELECT USING (true);
CREATE POLICY "Users read own enrollments" ON program_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own progress" ON program_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own results" ON workout_session_results FOR SELECT USING (auth.uid() = user_id);

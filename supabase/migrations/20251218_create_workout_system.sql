-- 1. EXERCISE LIBRARY
-- A catalog of all available movements independent of specific workouts.
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    video_url TEXT, -- URL to video guide (mp4/hls)
    thumbnail_url TEXT,
    muscle_groups TEXT[], -- e.g. ['glutes', 'hamstrings']
    equipment_needed TEXT[], -- e.g. ['dumbbells', 'bench']
    type TEXT DEFAULT 'strength', -- strength, cardio, mobility, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKOUTS
-- The high-level container for a session (e.g., "Full Body Blast").
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g. 'Strength', 'HIIT', 'Pilates'
    difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_duration_min INTEGER DEFAULT 45,
    cover_image_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKOUT BLOCKS
-- Sections of a workout to group exercises (e.g., "Warmup", "Circuit 1", "Cooldown").
CREATE TABLE workout_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- e.g., "Superset A"
    sort_order INTEGER NOT NULL,
    type TEXT DEFAULT 'standard', -- standard, circuit, emom, amrap
    rounds INTEGER DEFAULT 1, -- For circuits
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKOUT EXERCISES (Prescriptions)
-- Linking an exercise to a block with specific targets.
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID REFERENCES workout_blocks(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE RESTRICT,
    sort_order INTEGER NOT NULL,
    
    -- Prescriptions
    target_sets INTEGER DEFAULT 3,
    target_reps INTEGER, -- Can be null if time-based
    target_time_sec INTEGER, -- For duration-based exercises
    target_rpe INTEGER, -- Rate of Perceived Exertion (1-10)
    rest_time_sec INTEGER DEFAULT 60,
    
    notes TEXT, -- Specific cues for this workout context
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER WORKOUT SESSIONS
-- An instance of a user performing a workout.
CREATE TABLE user_workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, abandoned
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_volume_kg NUMERIC DEFAULT 0,
    total_time_sec INTEGER DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    feeling_rating INTEGER, -- 1-5 how they felt
    notes TEXT
);

-- 6. USER SET LOGS
-- Granular data for every set performed.
CREATE TABLE user_set_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES user_workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    block_id UUID REFERENCES workout_blocks(id) ON DELETE SET NULL,
    
    set_number INTEGER NOT NULL,
    weight_kg NUMERIC,
    reps_completed INTEGER,
    time_sec INTEGER, -- If duration based
    
    is_pr BOOLEAN DEFAULT false, -- Personal Record flag
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- exercises: Public read, Admin write
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);

-- workouts: Public read, Admin write
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read workouts" ON workouts FOR SELECT USING (true);

-- workout_blocks: Public read
ALTER TABLE workout_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blocks" ON workout_blocks FOR SELECT USING (true);

-- workout_exercises: Public read
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read workout exercises" ON workout_exercises FOR SELECT USING (true);

-- user_workout_sessions: User can read/write own
ALTER TABLE user_workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User view own sessions" ON user_workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User insert own sessions" ON user_workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User update own sessions" ON user_workout_sessions FOR UPDATE USING (auth.uid() = user_id);

-- user_set_logs: User can read/write own logs (via session ownership ideally, but direct ID for simplicity)
ALTER TABLE user_set_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User view own logs" ON user_set_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_workout_sessions s WHERE s.id = user_set_logs.session_id AND s.user_id = auth.uid())
);
CREATE POLICY "User insert own logs" ON user_set_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
);

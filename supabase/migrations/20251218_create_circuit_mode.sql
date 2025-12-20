-- CIRCUIT MODE SYSTEM

-- 1. CIRCUITS
-- Defines a standard 8-station layout or custom circuit.
CREATE TABLE circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    stations_count INTEGER DEFAULT 8,
    work_time_sec INTEGER DEFAULT 45,
    rest_time_sec INTEGER DEFAULT 15,
    transition_time_sec INTEGER DEFAULT 30, -- Time to move between stations
    rounds INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CIRCUIT STATIONS
-- The specific exercise assigned to each station number (1-8).
CREATE TABLE circuit_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circuit_id UUID REFERENCES circuits(id) ON DELETE CASCADE,
    station_number INTEGER NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    default_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(circuit_id, station_number)
);

-- 3. ACTIVE CIRCUIT SESSIONS (The "Source of Truth")
-- This controls the global timer and state for all connected devices.
CREATE TABLE circuit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circuit_id UUID REFERENCES circuits(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ,
    status TEXT DEFAULT 'setup', -- setup, active, paused, completed
    
    -- Realtime State (Updated every second/phase change)
    current_round INTEGER DEFAULT 1,
    current_phase TEXT DEFAULT 'warmup', -- warmup, work, rest, transition, cooldown
    phase_start_time TIMESTAMPTZ, -- When the current phase started (for client drift correction)
    paused_at TIMESTAMPTZ, -- If paused, when it happened
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STATION OVERRIDES (Live Updates)
-- Allows a coach/user to swap an exercise mid-session (e.g., "Station 4 broken" or "Injury swap").
CREATE TABLE circuit_session_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES circuit_sessions(id) ON DELETE CASCADE,
    station_number INTEGER NOT NULL,
    alternate_exercise_id UUID REFERENCES exercises(id),
    is_occupied BOOLEAN DEFAULT false, -- If a user marks station as busy
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, station_number)
);

-- 5. CONNECTED DEVICES (Presence)
-- Tracks which tablets/TVs are listening to which station.
CREATE TABLE circuit_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES circuit_sessions(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL, -- Fingerprint or unique ID
    device_type TEXT, -- 'tablet', 'tv', 'phone_controller'
    assigned_station INTEGER, -- Null for controller/TV, 1-8 for tablets
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read circuits" ON circuits FOR SELECT USING (true);

ALTER TABLE circuit_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read circuit stations" ON circuit_stations FOR SELECT USING (true);

ALTER TABLE circuit_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sessions" ON circuit_sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated create sessions" ON circuit_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creator update sessions" ON circuit_sessions FOR UPDATE USING (auth.uid() = created_by);

ALTER TABLE circuit_session_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read overrides" ON circuit_session_overrides FOR SELECT USING (true);
CREATE POLICY "Authenticated create overrides" ON circuit_session_overrides FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE circuit_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read devices" ON circuit_devices FOR SELECT USING (true);
CREATE POLICY "Public insert devices" ON circuit_devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update devices" ON circuit_devices FOR UPDATE USING (true);

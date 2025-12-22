-- Workout Sessions table (tracks when user starts a workout)
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_day INTEGER NOT NULL CHECK (workout_day >= 1 AND workout_day <= 9),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  calories_burned INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Exercise Logs (tracks each exercise within a workout)
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER DEFAULT 0,
  reps_completed INTEGER DEFAULT 0,
  weight_kg DECIMAL,
  duration_seconds INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Wearable Device Connections
CREATE TABLE public.wearable_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_type TEXT NOT NULL, -- 'apple_watch', 'garmin', 'fitbit'
  device_name TEXT,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Heart Rate Data (from wearables)
CREATE TABLE public.heart_rate_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  heart_rate INTEGER NOT NULL,
  source TEXT, -- 'apple_watch', 'garmin', 'fitbit', 'manual'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heart_rate_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions"
ON public.workout_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions"
ON public.workout_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
ON public.workout_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
ON public.workout_sessions FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for exercise_logs
CREATE POLICY "Users can view their own exercise logs"
ON public.exercise_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = exercise_logs.session_id
  AND workout_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own exercise logs"
ON public.exercise_logs FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = exercise_logs.session_id
  AND workout_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can update their own exercise logs"
ON public.exercise_logs FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = exercise_logs.session_id
  AND workout_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own exercise logs"
ON public.exercise_logs FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = exercise_logs.session_id
  AND workout_sessions.user_id = auth.uid()
));

-- RLS Policies for wearable_connections
CREATE POLICY "Users can view their own wearable connections"
ON public.wearable_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wearable connections"
ON public.wearable_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wearable connections"
ON public.wearable_connections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wearable connections"
ON public.wearable_connections FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for heart_rate_data
CREATE POLICY "Users can view their own heart rate data"
ON public.heart_rate_data FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = heart_rate_data.session_id
  AND workout_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own heart rate data"
ON public.heart_rate_data FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.workout_sessions
  WHERE workout_sessions.id = heart_rate_data.session_id
  AND workout_sessions.user_id = auth.uid()
));

-- Add trigger for updated_at
CREATE TRIGGER update_wearable_connections_updated_at
  BEFORE UPDATE ON public.wearable_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
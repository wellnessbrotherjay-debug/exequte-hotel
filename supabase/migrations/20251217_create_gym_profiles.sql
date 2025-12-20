-- Create Gym Profiles to store medical/fitness data
CREATE TABLE IF NOT EXISTS gym_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    gender TEXT,
    medical_conditions TEXT,
    waiver_signed BOOLEAN DEFAULT FALSE,
    waiver_signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gym_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON gym_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON gym_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON gym_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup (optional, or handle in app)
-- For now we will handle creation in the Onboarding flow manually to ensure data entry.

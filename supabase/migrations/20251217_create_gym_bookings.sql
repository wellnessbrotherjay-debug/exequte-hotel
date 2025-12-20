-- Create Gym Sessions (Classes)
CREATE TABLE IF NOT EXISTS gym_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_name TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    capacity INT DEFAULT 20,
    price_drop_in DECIMAL(10, 2) DEFAULT 0,
    venue_id UUID, -- For multi-venue support
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Gym Bookings
CREATE TABLE IF NOT EXISTS gym_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES gym_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_name TEXT, -- For non-auth users or manual entry
    status TEXT DEFAULT 'confirmed', -- confirmed, canceled, waitlisted
    payment_status TEXT DEFAULT 'pending', -- paid, pending, refund_requested
    booked_with TEXT, -- membership, drop-in, credits
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Memberships
CREATE TABLE IF NOT EXISTS gym_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL, -- monthly, annual, class-pack
    status TEXT DEFAULT 'active',
    credits_remaining INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gym_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_memberships ENABLE ROW LEVEL SECURITY;

-- Policies (Open for now for dev, restrict later)
CREATE POLICY "Public read sessions" ON gym_sessions FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON gym_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON gym_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

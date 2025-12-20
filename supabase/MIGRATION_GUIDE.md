# Database Migration Guide

## Running the Booking System Migrations

Follow these steps to set up the booking system database:

### 1. Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar

### 2. Run Schema Migration
1. Open `supabase/booking_system_schema.sql`
2. Copy the entire contents
3. Paste into a new query in Supabase SQL Editor
4. Click "Run" to execute
5. Verify tables were created in the "Table Editor"

### 3. Run Seed Data
1. Open `supabase/seed_classes.sql`
2. Copy the entire contents
3. Paste into a new query in Supabase SQL Editor
4. Click "Run" to execute
5. Verify data was inserted:
   - Check `coaches` table (should have 6 coaches)
   - Check `studio_classes` table (should have 6 classes)
   - Check `class_schedules` table (should have 42 schedules - 6 per day for 7 days)

### 4. Verify Setup
Run this query to confirm everything is working:

```sql
SELECT 
  cs.scheduled_time,
  sc.name as class_name,
  c.name as coach_name,
  cs.available_spots,
  cs.location
FROM class_schedules cs
JOIN studio_classes sc ON cs.class_id = sc.id
JOIN coaches c ON cs.coach_id = c.id
WHERE cs.scheduled_time >= NOW()
ORDER BY cs.scheduled_time
LIMIT 10;
```

You should see upcoming classes with coach names and available spots.

## Troubleshooting

### If you get "relation already exists" errors:
The tables might already exist. You can either:
- Drop the tables first: `DROP TABLE IF EXISTS class_bookings, class_schedules, studio_classes, coaches CASCADE;`
- Or skip to step 3 if tables exist but are empty

### If you get "function trigger_set_timestamp does not exist":
This function should be created by the schema file. If it's missing, add this before the triggers:

```sql
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Next Steps
After running migrations, the app will automatically use the real database for:
- Fetching class schedules
- Creating bookings
- Displaying user bookings on home page
- Managing (cancelling) bookings

-- Create exercise_media table to power the builder library
create extension if not exists "pgcrypto";

create table if not exists public.exercise_media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  equipment text not null,
  video_url text not null,
  muscles text[],
  cues text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.exercise_media
  add constraint exercise_media_name_equipment_unique unique (name, equipment);

alter table public.exercise_media enable row level security;

create policy "Allow read access to exercise media"
  on public.exercise_media
  for select
  using (true);

create policy "Allow service role to manage exercise media"
  on public.exercise_media
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Seed a baseline set of exercises (idempotent upsert)
insert into public.exercise_media (name, equipment, video_url, muscles, cues)
values
  ('Alt Hammer Curls', 'dumbbells', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Alt%20hammer%20curls%20.MP4', array['biceps','forearms'], array['Keep elbows pinned','Control the lowering phase']),
  ('Dumbbell Thrusters', 'dumbbells', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/DB%20thruster.MP4', array['legs','shoulders','core'], array['Drive through heels','Press straight overhead']),
  ('Renegade Row', 'dumbbells', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Renegade%20row.MP4', array['back','core','arms'], array['Hold a plank','Pull elbow to the sky']),
  ('Split Squat Pulse', 'dumbbells', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/DB%20split%20squat%20pulse.MP4', array['quads','glutes'], array['Keep torso tall','Pulse in the bottom half']),
  ('Barbell Shoulder Press', 'barbell', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Barbell%20shoulder%20press%20.MP4', array['shoulders','triceps'], array['Brace your core','Press straight overhead']),
  ('Barbell Deadlift', 'barbell', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Barbell%20deadlift%20.mp4', array['posterior chain'], array['Keep bar close','Drive hips through']),
  ('Barbell Front Squat', 'barbell', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Barbell%20front%20squat%20back%20lunge%20.MP4', array['quads','core'], array['Elbows high','Sit between your heels']),
  ('Band Lunges', 'band', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Band%20lunges%20.MP4', array['glutes','hamstrings','quads'], array['Keep front knee tracking toes','Drive through the heel']),
  ('Band Tricep Extension', 'band', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Band%20bent%20ofer%20tricep%20ext%20.MP4', array['triceps'], array['Lock elbows','Squeeze the finish']),
  ('Band Bent-Over Row', 'band', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Band%20seated%20lat%20pull%20down.MP4', array['back'], array['Lead with elbows','Keep chest broad']),
  ('Slow Wide Arm Push Up', 'bodyweight', '/videos/slow wide arm push up.mp4', array['chest','shoulders','triceps'], array['Lower with control','Keep elbows slightly bent at top']),
  ('Burpee Kick Through', 'bodyweight', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Burpee%20kick%20through.MP4', array['total body'], array['Move with rhythm','Land softly']),
  ('TRX Row', 'trx', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/TRX%20row.MP4', array['back','biceps'], array['Squeeze shoulder blades','Keep body straight']),
  ('TRX Pike', 'trx', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/TRX%20pike.MP4', array['core','shoulders'], array['Lift hips to the sky','Keep legs straight']),
  ('Bosu Roller Russian Twists', 'bosu', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Bosu%20roller%20russian%20twists%20.MP4', array['core','obliques'], array['Engage your core','Control the rotation']),
  ('Row Sprints', 'rower', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Row%20sprint.MP4', array['legs','back','cardio'], array['Drive legs first','Finish with arms']),
  ('AirBike Power Intervals', 'airbike', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Airbike%20power.MP4', array['total body','cardio'], array['Push/pull evenly','Keep cadence high']),
  ('SkiErg Pulls', 'skierg', 'https://xxknmjnvyeckmjlexxbs.supabase.co/storage/v1/object/public/Videos/Skierg%20pulls.MP4', array['lats','core','cardio'], array['Fold at hips','Snap arms down'])
on conflict (name, equipment)
do update set
  video_url = excluded.video_url,
  muscles = excluded.muscles,
  cues = excluded.cues,
  updated_at = now();

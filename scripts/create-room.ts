import { createAdminClient } from '../lib/supabase/server';

const DEFAULT_HOTEL_ID = '00000000-0000-0000-0000-000000000000';

async function createRoom() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name: 'Room 101',
      qr_slug: 'room-101',
      hotel_id: DEFAULT_HOTEL_ID
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating room:', error);
    return;
  }

  console.log('Created room:', data);
}

createRoom();

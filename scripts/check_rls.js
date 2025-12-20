import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase public credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAccess() {
    console.log('Testing ANON access to exercises...');
    const { data, error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching exercises:', error.message);
    } else {
        console.log('Success! Count:', data); // data is null for head: true mostly, but count is in return
    }

    const { data: rows, error: rowsError } = await supabase.from('exercises').select('name').limit(1);
    if (rowsError) {
        console.error('Error fetching rows:', rowsError.message);
    } else {
        console.log('Rows fetched:', rows);
    }
}

checkAccess();

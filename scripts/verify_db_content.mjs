import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log('Verifying exercises in Supabase...');
    const { data, error } = await supabase.from('exercises').select('name, demo_url, type');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${data.length} exercises.`);
    data.forEach(ex => {
        console.log(`- ${ex.name} | ${ex.demo_url} | ${ex.type}`);
    });
}

verify();

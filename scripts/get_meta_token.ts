
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Fetching Meta tokens from social_integrations...");

    const { data, error } = await supabase
        .from('social_integrations')
        .select('brand_id, platform, access_token, platform_user_id')
        .eq('platform', 'facebook');

    if (error) {
        console.error("DB Error:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No Facebook tokens found in DB.");
        return;
    }

    data.forEach((row, i) => {
        console.log(`\n--- Token ${i + 1} ---`);
        console.log(`Brand: ${row.brand_id}`);
        console.log(`User ID: ${row.platform_user_id}`);
        console.log(`Token: ${row.access_token}`);

        // Generate Curl Command for easy testing
        console.log(`\nTest Command:`);
        console.log(`curl "https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,account_status&access_token=${row.access_token}"`);
    });
}

main();

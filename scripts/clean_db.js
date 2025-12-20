
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bwndbccgzjdgtcyornwn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cleanDuplicates() {
    console.log("Checking for duplicates...");

    const { data: rows, error } = await supabase
        .from('social_integrations')
        .select('*');

    if (error) {
        console.error("Error fetching rows:", error);
        return;
    }

    console.log(`Found ${rows.length} total rows.`);

    const seen = new Set();
    const duplicates = [];

    if (rows.length > 0) {
        console.log("Deleting ALL rows to reset state:", rows.map(r => r.id));
        const { error: delError } = await supabase
            .from('social_integrations')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

        if (delError) console.error("Delete failed:", delError);
        else console.log("All rows deleted. State reset.");
    } else {
        console.log("Database is already clean.");
    }
}

cleanDuplicates();

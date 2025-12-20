import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local or .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim();
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY?.trim();
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL?.trim();

const missing = [];
if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
if (!CLOUDFLARE_ACCOUNT_ID) missing.push('CLOUDFLARE_ACCOUNT_ID');

// Check for either Token OR (Key + Email)
if (!CLOUDFLARE_API_TOKEN && (!CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL)) {
    missing.push('CLOUDFLARE_API_TOKEN OR (CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL)');
}

if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(m => console.error(` - ${m}`));
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (CLOUDFLARE_API_TOKEN) {
        headers['Authorization'] = `Bearer ${CLOUDFLARE_API_TOKEN}`;
    } else {
        headers['X-Auth-Email'] = CLOUDFLARE_EMAIL;
        headers['X-Auth-Key'] = CLOUDFLARE_API_KEY;
    }
    return headers;
}

async function verifyAuth() {
    console.log(`Verifying auth... Email: ${CLOUDFLARE_EMAIL || 'N/A'}`);
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts', {
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error(`Auth Verification Failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
        throw new Error(`Auth Verification API Error: ${JSON.stringify(data.errors)}`);
    }

    console.log('Available Accounts:');
    if (data.result) {
        data.result.forEach(acc => {
            console.log(` - ${acc.name} (ID: ${acc.id})`);
            if (acc.id === CLOUDFLARE_ACCOUNT_ID) {
                console.log(`   MATCHES configured CLOUDFLARE_ACCOUNT_ID`);
            }
        });
    }
    return true;
}

async function fetchCloudflareVideos() {
    console.log('Fetching videos from Cloudflare Stream...');
    const videos = [];

    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText} - ${errText}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(`Cloudflare API Failed: ${JSON.stringify(data.errors)}`);
        }

        if (data.result && Array.isArray(data.result)) {
            videos.push(...data.result);
        }

        console.log(`Found ${videos.length} videos in Cloudflare.`);
        return videos;
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}

function cleanExerciseName(filename) {
    if (!filename) return "Untitled Video";
    // Remove extension
    let name = filename.replace(/\.[^/.]+$/, "");
    // Replace underscores/hyphens with spaces
    name = name.replace(/[_-]/g, " ");
    // Title case (simple)
    return name.trim();
}

function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function syncVideos() {
    try {
        await verifyAuth();
        const cloudflareVideos = await fetchCloudflareVideos();

        if (cloudflareVideos.length === 0) {
            console.log('No videos found to sync.');
            return;
        }

        console.log('Syncing to Supabase...');

        let added = 0;
        let updated = 0;
        let failed = 0;

        for (const video of cloudflareVideos) {
            const name = video.meta?.name || cleanExerciseName(video.meta?.filename) || `Video ${video.uid}`;
            const slug = generateSlug(name);
            const videoId = video.uid;

            // Using the watch URL as the demo_url
            const demoUrl = `https://watch.cloudflarestream.com/${videoId}`;

            // Prepare Upsert Data
            const exerciseData = {
                slug: slug,
                name: name,
                demo_url: demoUrl,
                type: 'strength', // Default
                tags: ['synced-from-cloudflare']
            };

            // Upsert logic
            // Try to find by slug first
            const { data: existing } = await supabase.from('exercises').select('id').eq('slug', slug).maybeSingle();

            let result;
            if (existing) {
                // Update
                result = await supabase.from('exercises').update(exerciseData).eq('id', existing.id);
                if (!result.error) updated++;
            } else {
                // Insert
                result = await supabase.from('exercises').insert(exerciseData);
                if (!result.error) added++;
            }

            if (result.error) {
                console.error(`Failed to sync ${name}:`, result.error.message);
                failed++;
            } else {
                // console.log(`Synced: ${name}`);
            }
        }

        console.log('Sync Complete.');
        console.log(`Added: ${added}`);
        console.log(`Updated: ${updated}`);
        console.log(`Failed: ${failed}`);

    } catch (err) {
        console.error('Fatal Error during sync:', err);
    }
}

syncVideos();

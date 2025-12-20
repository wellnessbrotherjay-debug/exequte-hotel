
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENV_PATH = path.resolve(__dirname, "..", ".env.local")
const ENV_EXAMPLE_PATH = path.resolve(__dirname, "..", ".env.example")

function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`Environment file not found at ${filePath}`)
        return
    }

    const text = fs.readFileSync(filePath, "utf-8")

    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue
        const [key, ...rest] = trimmed.split("=")
        const value = rest.join("=").trim()
        if (value && !process.env[key]) {
            process.env[key] = value
        }
    }
}

loadEnv(ENV_PATH)
loadEnv(ENV_EXAMPLE_PATH)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
    console.error("Missing Supabase credentials")
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function checkExercises() {
    console.log('Checking exercises table...')
    const { data, error } = await supabase
        .from('exercises')
        .select('name, slug, demo_url')
        .limit(10)

    if (error) {
        console.error('Error fetching exercises:', error)
        return
    }

    console.log('Found exercises:', JSON.stringify(data, null, 2))
}

checkExercises()

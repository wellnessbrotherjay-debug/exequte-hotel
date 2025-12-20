import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENV_PATH = path.resolve(__dirname, "..", ".env.local")

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Environment file not found at ${filePath}`)
  }

  const text = fs.readFileSync(filePath, "utf-8")

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [key, ...rest] = trimmed.split("=")
    const value = rest.join("=").trim()
    if (value) {
      process.env[key] = value
    }
  }
}

loadEnv(ENV_PATH)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase credentials; make sure .env.local defines NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY"
  )
}

const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const checks = [
  { name: "brand_settings", select: "slug,name,created_at" },
  { name: "exercise_library", select: "id,exercise_name" },
  { name: "equipment_library", select: "id,equipment_name" },
]

const apiEndpoints = [
  "/api/admin/exercise-library",
  "/api/admin/equipment-library",
]

async function checkTables() {
  console.log("Checking Supabase tables via service role key:")
  const failures = []
  for (const table of checks) {
    try {
      const { error, data } = await serviceClient
        .from(table.name)
        .select(table.select)
        .limit(1)
      if (error) {
        console.warn(`[FAIL] ${table.name}: ${error.message} (code ${error.code})`)
        failures.push(table.name)
      } else {
        console.log(`[OK]   ${table.name}: ${data?.length ?? 0} rows readable`)
      }
    } catch (err) {
      console.warn(`[FAIL] ${table.name}: ${err instanceof Error ? err.message : err}`)
      failures.push(table.name)
    }
  }
  return failures
}

async function checkLocalApis() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100"
  if (!base) {
    console.warn("Skipping API checks because NEXT_PUBLIC_SITE_URL is not set")
    return
  }
  console.log(`\nChecking local API routes under ${base}:`)
  for (const endpoint of apiEndpoints) {
    const url = new URL(endpoint, base)
    try {
      const response = await fetch(url)
      console.log(
        `[${response.status}] ${endpoint} -> ${response.statusText}${
          response.ok ? "" : ` (${await response.text().catch(() => "body unavailable")})`
        }`
      )
    } catch (err) {
      console.warn(`[ERR] ${endpoint}: ${err instanceof Error ? err.message : err}`)
    }
  }
}

async function main() {
  const tableFailures = await checkTables()
  await checkLocalApis()
  if (tableFailures.length > 0) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error("Supabase check failed:", err)
  process.exitCode = 1
})

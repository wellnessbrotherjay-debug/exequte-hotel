#!/usr/bin/env node
/*
 Run SQL migration files against a Postgres DATABASE_URL.

 Usage:
   1. Install dependencies: npm install pg
   2. Set env var: export DATABASE_URL="postgres://user:pass@host:5432/dbname"
   3. Run: node scripts/run_migrations.js supabase/migrations/20251116093000_brand_theme_and_queue.sql

 This script is intentionally simple: it reads the SQL file, splits on
 ";" and runs statements one-by-one. It prints errors and exits with non-zero
 code on failure.
*/

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const args = process.argv.slice(2);
  if (!process.env.DATABASE_URL) {
    console.error('Please set DATABASE_URL env var (Postgres connection string).');
    process.exit(1);
  }
  if (args.length === 0) {
    console.error('Usage: node scripts/run_migrations.js path/to/file.sql');
    process.exit(1);
  }

  const file = path.resolve(process.cwd(), args[0]);
  if (!fs.existsSync(file)) {
    console.error('SQL file not found:', file);
    process.exit(1);
  }

  const sql = fs.readFileSync(file, 'utf8');

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to database. Running migration:', file);

    // Simple split by statement; keep blank-safe and ignore lines that are only whitespace.
    // NOTE: This is naive and may fail for $$ blocks; for complex SQL files consider using psql or supabase CLI.
    const statements = sql
      .split(/;\s*\n/) // split on semicolon + newline
      .map(s => s.trim())
      .filter(Boolean);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        console.log(`--- Executing statement ${i + 1}/${statements.length}`);
        await client.query(stmt);
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err.message || err);
        // Show the failing SQL fragment for debugging
        console.error('Failing SQL (truncated):', stmt.slice(0, 400));
        throw err;
      }
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

run();

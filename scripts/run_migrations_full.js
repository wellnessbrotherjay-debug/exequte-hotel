#!/usr/bin/env node
/*
 Run a SQL migration file as a single statement block. This avoids
 splitting on semicolons and preserves $$-delimited PL/pgSQL blocks.

 Usage:
   1. npm install pg
   2. export DATABASE_URL="postgres://user:pass@host:5432/dbname"
   3. node scripts/run_migrations_full.js supabase/migrations/20251116093000_brand_theme_and_queue.sql
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
    console.error('Usage: node scripts/run_migrations_full.js path/to/file.sql');
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
    console.log('Connected to database. Executing SQL file as one block:', file);
    await client.query(sql);
    console.log('Migration executed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

run();

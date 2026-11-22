import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.VITE_NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('missing neon connection string');
  process.exit(1);
}

const sql = neon(url);

async function run() {
  try {
    const cols = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'clicks' AND column_name = 'device'
    `;
    if (cols.length > 0) {
      await sql`ALTER TABLE clicks RENAME COLUMN device TO device_type`;
    }
  } catch {
    // legacy column check
  }

  const migrationSql = readFileSync(join(__dirname, '001_expand_clicks.sql'), 'utf-8');
  const statements = migrationSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await sql(stmt);
    } catch {
      // skip existing
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

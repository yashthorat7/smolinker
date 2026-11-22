import { neon } from '@neondatabase/serverless';

let sql;

export default function getSql() {
  if (!sql) {
    const url = import.meta.env.VITE_NEON_DATABASE_URL;
    if (!url || url === 'your_neon_connection_string_here') {
      throw new Error('VITE_NEON_DATABASE_URL is not configured');
    }
    sql = neon(url);
  }
  return sql;
}

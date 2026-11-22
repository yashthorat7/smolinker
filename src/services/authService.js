import getSql from './db';

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, storedHash] = stored.split(':');
  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex === storedHash;
}

export async function checkEmailExists(email) {
  const sql = getSql();
  const rows = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  return rows.length > 0;
}

export async function register(email, password) {
  const sql = getSql();
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length) throw new Error('email already registered');

  const hash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${hash})
    RETURNING id, email, created_at
  `;
  return rows[0];
}

export async function login(email, password) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, password_hash, created_at
    FROM users WHERE email = ${email} LIMIT 1
  `;
  if (!rows.length) throw new Error('invalid credentials');

  const valid = await verifyPassword(password, rows[0].password_hash);
  if (!valid) throw new Error('invalid credentials');

  const user = { ...rows[0] };
  delete user.password_hash;
  return user;
}

export async function updatePassword(email, newPassword) {
  const sql = getSql();
  const rows = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (!rows.length) throw new Error('email not found');

  const hash = await hashPassword(newPassword);
  await sql`
    UPDATE users
    SET password_hash = ${hash}
    WHERE email = ${email}
  `;
  return true;
}

import getSql from './db';

export async function getLongUrl(id) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, original_url
    FROM urls
    WHERE short_url = ${id} OR custom_url = ${id}
    LIMIT 1
  `;
  return rows[0];
}

export async function createUrl({ title, longUrl, customUrl, userId }) {
  const sql = getSql();
  const shortUrl = Math.random().toString(36).substring(2, 6);
  const rows = await sql`
    INSERT INTO urls (title, original_url, short_url, custom_url, user_id)
    VALUES (${title}, ${longUrl}, ${shortUrl}, ${customUrl || null}, ${userId})
    RETURNING *
  `;
  return rows[0];
}

export async function getUserUrls(userId) {
  const sql = getSql();
  return await sql`
    SELECT u.id, u.title, u.original_url, u.short_url, u.custom_url, u.created_at,
           COUNT(c.id)::int AS clicks
    FROM urls u
    LEFT JOIN clicks c ON c.url_id = u.id
    WHERE u.user_id = ${userId}
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
}

export async function deleteUrl(id) {
  const sql = getSql();
  await sql`DELETE FROM clicks WHERE url_id = ${id}`;
  await sql`DELETE FROM urls WHERE id = ${id}`;
}

export async function deleteMultipleUrls(ids) {
  if (!ids || !ids.length) return;
  const sql = getSql();
  for (const id of ids) {
    await sql`DELETE FROM clicks WHERE url_id = ${id}`;
    await sql`DELETE FROM urls WHERE id = ${id}`;
  }
}

export async function updateOriginalUrl(id, newUrl) {
  const sql = getSql();
  const rows = await sql`
    UPDATE urls
    SET original_url = ${newUrl}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

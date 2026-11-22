import getSql from './db';
import { collectClickData } from './fingerprint';

export async function storeClicks({ id }) {
  const sql = getSql();
  const env = await collectClickData();

  await sql`
    INSERT INTO clicks (
      url_id,
      ip_address,
      city,
      country,
      region,
      isp,
      timezone,
      latitude,
      longitude,
      device_type,
      browser,
      browser_version,
      os,
      os_version,
      user_agent,
      screen_width,
      screen_height,
      language,
      referrer,
      is_touch
    ) VALUES (
      ${id},
      ${env.ip_address},
      ${env.city},
      ${env.country},
      ${env.region},
      ${env.isp},
      ${env.timezone},
      ${env.latitude},
      ${env.longitude},
      ${env.device_type},
      ${env.browser},
      ${env.browser_version},
      ${env.os},
      ${env.os_version},
      ${env.user_agent},
      ${env.screen_width},
      ${env.screen_height},
      ${env.language},
      ${env.referrer},
      ${env.is_touch}
    )
  `;
}

export async function getUrlClicks(urlId) {
  const sql = getSql();
  return await sql`
    SELECT
      id,
      ip_address,
      city,
      country,
      region,
      isp,
      timezone,
      latitude,
      longitude,
      device_type,
      browser,
      browser_version,
      os,
      os_version,
      user_agent,
      screen_width,
      screen_height,
      language,
      referrer,
      is_touch,
      created_at
    FROM clicks
    WHERE url_id = ${urlId}
    ORDER BY created_at DESC
  `;
}

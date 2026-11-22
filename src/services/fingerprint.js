function parseUserAgent(ua) {
  const result = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
    deviceType: 'Desktop',
  };

  if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) {
    result.deviceType = 'Mobile';
  } else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    result.deviceType = 'Tablet';
  }

  if (/Edg\//i.test(ua)) {
    result.browser = 'Edge';
    result.browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    result.browser = 'Opera';
    result.browserVersion = ua.match(/(?:OPR|Opera)\/([\d.]+)/)?.[1] || '';
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    result.browser = 'Chrome';
    result.browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    result.browser = 'Safari';
    result.browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || '';
  } else if (/Firefox\//i.test(ua)) {
    result.browser = 'Firefox';
    result.browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
  }

  if (/Windows NT/i.test(ua)) {
    result.os = 'Windows';
    const ver = ua.match(/Windows NT ([\d.]+)/)?.[1];
    const winMap = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    result.osVersion = winMap[ver] || ver || '';
  } else if (/Mac OS X/i.test(ua)) {
    result.os = 'macOS';
    result.osVersion = ua.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (/Android/i.test(ua)) {
    result.os = 'Android';
    result.osVersion = ua.match(/Android ([\d.]+)/)?.[1] || '';
  } else if (/iPhone OS|iPad/i.test(ua)) {
    result.os = 'iOS';
    result.osVersion = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (/Linux/i.test(ua)) {
    result.os = 'Linux';
  } else if (/CrOS/i.test(ua)) {
    result.os = 'Chrome OS';
  }

  return result;
}

async function fetchIpGeo() {
  const fallback = {
    ip: null,
    city: null,
    country: null,
    region: null,
    isp: null,
    timezone: null,
    lat: null,
    lon: null,
  };

  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(1200),
    });
    if (res.ok) {
      const d = await res.json();
      if (d && d.success !== false) {
        return {
          ip: d.ip || null,
          city: d.city || null,
          country: d.country || null,
          region: d.region || null,
          isp: d.connection?.isp || null,
          timezone: d.timezone?.id || null,
          lat: d.latitude || null,
          lon: d.longitude || null,
        };
      }
    }
  } catch {
    // try fallback
  }

  try {
    const res = await fetch('https://freeipapi.com/api/json', {
      signal: AbortSignal.timeout(1000),
    });
    if (res.ok) {
      const d = await res.json();
      return {
        ip: d.ipAddress || null,
        city: d.cityName || null,
        country: d.countryName || null,
        region: d.regionName || null,
        isp: null,
        timezone: d.timeZones?.[0] || null,
        lat: d.latitude || null,
        lon: d.longitude || null,
      };
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export async function collectClickData() {
  const ua = navigator.userAgent || '';
  const parsed = parseUserAgent(ua);
  const geo = await fetchIpGeo();

  return {
    ip_address: geo.ip,
    city: geo.city,
    country: geo.country,
    region: geo.region,
    isp: geo.isp,
    timezone: geo.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    latitude: geo.lat,
    longitude: geo.lon,
    device_type: parsed.deviceType,
    browser: parsed.browser,
    browser_version: parsed.browserVersion,
    os: parsed.os,
    os_version: parsed.osVersion,
    user_agent: ua,
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    language: navigator.language || null,
    referrer: document.referrer || null,
    is_touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
}

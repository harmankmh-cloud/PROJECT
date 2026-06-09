/**
 * Auto-discover local business websites by sector + city.
 * Sources: DuckDuckGo search + OpenStreetMap Overpass (no API keys).
 */

const BLOCKED_HOSTS =
  /^(www\.)?(google|facebook|instagram|twitter|x|linkedin|youtube|yelp|yellowpages|bbb\.org|mapquest|tripadvisor|healthgrades|ratemds|zocdoc|canada411|411|wikipedia|reddit|pinterest|tiktok|indeed|glassdoor|fraservalleylocal|chamber|gov|whatclinic|dentistsranked|medseek|opencare|toprated|bestpros|homestars|houzz|angi|thumbtack)\./i;

const AGGREGATOR_PATHS = /\/(search|listing|profile|biz\/|maps\/|place\/)/i;

const CITY_BBOX = {
  abbotsford: { south: 49.0, west: -122.5, north: 49.1, east: -122.2 },
  chilliwack: { south: 49.1, west: -122.0, north: 49.2, east: -121.8 },
  langley: { south: 49.0, west: -122.7, north: 49.2, east: -122.5 },
  surrey: { south: 49.0, west: -122.9, north: 49.25, east: -122.6 },
  vancouver: { south: 49.2, west: -123.25, north: 49.35, east: -123.0 },
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeUrl(raw) {
  try {
    let href = raw.trim();
    if (href.includes("uddg=")) {
      const m = href.match(/uddg=([^&]+)/);
      if (m) href = decodeURIComponent(m[1]);
    }
    if (!href.startsWith("http")) href = `https://${href}`;
    const u = new URL(href);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    u.hash = "";
    return u.origin;
  } catch {
    return null;
  }
}

function hostOk(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (BLOCKED_HOSTS.test(host)) return false;
    if (AGGREGATOR_PATHS.test(url)) return false;
    if (host.endsWith(".ca") || host.endsWith(".com") || host.endsWith(".net")) return true;
    return host.split(".").length >= 2;
  } catch {
    return false;
  }
}

export async function ddgSearch(query, limit = 15) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "GreetQ-LeadAgent/1.0",
      Accept: "text/html",
    },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const found = new Set();
  for (const m of html.matchAll(/class="result__a"[^>]*href="([^"]+)"/gi)) {
    const norm = normalizeUrl(m[1]);
    if (norm && hostOk(norm)) found.add(norm);
    if (found.size >= limit) break;
  }
  for (const m of html.matchAll(/uddg=([^&"]+)/gi)) {
    const norm = normalizeUrl(decodeURIComponent(m[1]));
    if (norm && hostOk(norm)) found.add(norm);
    if (found.size >= limit) break;
  }
  return [...found];
}

function overpassTagToFilter(tag) {
  const [k, v] = tag.split("=");
  return `["${k}"="${v}"]`;
}

export async function overpassDiscover(city, tags, limit = 30) {
  const key = city.toLowerCase().replace(/[^a-z]/g, "");
  const bbox = CITY_BBOX[key];
  if (!bbox || !tags.length) return [];

  const filters = tags.map(overpassTagToFilter).join("");
  const query = `[out:json][timeout:25];
(
  node${filters}(${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way${filters}(${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out body 100;
>;
out skel qt;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return [];
  const data = await res.json();
  const results = [];
  for (const el of data.elements || []) {
    const website = el.tags?.website || el.tags?.["contact:website"];
    if (!website) continue;
    const norm = normalizeUrl(website);
    if (!norm || !hostOk(norm)) continue;
    const name = el.tags?.name || new URL(norm).hostname;
    results.push({ business_name: name, website: norm });
    if (results.length >= limit) break;
  }
  return results;
}

export async function discoverSector({ sector, city, limit = 50 }) {
  const businesses = new Map();

  for (const q of sector.queries || []) {
    const query = q.replace(/\{city\}/g, city);
    const urls = await ddgSearch(query, Math.ceil(limit / sector.queries.length) + 5);
    for (const website of urls) {
      if (businesses.size >= limit) break;
      const host = new URL(website).hostname.replace(/^www\./, "");
      if (!businesses.has(host)) {
        businesses.set(host, {
          business_name: host.split(".")[0].replace(/-/g, " "),
          website,
          vertical: sector.vertical,
          source: "search",
        });
      }
    }
    await sleep(1200);
    if (businesses.size >= limit) break;
  }

  const osm = await overpassDiscover(city, sector.overpass || [], limit);
  for (const b of osm) {
    if (businesses.size >= limit) break;
    const host = new URL(b.website).hostname.replace(/^www\./, "");
    if (!businesses.has(host)) {
      businesses.set(host, {
        business_name: b.business_name,
        website: b.website,
        vertical: sector.vertical,
        source: "osm",
      });
    }
  }

  return [...businesses.values()].slice(0, limit);
}

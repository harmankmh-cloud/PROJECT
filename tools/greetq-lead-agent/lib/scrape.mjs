/** Email extraction from business websites — shared scrape core */

const EMAIL_RE =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;

const JUNK_EMAIL =
  /(noreply|no-reply|donotreply|sentry|wixpress|example\.com|@2x\.|\.png|\.jpg|cloudflare|facebook|instagram|twitter|linkedin|youtube|google|schema\.org)/i;

const CONTACT_PATH_RE = /contact|about|team|staff|connect|reach|location|office|book|appointment/i;

const MAX_PAGES = 5;
const FETCH_TIMEOUT_MS = 10_000;

function decodeCfEmail(hex) {
  try {
    const key = parseInt(hex.slice(0, 2), 16);
    let out = "";
    for (let i = 2; i < hex.length; i += 2) {
      out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    }
    return out;
  } catch {
    return null;
  }
}

function extractEmails(html, pageUrl) {
  const found = new Set();
  for (const m of html.matchAll(/data-cfemail="([a-f0-9]+)"/gi)) {
    const d = decodeCfEmail(m[1]);
    if (d?.includes("@")) found.add(d.toLowerCase());
  }
  for (const m of html.matchAll(/mailto:([^\s"'<>?#]+)/gi)) {
    const raw = decodeURIComponent(m[1].split("?")[0].trim().toLowerCase());
    if (!raw.includes("%")) found.add(raw);
  }
  for (const m of html.matchAll(EMAIL_RE)) {
    const e = m[0].toLowerCase().replace(/\.$/, "").replace(/^%20+/, "");
    if (!e.includes("%")) found.add(e);
  }
  const host = new URL(pageUrl).hostname.replace(/^www\./, "");
  return [...found].filter((e) => {
    if (JUNK_EMAIL.test(e)) return false;
    const domain = e.split("@")[1] || "";
    const pageBase = host.split(".").slice(-2).join(".");
    const emailBase = domain.split(".").slice(-2).join(".");
    return emailBase === pageBase || domain.endsWith(pageBase) || host.endsWith(emailBase);
  });
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GreetQ-LeadAgent/1.0",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return { html: await res.text(), url: res.url || url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function seedUrls(website) {
  const start = website.startsWith("http") ? website : `https://${website}`;
  const base = new URL(start);
  const paths = ["", "/contact", "/contact-us", "/about", "/about-us"];
  const hosts = [base.origin];
  if (!base.hostname.startsWith("www.")) hosts.push(`${base.protocol}//www.${base.hostname}`);
  return [...new Set(hosts.flatMap((h) => paths.map((p) => `${h}${p}`)))];
}

export async function scrapeEmail(website) {
  const queue = seedUrls(website);
  const visited = new Set();
  const emails = new Set();

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    const page = await fetchHtml(url);
    if (!page?.html) continue;

    for (const e of extractEmails(page.html, page.url)) emails.add(e);
    if (emails.size) return [...emails];

    const base = new URL(page.url);
    for (const m of page.html.matchAll(/href=["']([^"'#]+)["']/gi)) {
      try {
        const u = new URL(m[1], page.url);
        if (u.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
        if (CONTACT_PATH_RE.test(u.pathname) && !visited.has(u.href)) queue.push(u.href.split("#")[0]);
      } catch {
        /* skip */
      }
    }
  }
  return [...emails];
}

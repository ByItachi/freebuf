/**
 * Downloads every connector icon in the catalog into public/connectors/<id>.svg.
 *
 * Sources, tried in order:
 *   1. lovable.dev asset CDN (multi-color brand marks, matches the reference UI)
 *   2. svgl.app API (by title)
 *   3. simple-icons CDN (by slug, monochrome)
 *   4. locally generated letter tile (for generic connectors like IMAP/Webhook)
 *
 * Run with: node scripts/fetch-connector-icons.mjs
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/connectors");
mkdirSync(OUT_DIR, { recursive: true });

/** id -> candidate sources beyond the lovable CDN. */
const EXTRA_SOURCES = {
  gmail: [["svgl", "Gmail"], ["si", "gmail"]],
  "google-search-console": [["si", "googlesearchconsole"]],
  "google-sheets": [["svgl", "Google Sheets"], ["si", "googlesheets"]],
  "google-maps": [["svgl", "Google Maps"], ["si", "googlemaps"]],
  "google-drive": [["svgl", "Google Drive"], ["si", "googledrive"]],
  "google-calendar": [["svgl", "Google Calendar"], ["si", "googlecalendar"]],
  sendgrid: [["si", "sendgrid"]],
  mailchimp: [["si", "mailchimp"]],
  teams: [["svgl", "Microsoft Teams"], ["si", "microsoftteams"]],
  outlook: [["svgl", "Microsoft Outlook"], ["si", "microsoftoutlook"]],
  onedrive: [["svgl", "Microsoft OneDrive"], ["si", "microsoftonedrive"]],
  excel: [["svgl", "Microsoft Excel"], ["si", "microsoftexcel"]],
  powerbi: [["si", "powerbi"]],
  dynamics: [["si", "microsoftdynamics365"]],
  "azure-sql": [["svgl", "Microsoft Azure"], ["si", "microsoftazure"]],
  adwords: [["si", "googleads"]],
  analytics: [["svgl", "Google Analytics"], ["si", "googleanalytics"]],
  "tag-manager": [["si", "googletagmanager"]],
  meet: [["svgl", "Google Meet"], ["si", "googlemeet"]],
  tasks: [["si", "googletasks"]],
  contacts: [],
  bigquery: [["si", "googlebigquery"], ["svgl", "Google Cloud"]],
  "twilio-sms": [["copy", "twilio"]],
  klaviyo: [["si", "klaviyo"]],
  braintree: [["si", "braintree"]],
  paypal: [["svgl", "PayPal"], ["si", "paypal"]],
  "lemon-squeezy": [["svgl", "Lemon Squeezy"], ["si", "lemonsqueezy"]],
  gumroad: [["si", "gumroad"]],
  close: [],
  "zendesk-sell": [["si", "zendesk"]],
  "telegram-bot": [["copy", "telegram"]],
  "teams-phone": [["copy", "teams"]],
  sharepoint: [["svgl", "Microsoft SharePoint"], ["si", "microsoftsharepoint"]],
  copilot: [["svgl", "Microsoft Copilot"], ["si", "microsoftcopilot"]],
  defender: [["svgl", "Microsoft Defender"], ["si", "microsoftdefender"]],
  bing: [["svgl", "Bing"], ["si", "bing"]],
  imap: [],
  smtp: [],
  webhook: [["si", "webhooks"]],
  rss: [["si", "rss"]],
  sqlite: [["svgl", "SQLite"], ["si", "sqlite"]],
  postgres: [["svgl", "PostgreSQL"], ["si", "postgresql"]],
  mysql: [["svgl", "MySQL"], ["si", "mysql"]],
  s3: [["svgl", "Amazon Web Services"], ["si", "amazons3"]],
  "aws-athena": [["svgl", "Amazon Web Services"], ["si", "amazonwebservices"]],
};

/** Fallback letter-tile colors for generic connectors. */
const FALLBACK_COLORS = {
  contacts: "#4285f4",
  close: "#3b82f6",
  imap: "#64748b",
  smtp: "#64748b",
  webhook: "#0ea5e9",
  powerbi: "#f2c811",
  dynamics: "#002050",
  adwords: "#4285f4",
  "tag-manager": "#246fdb",
  tasks: "#4285f4",
};

const LOVABLE_CDN =
  "https://lovable.dev/cdn-cgi/image/width=160,f=auto,fit=scale-down/https://assets.lovable.dev/img/connectors/";

let svglByTitle = null;
async function getSvglIndex() {
  if (svglByTitle) return svglByTitle;
  try {
    const res = await fetch("https://api.svgl.app");
    const list = await res.json();
    svglByTitle = new Map(list.map((x) => [String(x.title).toLowerCase(), x]));
  } catch (err) {
    console.warn("svgl index unavailable:", err.message);
    svglByTitle = new Map();
  }
  return svglByTitle;
}

function svglUrl(entry) {
  const r = entry?.route;
  if (!r) return null;
  if (typeof r === "string") return r;
  return r.light || r.dark || r.default || Object.values(r)[0] || null;
}

function looksLikeSvg(text) {
  return typeof text === "string" && text.includes("<svg");
}

async function tryFetch(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const text = await res.text();
    return looksLikeSvg(text) ? text : null;
  } catch {
    return null;
  }
}

async function fetchSource([kind, value]) {
  if (kind === "svgl") {
    const index = await getSvglIndex();
    const entry = index.get(value.toLowerCase());
    const url = svglUrl(entry);
    return url ? tryFetch(url) : null;
  }
  if (kind === "si") {
    return tryFetch(`https://cdn.simpleicons.org/${value}`);
  }
  if (kind === "copy") {
    const p = path.join(OUT_DIR, `${value}.svg`);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  }
  return null;
}

function letterTile(id, letter, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="${color}"/><text x="24" y="31" font-family="Inter,system-ui,sans-serif" font-size="20" font-weight="600" fill="#fff" text-anchor="middle">${letter}</text></svg>`;
}

async function main() {
  const ids = [
    "cloud", "ai", "gmail", "stripe", "paddle", "shopify", "aws-athena", "algolia",
    "linkedin", "replicate", "salesforce", "google-search-console", "firecrawl",
    "google-sheets", "google-maps", "resend", "google-drive", "google-calendar",
    "supabase", "slack", "github", "twilio", "sendgrid", "hubspot", "mailchimp",
    "discord", "telegram", "whatsapp", "teams", "outlook", "onedrive", "excel",
    "powerbi", "dynamics", "azure-sql", "adwords", "analytics", "tag-manager",
    "youtube", "meet", "tasks", "contacts", "zapier", "airtable", "linear",
    "notion", "figma", "sentry", "posthog", "snowflake", "bigquery", "twilio-sms",
    "klaviyo", "braintree", "paypal", "lemon-squeezy", "gumroad", "close",
    "zendesk-sell", "telegram-bot", "teams-phone", "sharepoint", "copilot",
    "defender", "bing", "imap", "smtp", "webhook", "rss", "sqlite", "postgres",
    "mysql", "mongodb", "redis", "s3",
  ];

  let ok = 0;
  const failed = [];

  for (const id of ids) {
    const file = path.join(OUT_DIR, `${id}.svg`);

    // 1. lovable CDN (best match for the reference UI)
    let svg = await tryFetch(`${LOVABLE_CDN}${id}.svg`);
    let source = "lovable";

    // 2-3. svgl / simple-icons / copy
    if (!svg) {
      for (const src of EXTRA_SOURCES[id] ?? []) {
        svg = await fetchSource(src);
        if (svg) {
          source = src[0];
          break;
        }
      }
    }

    // 4. letter tile fallback
    if (!svg) {
      svg = letterTile(id, (id[0] ?? "?").toUpperCase(), FALLBACK_COLORS[id] ?? "#94a3b8");
      source = "fallback";
    }

    writeFileSync(file, svg);
    ok++;
    console.log(`${source.padEnd(8)} ${id}.svg`);
  }

  console.log(`\nDone: ${ok}/${ids.length} icons in public/connectors`);
  if (failed.length) console.log("Failed:", failed.join(", "));
}

main();

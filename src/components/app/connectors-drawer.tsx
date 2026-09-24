"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Connector = {
  id: string;
  name: string;
  desc: string;
  category: Category;
  enabledByDefault?: boolean;
  isNew?: boolean;
};

type Category = "Marketing" | "Messaging" | "Productivity" | "Sales" | "Google" | "Microsoft";

/**
 * The visible catalog mirrors the reference UI: two always-on platform
 * connectors (Cloud, AI) plus third-party ones grouped by category.
 */
const CONNECTORS: Connector[] = [
  { id: "cloud", name: "Cloud", desc: "Built-in backend, ready to use", category: "Productivity", enabledByDefault: true },
  { id: "ai", name: "AI", desc: "Unlock powerful AI features", category: "Productivity", enabledByDefault: true },
  { id: "gmail", name: "Gmail", desc: "Read, send, and manage your emails", category: "Google", enabledByDefault: true },
  { id: "stripe", name: "Stripe", desc: "Set up payments", category: "Sales", enabledByDefault: true },
  { id: "paddle", name: "Paddle", desc: "Set up payments with tax handled for you", category: "Sales", enabledByDefault: true },
  { id: "shopify", name: "Shopify", desc: "Build an eCommerce store", category: "Sales", enabledByDefault: true },
  { id: "aws-athena", name: "AWS Athena", desc: "Run SQL queries on data in S3 with AWS Athena", category: "Productivity", isNew: true },
  { id: "algolia", name: "Algolia", desc: "Search and indexing engine", category: "Productivity", isNew: true },
  { id: "linkedin", name: "LinkedIn", desc: "Build LinkedIn profile and posting integrations", category: "Marketing", isNew: true },
  { id: "replicate", name: "Replicate", desc: "Run open-source AI models for image, video, and audio generation", category: "Productivity", isNew: true },
  { id: "salesforce", name: "Salesforce", desc: "Connect your Salesforce CRM data to your app", category: "Sales", isNew: true },
  { id: "google-search-console", name: "Google Search Console", desc: "Read Search Console analytics and manage sites", category: "Google" },
  { id: "firecrawl", name: "Firecrawl", desc: "AI-powered scraper, search and retrieval tool", category: "Productivity" },
  { id: "google-sheets", name: "Google Sheets", desc: "Read and update spreadsheet data", category: "Google" },
  { id: "google-maps", name: "Google Maps Platform", desc: "Maps, geocoding, directions, and places APIs", category: "Google" },
  { id: "resend", name: "Resend", desc: "Email API for developers", category: "Marketing" },
  { id: "google-drive", name: "Google Drive", desc: "Upload and download files to and from Google Drive", category: "Google" },
  { id: "google-calendar", name: "Google Calendar", desc: "Create and manage Google Calendar events", category: "Google" },
  { id: "supabase", name: "Supabase", desc: "Auth, database, and storage", category: "Productivity" },
  { id: "slack", name: "Slack", desc: "Notifications and commands", category: "Messaging" },
  { id: "github", name: "GitHub", desc: "Import repos and sync commits", category: "Microsoft" },
  { id: "twilio", name: "Twilio", desc: "SMS, voice, and verification APIs", category: "Messaging" },
  { id: "sendgrid", name: "SendGrid", desc: "Transactional email delivery", category: "Marketing" },
  { id: "hubspot", name: "HubSpot", desc: "CRM, marketing, and sales automation", category: "Marketing" },
  { id: "mailchimp", name: "Mailchimp", desc: "Email campaigns and audiences", category: "Marketing" },
  { id: "discord", name: "Discord", desc: "Community bot and notifications", category: "Messaging" },
  { id: "telegram", name: "Telegram", desc: "Bots and channel broadcasts", category: "Messaging" },
  { id: "whatsapp", name: "WhatsApp", desc: "Business messaging via WhatsApp Cloud API", category: "Messaging" },
  { id: "teams", name: "Microsoft Teams", desc: "Notifications and adaptive cards", category: "Microsoft" },
  { id: "outlook", name: "Outlook", desc: "Read and send email via Microsoft Graph", category: "Microsoft" },
  { id: "onedrive", name: "OneDrive", desc: "Files in the user's OneDrive", category: "Microsoft" },
  { id: "excel", name: "Excel", desc: "Read and write Excel workbooks", category: "Microsoft" },
  { id: "powerbi", name: "Power BI", desc: "Embed Power BI reports and datasets", category: "Microsoft" },
  { id: "dynamics", name: "Dynamics 365", desc: "Business apps and CRM data", category: "Microsoft" },
  { id: "azure-sql", name: "Azure SQL", desc: "Query Azure SQL databases", category: "Microsoft" },
  { id: "adwords", name: "Google Ads", desc: "Campaign and performance data", category: "Marketing" },
  { id: "analytics", name: "Google Analytics", desc: "Traffic and conversion reporting", category: "Marketing" },
  { id: "tag-manager", name: "Google Tag Manager", desc: "Manage marketing tags", category: "Marketing" },
  { id: "youtube", name: "YouTube", desc: "Video stats and channel management", category: "Marketing" },
  { id: "meet", name: "Google Meet", desc: "Create and manage meetings", category: "Google" },
  { id: "tasks", name: "Google Tasks", desc: "Read and write task lists", category: "Google" },
  { id: "contacts", name: "Google Contacts", desc: "Sync contact data", category: "Google" },
  { id: "zapier", name: "Zapier", desc: "Automate across 6,000+ apps", category: "Productivity" },
  { id: "airtable", name: "Airtable", desc: "Bases, tables, and records", category: "Productivity" },
  { id: "linear", name: "Linear", desc: "Issues, projects, and cycles", category: "Productivity" },
  { id: "notion", name: "Notion", desc: "Docs and knowledge sync", category: "Productivity" },
  { id: "figma", name: "Figma", desc: "Design tokens and assets", category: "Productivity" },
  { id: "sentry", name: "Sentry", desc: "Error tracking and releases", category: "Productivity" },
  { id: "posthog", name: "PostHog", desc: "Product analytics and feature flags", category: "Productivity" },
  { id: "snowflake", name: "Snowflake", desc: "Warehouse queries at scale", category: "Productivity" },
  { id: "bigquery", name: "BigQuery", desc: "Run SQL on your data warehouse", category: "Google" },
  { id: "twilio-sms", name: "Twilio Verify", desc: "OTP verification flows", category: "Messaging" },
  { id: "klaviyo", name: "Klaviyo", desc: "Ecommerce email and SMS", category: "Marketing" },
  { id: "braintree", name: "Braintree", desc: "Payments by PayPal", category: "Sales" },
  { id: "paypal", name: "PayPal", desc: "Checkout and payouts", category: "Sales" },
  { id: "lemon-squeezy", name: "Lemon Squeezy", desc: "Digital products and subscriptions", category: "Sales" },
  { id: "gumroad", name: "Gumroad", desc: "Sell directly to your audience", category: "Sales" },
  { id: "close", name: "Close", desc: "Sales CRM for startups", category: "Sales" },
  { id: "zendesk-sell", name: "Zendesk Sell", desc: "Modern sales CRM", category: "Sales" },
  { id: "telegram-bot", name: "Telegram for Business", desc: "Customer chats at scale", category: "Messaging" },
  { id: "teams-phone", name: "Teams Phone", desc: "Calls and voicemail", category: "Microsoft" },
  { id: "sharepoint", name: "SharePoint", desc: "Intranet sites and document libraries", category: "Microsoft" },
  { id: "copilot", name: "Microsoft Copilot", desc: "AI assistance across Microsoft 365", category: "Microsoft" },
  { id: "defender", name: "Microsoft Defender", desc: "Security signals and incidents", category: "Microsoft" },
  { id: "bing", name: "Bing Search", desc: "Web search results and news", category: "Microsoft" },
  { id: "imap", name: "IMAP", desc: "Any mailbox that speaks IMAP", category: "Messaging" },
  { id: "smtp", name: "SMTP", desc: "Send from any email provider", category: "Messaging" },
  { id: "webhook", name: "Webhook", desc: "Call any HTTP endpoint", category: "Productivity" },
  { id: "rss", name: "RSS", desc: "Follow feeds and publish updates", category: "Marketing" },
  { id: "sqlite", name: "SQLite", desc: "Built-in app database", category: "Productivity" },
  { id: "postgres", name: "Postgres", desc: "Bring your own database", category: "Productivity" },
  { id: "mysql", name: "MySQL", desc: "Bring your own database", category: "Productivity" },
  { id: "mongodb", name: "MongoDB", desc: "Document database", category: "Productivity" },
  { id: "redis", name: "Redis", desc: "Caching and queues", category: "Productivity" },
  { id: "s3", name: "Amazon S3", desc: "Object storage for files", category: "Productivity" },
];

/** All unique categories in catalog order. */
const CATEGORIES: Category[] = [
  "Marketing",
  "Messaging",
  "Productivity",
  "Sales",
  "Google",
  "Microsoft",
];

/** First 12 connector names for the hero pill cloud. */
const HERO_PILLS = CONNECTORS.slice(0, 12).map((c) => c.name);

const STORAGE = "freebuff.connectors";

function iconSrc(id: string) {
  // Local brand SVGs fetched into public/connectors by scripts/fetch-connector-icons.mjs
  return `/connectors/${id}.svg`;
}

function ConnectorIcon({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // safety net: letter tile if the local file is missing
    return (
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-linen-border bg-black/[0.06] text-[15px] font-semibold uppercase text-charcoal">
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-linen-border bg-parchment">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, no optimization pipeline needed */}
      <img
        src={iconSrc(id)}
        alt=""
        loading="lazy"
        className="size-7 object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function ConnectorsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"all" | "enabled">("all");
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [heroDismissed, setHeroDismissed] = useState(false);
  const [requested, setRequested] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const requestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (requestTimer.current) clearTimeout(requestTimer.current);
    };
  }, []);

  // hydrate override state (deferred so the eslint set-state rule passes)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) setOverrides(JSON.parse(raw) as Record<string, boolean>);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  // esc closes, body scroll locks, initial focus on close button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  const isEnabled = useCallback(
    (c: Connector) => overrides[c.id] ?? Boolean(c.enabledByDefault),
    [overrides],
  );

  const toggle = useCallback((id: string) => {
    setOverrides((s) => {
      const next = { ...s, [id]: !s[id] };
      try {
        localStorage.setItem(STORAGE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const enabledCount = useMemo(
    () => CONNECTORS.reduce((n, c) => n + (isEnabled(c) ? 1 : 0), 0),
    [isEnabled],
  );

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of CONNECTORS) m.set(c.category, (m.get(c.category) ?? 0) + 1);
    return m;
  }, []);

  const visible = useMemo(() => {
    let list = CONNECTORS;
    if (tab === "enabled") list = list.filter(isEnabled);
    if (category) list = list.filter((c) => c.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tab, category, query, isEnabled]);

  function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setRequested("Request received — we'll add it to the catalog soon.");
    if (requestTimer.current) clearTimeout(requestTimer.current);
    requestTimer.current = setTimeout(() => setRequested(null), 4000);
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-300",
        open ? "visible" : "invisible pointer-events-none",
      )}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/25 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* slide-over panel */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Connectors"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-linen-border bg-parchment shadow-2xl transition-transform duration-300 ease-out md:w-[min(1100px,calc(100vw-288px))]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* header */}
        <header className="flex min-h-14 shrink-0 items-center gap-2 border-b border-linen-border px-4 py-2.5 md:pl-5">
          <span className="flex size-5 items-center justify-center text-dim-gray">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
              <circle cx="6" cy="6" r="2.5" />
              <circle cx="6" cy="18" r="2.5" />
              <circle cx="18" cy="12" r="2.5" />
              <path d="M8.2 7.2 15.8 10.9M8.2 16.8 15.8 13.1" />
            </svg>
          </span>
          <span className="truncate text-[14px] font-medium tracking-tight text-charcoal">
            Connectors
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex size-8 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row">
          {/* left rail */}
          <aside className="flex w-full shrink-0 flex-col gap-3 p-3 md:w-60 md:border-r md:border-linen-border">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim-gray"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search connectors"
                className="w-full rounded-2xl border border-linen-border bg-warm-sand py-2.5 pl-9 pr-3 text-[13px] text-charcoal outline-none placeholder:text-dim-gray focus:border-stone"
              />
            </div>

            <nav aria-label="Connector filters" className="flex flex-col gap-0.5">
              {(
                [
                  ["enabled", "Enabled", enabledCount],
                  ["all", "All", CONNECTORS.length],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] transition-colors",
                    tab === key
                      ? "bg-black/[0.06] font-medium text-charcoal"
                      : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
                  )}
                >
                  <span>{label}</span>
                  <span className="tabular-nums text-dim-gray">{count}</span>
                </button>
              ))}
            </nav>

            <div className="hidden flex-col gap-0.5 md:flex">
              <p className="flex h-8 items-center px-3 text-[13px] font-normal text-charcoal">
                Categories
              </p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? null : cat)}
                  aria-pressed={category === cat}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] transition-colors",
                    category === cat
                      ? "bg-black/[0.06] font-medium text-charcoal"
                      : "text-dim-gray hover:bg-black/[0.03] hover:text-charcoal",
                  )}
                >
                  <span>{cat}</span>
                  <span className="tabular-nums text-dim-gray">
                    {categoryCounts.get(cat) ?? 0}
                  </span>
                </button>
              ))}
            </div>

            {/* request + admin */}
            <div className="mt-auto flex flex-col gap-2 rounded-2xl border border-linen-border bg-warm-sand p-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-4 text-dim-gray"
                aria-hidden
              >
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="12" r="2.5" />
                <path d="M8.2 7.2 15.8 10.9M8.2 16.8 15.8 13.1" />
              </svg>
              <p className="text-[13px] font-medium text-charcoal">Missing a connector?</p>
              <button
                type="button"
                onClick={submitRequest}
                className="w-full rounded-xl border border-linen-border bg-parchment px-3 py-2 text-[13px] text-charcoal transition-colors hover:border-stone"
              >
                Request
              </button>
              {requested ? (
                <p className="text-[11.5px] leading-snug text-dim-gray" role="status">
                  {requested}
                </p>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] text-dim-gray transition-colors hover:bg-black/[0.04] hover:text-charcoal"
              >
                <Settings className="size-3.5" />
                Admin settings
              </button>
            </div>
          </aside>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* hero (dismissible) */}
            {!heroDismissed ? (
              <div className="flex flex-col items-center gap-2 border-b border-linen-border px-6 pb-6 pt-8 text-center">
                <div className="flex max-w-lg flex-wrap items-center justify-center gap-1.5">
                  {HERO_PILLS.map((name, i) => (
                    <span
                      key={name}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full bg-black/[0.04] py-1.5 pl-1.5 pr-3 text-[12px] font-medium text-charcoal",
                        // fade the outer rings so the cloud reads as a soft cloud, like the reference
                        i < 4 || i >= 8 ? "opacity-45" : "",
                      )}
                    >
                      <ConnectorIcon id={CONNECTORS[i].id} name={name} />
                      {name}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-[24px] font-medium tracking-tight text-charcoal">
                  Build from what you already use
                </h2>
                <p className="max-w-md text-[13px] leading-relaxed text-dim-gray">
                  Connectors let your Freebuff app talk to external tools like Stripe, Slack, and
                  Google. Ask the agent to get started.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="/connect"
                    className="rounded-full border border-linen-border bg-warm-sand px-3.5 py-1.5 text-[12.5px] text-charcoal transition-colors hover:border-stone"
                  >
                    View the docs ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setHeroDismissed(true)}
                    className="rounded-full border border-linen-border bg-warm-sand px-3.5 py-1.5 text-[12.5px] text-charcoal transition-colors hover:border-stone"
                  >
                    Got it
                  </button>
                </div>
              </div>
            ) : null}

            {/* connector grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-6">
              <h3 className="text-[20px] font-medium tracking-tight text-charcoal">
                App connectors
              </h3>
              <p className="mt-1 text-[13.5px] text-dim-gray">
                Add functionality to your apps. Configured once by admins, available to your
                workspace.
              </p>

              {visible.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-dim-gray">
                  No connectors match — try another search or category.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-2">
                  {visible.map((c) => {
                    const active = isEnabled(c);
                    return (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-2xl border border-linen-border bg-warm-sand p-2.5 transition-shadow hover:shadow-sm"
                      >
                        <ConnectorIcon id={c.id} name={c.name} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[14px] font-medium tracking-tight text-charcoal">
                              {c.name}
                            </span>
                            {c.isNew ? (
                              <span className="shrink-0 rounded-md bg-[#eef2ff] px-1.5 py-0.5 text-[11px] font-medium text-[#4f46e5]">
                                New
                              </span>
                            ) : null}
                          </span>
                          <span className="block truncate text-[12.5px] text-dim-gray">
                            {c.desc}
                          </span>
                        </span>
                        {active ? (
                          <span className="shrink-0 rounded-lg bg-[#e7f4e4] px-2 py-1 text-[12px] font-medium text-[#1a7f37]">
                            Enabled
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggle(c.id)}
                            aria-pressed={false}
                            className="shrink-0 rounded-lg border border-linen-border bg-parchment px-2.5 py-1 text-[12px] text-charcoal transition-colors hover:border-stone"
                          >
                            Enable
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-6 border-t border-linen-border pt-4 text-[12px] text-dim-gray">
                Connections are saved on this device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConnectorsDrawer;

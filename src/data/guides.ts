export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
};

function g(
  slug: string,
  title: string,
  category: string,
  excerpt: string,
  body: string[],
): Guide {
  return { slug, title, category, excerpt, body };
}

export const GUIDES: Guide[] = [
  g(
    "best-ai-website-builder",
    "Best AI website builder",
    "Comparisons",
    "How the top AI website builders compare on design quality, speed and control.",
    [
      "AI website builders all promise the same thing — a site from a sentence — but they differ wildly once you look past the landing page. The three things that matter are design quality out of the box, how much control you keep, and whether you can export or extend the result.",
      "Builders that generate editable, real code win on control: you can refine anything, connect a database, and hand the project to a developer later. Closed builders are faster for a one-pager but trap you when you outgrow them.",
      "Evaluate with a real brief, not the demo prompt. Ask for your actual content, your colors and two pages — then judge the output. The best tools nail structure, spacing and mobile in one shot.",
    ],
  ),
  g(
    "how-to-build-a-marketplace-app",
    "How to build a marketplace app",
    "How-to",
    "Listings, search, payments and trust: the building blocks of a marketplace MVP.",
    [
      "A marketplace MVP needs four things: listings people can create and browse, search and filters, a way to transact, and trust signals like profiles and reviews.",
      "Start with the demand side. Build the browse and search experience first with realistic sample data, then add listing creation, then accounts.",
      "Payments can start simple — even 'contact seller' buttons validate demand before you wire up Stripe. Add reviews early; they compound into the trust that makes marketplaces work.",
    ],
  ),
  g(
    "lovable-vs-replit-platform-comparison",
    "Lovable vs Replit",
    "Comparisons",
    "Prompt-to-app speed versus full IDE power: which fits your project?",
    [
      "Lovable and Replit approach AI building from opposite ends. Lovable starts from a sentence and generates the whole app; Replit gives you a full IDE where AI assists inside a traditional workflow.",
      "If you want speed and design quality without touching config, prompt-first wins. If you want to live in the code, manage environments and deploy complex backends manually, an IDE-centric tool fits better.",
      "Many teams use both: prototype in Lovable in an afternoon, then export the code to GitHub for long-term engineering.",
    ],
  ),
  g(
    "lovable-vs-bolt",
    "Lovable vs Bolt",
    "Comparisons",
    "Two prompt-to-app builders compared on design, backends and iteration.",
    [
      "Both turn prompts into working apps with hosting included. The differences show up in design polish, backend depth and how edits behave on larger projects.",
      "Look for full-stack generation (auth, database, storage in one flow), visual editing for pixel tweaks, and version restore so experiments are never risky.",
      "The fastest way to decide is a bake-off: build the same landing page plus a simple database feature in both, and compare the third iteration — not just the first.",
    ],
  ),
  g(
    "best-vibe-coding-tools-2026-build-apps-chatting",
    "Best vibe coding tools",
    "Comparisons",
    "The chat-first app builders worth trying, and what each is best at.",
    [
      "Vibe coding tools share a loop — describe, preview, refine — but differ in output quality, backend support and how they handle big projects.",
      "Prioritize tools that generate real, exportable code with GitHub sync. That keeps every option open: keep iterating in chat, or graduate to traditional development.",
      "Test with something stateful — a todo app with auth, or a booking flow. Stateless landing pages flatter every tool; databases reveal the gaps.",
    ],
  ),
  g(
    "how-to-make-an-ecommerce-website",
    "How to make an ecommerce website",
    "How-to",
    "Storefront, cart, checkout and product management in one build.",
    [
      "A solid ecommerce MVP has a browsable catalog, product pages, a cart and checkout. Start with a handful of real products and great images — design sells.",
      "Add the trust layer: shipping info, returns policy, reviews and secure checkout badges. These pages take an hour and lift conversion enormously.",
      "Connect payments with Stripe when you're ready to take real orders, and use the admin view to manage inventory without touching code.",
    ],
  ),
  g(
    "landing-page-best-practices-convert",
    "Landing page best practices that convert",
    "How-to",
    "Headline, proof, offer, CTA: the anatomy of pages that turn visitors into users.",
    [
      "Every high-converting landing page answers four questions above the fold: what is this, who is it for, why should I believe you, and what do I do next.",
      "Social proof beats adjectives. Put real numbers, logos or testimonials near the top — and make the primary call to action impossible to miss on mobile.",
      "One page, one job. Cut every section that doesn't move the visitor toward the single action you want, then A/B test the headline first.",
    ],
  ),
  g(
    "how-to-build-a-fitness-app-6-steps",
    "How to build a fitness app in 6 steps",
    "How-to",
    "Workouts, tracking and streaks: ship a fitness MVP users open daily.",
    [
      "Fitness apps live or die on the daily loop. Design the workout view first — big timers, clear next-exercise cues, minimal taps with sweaty hands.",
      "Add tracking second: log sets, chart progress and celebrate streaks. History is the feature that brings people back tomorrow.",
      "Then layer on programs and plans, social accountability, and reminders. Build the loop, then widen it.",
    ],
  ),
  g(
    "bubble-vs-lovable-no-code-platform-comparison",
    "Bubble vs Lovable",
    "Comparisons",
    "Visual programming depth versus prompt-to-app speed.",
    [
      "Bubble offers deep visual programming: workflows, database rules and plugin ecosystems you assemble by hand. Lovable generates the whole app — frontend, backend and hosting — from a description.",
      "Choose Bubble when you want pixel-level control over complex logic without code. Choose prompt-first when you want a working product this week and readable code underneath.",
      "Migration paths matter: generated code you can export keeps you independent of any single platform's pricing or limits.",
    ],
  ),
  g(
    "best-ai-app-builders",
    "Best AI app builders",
    "Comparisons",
    "Full-stack generation, backends and design: ranking the AI app builders.",
    [
      "The best AI app builders do more than landing pages: they create databases, auth, storage and API integrations from the same conversation.",
      "Score candidates on five axes: first-draft quality, edit reliability on existing projects, backend completeness, design taste, and export options.",
      "Build the same realistic brief in your top two — a tool with two user roles and a dashboard — and keep the one whose third iteration still impresses you.",
    ],
  ),
  g(
    "cursor-vs-bolt-vs-lovable-comparison",
    "Cursor vs Bolt vs Lovable",
    "Comparisons",
    "AI IDE, browser builder, or prompt-to-app: mapping the three workflows.",
    [
      "Cursor supercharges developers inside VS Code. Bolt and Lovable generate whole apps from prompts in the browser. The right choice depends on who is building.",
      "Developers who live in code get the most from an AI IDE. Everyone else — founders, marketers, PMs — ships faster with a tool that owns the full stack from sentence to URL.",
      "Hybrid teams split the difference: prototype in a prompt-to-app builder, export to GitHub, and finish in the IDE.",
    ],
  ),
  g(
    "how-to-build-admin-panel-without-code",
    "How to build an admin panel without code",
    "How-to",
    "Tables, filters, roles and audit trails for your internal ops.",
    [
      "An admin panel is mostly tables with superpowers: search, filter, edit and delete over your existing data, gated by roles.",
      "Connect it to the same database your app uses so ops always sees live data. Add role-based access before you share the link.",
      "Finish with audit logging and CSV export. Those two features turn a handy tool into infrastructure your whole company trusts.",
    ],
  ),
  g(
    "shopify-vs-wordpress",
    "Shopify vs WordPress",
    "Comparisons",
    "Hosted commerce versus open CMS: costs, control and AI-built alternatives.",
    [
      "Shopify wins for stores that just need to sell: hosting, checkout and payments handled. WordPress wins for content-rich sites that need total control and thousands of plugins.",
      "Tally the true cost: subscriptions and transaction fees on one side; hosting, maintenance and developer time on the other.",
      "For custom storefronts and internal tools around your shop, an AI-built app can complement either platform rather than replace it.",
    ],
  ),
  g(
    "framer-vs-lovable-app-builder-comparison",
    "Framer vs Lovable",
    "Comparisons",
    "Design-first sites versus full-stack apps from a prompt.",
    [
      "Framer is a design tool that publishes beautiful sites — unmatched for marketing pages where every pixel matters. Lovable builds full-stack apps with databases and auth behind the design.",
      "Marketing site with CMS content? Framer shines. User accounts, dashboards or anything stateful? You need an app builder.",
      "Many teams use both: Framer for the marketing site, Lovable for the product behind the login button.",
    ],
  ),
  g(
    "how-to-publish-a-web-app",
    "How to publish a web app",
    "How-to",
    "From preview to production URL: domains, SSL and launch checklist.",
    [
      "Publishing turns your preview into a live URL anyone can visit. Connect a custom domain for credibility — DNS usually propagates within the hour.",
      "Before launch, walk the checklist: test on mobile, add analytics, set up error alerts, write the meta title and description, and remove placeholder content.",
      "Launch small, then iterate. Share the link with ten users, fix what confuses them, and publish updates as often as you like.",
    ],
  ),
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_CATEGORIES = [...new Set(GUIDES.map((g) => g.category))];

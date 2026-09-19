export type Post = {
  slug: string;
  cover: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "what-is-vibe-coding",
    cover: "vibe-coding.png",
    title: "What is vibe coding?",
    date: "Feb 12, 2026",
    tag: "Guides",
    excerpt: "Vibe coding lets you build software by describing what you want in plain language — the AI handles the code.",
    body: [
      "Vibe coding is a way of building software where you describe what you want in natural language and an AI agent writes, runs and fixes the code for you. Instead of editing files by hand, you stay in a creative flow: prompt, preview, refine.",
      "The term took off because the experience genuinely feels different from traditional development. You focus on the outcome — the layout, the logic, the feel — while the agent handles syntax, imports, build errors and deployment plumbing.",
      "Good vibe coding still benefits from clear thinking. The best results come from describing the user's journey step by step, naming the pages and data you need, and iterating in small loops: one feature at a time, checking the preview as you go.",
      "When something breaks, paste the error back into the chat or just describe what you see. The agent can inspect the code, trace the issue and fix it — this tight feedback loop is what makes vibe coding fast.",
      "Start with a template or a blank project, describe your idea in two or three sentences, and ship your first version today. You can always refine it afterward; published apps can be edited with follow-up prompts.",
    ],
  },
  {
    slug: "lovable-2-0",
    cover: "frame-2085660791.png",
    title: "Lovable 2.0",
    date: "Jan 28, 2026",
    tag: "Product",
    excerpt: "A faster agent, deeper framework support and a new layer of design control — meet Lovable 2.0.",
    body: [
      "Lovable 2.0 is the biggest upgrade to the platform yet: a rebuilt agent that plans before it builds, full-stack reasoning across your frontend, backend and data, and far more reliable edits to existing projects.",
      "The new agent starts by understanding your project structure, then makes targeted changes instead of rewriting files wholesale. That means fewer regressions, cleaner diffs and faster iterations on large codebases.",
      "Design gets a major step forward too. Ask for a specific aesthetic — brutalist, playful, enterprise-clean — and the agent applies it consistently across every page, with design-system tokens you can inspect and tweak.",
      "Under the hood, builds are faster, previews load sooner and deployments stay zero-config. Everything you loved about Lovable, with the rough edges sanded off.",
    ],
  },
  {
    slug: "introducing-visual-edits",
    cover: "visual-edits-blog-post-1-.png",
    title: "Introducing visual edits",
    date: "Dec 10, 2025",
    tag: "Product",
    excerpt: "Point at any element in the preview and tell the agent exactly what to change.",
    body: [
      "Visual edits close the gap between what you see and what you describe. Click any element in the preview — a button, a heading, a card — and your next prompt targets exactly that element.",
      "No more describing locations in words ('the blue button under the hero on the homepage'). Select it, say 'make this darker and wider', and the agent applies a surgical edit.",
      "Combined with chat, visual edits make iteration dramatically faster: select, instruct, preview, repeat. Try it on spacing, colors, copy and layout in your next session.",
    ],
  },
  {
    slug: "how-to-build-ai-app",
    cover: "brand-posts-advice.png",
    title: "How to build an AI app",
    date: "Nov 18, 2025",
    tag: "Guides",
    excerpt: "From idea to AI-powered product: the pages, the data model and the prompts that get you there.",
    body: [
      "Every AI app has the same skeleton: an input surface, some model or logic in the middle, and a way to show results. Start by describing that loop in one paragraph.",
      "Next, sketch the pages: a landing page that explains the value, the core tool page where the magic happens, and optionally auth plus a history or dashboard view.",
      "Then define your data. What needs to be stored — users, generations, settings? Name the tables and fields in your prompt; the agent wires up the database for you.",
      "Build it in slices: landing first, then the core loop, then polish. Test with real inputs early — AI features always need two or three rounds of prompt tuning.",
      "Finally, publish and share the link. Watch how people use it, then iterate with follow-up prompts. Shipping beats perfecting.",
    ],
  },
  {
    slug: "a-founders-guide-to-lovable-security",
    cover: "Security%20Founders%20Marketing%20Design.png",
    title: "A founder's guide to Lovable security",
    date: "Oct 30, 2025",
    tag: "Security",
    excerpt: "What actually keeps your app and customer data safe: SSO, RBAC, scanning, isolation and data controls.",
    body: [
      "Security questions come up in almost every serious build. Here's the short version of how Lovable protects your work: everything runs in isolated projects, secrets are stored encrypted and never baked into code, and every publish can be gated behind approvals.",
      "For teams, SSO and role-based access control mean only the right people can edit, publish or manage billing. Audit logs record who did what, which keeps compliance reviews painless.",
      "Automatic security scanning checks your app for common issues on every publish, and infrastructure runs on hardened, monitored cloud with encrypted connections throughout.",
      "Your prompts and private project data are not used to train models on business and enterprise plans. If you handle regulated data, talk to sales about data residency options.",
    ],
  },
  {
    slug: "mcp-101",
    cover: "mcp-101.jpg",
    title: "MCP 101: connecting your agent to everything",
    date: "Oct 2, 2025",
    tag: "Guides",
    excerpt: "Model Context Protocol servers give your agent tools: databases, file hosts, payment APIs and more.",
    body: [
      "MCP — the Model Context Protocol — is a standard way to plug external tools into an AI agent. Each MCP server exposes actions (like 'run a query' or 'upload a file') that the agent can call while building.",
      "In practice this means your agent isn't limited to writing code: it can read your database schema, check your analytics, or create records in your CRM as part of the build.",
      "To use one, add the MCP server to your project and describe what you want in chat. The agent discovers the available tools and calls them when needed.",
      "Start with one integration — your database or your file storage — and expand from there once you see the pattern.",
    ],
  },
  {
    slug: "gpt-5-5-now-in-lovable",
    cover: "gpt-5-5.jpeg",
    title: "GPT-5.5 now in Lovable",
    date: "Sep 14, 2025",
    tag: "Models",
    excerpt: "The newest flagship model is available in the model picker for every project.",
    body: [
      "GPT-5.5 is now available across Lovable. It brings stronger reasoning for complex multi-file edits, better adherence to long instructions, and noticeably cleaner first drafts of full-stack features.",
      "Switch models any time from the picker in the composer. Your conversation history carries over, so you can compare outputs on the same task.",
      "As always, you can pair any model with visual edits, chat mode and version restore to iterate safely.",
    ],
  },
  {
    slug: "one-year-of-lovable",
    cover: "screenshot-2025-11-18-at-14.06.24.png",
    title: "One year of Lovable",
    date: "Nov 20, 2025",
    tag: "Company",
    excerpt: "From a weekend prototype to millions of builders: a look back at year one.",
    body: [
      "A year ago Lovable was a small experiment in letting GPT write whole apps. Today millions of people have prompted ideas into existence — startups, internal tools, portfolios, games and everything in between.",
      "The community made it happen: sharing templates, answering questions, running meetups on five continents and shipping an absurd volume of software.",
      "Year two is about depth — bigger codebases, team workflows, enterprise trust — without losing the magic of typing a sentence and watching software appear.",
      "Thank you for building with us. The best is still a prompt away.",
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

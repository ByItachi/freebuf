import Link from "next/link";
import { POSTS } from "@/data/posts";
import { px } from "@/lib/img";

const CATS = [
  { label: "Latest", href: "/blog", active: true },
  { label: "Announcements", href: "/blog?category=announcements" },
  { label: "Changelog", href: "/blog?category=changelog" },
  { label: "Inside Lovable", href: "/blog?category=inside+lovable" },
  { label: "Development 101", href: "/blog?category=development+101" },
  { label: "Reports", href: "/blog?category=reports" },
  { label: "Tutorials", href: "/blog?category=tutorials" },
  { label: "Stories", href: "/blog?category=stories" },
];

export default function BlogPage() {
  return (
    <div className="isolate">
      <main id="main-content" tabIndex={-1} className="focus-visible:ring-focus-pulse container min-w-0 outline-hidden focus-visible:ring-2 focus-visible:ring-inset">
        <div className="flex min-h-screen w-full flex-col pt-16 pb-20 md:flex-row md:pb-32">
          <aside className="w-full md:w-64">
            <div className="px-4 md:sticky md:top-20 md:px-8">
              <div className="flex flex-col gap-8">
                <div className="w-full md:w-3/4">
                  <h1 className="mb-4 text-5xl font-medium md:text-4xl">Blog</h1>
                  <p className="text-marketing-muted-foreground mt-1 md:text-sm">Compiled notes from the Lovable team</p>
                  <div className="border-marketing-border mt-8 w-full border-b md:w-1/2" />
                </div>
                <nav className="scrollbar-hide flex gap-4 overflow-x-auto whitespace-nowrap pb-4 md:mx-0 md:flex-col md:pb-0">
                  {CATS.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      aria-current={c.active ? "page" : undefined}
                      data-status={c.active ? "active" : undefined}
                      className={`transition-colors hover:text-charcoal ${c.active ? "text-charcoal font-medium" : "text-steel"}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
          <div className="flex flex-1 flex-col items-center gap-8 px-4 md:px-8">
            <div className="grid w-full grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-2">
              {POSTS.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.01]">
                  <div className="rounded-2 relative mb-4 aspect-[16/9] w-full overflow-hidden">
                    <img
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1500px) 50vw, 33vw"
                      srcSet={`${px(`https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 640w, ${px(`https://lovable.dev/cdn-cgi/image/width=750,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 750w, ${px(`https://lovable.dev/cdn-cgi/image/width=828,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 828w, ${px(`https://lovable.dev/cdn-cgi/image/width=1080,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 1080w, ${px(`https://lovable.dev/cdn-cgi/image/width=1920,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 1920w, ${px(`https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)} 3840w`}
                      src={px(`https://lovable.dev/cdn-cgi/image/width=3840,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${p.cover}`)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-1">
                    <div className="text-steel text-sm">{p.tag}</div>
                    <h2 className="text-2xl font-medium leading-tight">{p.title}</h2>
                    <p className="text-steel line-clamp-2">{p.excerpt}</p>
                    <div className="text-steel mt-2 flex items-center gap-2 text-sm">
                      <time dateTime={p.date}>{p.date}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

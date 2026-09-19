import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/inner";
import { POSTS, getPost } from "@/data/posts";
import { px } from "@/lib/img";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="bg-parchment">
      <article className="mx-auto max-w-3xl px-4 pb-8 pt-16 md:pt-24">
        <Link href="/blog" className="text-sm font-medium text-steel transition-colors hover:text-charcoal">
          ← All posts
        </Link>
        <p className="mt-6 text-[13px] font-medium text-steel">
          {post.tag} · {post.date}
        </p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-charcoal md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-snug text-charcoal/65">{post.excerpt}</p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
          <img
            src={px(`https://lovable.dev/cdn-cgi/image/width=1600,f=auto,fit=scale-down/https://assets.lovable.dev/content/news/covers/${post.cover}`)}
            alt={post.title}
            loading="eager"
            decoding="async"
            className="aspect-[21/9] w-full object-cover"
          />
        </div>
        <div className="mt-8 space-y-5">
          {post.body.map((para, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-steel">
              {para}
            </p>
          ))}
        </div>
      </article>
      <CtaBand />
    </main>
  );
}

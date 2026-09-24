"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FreebuffLogo } from "@/components/brand";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] text-center">
        <Link
          href="/"
          aria-label="Freebuff"
          className="inline-flex items-center justify-center text-charcoal"
        >
          <FreebuffLogo />
        </Link>

        <h1 className="mt-10 text-[28px] font-semibold leading-[1.2] tracking-[-0.7px] text-charcoal">
          First, let&apos;s create your account
        </h1>

        <form
          className="mt-8 space-y-4 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/new");
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[14px] text-dim-gray"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-inputs border border-linen-border bg-white px-4 py-3 text-[15px] text-charcoal shadow-subtle outline-none placeholder:text-dim-gray/70 focus:border-stone"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-buttons bg-charcoal py-3 text-[15px] text-parchment transition-colors hover:bg-charcoal/90"
          >
            Continue with email
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-[12px] text-dim-gray">
          <span className="h-px flex-1 bg-linen-border" />
          or
          <span className="h-px flex-1 bg-linen-border" />
        </div>

        <button
          type="button"
          onClick={() => router.push("/new")}
          className="flex w-full items-center justify-center gap-3 rounded-buttons border border-linen-border bg-white py-3 text-[15px] text-charcoal transition-colors hover:border-stone"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.86-3c-1.08.72-2.45 1.15-4.09 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.36.61 4.61 1.8l3.43-3.43A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => router.push("/new")}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-buttons border border-linen-border bg-white py-3 text-[15px] text-charcoal transition-colors hover:border-stone"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="#1b1b1f"
            aria-hidden="true"
          >
            <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm3 6V7a3 3 0 0 0-6 0v1h6z" />
          </svg>
          Continue with SSO
        </button>

        <p className="mt-8 text-[13px] leading-[1.5] text-dim-gray">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-charcoal underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-charcoal underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
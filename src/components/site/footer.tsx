"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LovableLogo } from "@/components/brand";

type FooterLink = { label: string; href: string; external?: boolean };

const footerLinks: Record<string, FooterLink[]> = {
  company: [
    { label: "Careers", href: "/careers" },
    { label: "Press & media", href: "/brand" },
    { label: "Enterprise", href: "/enterprise-landing" },
    { label: "Security", href: "/security" },
    { label: "Trust center", href: "https://trust.lovable.dev/", external: true },
    { label: "Partnerships", href: "/partners" },
  ],
  product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Student discount", href: "/students" },
    { label: "For Work", href: "/for-work" },
    { label: "Founders", href: "/founders" },
    { label: "Product managers", href: "/product-managers" },
    { label: "Designers", href: "/designers" },
    { label: "Marketers", href: "/marketers" },
    { label: "Sales", href: "/sales" },
    { label: "Ops", href: "/ops" },
    { label: "People", href: "/people" },
    { label: "Prototypes", href: "/prototypes" },
    { label: "Tools", href: "/tools" },
    { label: "Download", href: "/download" },
  ],
  resources: [
    { label: "Docs", href: "https://docs.lovable.dev/introduction/welcome", external: true },
    { label: "Templates", href: "/templates" },
    { label: "Guides", href: "/guides" },
    { label: "Connect", href: "/connect" },
    { label: "MCP server", href: "/mcp" },
    { label: "Videos", href: "https://www.youtube.com/@lovable", external: true },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Do not sell or share my personal information", href: "/do-not-sell-or-share-my-personal-information" },
    { label: "Cookie policy", href: "/cookie-policy" },
    { label: "Enterprise terms", href: "https://lovable.dev/legal", external: true },
    { label: "General terms", href: "/terms" },
    { label: "Desktop app terms", href: "/desktop-app-terms" },
    { label: "Domain registration terms", href: "/domain-registration-terms" },
    { label: "DMCA copyright policy", href: "/dmca" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Platform rules", href: "/platform-rules" },
    { label: "Report abuse", href: "/abuse" },
    { label: "Report security concerns", href: "/security-issues" },
    { label: "DPA", href: "/data-processing-agreement" },
  ],
  community: [
    { label: "Become a partner", href: "/partners" },
    { label: "Hire a Lovable partner", href: "https://lovable-partner-directory.lovable.app/", external: true },
    { label: "Affiliates", href: "/partners/affiliates" },
    { label: "Code of conduct", href: "/community-code-of-conduct" },
    { label: "Discord", href: "https://discord.com/invite/lovable-dev", external: true },
    { label: "Reddit", href: "https://reddit.com/r/lovable", external: true },
    { label: "X / Twitter", href: "https://twitter.com/Lovable", external: true },
    { label: "YouTube", href: "https://www.youtube.com/@lovable", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/lovable-dev/", external: true },
  ],
};

const SOCIALS = [
  { label: "Discord", href: "https://discord.com/invite/lovable-dev", icon: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.6176-1.2495.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C2.079 10.13 1.007 15.91 2.032 21.52a.083.083 0 00.0316.0569 19.9 19.9 0 005.993 3.03.078.078 0 00.0842-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.0416-.1057 13.11 13.11 0 01-1.872-.892.077.077 0 01-.0077-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.198.3737.2924a.077.077 0 01-.0066.1276 12.3 12.3 0 01-1.873.8914.076.076 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.88 19.88 0 006.002-3.03.077.077 0 00.0316-.0552c1.203-6.561-.466-12.275-1.966-17.12a.07.07 0 00-.0316-.0286zM8.02 15.3312c-1.183 0-2.1569-1.0857-2.1569-2.419 0-1.3332 1.9558-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189zm7.9748 0c-1.183 0-2.157-1.0857-2.157-2.419 0-1.3332 1.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" },
  { label: "GitHub", href: "https://github.com/lovable-dev", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" },
  { label: "X (Twitter)", href: "https://twitter.com/Lovable", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "YouTube", href: "https://www.youtube.com/@lovable", icon: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lovable-dev/", icon: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" },
];

function FooterAnchor({ link, className }: { link: FooterLink; className: string }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-charcoal">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterAnchor
              link={link}
              className="text-[14px] text-dim-gray transition-colors hover:text-charcoal"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <div className="contain bg-[#fcfbf8] pb-2">
      <footer className="relative rounded-2xl bg-[#fcfbf8] px-4 py-8 sm:px-0 sm:py-8 md:px-0 md:py-10 lg:px-0 lg:py-14">
        <nav className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:grid-rows-2">
          <div className="col-span-2 flex h-full justify-between sm:col-span-3 lg:col-span-1 lg:flex-col">
            <Link href="/" aria-label="Go to homepage" className="hover-heartbeat w-fit">
              <LovableLogo />
            </Link>
            <p className="mt-2 max-w-[32ch] text-[14px] leading-relaxed text-dim-gray">
              Your AI cofounder and dev team. Build, ship, and grow your ideas — from prototype to production.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-[14px] text-dim-gray transition-colors hover:text-charcoal"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Resources" links={footerLinks.resources} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
          <FooterColumn title="Community" links={footerLinks.community} />

          <div className="col-span-2 w-fit sm:col-span-3 lg:col-span-1 lg:flex lg:items-end">
            <button
              type="button"
              aria-label="EN — open language selector"
              aria-haspopup="menu"
              className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 py-1.5 text-[14px] text-charcoal transition-colors hover:bg-charcoal/5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M7.25 12C7.25 11.2275 7.2925 10.4739 7.372 9.75H4.063C3.861 10.4655 3.75 11.2197 3.75 12C3.75 12.7803 3.861 13.5345 4.063 14.25H7.372C7.2925 13.5261 7.25 12.7725 7.25 12ZM9.129 15.75C9.315 16.6194 9.563 17.3996 9.856 18.0596C10.193 18.8165 10.575 19.3822 10.96 19.749C11.342 20.1122 11.692 20.25 12 20.25C12.308 20.25 12.659 20.1122 13.04 19.749C13.425 19.3822 13.807 18.8165 14.144 18.0596C14.437 17.3996 14.685 16.6194 14.871 15.75H9.129ZM16.401 15.75C16.19 16.8357 15.889 17.8244 15.514 18.6689C15.351 19.0341 15.171 19.3768 14.976 19.6934C16.872 18.9592 18.429 17.5462 19.348 15.75H16.401ZM4.652 15.75C5.571 17.5459 7.127 18.9591 9.023 19.6934C8.829 19.3769 8.649 19.0339 8.486 18.6689C8.111 17.8244 7.81 16.8357 7.599 15.75H4.652ZM14.976 4.30566C15.171 4.62245 15.351 4.96567 15.514 5.33105C15.889 6.17561 16.19 7.16429 16.401 8.25H19.348C18.429 6.4537 16.873 5.03977 14.976 4.30566ZM12 3.75C11.692 3.75 11.342 3.88785 10.96 4.25098C10.575 4.61779 10.193 5.18354 9.856 5.94043C9.563 6.60044 9.315 7.38058 9.129 8.25H14.871C14.685 7.38058 14.437 6.60044 14.144 5.94043C13.807 5.18354 13.425 4.61779 13.04 4.25098C12.659 3.88785 12.308 3.75 12 3.75ZM9.023 4.30566C7.127 5.03986 5.571 6.45397 4.652 8.25H7.599C7.81 7.16429 8.111 6.17561 8.486 5.33105C8.649 4.96583 8.829 4.62233 9.023 4.30566ZM8.75 12C8.75 12.7821 8.797 13.5362 8.882 14.25H15.118C15.203 13.5362 15.25 12.7821 15.25 12C15.25 11.2179 15.203 10.4638 15.118 9.75H8.882C8.797 10.4638 8.75 11.2179 8.75 12ZM16.75 12C16.75 12.7725 16.708 13.5261 16.628 14.25H19.937C20.139 13.5345 20.25 12.7803 20.25 12C20.25 11.2197 20.139 10.4655 19.937 9.75H16.628C16.708 10.4739 16.75 11.2275 16.75 12ZM21.75 12C21.75 17.3848 17.385 21.75 12 21.75C6.615 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.615 2.25 12 2.25C17.385 2.25 21.75 6.61522 21.75 12Z" />
              </svg>
              <span>EN</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M11.526 15.582c.295.24.729.223 1.004-.052l5-5c.293-.293.293-.768 0-1.061-.293-.293-.767-.293-1.06 0L12 13.94 7.53 9.47c-.293-.293-.767-.293-1.06 0-.293.293-.293.768 0 1.061l5 5 .056.052z" />
              </svg>
            </button>
          </div>
        </nav>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal/10 pt-8 sm:flex-row">
          <p className="text-[13px] text-dim-gray">
            &copy; {new Date().getFullYear()} Lovable. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[13px] text-dim-gray transition-colors hover:text-charcoal"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] text-dim-gray transition-colors hover:text-charcoal"
            >
              Terms
            </Link>
            <span className="text-[13px] text-dim-gray">Built with Lovable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

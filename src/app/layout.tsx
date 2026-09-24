import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { AppChrome } from "@/components/site/app-chrome";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-camera-variable",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-freebuff-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freebuff | Your home to build software with an AI Agent",
  description:
    "Build products, features, and prototypes in minutes. Prompt, iterate, and ship with Freebuff.",
  icons: {
    icon: "/freebuff.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plex.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        {/* Freebuff ships dark-first (OLED slate + green). Only restore the
            light parchment variant when the user explicitly picked Light —
            prevents a dark flash and transition-frozen colors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("freebuff.theme");if(t==="light"||(t==="system"&&!matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.setAttribute("data-theme","light")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}

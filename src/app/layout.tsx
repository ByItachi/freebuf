import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AppChrome } from "@/components/site/app-chrome";
import "./globals.css";

const camera = Inter({
  variable: "--font-camera-variable",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovable | Your home to make software with an AI Agent",
  description:
    "Build products, features, and prototypes in minutes. Prompt, iterate, and ship with Lovable.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${camera.variable} h-full antialiased`}>
      <head>
        {/* Apply the stored theme before first paint — prevents a light flash
            and transition-frozen colors when dark mode is active. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("lovable.theme")==="dark"||(localStorage.getItem("lovable.theme")==="system"&&matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}

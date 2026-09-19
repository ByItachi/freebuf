"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { px } from "@/lib/img";

/* ── Data ──────────────────────────────────────────────────────────── */

const SHOWCASE_IMAGES = ["hero-beacon.webp", "hero-northstar.webp", "hero-polaris.webp"].map(
  (f) => `${px("https://lovable.dev/cdn-cgi/image/width=2432,f=auto,fit=scale-down")}/https://assets.lovable.dev/content/for-work/${f}`,
);

const TEAM_LOGOS = [
  { name: "sciongroup", src: `${px("https://lovable.dev/cdn-cgi/image/width=400,f=auto,fit=scale-down/https://assets.lovable.dev/content/customers")}/sciongroup/customers-sciongroup-logo.svg` },
  { name: "nursa", src: `${px("https://lovable.dev/cdn-cgi/image/width=400,f=auto,fit=scale-down/https://assets.lovable.dev/content/customers")}/nursa/customers-nursa-logo.svg` },
  { name: "exprealty", src: `${px("https://lovable.dev/cdn-cgi/image/width=400,f=auto,fit=scale-down/https://assets.lovable.dev/content/customers")}/exprealty/customers-exprealty-logo.svg` },
];

const ARC_ITEMS = [
  { angle: -35, scale: 0.85, tileRotate: -7.5, delay: 0, icon: "vercel" },
  { angle: -21, scale: 0.92, tileRotate: 5.52, delay: -1.7, icon: "google" },
  { angle: -7, scale: 1, tileRotate: 5.75, delay: -3.4, icon: "notion" },
  { angle: 7, scale: 1, tileRotate: -2.805, delay: -5.1, icon: "linear" },
  { angle: 21, scale: 0.92, tileRotate: 1.785, delay: -6.8, icon: "slack" },
  { angle: 35, scale: 0.85, tileRotate: -2.735, delay: -8.5, icon: "lovable" },
];

const DESKTOP_TILES = [
  { left: 214, top: 146, rotate: -15, delay: -1.5, icon: "vercel" },
  { left: 324, top: 200, rotate: 11.04, delay: -3, icon: "google" },
  { left: 283, top: 260, rotate: 11.5, delay: -3.6, icon: "notion" },
  { left: 1126, top: 134, rotate: -5.61, delay: -2.3, icon: "linear" },
  { left: 1076, top: 194, rotate: 3.57, delay: -0.8, icon: "slack" },
  { left: 1163, top: 247, rotate: -5.47, delay: 0, icon: "lovable" },
];

const CONNECTOR_PATHS = [
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.00833, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.01667, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.025, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.03333, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.04167, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.05, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.05833, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.06667, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.075, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.08333, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.09167, delay: -1.5 },
  { d: "M270 174 C450 198.64 720 235.6 720 482", len: 0.1, dash: 0.1, delay: -1.5 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.01333, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.02667, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.04, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.05333, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.06667, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.08, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.09333, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.10667, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.12, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.13333, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.14667, delay: -3 },
  { d: "M380 228 C516 248.32 720 278.8 720 482", len: 0.16, dash: 0.16, delay: -3 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.00667, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.01333, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.02, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.02667, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.03333, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.04, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.04667, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.05333, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.06, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.06667, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.07333, delay: -3.6 },
  { d: "M339 288 C491.4 303.52 720 326.8 720 482", len: 0.08, dash: 0.08, delay: -3.6 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.01167, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.02333, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.035, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.04667, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.05833, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.07, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.08167, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.09333, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.105, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.11667, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.12833, delay: -2.3 },
  { d: "M1126 162 C963.6 187.6 720 226 720 482", len: 0.14, dash: 0.14, delay: -2.3 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.015, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.03, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.045, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.06, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.075, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.09, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.105, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.12, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.135, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.15, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.165, delay: -0.8 },
  { d: "M1076 222 C933.6 242.8 720 274 720 482", len: 0.18, dash: 0.18, delay: -0.8 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.00917, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.01833, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.0275, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.03667, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.04583, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.055, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.06417, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.07333, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.0825, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.09167, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.10083, delay: 0 },
  { d: "M1163 275 C985.8 291.56 720 316.4 720 482", len: 0.11, dash: 0.11, delay: 0 },
];

const ICON_SVGS: Record<string, React.ReactNode> = {
  vercel: (
    <svg width="42.861" height="30" viewBox="478.569 335.12 42.861 30" xmlns="http://www.w3.org/2000/svg">
      <path d="M496.394 338.393c1.387-1.44 3.317-2.334 5.453-2.334 2.839 0 5.315 1.578 6.634 3.92 1.146-0.51 2.415-0.794 3.749-0.794 5.12 0 9.27 4.173 9.27 9.321 0 5.148-4.151 9.321-9.27 9.321a9.17 9.2 89.99965 0 1-1.826-0.181c-1.161 2.065-3.374 3.46-5.915 3.46-1.063 0-2.069-0.245-2.964-0.68-1.177 2.76-3.92 4.696-7.117 4.695-3.329 0-6.166-2.1-7.256-5.044-0.476 0.101-0.969 0.153-1.475 0.153C481.714 360.23 478.5 356.994 478.5 353.002c0-2.675 1.444-5.011 3.589-6.261-0.442-1.013-0.687-2.131-0.687-3.307C481.402 338.843 485.141 335.121 489.754 335.121c2.708 0 5.115 1.283 6.64 3.272" fill="#00A1E0" />
      <path d="M484.728 350.678c-0.027 0.07 0.01 0.085 0.019 0.098 0.081 0.059 0.163 0.101 0.245 0.147 0.439 0.232 0.853 0.3 1.286 0.3 0.882 0 1.43-0.468 1.43-1.22l0-0.015c0-0.696-0.618-0.949-1.198-1.131l-0.076-0.025c-0.437-0.142-0.815-0.264-0.814-0.551l0-0.015c0-0.245 0.221-0.426 0.562-0.426 0.38 0 0.831 0.126 1.121 0.286 0 0 0.085 0.055 0.116-0.028 0.017-0.044 0.164-0.438 0.18-0.481 0.017-0.046-0.013-0.081-0.043-0.099-0.331-0.201-0.79-0.338-1.264-0.338l-0.088 0.001c-0.807 0-1.371 0.486-1.371 1.182l0 0.015c0 0.734 0.622 0.973 1.204 1.139l0.094 0.028c0.424 0.13 0.79 0.242 0.79 0.54l0 0.015c0 0.272-0.238 0.475-0.621 0.475-0.149 0-0.624-0.003-1.136-0.326-0.062-0.036-0.098-0.062-0.146-0.091-0.025-0.016-0.088-0.043-0.116 0.039l-0.174 0.481z m12.913 0c-0.027 0.07 0.01 0.085 0.018 0.098 0.081 0.059 0.163 0.101 0.246 0.147 0.439 0.232 0.853 0.3 1.286 0.3 0.882 0 1.43-0.468 1.43-1.22l0-0.015c0-0.696-0.618-0.949-1.199-1.131l-0.075-0.025c-0.437-0.142-0.815-0.264-0.815-0.551l0-0.015c0-0.245 0.221-0.426 0.563-0.426 0.38 0 0.831 0.126 1.121 0.286 0 0 0.085 0.055 0.116-0.028 0.017-0.044 0.164-0.438 0.179-0.481 0.017-0.046-0.013-0.081-0.042-0.099-0.331-0.201-0.79-0.338-1.264-0.338l-0.088 0.001c-0.807 0-1.371 0.486-1.371 1.182l0 0.015c0 0.734 0.622 0.973 1.204 1.139l0.094 0.028c0.424 0.13 0.791 0.242 0.791 0.54l0 0.015c0 0.272-0.238 0.475-0.622 0.475-0.149 0-0.624-0.003-1.136-0.326-0.062-0.036-0.099-0.061-0.145-0.091-0.016-0.01-0.091-0.039-0.117 0.039l-0.174 0.481z m8.815-1.474c0 0.426-0.08 0.761-0.236 0.998-0.155 0.234-0.39 0.349-0.717 0.348-0.328 0-0.561-0.114-0.713-0.348-0.154-0.236-0.233-0.572-0.233-0.998 0-0.425 0.078-0.76 0.233-0.994 0.153-0.232 0.386-0.345 0.713-0.345 0.327 0 0.562 0.113 0.718 0.345 0.156 0.234 0.236 0.569 0.235 0.994m0.737-0.789c-0.072-0.244-0.185-0.459-0.335-0.637-0.15-0.18-0.34-0.324-0.566-0.429-0.225-0.104-0.491-0.158-0.789-0.158-0.299 0-0.565 0.053-0.789 0.158-0.225 0.105-0.415 0.249-0.566 0.429-0.149 0.18-0.262 0.394-0.335 0.637-0.072 0.242-0.108 0.507-0.108 0.789s0.036 0.547 0.108 0.789c0.073 0.243 0.185 0.458 0.335 0.637 0.15 0.18 0.341 0.323 0.566 0.425 0.225 0.102 0.491 0.154 0.789 0.154 0.298 0 0.564-0.052 0.789-0.154 0.225-0.102 0.415-0.245 0.566-0.425 0.15-0.179 0.263-0.394 0.335-0.637 0.072-0.242 0.108-0.508 0.108-0.789s-0.036-0.546-0.108-0.789m6.046 2.021c-0.024-0.071-0.094-0.045-0.094-0.044-0.107 0.041-0.221 0.079-0.342 0.098-0.123 0.019-0.259 0.029-0.404 0.028-0.356 0-0.639-0.106-0.842-0.314-0.203-0.209-0.317-0.546-0.316-1.003 0.001-0.416 0.102-0.728 0.282-0.967 0.179-0.237 0.453-0.358 0.817-0.358 0.304 0 0.535 0.035 0.778 0.111 0 0 0.058 0.025 0.086-0.051 0.064-0.178 0.112-0.306 0.181-0.502 0.02-0.056-0.028-0.079-0.046-0.086-0.096-0.037-0.321-0.098-0.491-0.123-0.159-0.024-0.345-0.037-0.553-0.037-0.309 0-0.585 0.053-0.82 0.157-0.235 0.104-0.435 0.248-0.593 0.428-0.158 0.18-0.278 0.394-0.359 0.638-0.08 0.242-0.12 0.509-0.12 0.79 0 0.609 0.165 1.101 0.49 1.461 0.326 0.361 0.815 0.545 1.454 0.545 0.377 0 0.764-0.076 1.043-0.186 0 0 0.053-0.026 0.03-0.087l-0.181-0.498z m1.288-1.64c0.035-0.236 0.1-0.433 0.202-0.586 0.153-0.233 0.385-0.36 0.712-0.36s0.543 0.128 0.698 0.36c0.103 0.153 0.148 0.358 0.166 0.586l-1.778 0z m2.479-0.519c-0.062-0.235-0.217-0.473-0.319-0.582-0.161-0.172-0.317-0.292-0.473-0.359-0.203-0.087-0.447-0.144-0.714-0.144-0.311 0-0.594 0.052-0.823 0.159-0.23 0.107-0.423 0.254-0.574 0.437-0.151 0.182-0.265 0.399-0.337 0.644-0.073 0.245-0.11 0.512-0.11 0.793 0 0.286 0.038 0.553 0.113 0.793 0.076 0.242 0.197 0.455 0.362 0.632 0.164 0.178 0.374 0.317 0.626 0.414 0.251 0.096 0.555 0.147 0.905 0.146 0.72-0.002 1.099-0.162 1.255-0.249 0.028-0.015 0.054-0.042 0.021-0.119l-0.163-0.455c-0.024-0.068-0.094-0.043-0.094-0.043-0.178 0.066-0.432 0.184-1.023 0.184-0.386-0.001-0.673-0.114-0.852-0.292-0.184-0.182-0.274-0.449-0.291-0.827l2.493 0.003s0.066-0.001 0.072-0.065c0.002-0.027 0.086-0.51-0.074-1.07m-22.44 0.519c0.036-0.236 0.1-0.433 0.202-0.586 0.153-0.233 0.385-0.36 0.712-0.36s0.543 0.128 0.699 0.36c0.102 0.153 0.147 0.358 0.165 0.586l-1.778 0z m2.479-0.519c-0.062-0.235-0.217-0.473-0.319-0.582-0.161-0.172-0.317-0.292-0.473-0.359-0.203-0.087-0.447-0.144-0.714-0.144-0.311 0-0.594 0.052-0.822 0.159-0.23 0.107-0.423 0.254-0.574 0.437-0.151 0.182-0.265 0.399-0.338 0.644-0.072 0.245-0.11 0.512-0.11 0.793 0 0.286 0.038 0.553 0.114 0.793 0.076 0.242 0.197 0.455 0.361 0.632 0.164 0.178 0.374 0.317 0.627 0.414 0.251 0.096 0.555 0.147 0.905 0.146 0.72-0.002 1.099-0.162 1.255-0.249 0.028-0.015 0.054-0.042 0.02-0.119l-0.162-0.455c-0.025-0.068-0.094-0.043-0.094-0.043-0.178 0.066-0.431 0.184-1.024 0.184-0.386-0.001-0.673-0.114-0.852-0.292-0.184-0.182-0.274-0.449-0.29-0.827l2.492 0.003s0.066-0.001 0.073-0.065c0.002-0.027 0.086-0.51-0.075-1.07m-7.866 2.146c-0.097-0.078-0.111-0.097-0.144-0.147-0.049-0.076-0.074-0.185-0.074-0.323 0-0.219 0.072-0.375 0.222-0.481-0.002 0.001 0.214-0.186 0.723-0.18 0.357 0.005 0.676 0.057 0.676 0.058l0 1.129 0.001 0s-0.317 0.068-0.673 0.089c-0.507 0.031-0.733-0.146-0.731-0.145m0.992-1.746c-0.101-0.007-0.232-0.012-0.389-0.011-0.214 0-0.42 0.027-0.614 0.078-0.195 0.052-0.37 0.133-0.521 0.241a1.198 1.202 89.99965 0 0-0.361 0.41c-0.088 0.164-0.133 0.357-0.133 0.572 0 0.22 0.038 0.411 0.114 0.568 0.076 0.157 0.186 0.288 0.325 0.388 0.138 0.101 0.309 0.175 0.508 0.219 0.195 0.045 0.417 0.067 0.66 0.067 0.255 0 0.51-0.021 0.757-0.063 0.244-0.042 0.545-0.102 0.628-0.121a6.275 6.295 89.99965 0 0 0.174-0.044c0.062-0.015 0.057-0.081 0.057-0.081l-0.001-2.272c0-0.498-0.134-0.868-0.396-1.097-0.262-0.228-0.647-0.344-1.145-0.344-0.187 0-0.488 0.026-0.668 0.062 0 0-0.545 0.105-0.769 0.28 0 0-0.049 0.031-0.022 0.099l0.177 0.472c0.022 0.061 0.081 0.04 0.081 0.041s0.019-0.007 0.041-0.021c0.48-0.26 1.086-0.252 1.086-0.252 0.27 0 0.477 0.054 0.617 0.161 0.136 0.104 0.205 0.261 0.205 0.591l0 0.105c-0.214-0.031-0.411-0.048-0.411-0.048m20.102-1.28c0.019-0.056-0.021-0.083-0.037-0.089-0.042-0.016-0.254-0.061-0.418-0.071-0.313-0.019-0.487 0.034-0.643 0.103-0.154 0.07-0.326 0.182-0.421 0.309l0-0.302c0-0.042-0.03-0.076-0.072-0.076l-0.639 0c-0.042 0-0.072 0.034-0.071 0.076l0 3.706c0 0.042 0.034 0.076 0.076 0.075l0.655 0a0.076 0.076 89.99965 0 0 0.075-0.075l0-1.852c0-0.249 0.028-0.496 0.083-0.652 0.054-0.154 0.127-0.277 0.218-0.365 0.091-0.088 0.195-0.15 0.308-0.185 0.116-0.035 0.244-0.047 0.334-0.047 0.13 0 0.274 0.034 0.274 0.034 0.048 0.005 0.075-0.024 0.091-0.067 0.043-0.114 0.164-0.454 0.187-0.522" fill="#FFF" />
      <path d="M504.127 345.68c-0.08-0.024-0.152-0.041-0.246-0.059-0.096-0.017-0.209-0.026-0.339-0.025-0.451 0-0.806 0.127-1.056 0.377-0.248 0.249-0.417 0.628-0.501 1.127l-0.03 0.168-0.566 0s-0.069-0.002-0.084 0.072l-0.092 0.517c-0.007 0.049 0.015 0.08 0.081 0.08l0.551 0-0.559 3.109c-0.044 0.25-0.094 0.456-0.15 0.612-0.055 0.154-0.108 0.269-0.174 0.354-0.064 0.081-0.124 0.14-0.227 0.175-0.086 0.029-0.185 0.042-0.294 0.042-0.06 0-0.14-0.01-0.2-0.022-0.059-0.012-0.09-0.024-0.134-0.043 0 0-0.064-0.024-0.09 0.04-0.02 0.053-0.167 0.455-0.185 0.505-0.017 0.049 0.007 0.088 0.038 0.099 0.074 0.026 0.128 0.043 0.228 0.067 0.138 0.032 0.255 0.034 0.365 0.034 0.229 0 0.439-0.032 0.612-0.095 0.174-0.063 0.326-0.172 0.461-0.32 0.145-0.16 0.236-0.327 0.323-0.556 0.086-0.226 0.161-0.507 0.219-0.834l0.562-3.167 0.821 0s0.069 0.002 0.083-0.073l0.093-0.516c0.006-0.049-0.015-0.08-0.081-0.08l-0.797 0c0.004-0.018 0.04-0.297 0.132-0.561 0.039-0.112 0.113-0.203 0.174-0.265 0.061-0.061 0.132-0.104 0.209-0.129 0.079-0.026 0.169-0.038 0.268-0.038 0.075 0 0.149 0.009 0.204 0.02 0.077 0.017 0.107 0.025 0.128 0.031 0.081 0.024 0.092 0.001 0.108-0.038l0.191-0.521c0.02-0.056-0.029-0.08-0.046-0.087m-11.135 5.373c0 0.042-0.03 0.075-0.071 0.075l-0.661 0c-0.042 0-0.071-0.034-0.071-0.075l0-5.302c0-0.041 0.029-0.075 0.071-0.075l0.661 0c0.042 0 0.072 0.034 0.071 0.075l0 5.302z" fill="#FFF" />
    </svg>
  ),
  google: (
    <svg width="40" height="35.729" viewBox="23.649 21.131 40.002 35.74" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.673 51.677l1.763 3.028c0.367 0.637 0.893 1.138 1.513 1.501L36.249 45.373 23.649 45.373c0 0.705 0.183 1.412 0.549 2.048z" fill="#0066DA" />
      <path d="M43.649 32.627L37.349 21.793c-0.619 0.364-1.146 0.865-1.513 1.503l-11.638 20.029A4.124 4.151 89.99992 0 0 23.649 45.373l12.6 0z" fill="#00AC47" />
      <path d="M57.35 56.206c0.619-0.364 1.146-0.865 1.511-1.501l0.734-1.253L63.1 47.421c0.367-0.637 0.55-1.342 0.55-2.048L51.048 45.373l2.682 5.234z" fill="#EA4335" />
      <path d="M43.649 32.627L49.95 21.793C49.331 21.43 48.621 21.247 47.888 21.247L39.411 21.247c-0.733 0-1.444 0.204-2.062 0.546z" fill="#00832D" />
      <path d="M51.049 45.373L36.249 45.373 29.949 56.206c0.619 0.364 1.329 0.546 2.062 0.546l23.277 0c0.733 0 1.444-0.204 2.062-0.546z" fill="#2684FC" />
      <path d="M57.281 33.31l-5.82-10.014c-0.367-0.637-0.893-1.138-1.511-1.503L43.649 32.627 51.049 45.373l12.578 0c0-0.705-0.183-1.412-0.55-2.048z" fill="#FFBA00" />
    </svg>
  ),
  notion: (
    <svg width="37.882" height="39" viewBox="153.959 158.5 37.883 39" xmlns="http://www.w3.org/2000/svg">
      <path d="M182.78 171.427l0-4.579c1.198-0.57 2.044-1.775 2.044-3.177l0-0.11c0-1.939-1.593-3.517-3.527-3.517l-0.11 0c-1.945 0-3.528 1.588-3.528 3.517l0 0.11c0 1.402 0.835 2.607 2.044 3.177l0 4.579c-1.78 0.274-3.418 1.008-4.758 2.092L162.33 163.736c0.088-0.318 0.143-0.646 0.142-0.986 0-2.191-1.78-3.977-3.978-3.976S154.505 160.548 154.494 162.739c0 2.191 1.78 3.977 3.978 3.977 0.714 0 1.385-0.197 1.956-0.526l12.407 9.619c-1.055 1.588-1.67 3.484-1.67 5.532s0.681 4.119 1.824 5.751l-3.769 3.758c-0.297-0.088-0.604-0.153-0.934-0.153-1.813 0-3.275 1.457-3.275 3.264s1.462 3.265 3.275 3.265 3.275-1.457 3.274-3.265-0.066-0.635-0.153-0.931l3.736-3.725c1.692 1.293 3.802 2.06 6.099 2.06 5.56 0 10.066-4.492 10.066-10.035s-3.703-9.169-8.528-9.903h0ZM181.231 186.479c-2.846 0-5.165-2.301-5.165-5.149s2.308-5.149 5.165-5.149 5.165 2.301 5.165 5.149-2.308 5.149-5.165 5.149Z" fill="#FF4800" />
    </svg>
  ),
  linear: (
    <svg width="42" height="42" viewBox="33 -8.376 42.002 42.007" xmlns="http://www.w3.org/2000/svg">
      <path d="M70.746 9.239l-16.903 9.515L35.744 8.587 34.873 9.057v7.383l18.97 10.635 16.901-9.478v3.907l-16.901 9.517-18.099-10.167-0.871 0.47v1.265l18.97 10.637 18.933-10.637v-7.381l-0.871-0.47-18.062 10.13L36.904 15.39V11.481l16.939 9.478 18.933-10.633V3.049l-0.944-0.543-17.989 10.095-16.068-8.973 16.068-9.008 13.201 7.416 1.162-0.65V0.481L53.843-7.585 34.873 3.05v1.16l18.97 10.637 16.901-9.517z" fill="#EE3D2C" />
    </svg>
  ),
  slack: (
    <svg width="40" height="40.074" viewBox="1203.801 1206.206 40.008 40.088" xmlns="http://www.w3.org/2000/svg">
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="M1218.456 1206.287c-2.216 0.001-4.01 1.789-4.009 3.992-0.001 2.203 1.793 3.991 4.01 3.992l4.009 0 0-3.991c0.001-2.203-1.793-3.991-4.01-3.993 0.001 0 0.001 0 0 0m0 10.647l-10.69 0c-2.216 0.001-4.01 1.789-4.009 3.991-0.004 2.203 1.792 3.991 4.008 3.994l10.691 0c2.216-0.001 4.01-1.789 4.009-3.992 0.001-2.204-1.793-3.992-4.009-3.993z" fill="#36C5F0" />
        <path d="M1243.845 1220.925c0.001-2.203-1.793-3.991-4.009-3.991-2.216 0.001-4.01 1.789-4.01 3.991l0 3.994 4.01 0c2.216-0.001 4.01-1.789 4.009-3.994z m-10.69 0l0-10.646c0.001-2.201-1.792-3.989-4.008-3.992-2.216 0.001-4.01 1.789-4.009 3.992l0 10.646c-0.004 2.203 1.792 3.991 4.007 3.994 2.216-0.001 4.01-1.789 4.01-3.994z" fill="#2EB67D" />
        <path d="M1229.145 1246.213c2.216-0.001 4.01-1.789 4.01-3.992 0.001-2.203-1.793-3.991-4.01-3.992l-4.009 0 0 3.992c-0.001 2.201 1.793 3.989 4.009 3.992z m0-10.648l10.691 0c2.216-0.001 4.01-1.789 4.009-3.993 0.004-2.203-1.792-3.991-4.008-3.992l-10.69 0c-2.216 0.001-4.01 1.789-4.009 3.991-0.001 2.204 1.792 3.992 4.007 3.994z" fill="#ECB22E" />
        <path d="M1203.757 1231.572c-0.001 2.203 1.793 3.991 4.009 3.993 2.216-0.001 4.01-1.789 4.01-3.993l0-3.991-4.01 0c-2.216 0.001-4.01 1.789-4.009 3.991z m10.69 0l0 10.647c-0.004 2.203 1.792 3.991 4.009 3.994 2.216-0.001 4.01-1.789 4.009-3.992l0-10.645c0.004-2.203-1.792-3.991-4.008-3.993-2.217 0-4.01 1.787-4.01 3.989 0 0 0 0.001 0 0" fill="#E01E5A" />
      </g>
    </svg>
  ),
  lovable: (
    <svg width="36.299" height="38" viewBox="109.85 115 36.299 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M112.263 116.636L133.075 115.086c2.556-0.221 3.213-0.072 4.821 1.106l6.644 4.719C145.636 121.723 146 121.944 146 122.828l0 25.88c0 1.622-0.584 2.581-2.629 2.729L119.203 152.912c-1.535 0.073-2.265-0.148-3.069-1.181L111.241 145.317C110.364 144.136 110 143.252 110 142.22L110 119.215c0-1.326 0.584-2.432 2.263-2.579Z" fill="#FFF" />
      <path d="M133.075 115.086L112.263 116.636C110.585 116.783 110 117.889 110 119.215l0 23.005c0 1.033 0.364 1.916 1.241 3.097l4.893 6.414c0.804 1.033 1.535 1.254 3.069 1.181l24.168-1.475c2.044-0.147 2.629-1.106 2.629-2.729L146 122.828c0-0.838-0.329-1.08-1.295-1.795l-0.166-0.122L137.896 116.192C136.289 115.014 135.632 114.865 133.075 115.086ZM119.749 122.404c-1.973 0.134-2.421 0.164-3.541-0.755L113.358 119.364c-0.29-0.296-0.144-0.665 0.585-0.738l20.008-1.474c1.68-0.148 2.555 0.442 3.212 0.958l3.431 2.507c0.147 0.074 0.512 0.516 0.073 0.516L120.005 122.387l-0.256 0.017Zm-2.3 26.083L117.449 126.516c0-0.96 0.292-1.402 1.167-1.476L142.347 123.639c0.805-0.073 1.169 0.442 1.168 1.401l0 21.824c0 0.96-0.147 1.771-1.46 1.844l-22.709 1.328c-1.314 0.073-1.897-0.368-1.897-1.549ZM139.866 127.694c0.145 0.664 0 1.327-0.658 1.404l-1.095 0.218 0 16.222c-0.95 0.516-1.825 0.81-2.556 0.81-1.168 0-1.461-0.369-2.336-1.474l-7.158-11.354 0 10.985 2.264 0.517s0 1.327-1.826 1.327l-5.037 0.295c-0.147-0.296 0-1.033 0.511-1.179l1.315-0.368L123.29 130.572l-1.825-0.149c-0.147-0.664 0.218-1.622 1.241-1.697l5.403-0.366 7.448 11.501 0-10.175-1.898-0.22c-0.147-0.813 0.437-1.403 1.167-1.475l5.04-0.296Z" fill="#000" />
    </svg>
  ),
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function ForWorkPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SHOWCASE_IMAGES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(nextSlide, 4000);
    return () => clearInterval(id);
  }, [paused, nextSlide]);

  return (
    <main className="bg-parchment">
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="relative isolate pt-14 pb-10 md:pt-24 md:pb-13 overflow-hidden">
        {/* Desktop floating tiles (hidden on mobile) */}
        <div className="pointer-events-none absolute top-0 left-1/2 hidden w-360 -translate-x-1/2 xl:block" aria-hidden="true">
          <svg className="absolute top-0 left-0" width="1440" height="620" viewBox="0 0 1440 620" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Static connector paths */}
            <path d="M270 174 C450 198.64 720 235.6 720 482" stroke="#E8E8E8" />
            <path d="M380 228 C516 248.32 720 278.79999999999995 720 482" stroke="#E8E8E8" />
            <path d="M339 288 C491.4 303.52 720 326.79999999999995 720 482" stroke="#E8E8E8" />
            <path d="M1126 162 C963.6 187.6 720 226 720 482" stroke="#E8E8E8" />
            <path d="M1076 222 C933.6 242.8 720 274 720 482" stroke="#E8E8E8" />
            <path d="M1163 275 C985.8 291.56 720 316.4 720 482" stroke="#E8E8E8" />
            {/* Animated dashed connector paths */}
            {CONNECTOR_PATHS.map((p, i) => (
              <path
                key={i}
                className="for-work-connector-dash"
                d={p.d}
                stroke="#FF8E2A"
                strokeOpacity="0.5"
                pathLength="1"
                style={{ "--dash-len": `${p.len}px`, "--dash-d": `${p.dash}px`, animationDelay: `${p.delay}s, ${p.delay}s` } as React.CSSProperties}
              />
            ))}
          </svg>
          {/* Desktop floating tile logos */}
          {DESKTOP_TILES.map((t, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: t.left, top: t.top, rotate: `${t.rotate}deg` }}
            >
              <div
                className="for-work-tile-bounce flex size-14 items-center justify-center rounded-3.5 bg-white"
                style={{
                  boxShadow: "0 0 0 1px #0000000A,0 1px 1px #0000001F,0 2px 2px -1px #0000000A,0 4px 4px -2px #0000000A,0 8px 8px -4px #0000000A,0 16px 16px -8px #0000000A,0 24px 24px -12px #00000014",
                  animationDelay: `${t.delay}s`,
                }}
              >
                {ICON_SVGS[t.icon]}
              </div>
            </div>
          ))}
        </div>

        {/* Main hero content */}
        <div className="for-work-container relative">
          <div className="flex flex-col items-center gap-y-8">
            {/* Mobile arc tiles (hidden on xl+) */}
            <div className="for-work-tile-arc xl:hidden" aria-hidden="true">
              {ARC_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="for-work-tile-arc-item"
                  style={{ "--arc-angle": `${item.angle}deg`, "--arc-scale": item.scale, "--arc-tile-rotate": `${item.tileRotate}deg` } as React.CSSProperties}
                >
                  <div
                    className="for-work-tile-drift flex size-12 items-center justify-center rounded-3.5 bg-white"
                    style={{
                      boxShadow: "0 0 0 1px #0000000A,0 1px 1px #0000001F,0 2px 2px -1px #0000000A,0 4px 4px -2px #0000000A,0 8px 8px -4px #0000000A,0 16px 16px -8px #0000000A,0 24px 24px -12px #00000014",
                      "--drift-duration": `calc(var(--drift-base, 8s) + ${i} * var(--drift-fan, 0.35s))`,
                      "--drift-delay": `${item.delay}s`,
                    } as React.CSSProperties}
                  >
                    <div className="scale-70">{ICON_SVGS[item.icon]}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Heading */}
            <h1 className="leading-tighter text-5xl font-bold tracking-tighter text-center [text-wrap:balance] md:text-[72px]">
              <span className="inline-block" style={{ transform: "none" }}>Build the software that</span>
              <br />
              <span className="inline-block" style={{ transform: "none" }}>runs your business</span>
            </h1>

            {/* Description + CTA */}
            <div className="flex max-w-2xl flex-col items-center gap-y-8" style={{ opacity: 1 }}>
              <p
                className="text-center font-[500] [text-wrap:pretty] text-base/6 tracking-[-0.32px] md:text-xl/[25px] md:tracking-[-0.5px]"
                style={{ transform: "none", opacity: 1, color: "var(--color-charcoal)" }}
              >
                Describe what your team needs and build it with Lovable: full-stack software on your data, behind a login, connected to the tools you already run.
              </p>
              <Link
                href="/enterprise"
                className="group/for-work-button inline-flex items-center gap-x-1.25 rounded-2 px-4 text-sm/5 font-[500] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.06)] transition-colors duration-300 ease-out py-3 bg-charcoal text-parchment hover:bg-charcoal/90"
                style={{ transform: "none", opacity: 1 }}
              >
                Book a demo
              </Link>
            </div>

            {/* Showcase frame with image slideshow */}
            <div className="relative w-full mt-4 md:mt-16">
              <div aria-hidden="true" className="rounded-3 relative aspect-[1216/784] w-full overflow-clip md:rounded-5" style={{ backgroundColor: "#F7F7F7" }}>
                {SHOWCASE_IMAGES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    width={1216}
                    height={650}
                    alt=""
                    className={`max-w-full for-work-showcase-slide absolute inset-0 h-full w-full object-cover object-top ${i === activeSlide ? "is-active" : ""}`}
                    style={{ height: "auto" }}
                    loading="lazy"
                    decoding="async"
                    sizes="1216px"
                  />
                ))}
              </div>

              {/* Impact glow dots (desktop only) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden xl:block" aria-hidden="true">
                {[0.39, -1.236, -1.668, -0.494, 0.922, 1.869].map((d, i) => (
                  <div
                    key={i}
                    className="for-work-impact-glow"
                    style={{ animationDelay: `${d}s, ${d - 1.89}s` }}
                  />
                ))}
              </div>

              {/* Pause/Play button */}
              <button
                type="button"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                onClick={() => setPaused(!paused)}
                className="group/showcase-pause absolute right-2 bottom-2 z-20 grid size-11 place-items-center rounded-full md:right-3 md:bottom-3"
              >
                <span className="grid size-7.5 place-items-center rounded-full md:size-9 bg-black/40 text-white backdrop-blur-sm transition-colors duration-200 ease-out group-hover/showcase-pause:bg-black/55">
                  {paused ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="shrink-0 size-4" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="shrink-0 size-4" aria-hidden="true">
                      <path d="M9.75 18C9.75 19.5188 8.51878 20.75 7 20.75C5.48122 20.75 4.25 19.5188 4.25 18V6C4.25 4.48122 5.48122 3.25 7 3.25C8.51878 3.25 9.75 4.48122 9.75 6V18ZM19.75 18C19.75 19.5188 18.5188 20.75 17 20.75C15.4812 20.75 14.25 19.5188 14.25 18V6C14.25 4.48122 15.4812 3.25 17 3.25C18.5188 3.25 19.75 4.48122 19.75 6V18Z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Logos ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TEAM_LOGOS.map((l) => (
            <img key={l.name} src={l.src} alt={l.name} loading="lazy" className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100" />
          ))}
        </div>
      </section>

      {/* ── Why Teams Switch ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel">Why teams switch</p>
          <h2 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">Building is just the beginning</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "The proof is in production", desc: "Thousands of teams run Lovable-built tools every day — CRMs, dashboards, portals and more." },
            { title: "Connect your stack", desc: "Supabase, Stripe, GitHub and 100+ integrations keep data flowing." },
            { title: "Safe and secure, as standard", desc: "SSO, roles, scanning and audit logs come built in." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-medium text-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enterprise Image ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img
            src={`${px("https://lovable.dev/cdn-cgi/image/width=1284,f=auto,fit=scale-down")}/https://assets.lovable.dev/content/for-work/plans-enterprise.jpg`}
            alt="Lovable for enterprise teams"
            loading="lazy"
            decoding="async"
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
      </section>

      {/* ── By Team ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel">By team</p>
          <h2 className="text-3xl font-medium tracking-tight text-charcoal md:text-4xl">Tools tailored to your team</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Founders & operators", desc: "Ship the internal tool, the landing page, the MVP — without waiting on eng." },
            { title: "Product teams", desc: "Prototype in the morning, test with users by lunch." },
            { title: "Marketing", desc: "Campaign pages and interactive content without the ticket queue." },
            { title: "Sales", desc: "Custom demos and ROI calculators that close deals." },
            { title: "IT & engineering", desc: "Guardrailed building with SSO, audit logs and code export." },
            { title: "Enterprises", desc: "Data residency, approvals and support that satisfy procurement." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-medium text-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        <h2 className="text-3xl font-medium tracking-tight text-charcoal md:text-5xl">Ready to build what your team needs?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-charcoal/65">Start free, invite your team, and ship your first internal tool this week.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Link href="/new" className="rounded-buttons bg-charcoal px-5 py-2.5 text-[15px] font-medium text-parchment transition-colors hover:bg-charcoal/90">
            Start building
          </Link>
          <Link href="/enterprise" className="rounded-buttons border border-linen-border bg-white px-5 py-2.5 text-[15px] font-medium text-charcoal transition-colors hover:border-stone">
            Talk to sales
          </Link>
        </div>
      </section>
    </main>
  );
}

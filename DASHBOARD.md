# Manus Dashboard — Lovable Tasarım Spesifikasyonu

> **Durum:** Uygulanabilir tasarım dokümanı + hazır CSS token’ları.  
> **Hedef uygulama:** `C:\Users\root\Desktop\manus` (Next.js 16, `src/app/dashboard/`)  
> **Referans sistem:** Lovable Style Reference (parşömen / achromatic / pill)  
> **Yerel URL:** `http://localhost:3000/dashboard` (`npm run dev`)

---

## 1. Genel bakış

Manus dashboard, projeler, yıldızlananlar, “benim oluşturduklarım” ve bağlayıcılar (connectors) için merkezi bir çalışma alanıdır. Lovable diliyle: **sıcak parşömen bir tuval** üzerinde neredeyse tamamen **akromatik (renksiz)** bir arayüz; tek renkli spektakül yalnızca dekoratif hero şeridinde (`--gradient-hero`) — **asla buton / CTA / badge üzerinde değil**.

Bu doküman:

- Mevcut `/dashboard` rotalarını Lovable yüzeylerine eşler
- Layout (sidebar + ana tuval + kartlar) wireframe’lerini verir
- CSS `:root` + Tailwind `@theme` token’larını içerir
- Yap / Yapma kurallarını ve agent prompt rehberini bu dashboard’a uyarlar
- Uygulama checklist’i sunar

---

## 2. Tasarım ilkeleri (Lovable → Manus)

| İlke | Uygulama |
|------|----------|
| Tuval | `#fcfbf8` (parchment) — sayfa / layout arka planı |
| Kart yüzeyi | `#f7f4ed` (warm-sand) |
| Kenarlık | `#eceae4` (linen-border) — tek border rengi |
| Metin | `#1c1c1c` charcoal; vurgu `#030303` ink; ikincil `#5f5f5d` dim-gray |
| Tipografi | Inter veya DM Sans (Camera Plain Variable yedeği); global `letter-spacing: -0.025em`; başlık weight **500** (font 480 destekliyorsa 480) |
| Butonlar | `border-radius: 9999px` pill; Dark / Outlined / Ghost |
| Gölge | Inset / subtle; ağır drop-shadow yok (chat input hariç) |
| Renk | Achromatic UI; hero gradient yalnızca dekoratif şerit |

---

## 3. Rotalar ve Lovable eşlemesi

Kaynak ağaç (bilinen yapı):

```
src/app/dashboard/
  layout.tsx          → Shell: sidebar + main canvas
  page.tsx            → Ana dashboard (özet / prompt / son projeler)
  _components.tsx     → Paylaşılan widget’lar
  connectors/         → Bağlayıcı listesi
  created-by-me/      → Benim oluşturduklarım
  projects/           → Proje ızgarası
  starred/            → Yıldızlananlar
```

| Rota | Lovable yüzeyi | Bileşenler |
|------|----------------|------------|
| `/dashboard` | Canvas + opsiyonel Chat Input Card + Template Preview grid (son projeler) | Section Heading, Dark Pill CTA, Warm Surface Card |
| `/dashboard/projects` | Template Preview Card ızgarası | card-template, View All pill |
| `/dashboard/starred` | Aynı ızgara; boş durumda Warm Surface empty-state | card-template |
| `/dashboard/created-by-me` | Aynı ızgara + Dark Pill “Yeni proje” | card-template, btn-pill-dark |
| `/dashboard/connectors` | Warm Surface Card listesi (satır kartları) | card-warm, Outlined / Dark pill aksiyonlar |
| `layout` sidebar | Sticky sol nav; Ghost / aktif pill | dashboard-sidebar, nav-item |

---

## 4. Layout wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ [opsiyonel 4px hero-gradient-strip — sadece dekor]          │
├──────────────┬──────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN CANVAS (#fcfbf8)                         │
│ #fcfbf8      │                                              │
│ 240px        │  H1 Section Heading (36–48px / w500)         │
│ border-right │  subtitle dim-gray                           │
│ linen        │                                              │
│              │  [Chat Input Card?]  warm-sand / r24         │
│  Logo        │                                              │
│  ─────────   │  Bölüm başlığı + “Tümünü gör” outlined pill  │
│  Ana sayfa   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  Projeler    │  │prev│ │prev│ │prev│ │prev│  template cards │
│  Yıldızlı    │  └────┘ └────┘ └────┘ └────┘               │
│  Oluşturduk. │                                              │
│  Bağlayıcılar│                                              │
│              │                                              │
│  [Yeni +]    │                                              │
│  dark pill   │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Sidebar kuralları

- Arka plan: parchment
- Aktif öğe: warm-sand zemin + inset shadow + ink metin; `border-radius: 9999px`
- Pasif: dim-gray metin; hover’da `rgba(28,28,28,0.03)`
- Altta birincil aksiyon: Dark Pill (`rgba(0,0,0,0.88)` + inset shadow)

### Main canvas

- Padding: 24–32px
- Max içerik: ~1280px
- Kartlar arası gap: 16–24px
- Bölüm arası: 32–48px (dashboard içinde; marketing’deki 80px kadar abartma)

---

## 5. Ekran ekran wireframe’ler

### 5.1 `/dashboard` — Ana

1. Üst: “Dashboard” / kullanıcı selamı — heading 36px w500 charcoal  
2. Alt satır: kısa açıklama 16px dim-gray  
3. (Varsa) Chat / “Yeni fikir” alanı → `.chat-input-card`  
4. “Son projeler” satırı + sağda Outlined Pill “Tümünü gör” → `/dashboard/projects`  
5. 2–4 kolon Template Preview Card  
6. “Bağlayıcılar” özeti → Warm Surface satır kartları (en fazla 3) + Outlined “Yönet”

**Sahte metrik uydurma:** Kodda gerçek sayaç yoksa sayı gösterme; “—” veya boş state kullan.

### 5.2 `/dashboard/projects`

- Başlık “Projeler” + Dark Pill “Yeni proje”
- Filtre/chip’ler: Outlined Pill (aktifte warm-sand + inset)
- Grid: Template Preview Cards (görsel 12px radius + linen + açıklama)

### 5.3 `/dashboard/starred`

- Aynı grid; boşsa merkezde Warm Surface: “Henüz yıldızlanan proje yok” + Outlined “Projelere git”

### 5.4 `/dashboard/created-by-me`

- Grid + Dark Pill CTA; kartlarda “benim” etiketi caption 14px dim-gray (renkli badge yok)

### 5.5 `/dashboard/connectors`

- Liste: her bağlayıcı bir Warm Surface Card (yatay: ikon monokrom charcoal, ad, durum caption, sağda Outlined “Bağla” / Dark “Açık”)
- Durum rengi yok; metinle “Bağlı / Bağlı değil”

---

## 6. CSS token’ları

Hazır dosya: `lovable-tokens.css` (bu handoff klasöründe).  
Hedef: `src/app/globals.css` (veya projedeki global stil dosyası) içine yapıştır / import et.

Özet `:root`:

```css
:root {
  --color-parchment: #fcfbf8;
  --color-warm-sand: #f7f4ed;
  --color-linen-border: #eceae4;
  --color-stone: #d4d3d0;
  --color-dim-gray: #5f5f5d;
  --color-charcoal: #1c1c1c;
  --color-ink: #030303;
  --font-sans: "Inter", "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --tracking-tight: -0.025em;
  --radius-pill: 9999px;
  --radius-card: 16px;
  --radius-card-lg: 24px;
  --radius-image: 12px;
  --shadow-inset: oklch(0 0 0 / 0.25) 0px 0px 0px 0.5px inset;
  --shadow-dark-pill:
    rgba(255,255,255,0.2) 0 0.5px 0 0 inset,
    rgba(0,0,0,0.2) 0 0 0 0.5px inset,
    rgba(0,0,0,0.05) 0 1px 2px 0;
}
```

Tailwind v4 `@theme` bloğu `lovable-tokens.css` içinde.

Inter yükleme (layout veya globals):

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

---

## 7. Uygulama checklist (kod)

1. `globals.css` → token’ları ekle; body/dashboard root’a parchment + Inter + tracking  
2. `dashboard/layout.tsx` → sidebar + main sınıflarını Lovable’a çek (bg, border linen, pill nav)  
3. `dashboard/_components.tsx` → buton/kart/empty-state varyantlarını Dark/Outlined/Ghost + card-warm/card-template yap  
4. `page.tsx` + `projects|starred|created-by-me|connectors` → başlık tipografisi, grid gap, kart stilleri  
5. Renkli CTA / mavi primary / cool gray / drop-shadow tarayıp kaldır  
6. `npm run dev` → `http://localhost:3000/dashboard` doğrula  

Utility örnekleri (Tailwind):

```tsx
// Dark pill
className="rounded-full bg-black/90 text-[#fcfbf8] px-3 py-1.5 text-sm tracking-tight shadow-[inset_0_0.5px_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2)]"

// Outlined pill
className="rounded-full border border-[#eceae4] text-[#1c1c1c] px-3 py-1.5 text-sm tracking-tight bg-transparent"

// Canvas
className="bg-[#fcfbf8] text-[#1c1c1c] tracking-tight"

// Card
className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-5 shadow-none"
```

---

## 8. Yap / Yapma

### Yap

- Parchment tuval + warm-sand kart
- Pill (9999px) tüm aksiyon butonlarında
- Inset gölge dark pill’de
- `-0.025em` tracking; başlık ~500
- Tek border rengi linen `#eceae4`
- Boş state’lerde abartısız tipografi

### Yapma

- `#ffffff` soğuk beyaz tuval
- Cool gray (`#e5e7eb`, `#6b7280`)
- Renkli CTA / mavi primary buton
- Kartlarda ağır drop-shadow
- Hero gradient’i buton fill olarak kullanma
- Weight 700 bold
- Sahte KPI / uydurma metrik

---

## 9. Agent prompt rehberi (bu dashboard için)

> “Manus `src/app/dashboard` UI’sini Lovable’a çek. Tuval `#fcfbf8`, kart `#f7f4ed`, border `#eceae4`, metin `#1c1c1c` / `#5f5f5d`. Butonlar `rounded-full`; primary `bg-black/90 text-[#fcfbf8]` inset shadow; secondary outlined linen. Inter, tracking `-0.025em`, başlık font-medium. Sidebar aktif öğe warm-sand pill. Projeler ızgarası Template Preview: görsel `rounded-xl` + linen. Renkli CTA ve drop-shadow yok. Mevcut route yapısını bozma.”

---

## 10. Yerel çalıştırma

```powershell
cd C:\Users\root\Desktop\manus
npm run dev
```

- Ana: http://localhost:3000  
- Dashboard: http://localhost:3000/dashboard  
- Alt: `/dashboard/projects`, `/dashboard/starred`, `/dashboard/created-by-me`, `/dashboard/connectors`

---

## 11. Handoff notu (executor)

Bu MD + `lovable-tokens.css`, executor subagent’ın **machineId’li Shell’e erişememesi** nedeniyle önce box’ta üretildi. Parent / local Shell ile şu yollara kopyalanmalı:

- `C:\Users\root\Desktop\manus\DASHBOARD.md`
- Token’lar → `src/app/globals.css` (veya eşdeğeri)
- Ardından layout/_components/sayfalar restyle + `npm run dev`


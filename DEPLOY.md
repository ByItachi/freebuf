# Freebuff — Dağıtım Rehberi

> Üç hedef: **(1)** Windows `.exe` masaüstü uygulaması, **(2)** macOS/Linux kurulumları,
> **(3)** web sürümünün canlıya alınması. Hepsi bu repodan üretilir.

---

## 1. Windows `.exe` (bu makinede)

### Gereksinimler (tek seferlik)

1. **Rust** (MSVC hedefiyle):
   ```powershell
   winget install --id Rustlang.Rustup -e
   rustup default stable-x86_64-pc-windows-msvc
   ```
2. **MSVC C++ araç zinciri**: Makinede `VS 2019 BuildTools` kurulu (doğrulandı ✅).
   Eksik olsaydı: `winget install --id Microsoft.VisualStudio.2019.BuildTools -e --override "--add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"`

### Derleme

```powershell
npm install          # bağımlılıklar + @tauri-apps/cli
npm run desktop:prepare   # Next'i standalone derler + Node runtime'ı paketler
npm run tauri:build       # Rust derlemesi + kurulum paketleri
```

**Çıktılar** (`src-tauri/target/release/`):

| Dosya | Ne işe yarar |
|---|---|
| `freebuff.exe` | Tek dosyalık taşınabilir uygulama |
| `bundle/nsis/Freebuff_0.1.0_x64-setup.exe` | Kurulum sihirbazı (önerilen dağıtım) |
| `bundle/msi/*.msi` | MSI kurulum paketi (kurumsal dağıtım) |

Nasıl çalışır: Tauri penceresi açılır; uygulama içinde **paketlenmiş Node runtime**
ile Next.js standalone sunucusu `127.0.0.1` üzerinde ayağa kalkar (port aralığı
36412–36442), UI o sunucudan yüklenir. Uygulama kapanınca sunucu da kapanır.
Kullanıcı verisi `%APPDATA%\com.freebuff.desktop\` altında saklanır
(`FREEBUFF_DATA_DIR`), `server.log` da aynı klasörde tutulur.

Yönetici paneli (`/admin`) yerel kurulumda `freebuff-local` şifresiyle açılır.

### Geliştirme modu

```powershell
npm run dev          # terminal 1 — next dev (port 3000)
npm run desktop:dev  # terminal 2 — tauri penceresi dev sunucuya bağlanır
```

---

## 2. Tüm platformlar (GitHub Actions ile otomatik)

Depo GitHub'a pushlandıktan sonra:

```powershell
git init; git add .; git commit -m "feat: desktop + deploy altyapisi"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/FREEBUFF_REPO.git
git push -u origin main
git tag v0.1.0 && git push origin v0.1.0   # etiket = tüm platformlarda derleme
```

`v*` etiketi push edildiğinde **Desktop Builds** workflow'u şu çıktıları üretir:

- Windows: NSIS `.exe` kurulum + MSI + portable `freebuff.exe`
- macOS (Apple Silicon + Intel): `.dmg` + `.app`
- Linux: `.deb` + `.AppImage`

Sonuçlar: GitHub → **Actions** → ilgili run → **Artifacts**.

---

## 3. Web sürümünü canlıya alma

### Seçenek A — Vercel (en hızlı)

1. Depoyu https://vercel.com/import ile içe aktarın — Next.js otomatik tanınır.
2. **Environment Variables**'a `.env.example`'daki sağlayıcı anahtarlarını girin
   (ör. `OPENAI_API_KEY`). `ADMIN_PASSWORD` mutlaka ayarlayın.
3. Deploy. Alternatif olarak repo secret'ına `VERCEL_TOKEN` ekleyip
   repo variable'ı `DEPLOY_TARGET=vercel` yapın; **Web Deploy** workflow'u halleder.

### Seçenek B — Kendi sunucunuz (Ubuntu 24.04, Docker)

```bash
# 1) Sunucuyu hazırla
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh

# 2) Uygulamayı al ve çalıştır
git clone https://github.com/KULLANICI_ADI/FREEBUFF_REPO.git freebuff
cd freebuff
cp .env.example .env.production   # anahtarları doldur
docker compose up -d --build
curl http://localhost:3000/api/platform/status   # {"ok":...} beklenir
```

`docker-compose.yml` uygulamayı + PostgreSQL/Redis'i (ilerideki sunucu bileşenleri
için hazır) ayağa kaldırır; veriler `app-data` volume'ünde kalıcıdır.

### Seçenek C — Kendi sunucunuz (PM2 + Nginx, Dockersız)

```bash
# Node 20+ kurulu olmalı
git clone https://github.com/KULLANICI_ADI/FREEBUFF_REPO.git freebuff && cd freebuff
npm ci
NEXT_OUTPUT=standalone npm run build
cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/
sudo mkdir -p /var/lib/freebuff && sudo chown $USER /var/lib/freebuff
pm2 start ecosystem.config.js     # vercel/deploy bölümündeki konfig
pm2 save && pm2 startup           # reboot'ta otomatik başlar
sudo cp deploy/nginx-freebuff.conf /etc/nginx/sites-available/freebuff
sudo ln -s /etc/nginx/sites-available/freebuff /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.yourdomain.com   # SSL
```

Nginx konfigürasyonu WebSocket upgrade + 300 saniye AI stream timeout içerir
(`deploy/nginx-freebuff.conf`).

---

## 4. Mimari notlar

```
Masaüstü (Tauri)                     Web (canlı)
┌──────────────────────────┐         ┌─────────────────────────────┐
│ freebuff.exe             │         │ Nginx (SSL, WS, 300s)       │
│  └ WebView → 127.0.0.1   │         │  └ pm2 / docker → server.js │
│  ┌────────────────────┐  │         │     └ Next.js standalone    │
│  │ node.exe (paketli) │  │         │       API routes /chat vs.  │
│  │  server.js (Next)  │  │         │  Data: /var/lib/freebuff    │
│  └────────────────────┘  │         └─────────────────────────────┘
│  Data: %APPDATA%\...     │
└──────────────────────────┘
```

- API route'lar (chat proxy, proje deposu, admin) masaüstünde **yerel** çalışır;
  sağlayıcı anahtarları sunucu tarafında kalır.
- `FREEBUFF_DATA_DIR`: her iki ortamda da yazılabilir veri klasörünü belirler.
- Veri dosyaları: `projects.json` + `admin.json` (basit, yedeklemesi kolay).

## 5. Sorun giderme

| Belirti | Çözüm |
|---|---|
| `bundled Node runtime not found` | `npm run desktop:prepare` sonrası `tauri build` çalıştırın |
| Pencere "Starting local server..." takılıyor | `%APPDATA%\com.freebuff.desktop\server.log` dosyasına bakın |
| `link.exe not found` (Rust derlemesi) | VS Build Tools + `VC.Tools.x86.x64` bileşeni kurulu mu kontrol edin |
| Canlıda chat 403 | `/admin` → AI sekmesinden sağlayıcı anahtarı ekleyin veya env verin |
| Port çakışması | Desktop otomatik 36412–36442 arası boş port seçer; web'de `PORT` env değiştirin |

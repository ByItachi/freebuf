# Freebuff AI Agent Studio — Sunucu Konfigürasyon Yol Haritası

Uygulamanın canlı backend servislerini ve AI Agent yapısını barındırmak için sunucu kurulum adımları.

| Aşama | Bileşen | Yapılacak İşlem | Konfigürasyon / Komut |
| :--- | :--- | :--- | :--- |
| **1. Sunucu** | Ubuntu 24.04 LTS | Sistem güncellemeleri ve temel paketler | `sudo apt update && sudo apt upgrade -y` |
| **2. Çalışma Zamanı** | Node.js v20 & Docker | Node.js ve Docker ortamının kurulması | `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash -` |
| **3. Veritabanı** | PostgreSQL & Redis | Kullanıcı verileri ve Agent kuyruk yönetimi | Docker Compose ile PostgreSQL + Redis konteynerleri |
| **4. Process Manager** | PM2 | Backend servisinin kesintisiz çalıştırılması | `npm install -g pm2 && pm2 start npm --name "freebuff-api" -- start` |
| **5. Reverse Proxy** | Nginx & WebSocket | API ve WebSocket yönlendirmesi | Nginx konfigürasyon dosyası `/etc/nginx/sites-available/freebuff` |
| **6. Güvenlik** | UFW & SSL | Güvenlik duvarı ve Certbot SSL | `sudo certbot --nginx -d api.domaininiz.com` |

## Örnek Nginx WebSocket Konfigürasyonu

```nginx
server {
    listen 80;
    server_name api.domaininiz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker Compose — PostgreSQL + Redis

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: freebuff
      POSTGRES_USER: freebuff
      POSTGRES_PASSWORD: change-me
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
```

## PM2

```bash
npm install -g pm2
pm2 start npm --name "freebuff-api" -- start
pm2 save && pm2 startup
```

## Hugging Face tarzı tasarım referansı

- Tek sıcak renk: marka sarısı yalnızca logoda (#ffd210)
- Gece paneli (#101828 → #0b0f19 gradyanı) yalnızca hero ve ürün önizlemesinde
- Hairline sınırlar (#e5e7eb), 8px kart yarıçapı, gölge yok, veri yoğun listeler
- Monospace tanımlayıcılar (IBM Plex Mono 15px): model adları, repo yolları, diff sayıları

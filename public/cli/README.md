# manus CLI

Terminalden Manus workspace'ini yönetin — llama-cli tarzı interaktif REPL, proje yönetimi ve agent sohbeti.

## Kurulum

```bash
# Doğrudan indirip çalıştırın (Node 18+)
curl -fsSL http://localhost:3000/manus.mjs -o manus.mjs && node manus.mjs --help

# veya global kurun
npm i -g manus-cli
```

## Bağlanma

```bash
manus login --server http://localhost:3000 --email ben@ornek.com --name "Gürkan"
manus whoami
```

Profil `~/.manus/config.json` içine kaydedilir.

## İnteraktif REPL (llama-cli tarzı)

```bash
$ manus chat

  __  __
 |  \/  |   _ __     ___   _ __    ___
 | |\/| |  | '_ \   / _ \ | '_ \  / _ \
 | |  | |  | | | | |  __/ | | | | |  __/
 |_|  |_|  |_| |_|  \___| |_| |_|  \___|

  manus  · http://localhost:3000
  build : 0.2.0   modality : chat + projects   data : ~/.manus/config.json

available commands:
  /exit or Ctrl+C    stop or exit
  /regen             regenerate the last response
  /clear             clear the chat history
  /read <file>       attach a text file to the context
  /projects          list workspace projects
  /new <prompt>      create a project and select it
  /open <id|name>    open the selected project in the browser
  /model             show AI provider availability
  /server <url>      switch server
  /help              list commands

  HELLO THERE
  Type a message or /read a file to get started

you > merhaba
manus > Merhaba! ...
```

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `manus login` | Sunucuya bağlan ve profil kaydet |
| `manus whoami` | Bağlı profil ve sunucu |
| `manus projects [--json]` | Projeleri listele |
| `manus new "Todo app"` | Yeni proje oluştur |
| `manus open <id>` | Projeyi tarayıcıda aç |
| `manus rm <id>` | Projeyi sil |
| `manus chat "mesaj"` | Tek seferlik agent sorusu |
| `manus chat` | İnteraktif REPL |
| `manus models` | AI sağlayıcılarının anahtar durumunu listele |
| `manus logout` | Yerel profili sil |

## REPL komutları

| Komut | Açıklama |
| --- | --- |
| `/exit`, `/quit`, Ctrl+C | Çıkış |
| `/regen` | Son yanıtı yeniden üret |
| `/clear` | Sohbet geçmişini temizle |
| `/read <dosya>` | Bağlama metin dosyası ekle (llama-cli'deki `/read` gibi) |
| `/projects` | Projeleri listele |
| `/new <prompt>` | Proje oluştur ve seç |
| `/open <id\|isim>` | Projeyi tarayıcıda aç |
| `/model` | AI sağlayıcı kullanılabilirliği |
| `/server <url>` | Sunucuyu değiştir |
| `/help` | Komutları listele |

## Örnekler

```bash
$ manus projects
abc12345  Refero Design Screens  ★
def67890  crowl auth redesign

2 project(s)

$ manus chat "kullanıcı girişi sayfası ekle"
Login sayfası için plan: ...

$ manus chat
you > /read CONTRIBUTING.md
✓ Loaded text from 'CONTRIBUTING.md' (2314 bytes)
you > bu dosyadaki katkı kurallarını özetle
manus > ...
```

AI anahtarları sunucu tarafında (`/admin` → Cloud & AI balance) veya ortam değişkenleriyle
(`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, …) ayarlanır; CLI yalnızca sunucunun yanıtını görür.

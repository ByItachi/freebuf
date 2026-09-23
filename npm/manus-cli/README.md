# manus-cli

> Manus workspace'inizi terminalden yönetin — llama-cli esintili interaktif REPL, proje yönetimi ve agent sohbeti.

```bash
npm i -g manus-cli
manus login --server http://localhost:3000
manus chat
```

## REPL

```
  __  __
 |  \/  |   _ __     ___   _ __    ___
 | |\/| |  | '_ \   / _ \ | '_ \  / _ \
 | |  | |  | | | | |  __/ | | | | |  __/
 |_|  |_|  |_| |_|  \___| |_| |_|  \___|

  manus  · http://localhost:3000

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
```

## One-shot komutlar

```bash
manus projects            # listele
manus new "Todo app"      # oluştur
manus open <id>           # tarayıcıda aç
manus rm <id>             # sil
manus chat "mesaj"        # tek seferlik sor
manus models              # sağlayıcı durumu
```

## Yayınlama (maintainer)

```bash
cd npm/manus-cli
cp ../../cli/manus.mjs .
cp ../../public/cli/README.md ./README.md   # veya bu README'yi düzenleyin
npm publish
```

Sadece `manus.mjs` + `README.md` yayınlanır (`files` alanı); bağımlılık yoktur, Node 18+ yeterlidir.

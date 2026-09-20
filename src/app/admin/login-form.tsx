"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Şifre hatalı");
        return;
      }
      window.location.reload();
    } catch {
      setError("Giriş başarısız — tekrar dene");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#1c1c1a] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]"
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.06] text-white">
        <KeyRound className="size-5" />
      </div>
      <h1 className="mt-4 text-[18px] font-medium tracking-tight text-white">Admin paneli</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-white/50">
        Devam etmek için yönetici şifresini gir. <code className="text-white/70">ADMIN_PASSWORD</code>{" "}
        ortam değişkeniyle belirlenir; tanımlı değilse sunucu konsolunda geçici şifre görünür.
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Yönetici şifresi"
        autoFocus
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/25"
      />
      {error ? <p className="mt-2 text-[12px] text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={busy || !password}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[14px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Giriş yap
      </button>
    </form>
  );
}

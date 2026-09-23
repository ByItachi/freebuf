"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LovableMark } from "@/components/brand";

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
      className="w-full max-w-sm rounded-3xl border border-linen-border bg-parchment p-6 shadow-[0_24px_60px_-32px_rgba(28,28,28,0.25)]"
    >
      <div className="flex items-center gap-2">
        <LovableMark className="size-6" />
        <span className="text-[15px] font-medium tracking-tight text-charcoal">Refero Design</span>
      </div>
      <h1 className="mt-4 text-[18px] font-medium tracking-tight text-charcoal">Admin paneli</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-dim-gray">
        Devam etmek için yönetici şifresini gir.{" "}
        <code className="text-charcoal">ADMIN_PASSWORD</code> ortam değişkeniyle belirlenir;
        tanımlı değilse sunucu konsolunda geçici şifre görünür.
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Yönetici şifresi"
        autoFocus
        className="mt-4 w-full rounded-xl border border-linen-border bg-parchment px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-dim-gray focus:border-stone"
      />
      {error ? <p className="mt-2 text-[12px] text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy || !password}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-[14px] font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Giriş yap
      </button>
    </form>
  );
}

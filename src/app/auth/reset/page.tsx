"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ResetPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    if (!ready) { setError("This reset link is invalid or has expired."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message); else setMessage("Password updated successfully. You can now sign in.");
  }

  return <main className="min-h-screen grid place-items-center px-5 py-10"><div className="card w-full max-w-md p-7"><Link href="/auth" className="text-sm text-green-400">← Back to sign in</Link><h1 className="mt-5 text-3xl font-black">Set a new password</h1><p className="mt-2 text-sm text-slate-400">Choose a new password for your Numberly account.</p><form onSubmit={submit} className="mt-6 space-y-4"><input value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} type="password" autoComplete="new-password" placeholder="New password" className="input"/><input value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={6} type="password" autoComplete="new-password" placeholder="Confirm password" className="input"/><button disabled={loading || !ready} className="gradient w-full rounded-xl py-3 font-bold text-slate-950 disabled:opacity-60">{loading ? "Updating..." : "Update password"}</button></form>{error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}{message && <p className="mt-4 rounded-lg border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-200">{message}</p>}</div></main>;
}

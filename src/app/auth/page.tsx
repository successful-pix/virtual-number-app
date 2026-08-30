"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage("");
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setMessage(result.error.message);
    else if (mode === "signup") setMessage("Account created. Check your email if confirmation is enabled, then sign in.");
    else window.location.href = "/dashboard";
    setLoading(false);
  }

  return <main className="min-h-screen grid place-items-center px-5 py-10"><div className="card w-full max-w-md p-7"><Link href="/" className="text-sm text-green-400">← Back to Numberly</Link><h1 className="mt-5 text-3xl font-black">{mode === "signup" ? "Create account" : "Welcome back"}</h1><p className="mt-2 text-sm text-slate-400">Manage your virtual numbers in one secure place.</p><form onSubmit={submit} className="mt-6 space-y-4">{mode === "signup" && <input value={fullName} onChange={e=>setFullName(e.target.value)} required placeholder="Full name" className="input"/>}<input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="Email address" className="input"/><input value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} type="password" placeholder="Password" className="input"/><button disabled={loading} className="gradient w-full rounded-xl py-3 font-bold text-slate-950 disabled:opacity-60">{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button></form>{message && <p className="mt-4 text-sm text-slate-300">{message}</p>}<button onClick={()=>{setMode(mode === "signup" ? "login" : "signup");setMessage("")}} className="mt-5 text-sm text-green-400">{mode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}</button></div></main>;
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
        if (error) throw error;
        if (data.session) window.location.href = "/dashboard";
        else setMessage("Account created. Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Authentication failed. Please try again."); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/reset` });
    setLoading(false);
    if (error) setError(error.message); else setMessage("Password reset instructions have been sent if the account exists.");
  }

  return <main className="min-h-screen grid place-items-center px-5 py-10"><div className="card w-full max-w-md p-7"><Link href="/" className="text-sm text-green-400">← Back to Numberly</Link><h1 className="mt-5 text-3xl font-black">{mode === "signup" ? "Create your account" : "Welcome back"}</h1><p className="mt-2 text-sm text-slate-400">Sign in to manage your private virtual-number workspace.</p><form onSubmit={submit} className="mt-6 space-y-4">{mode === "signup" && <input value={fullName} onChange={e=>setFullName(e.target.value)} required autoComplete="name" placeholder="Full name" className="input"/>}<input value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" type="email" placeholder="Email address" className="input"/><input value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} type="password" placeholder="Password" className="input"/><button disabled={loading} className="gradient w-full rounded-xl py-3 font-bold text-slate-950 disabled:opacity-60">{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button></form>{mode === "login" && <button onClick={resetPassword} disabled={loading} className="mt-4 text-sm text-slate-400 hover:text-green-400">Forgot your password?</button>}{error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}{message && <p className="mt-4 rounded-lg border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-200">{message}</p>}<button onClick={()=>{setMode(mode === "signup" ? "login" : "signup");setError("");setMessage("")}} className="mt-5 text-sm text-green-400">{mode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}</button></div></main>;
}

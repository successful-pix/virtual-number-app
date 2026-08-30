"use client";

import Link from "next/link";
import { ArrowRight, Check, Globe2, LockKeyhole, MessageSquare, Phone, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: <Globe2 />, title: "Choose coverage", text: "Browse countries supported by your authorized number provider." },
  { icon: <Phone />, title: "Manage numbers", text: "Keep active numbers, rental dates and service status together." },
  { icon: <MessageSquare />, title: "View messages", text: "Use the inbox for messages delivered to numbers you legitimately control." },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold"><span className="gradient grid h-9 w-9 place-items-center rounded-xl text-slate-950"><Phone size={18}/></span>Numberly</Link>
        <div className="hidden gap-8 text-sm text-slate-300 md:flex"><a href="#how">How it works</a><a href="#security">Security</a></div>
        <Link href="/auth" className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold">Sign in</Link>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300"><Sparkles size={14}/> Private number management</div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">Your number.<br/><span className="text-green-400">Your control.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">A private dashboard for managing virtual phone numbers obtained through authorized providers.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/numbers" className="gradient flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-slate-950">Browse numbers <ArrowRight size={18}/></Link><Link href="/auth" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold">Create account</Link></div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-400"><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> No hardware</span><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Secure account</span><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Auditable activity</span></div>
        </div>
        <div className="card p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Numberly workspace</p><h2 className="mt-1 text-xl font-bold">Manage your numbers</h2></div><Phone className="text-green-400"/></div>
          <div className="mt-6 space-y-3"><div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="font-semibold">Virtual numbers</p><p className="mt-1 text-sm text-slate-400">View availability and active rentals.</p></div><div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="font-semibold">Message inbox</p><p className="mt-1 text-sm text-slate-400">Review supported inbound messages.</p></div><div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="font-semibold">Transactions</p><p className="mt-1 text-sm text-slate-400">Track purchases and service charges.</p></div></div>
          <Link href="/dashboard" className="gradient mt-5 block w-full rounded-xl py-3 text-center font-bold text-slate-950">Open dashboard</Link>
        </div>
      </section>

      <section id="how" className="border-y border-slate-800/80 bg-slate-950/30"><div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3">{features.map((f)=><Feature key={f.title} {...f}/>)}</div></section>
      <section id="security" className="mx-auto max-w-6xl px-5 py-16"><div className="card flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-400/10 text-green-400"><ShieldCheck/></div><div><h2 className="font-bold">Security first</h2><p className="mt-1 text-sm leading-6 text-slate-400">Authentication and private data are protected with Supabase Auth and Row Level Security. Provider credentials remain server-side.</p></div></div><div className="flex items-center gap-2 text-sm text-slate-400"><LockKeyhole size={16}/> Protected architecture</div></div></section>
      <footer className="border-t border-slate-800 px-5 py-8 text-center text-sm text-slate-500">© 2026 Numberly · Private virtual number management</footer>
    </main>
  );
}
function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <div className="card p-5"><div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-green-400/10 text-green-400">{icon}</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>}

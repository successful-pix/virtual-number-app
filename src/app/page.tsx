"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Globe2, LockKeyhole, MessageSquare, Phone, ShieldCheck, Sparkles } from "lucide-react";

const countries = [
  { flag:"🇺🇸", name:"United States", code:"+1", price:"$2.99/mo", stock:"128 numbers" },
  { flag:"🇬🇧", name:"United Kingdom", code:"+44", price:"$3.49/mo", stock:"84 numbers" },
  { flag:"🇨🇦", name:"Canada", code:"+1", price:"$2.99/mo", stock:"62 numbers" },
  { flag:"🇩🇪", name:"Germany", code:"+49", price:"$4.99/mo", stock:"41 numbers" },
  { flag:"🇳🇬", name:"Nigeria", code:"+234", price:"$1.99/mo", stock:"36 numbers" },
  { flag:"🇦🇺", name:"Australia", code:"+61", price:"$4.49/mo", stock:"29 numbers" },
];

export default function Home() {
  const [country, setCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2 text-xl font-bold"><span className="gradient grid h-9 w-9 place-items-center rounded-xl text-slate-950"><Phone size={18}/></span>Numberly</div>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex"><a href="#numbers">Numbers</a><a href="#how">How it works</a><a href="#security">Security</a></div>
        <button onClick={()=>setStarted(true)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-slate-500">Sign in</button>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
        <div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300"><Sparkles size={14}/> Private numbers, made simple</div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">Your number.<br/><span className="text-green-400">Your control.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">Get a virtual phone number for calls and messages without needing a second physical SIM. Manage everything from one secure dashboard.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={()=>document.getElementById('numbers')?.scrollIntoView({behavior:'smooth'})} className="gradient flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-slate-950">Get a number <ArrowRight size={18}/></button><button onClick={()=>setStarted(true)} className="rounded-xl border border-slate-700 px-5 py-3 font-semibold">Create account</button></div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-400"><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> No hardware</span><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Cancel anytime</span><span className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Secure by design</span></div>
        </div>
        <div className="card p-5 shadow-2xl shadow-black/20"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm text-slate-400">Choose a country</p><p className="font-bold">Available numbers</p></div><Globe2 className="text-green-400"/></div>
          <div className="relative"><button onClick={()=>setOpen(!open)} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-4"><span className="flex items-center gap-3"><span className="text-2xl">{country.flag}</span><span className="text-left"><b className="block">{country.name}</b><small className="text-slate-400">{country.code} · from {country.price}</small></span></span><ChevronDown size={18}/></button>{open&&<div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">{countries.map(c=><button key={c.name} onClick={()=>{setCountry(c);setOpen(false)}} className="flex w-full items-center gap-3 p-3 text-left hover:bg-slate-800"><span className="text-xl">{c.flag}</span><span className="flex-1"><b>{c.name}</b><small className="ml-2 text-slate-500">{c.code}</small></span><small className="text-green-300">{c.price}</small></button>)}</div>}</div>
          <div className="mt-4 rounded-xl bg-slate-900/70 p-4"><div className="flex items-center justify-between"><span className="font-mono text-lg">{country.code} ••• ••••</span><span className="rounded-full bg-green-400/10 px-2 py-1 text-xs text-green-300">{country.stock}</span></div><p className="mt-2 text-sm text-slate-500">A real number provisioned through an authorized provider.</p></div>
          <button onClick={()=>setStarted(true)} className="gradient mt-4 w-full rounded-xl py-3 font-bold text-slate-950">Continue with {country.name}</button>
        </div>
      </section>

      <section id="how" className="border-y border-slate-800/80 bg-slate-950/30"><div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3"><Feature icon={<Globe2/>} title="Pick a country" text="Browse supported regions and see pricing and availability."/><Feature icon={<Phone/>} title="Choose your number" text="Reserve an available number through your provider account."/><Feature icon={<MessageSquare/>} title="Manage messages" text="View supported inbound messages and number activity in one place."/></div></section>
      <section id="security" className="mx-auto max-w-6xl px-5 py-16"><div className="card flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-400/10 text-green-400"><ShieldCheck/></div><div><h2 className="font-bold">Built with security in mind</h2><p className="mt-1 text-sm leading-6 text-slate-400">Provider credentials stay server-side. Accounts, purchases, and number assignments are designed to be auditable and protected.</p></div></div><div className="flex items-center gap-2 text-sm text-slate-400"><LockKeyhole size={16}/> Secure architecture</div></div></section>
      {started&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5"><div className="card w-full max-w-md p-6"><h2 className="text-xl font-bold">Create your Numberly account</h2><p className="mt-2 text-sm text-slate-400">Account authentication will be connected to the production backend next.</p><input placeholder="Email address" className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 outline-none focus:border-green-400"/><button onClick={()=>setStarted(false)} className="gradient mt-3 w-full rounded-xl py-3 font-bold text-slate-950">Continue</button><button onClick={()=>setStarted(false)} className="mt-3 w-full py-2 text-sm text-slate-500">Close</button></div></div>}
      <footer className="border-t border-slate-800 px-5 py-8 text-center text-sm text-slate-500">© 2026 Numberly · Virtual number management</footer>
    </main>
  );
}
function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <div className="card p-5"><div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-green-400/10 text-green-400">{icon}</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>}

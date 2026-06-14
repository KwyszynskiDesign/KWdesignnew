"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./HeroSaas.css";

export function HeroSaas() {
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const px = mouse.x * 14;
  const py = mouse.y * 8;
  const gx = 50 + mouse.x * 22;
  const gy = 48 + mouse.y * 18;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#07091a] select-none"
    >
      {/* Static base gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,33,182,0.22)_0%,rgba(15,10,50,0.55)_55%,transparent_80%)]" />

      {/* Dynamic mouse-tracking glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-100"
        style={{
          background: `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(109,40,217,0.18) 0%, rgba(56,30,150,0.10) 40%, transparent 65%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Hero text ─────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300 text-[11px] font-semibold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          System wycen B2B · Raz Dwa Druk
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] font-bold text-white tracking-tight leading-[1.06] mb-5">
          Wycena w 5 minut,
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            nie w godzinę
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
          Kalkulator druku CAD, koszyk zamówień i eksport PDF — w jednej aplikacji
          PWA działającej offline w warsztacie.
        </p>
      </div>

      {/* ── Monitor + floating cards wrapper ─────────────── */}
      <div
        className="relative z-10 w-full max-w-[920px] px-6"
        style={{
          transform: `translate(${px}px, ${py}px)`,
          transition: "transform 0.08s ease-out",
        }}
      >
        {/* Purple glow behind monitor */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-24px 48px -8px 48px",
            background:
              "radial-gradient(ellipse at 50% 65%, rgba(124,58,237,0.55) 0%, rgba(99,40,220,0.25) 40%, transparent 68%)",
            filter: "blur(48px)",
          }}
        />

        {/* ── Monitor ─────────────────────────────────────── */}
        <div
          className="relative mx-auto"
          style={{
            transform: "perspective(2000px) rotateX(10deg)",
            transformOrigin: "50% 100%",
          }}
        >
          {/* Bezel */}
          <div
            className="relative rounded-[20px]"
            style={{
              background: "linear-gradient(160deg, #22232e 0%, #16171f 100%)",
              padding: "10px 10px 30px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: [
                "0 0 0 1px rgba(255,255,255,0.04) inset",
                "0 50px 120px -24px rgba(0,0,0,0.85)",
                "0 4px 16px -4px rgba(0,0,0,0.6)",
                "0 0 80px rgba(109,40,217,0.12)",
              ].join(", "),
            }}
          >
            {/* Camera dot */}
            <div className="flex justify-center mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2a2b38]" />
            </div>

            {/* Screen */}
            <div
              className="relative rounded-[12px] overflow-hidden"
              style={{ aspectRatio: "16 / 10" }}
            >
              {/* Inner screen highlight */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.055) 0%, transparent 48%)",
                }}
              />
              <AppDashboard />
            </div>

            {/* Bottom chin */}
            <div className="flex justify-center mt-2.5">
              <div className="w-10 h-0.5 rounded-full bg-[#2a2b38]" />
            </div>
          </div>

          {/* Stand — neck */}
          <div className="flex flex-col items-center">
            <div
              style={{
                width: "68px",
                height: "32px",
                background: "linear-gradient(to bottom, #1e1f2a, #131419)",
                clipPath: "polygon(32% 0%, 68% 0%, 76% 100%, 24% 100%)",
              }}
            />
            {/* Stand — base */}
            <div
              className="rounded-full"
              style={{
                width: "200px",
                height: "12px",
                background: "linear-gradient(to bottom, #222335, #161620)",
                boxShadow: "0 6px 24px -6px rgba(0,0,0,0.7)",
              }}
            />
          </div>
        </div>

        {/* ── Floating cards ───────────────────────────────── */}
        <FloatingCards />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   App dashboard inside monitor screen
───────────────────────────────────────────────────────────────────────────── */
function AppDashboard() {
  return (
    <div className="absolute inset-0 flex overflow-hidden bg-[#0d0f1a] text-[11px] font-sans">
      {/* Sidebar nav */}
      <aside className="w-44 shrink-0 bg-[#090b14] border-r border-white/[0.05] flex flex-col">
        <div className="px-3.5 pt-4 pb-3 border-b border-white/[0.05]">
          <div className="text-white font-semibold text-[11px] tracking-tight">Raz Dwa Druk</div>
          <div className="text-slate-500 text-[9.5px] mt-0.5">Panel operatora</div>
        </div>

        <nav className="flex-1 py-2.5 px-2 space-y-0.5 overflow-hidden">
          {[
            { label: "Panel główny", active: true },
            { label: "Kalkulator druku", active: false },
            { label: "Koszyk", active: false },
            { label: "Zamówienia", active: false },
            { label: "Cennik", active: false },
            { label: "Warianty", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`px-2.5 py-1.5 rounded-md text-[10.5px] cursor-default leading-tight ${
                item.active
                  ? "bg-violet-600/25 text-violet-300 font-medium"
                  : "text-slate-500"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div className="px-3.5 py-2.5 border-t border-white/[0.05]">
          <div className="text-[9px] text-slate-600 font-mono">v2.4.1 · offline ●</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="px-4 py-2 border-b border-white/[0.05] flex items-center justify-between shrink-0">
          <span className="text-white/75 font-medium text-[10.5px]">Panel główny</span>
          <div className="flex items-center gap-1.5">
            <div className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
              ● Aktywny
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-2 p-3 shrink-0">
          {[
            { label: "Wyceny dziś", value: "24", sub: "+3 vs wczoraj", color: "text-violet-400" },
            { label: "W koszyku", value: "7", sub: "aktywnych pozycji", color: "text-cyan-400" },
            { label: "Śr. czas wyceny", value: "4.8 min", sub: "−90% vs poprzednio", color: "text-emerald-400" },
            { label: "Wartość sesji", value: "3 240 zł", sub: "+12% m/m", color: "text-amber-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.035] border border-white/[0.055] rounded-lg p-2.5"
            >
              <div className="text-slate-500 text-[9px] mb-1 leading-tight">{s.label}</div>
              <div className="text-white font-semibold text-[13px] leading-tight">{s.value}</div>
              <div className={`text-[9px] mt-0.5 ${s.color}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart + table + preview */}
        <div className="flex gap-2 px-3 pb-3 flex-1 overflow-hidden min-h-0">
          {/* Activity chart */}
          <div className="flex-1 bg-white/[0.025] border border-white/[0.05] rounded-lg p-3 flex flex-col min-w-0">
            <div className="text-slate-400 text-[9.5px] font-medium mb-2 shrink-0">
              Aktywność — ostatnie 7 dni
            </div>
            <div className="flex-1 flex items-end gap-1.5 min-h-0">
              {[5, 8, 6, 11, 14, 9, 12].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${(h / 14) * 82}%`,
                      background:
                        i === 6
                          ? "linear-gradient(to top, #7c3aed, #a78bfa)"
                          : i === 3 || i === 4
                          ? "rgba(124,58,237,0.45)"
                          : "rgba(124,58,237,0.22)",
                    }}
                  />
                  <div className="text-[7.5px] text-slate-600">
                    {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div className="w-40 shrink-0 bg-white/[0.025] border border-white/[0.05] rounded-lg p-2.5 flex flex-col">
            <div className="text-slate-400 text-[9.5px] font-medium mb-2 shrink-0">
              Ostatnie zamówienia
            </div>
            <div className="space-y-2 flex-1 overflow-hidden">
              {[
                { id: "#024", name: "Druk A4 · 500 szt.", ok: true },
                { id: "#023", name: "CAD 90×120 cm", ok: true },
                { id: "#022", name: "Banery reklamowe", ok: false },
                { id: "#021", name: "Wizytówki", ok: true },
              ].map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <div className="text-white/65 text-[9px] font-medium">{r.id}</div>
                    <div className="text-slate-500 text-[8.5px] truncate">{r.name}</div>
                  </div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.ok ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hero preview panel — RAZDWA screenshot as content */}
          <div className="w-48 shrink-0 bg-white/[0.025] border border-white/[0.05] rounded-lg overflow-hidden flex flex-col">
            <div className="px-2.5 pt-2 pb-1.5 shrink-0 border-b border-white/[0.05]">
              <div className="text-slate-400 text-[9.5px] font-medium">Strona startowa</div>
              <div className="text-slate-600 text-[8.5px]">razdwa.github.io</div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <Image
                src="/assets/images/strona startowa_RAZDWA.webp"
                alt="Raz Dwa Druk — strona startowa aplikacji"
                fill
                className="object-cover object-top"
                sizes="192px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0f1a]/60" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Floating cards — depth effect
───────────────────────────────────────────────────────────────────────────── */
function FloatingCards() {
  const cardBase =
    "absolute bg-[#12141f]/90 border border-white/10 rounded-xl backdrop-blur-sm shadow-2xl pointer-events-none";

  return (
    <>
      {/* Left card — pricing result */}
      <div
        className={`${cardBase} hidden md:block p-3 w-48`}
        style={{
          left: "-2.5rem",
          top: "18%",
          animation: "float 6s ease-in-out infinite",
          boxShadow: "0 20px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <div className="text-[9.5px] text-slate-400 mb-1 uppercase tracking-wide font-medium">
          Wycena gotowa
        </div>
        <div className="text-white font-semibold text-[12px] leading-tight">
          Druk CAD 90 × 120 cm
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-violet-300 font-bold text-[15px]">186,00 zł</div>
          <div className="text-[8.5px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full font-semibold">
            EXPRESS
          </div>
        </div>
      </div>

      {/* Right card — sync status */}
      <div
        className={`${cardBase} hidden md:block p-3 w-44`}
        style={{
          right: "-2rem",
          top: "28%",
          animation: "float-reverse 6s ease-in-out infinite",
          animationDelay: "-2s",
          boxShadow: "0 20px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <div className="text-[9.5px] text-slate-400 mb-2 uppercase tracking-wide font-medium">
          Synchronizacja
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[13px] shrink-0">
            ✓
          </div>
          <div>
            <div className="text-white text-[10.5px] font-medium">Google Sheets</div>
            <div className="text-slate-500 text-[9px]">przed chwilą · 12 rekordów</div>
          </div>
        </div>
      </div>

      {/* Bottom center card — key metric */}
      <div
        className={`${cardBase} px-4 py-2.5 flex items-center gap-3`}
        style={{
          left: "50%",
          bottom: "-1.75rem",
          animation: "float-center 6s ease-in-out infinite",
          animationDelay: "-4s",
          boxShadow: "0 20px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <div className="text-[18px] leading-none">⚡</div>
        <div>
          <div className="text-white text-[11px] font-semibold">−90% czasu wyceny</div>
          <div className="text-slate-500 text-[9.5px]">Z ~1 godziny do ~5 minut</div>
        </div>
      </div>

      {/* Top right corner — small badge */}
      <div
        className={`${cardBase} px-3 py-2 flex items-center gap-2`}
        style={{
          right: "10%",
          top: "-1.5rem",
          animation: "float 6s ease-in-out infinite",
          animationDelay: "-1s",
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        <div className="text-[10px] text-white/80 font-medium">PWA · działa offline</div>
      </div>
    </>
  );
}

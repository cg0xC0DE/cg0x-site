"use client";

import { useState, useRef, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Github,
  Twitter,
  Mail,
  ArrowUpRight,
  Wrench,
  Flame,
  Terminal,
  Globe,
  Clipboard,
  AudioLines,
  Palette,
  Languages,
} from "lucide-react";
import { probeAll } from "@/lib/loadbalancer";
import { t, type Locale } from "@/lib/i18n";

const toolsDef = [
  {
    id: "paste" as const,
    titleKey: "tool.paste.title" as const,
    descKey: "tool.paste.desc" as const,
    path: "/paste/",
    icon: Clipboard,
    tagKey: "tagTool" as const,
    needsLB: true,
  },
  {
    id: "link2asr" as const,
    titleKey: "tool.link2asr.title" as const,
    descKey: "tool.link2asr.desc" as const,
    path: "/link2asr/",
    icon: AudioLines,
    tagKey: "tagTool" as const,
    needsLB: true,
  },
  {
    id: "civitai" as const,
    titleKey: "tool.civitai.title" as const,
    descKey: "tool.civitai.desc" as const,
    path: "https://github.com/cg0xC0DE/civitai-downloader",
    icon: Palette,
    tagKey: "tagProject" as const,
    needsLB: false,
  },
];

const articlesDef = [
  { titleKey: "article.1.title" as const, date: "2026-02-10", href: "#" },
  { titleKey: "article.2.title" as const, date: "2026-01-28", href: "#" },
  { titleKey: "article.3.title" as const, date: "2026-01-15", href: "#" },
];

const socials = [
  { icon: Github, href: "https://github.com/cg0xC0DE", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/cg0xC0DE", label: "X / Twitter" },
  { icon: Mail, href: "mailto:hi@cg0x.ai", label: "Email" },
];

function WeChatIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/wechat-icon.png"
      alt="WeChat"
      width={16}
      height={16}
      className={className}
      style={{ filter: "grayscale(100%) brightness(1.5)" }}
    />
  );
}

function WeChatButton({
  showQR,
  setShowQR,
  locale,
}: {
  showQR: boolean;
  setShowQR: Dispatch<SetStateAction<boolean>>;
  locale: Locale;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showQR && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.top - 12,
        left: r.left + r.width / 2,
      });
    }
  }, [showQR]);

  return (
    <>
      <button
        ref={btnRef}
        aria-label="WeChat: cq4biz"
        onClick={() => setShowQR((v) => !v)}
        className="relative z-[60] flex items-center justify-center w-9 h-9 rounded-lg border border-card-border bg-card/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
      >
        <WeChatIcon className="w-4 h-4" />
      </button>
      {showQR &&
        createPortal(
          <>
            {/* backdrop */}
            <div className="fixed inset-0 z-50" onClick={() => setShowQR(false)} />
            {/* card */}
            <div
              className="fixed z-[55]"
              style={{ bottom: `calc(100dvh - ${pos.top}px)`, left: pos.left, transform: "translateX(-50%)" }}
            >
              <div className="rounded-2xl border border-card-border bg-card p-4 shadow-2xl shadow-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/wechat-qrcode.png"
                  alt="WeChat QR Code"
                  style={{ width: "260px", height: "260px" }}
                  className="rounded-xl block max-w-none"
                />
                <p className="mt-3 text-center text-xs leading-relaxed font-mono text-muted">
                  {t("wechatQR", locale).split("\n").map((line, i) => (
                    <span key={i}>{i > 0 && <br />}{line}</span>
                  ))}
                  <span className="text-accent">cq4biz</span>
                </p>
              </div>
              <div className="mx-auto w-3 h-3 rotate-45 border-r border-b border-card-border bg-card -mt-1.5" />
            </div>
          </>,
          document.body
        )}
    </>
  );
}

export default function Home() {
  const [showQR, setShowQR] = useState(false);
  const [bestEndpoint, setBestEndpoint] = useState<string | null>(null);
  const [probing, setProbing] = useState(true);
  const [locale, setLocale] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale | null;
    if (saved === "en" || saved === "zh") setLocale(saved);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await probeAll();
        if (!cancelled) {
          const best = results.find((r) => r.healthy);
          setBestEndpoint(best ? best.endpoint : null);
        }
      } finally {
        if (!cancelled) setProbing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getToolHref = useCallback(
    (tool: (typeof toolsDef)[number]) => {
      if (!tool.needsLB) return tool.path;
      if (probing) return undefined;
      return bestEndpoint ? bestEndpoint + tool.path : undefined;
    },
    [bestEndpoint, probing]
  );

  return (
    <div className="min-h-screen lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden bg-grid relative">
      {/* Top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-accent/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-0 lg:px-0 lg:h-[100dvh]">
        <div className="flex flex-col lg:flex-row lg:h-[100dvh]">
          {/* ===== LEFT: Profile Card (fixed, no scroll on desktop) ===== */}
          <aside className="lg:w-[380px] shrink-0 lg:h-[100dvh] lg:overflow-visible lg:px-10 lg:flex lg:items-center">
            {/* Mobile: horizontal compact layout | Desktop: vertical layout */}
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-5 items-start lg:items-stretch">
              {/* Avatar */}
              <div className="animate-fade-in-up shrink-0">
                <div className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-2xl overflow-hidden border border-card-border glow">
                  <Image
                    src="/avatar.png"
                    alt="CG0X Avatar"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-emerald-400 animate-pulse-slow" />
                </div>
              </div>

              {/* Right side: Name, Bio, Info Card (mobile) | Stacked (desktop) */}
              <div className="flex-1 min-w-0 flex flex-col lg:flex-col gap-3 lg:gap-5">
                {/* Name & Bio */}
                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                    {t("name", locale)}
                  </h1>
                  <p className="mt-0.5 lg:mt-1 text-xs lg:text-sm font-mono text-accent">
                    @cg0x
                  </p>
                  <p className="mt-2 text-xs lg:text-sm leading-relaxed text-muted line-clamp-2 lg:line-clamp-none">
                    {t("bio", locale)}
                  </p>
                </div>

                {/* Info card */}
                <div
                  className="animate-fade-in-up rounded-xl border border-card-border bg-card/60 backdrop-blur-sm p-2 lg:p-3 space-y-1 lg:space-y-2"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-mono text-muted">
                    <Terminal className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-accent" />
                    <span className="text-accent">$</span>
                    <span className="truncate">indie-dev --ai</span>
                  </div>
                  <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted">
                    <Globe className="w-3.5 h-3.5 text-accent" />
                    <span>cg0x.ai</span>
                  </div>
                </div>

                {/* Social links */}
                <div
                  className="animate-fade-in-up flex flex-wrap gap-2 lg:gap-3"
                  style={{ animationDelay: "0.3s" }}
                >
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-card-border bg-card/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
                    >
                      <s.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </a>
                  ))}
                  {/* WeChat with click toggle */}
                  <WeChatButton showQR={showQR} setShowQR={setShowQR} locale={locale} />
                  {/* Language toggle */}
                  <button
                    onClick={toggleLocale}
                    className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-card-border bg-card/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
                    aria-label="Toggle language"
                  >
                    <span className="text-[10px] lg:text-xs font-mono font-semibold">{t("switchLang", locale)}</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ===== RIGHT: Content Area (scrollable) ===== */}
          <main className="flex-1 min-w-0 space-y-12 lg:h-[100dvh] lg:overflow-y-auto lg:py-16 lg:px-10">
            {/* Section: Projects / Tools */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  {t("sectionTools", locale)}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {toolsDef.map((tool) => {
                  const href = getToolHref(tool);
                  const disabled = tool.needsLB && !href;
                  return (
                    <a
                      key={tool.id}
                      href={href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={disabled}
                      className={`group card-hover block rounded-xl border border-card-border bg-card/50 backdrop-blur-sm p-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-dim">
                            <tool.icon className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                              {t(tool.titleKey, locale)}
                            </h3>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                              {t(tool.tagKey, locale)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {tool.needsLB && probing && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" title={t("probing", locale)} />
                          )}
                          {tool.needsLB && !probing && bestEndpoint && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title={t("nodeUp", locale)} />
                          )}
                          {tool.needsLB && !probing && !bestEndpoint && (
                            <span className="w-2 h-2 rounded-full bg-red-400" title={t("nodeDown", locale)} />
                          )}
                          <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-200" />
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {t(tool.descKey, locale)}
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Section: Hot Articles */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  {t("sectionPosts", locale)}
                </h2>
              </div>
              <div className="space-y-2">
                {articlesDef.map((a) => (
                  <a
                    key={a.titleKey}
                    href={a.href}
                    className="group card-hover flex items-center justify-between rounded-lg border border-card-border bg-card/30 px-5 py-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
                      <span className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                        {t(a.titleKey, locale)}
                      </span>
                    </div>
                    <span className="shrink-0 ml-4 text-xs font-mono text-muted">
                      {a.date}
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* Section: Quick Status */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
              <div className="rounded-xl border border-card-border bg-card/30 p-5">
                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                  <span>{t("statusOk", locale)}</span>
                  <span className="mx-2 text-card-border">|</span>
                  <span>{t("lastDeploy", locale)}</span>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-card-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
                <span>&copy; {new Date().getFullYear()} cg0x.ai</span>
                <span className="flex items-center gap-1.5">
                  {t("builtWith", locale)}
                  <span className="text-accent">Next.js</span>
                  &middot; {t("deployedOn", locale)}
                  <span className="text-accent">Azure</span>
                </span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

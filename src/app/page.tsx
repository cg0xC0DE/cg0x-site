import {
  Github,
  Twitter,
  Mail,
  ArrowUpRight,
  Wrench,
  Flame,
  Terminal,
  Cpu,
  Globe,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    title: "JSON Formatter",
    description: "Fast, offline JSON beautifier & validator",
    href: "/tools/json-formatter",
    icon: Terminal,
    tag: "Tool",
  },
  {
    title: "Base64 Codec",
    description: "Encode & decode Base64 strings instantly",
    href: "/tools/base64",
    icon: Cpu,
    tag: "Tool",
  },
  {
    title: "Color Picker",
    description: "HEX / RGB / HSL converter with live preview",
    href: "/tools/color-picker",
    icon: Sparkles,
    tag: "Tool",
  },
  {
    title: "URL Shortener",
    description: "Self-hosted short link service",
    href: "/tools/url-shortener",
    icon: Globe,
    tag: "Tool",
  },
];

const articles = [
  {
    title: "Building a Minimal CLI in Rust",
    date: "2026-02-10",
    href: "#",
  },
  {
    title: "Why I Moved to Azure Static Web Apps",
    date: "2026-01-28",
    href: "#",
  },
  {
    title: "Reverse Engineering a Smart Lock Protocol",
    date: "2026-01-15",
    href: "#",
  },
];

const socials = [
  { icon: Github, href: "https://github.com/cg0x", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/cg0x", label: "X / Twitter" },
  { icon: Mail, href: "mailto:hi@cg0x.ai", label: "Email" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-grid relative">
      {/* Top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-accent/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ===== LEFT: Profile Card ===== */}
          <aside className="lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Avatar */}
              <div className="animate-fade-in-up">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-card-border glow">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 via-card to-card flex items-center justify-center">
                    <span className="text-4xl font-bold font-mono text-accent">
                      CG
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-emerald-400 animate-pulse-slow" />
                </div>
              </div>

              {/* Name & Bio */}
              <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-2xl font-bold tracking-tight">
                  CG0X
                </h1>
                <p className="mt-1 text-sm font-mono text-accent">
                  @cg0x
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Builder · Tinkerer · Minimalist<br />
                  Crafting tools, breaking things, shipping fast.
                  Obsessed with clean code and dark terminals.
                </p>
              </div>

              {/* Info card */}
              <div
                className="animate-fade-in-up rounded-xl border border-card-border bg-card/60 backdrop-blur-sm p-4 space-y-3"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  <span>Full-stack · Systems · AI</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>cg0x.ai</span>
                </div>
              </div>

              {/* Social links */}
              <div
                className="animate-fade-in-up flex gap-3"
                style={{ animationDelay: "0.3s" }}
              >
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-card-border bg-card/40 text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ===== RIGHT: Content Area ===== */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Section: Projects / Tools */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Tools & Projects
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <a
                    key={p.title}
                    href={p.href}
                    className="group card-hover block rounded-xl border border-card-border bg-card/50 backdrop-blur-sm p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-dim">
                          <p.icon className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                            {p.title}
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                            {p.tag}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-200" />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {p.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* Section: Hot Articles */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Recent Posts
                </h2>
              </div>
              <div className="space-y-2">
                {articles.map((a) => (
                  <a
                    key={a.title}
                    href={a.href}
                    className="group card-hover flex items-center justify-between rounded-lg border border-card-border bg-card/30 px-5 py-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
                      <span className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                        {a.title}
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
                  <span>All systems operational</span>
                  <span className="mx-2 text-card-border">|</span>
                  <span>Last deploy: just now</span>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-card-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
            <span>&copy; {new Date().getFullYear()} cg0x.ai</span>
            <span className="flex items-center gap-1.5">
              Built with
              <span className="text-accent">Next.js</span>
              &middot; Deployed on
              <span className="text-accent">Azure</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

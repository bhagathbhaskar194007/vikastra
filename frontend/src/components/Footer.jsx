import { Mail, Phone, Linkedin, Twitter, Instagram, Github, ArrowUpRight } from "lucide-react";

const cols = [
  {
    title: "Services",
    links: [
      "Web Development",
      "Mobile Apps",
      "Software",
      "IoT Solutions",
      "AI & Automation",
    ],
  },
  {
    title: "Company",
    links: ["About", "Work", "Careers", "Contact", "Blog"],
  },
  {
    title: "Resources",
    links: ["Courses", "Case Studies", "Documentation", "Support", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden border-t border-white/5">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-[100%] bg-gradient-to-t from-sky-500/15 via-violet-500/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="container-vk relative">
        {/* Marquee tag */}
        <div className="relative overflow-hidden border-y border-white/5 py-6 mb-16 -mx-6">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center gap-12 px-6">
                {["BUILD", "•", "SHIP", "•", "SCALE", "•", "REPEAT", "•", "VIKASTRA TECHNOLOGIES", "•"].map((t, i) => (
                  <span
                    key={`${k}-${i}`}
                    className={`font-display text-3xl sm:text-5xl font-black tracking-tighter ${
                      t === "•" ? "text-sky-400" : "text-white/10 hover:text-white/40 transition-colors"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 grid place-items-center glow-cyan">
                <span className="font-display text-lg font-black text-[#05050A]">V</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                VIKASTRA<span className="text-sky-400">.</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed mb-8">
              We build cinematic digital experiences — web, mobile, IoT, and AI —
              for ambitious teams crafting tomorrow's leading products.
            </p>

            <div className="flex items-center gap-3">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Github, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  data-testid={`social-${label.toLowerCase()}`}
                  className="w-10 h-10 rounded-full grid place-items-center border border-white/10 text-slate-400 hover:text-sky-300 hover:border-sky-400/40 hover:bg-sky-400/5 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-400 mb-4">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-400 mb-4">
              Reach
            </div>
            <ul className="space-y-3">
              <li>
                <a href="mailto:vikasthratechnologies@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </li>
              <li>
                <a href="tel:+917012845860" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </li>
              <li>
                <a href="/admin/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition" data-testid="footer-admin-link">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            © {new Date().getFullYear()} Vikastra Technologies. All rights reserved.
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

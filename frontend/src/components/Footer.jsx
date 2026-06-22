import { Mail, Phone, Linkedin, ArrowUpRight } from "lucide-react";

// Custom X (formerly Twitter) icon
const XIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

// Custom Threads icon
const ThreadsIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.34 8.197c.98-1.452 2.568-2.25 4.471-2.25h.043c3.183.02 5.082 1.967 5.271 5.36.108.043.214.094.317.143 1.49.7 2.575 1.762 3.142 3.07.79 1.823.864 4.79-1.553 7.158C17.151 22.881 15.011 23.971 12.186 24Zm.952-13.124c-.243 0-.49.011-.745.025-1.83.103-2.968.948-2.906 2.156.064 1.265 1.456 1.852 2.795 1.781 1.231-.067 2.84-.546 3.114-3.728a10.97 10.97 0 0 0-2.258-.234Z" />
  </svg>
);

// Custom Instagram icon
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const cols = [
  {
    title: "Services",
    links: [
      "Web Development",
      "Mobile Apps",
      "Software",
      "IoT Solutions",
      "Project Development",
    ],
  },
  {
    title: "Company",
    links: ["About", "Work", "Careers", "Contact", "Blog"],
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
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 grid place-items-center glow-cyan">
                <span className="font-display text-lg font-black text-[#05050A]">V</span>
              </div>
              <span className="font-display text-xl font-bond tracking-tight">
                VIKASTRA<span className="text-sky-400">.</span>
              </span>
              
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed mb-8">
              We build cinematic digital experiences — web, mobile, IoT, and AI —
              for ambitious teams crafting tomorrow's leading products.
            </p>

            <div className="flex items-center gap-3">
             {[
  { Icon: InstagramIcon, label: "Instagram", url: "https://www.instagram.com/vikastra_technologies?igsh=MTJoMDE3Zmk3YzAwZg==" },
  { Icon: XIcon, label: "X", url: "https://x.com/VikastraTech" },
  { Icon: ThreadsIcon, label: "Threads", url: "https://www.threads.com/@vikastra_technologies" },
  { Icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/company/YOUR_COMPANY" },
].map(({ Icon, label, url }) => (
  <a
    key={label}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
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

          <div className="lg:col-span-2">
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

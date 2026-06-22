import { motion } from "framer-motion";
import { Linkedin, Mail, ArrowUpRight } from "lucide-react";

// Custom X (formerly Twitter) icon
const XIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

// Custom Threads icon
const ThreadsIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.34 8.197c.98-1.452 2.568-2.25 4.471-2.25h.043c3.183.02 5.082 1.967 5.271 5.36.108.043.214.094.317.143 1.49.7 2.575 1.762 3.142 3.07.79 1.823.864 4.79-1.553 7.158C17.151 22.881 15.011 23.971 12.186 24Zm.952-13.124c-.243 0-.49.011-.745.025-1.83.103-2.968.948-2.906 2.156.064 1.265 1.456 1.852 2.795 1.781 1.231-.067 2.84-.546 3.114-3.728a10.97 10.97 0 0 0-2.258-.234Z" />
  </svg>
);

// Custom Instagram icon (lucide has Instagram but using svg here for consistency with X/Threads)
const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const members = [
  {
    name: "D. Bhagath Bhaskar Unnithan",
    role: "Founder & Chief Executive Officer (CEO)",
    short: "CEO",
    focus: "Vision, leadership, business strategy, and growth.",
    bio: "D. Bhagath Bhaskar Unnithan is the Founder and CEO of Vikastra Technologies. He leads the company's vision, strategic planning, and business development initiatives — driving innovation, building strong client relationships, and steering Vikastra toward becoming a leading technology solutions provider.",
    initials: "DB",
    accent: "from-sky-400 to-sky-600",
    badge: "Leadership",
    socialLinks: { 
      instagram: "https://www.instagram.com/bhagath_bhaskar?igsh=MTA1aWFsN2llYXBnYg==",
      threads: "https://x.com/Bhagath_194_007",
      linkedin: "https://www.threads.com/@bhagath_bhaskar",
      x: "https://www.linkedin.com/in/d-bhagath-bhaskar-unnithan-6b8a713a5?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
    
  },
  {
    name: "Salman Fariz",
    role: "Co-Founder & Chief Technology Officer (CTO)",
    short: "CTO",
    focus: "Technology leadership, software development, and innovation.",
    bio: "Salman Fariz serves as the Co-Founder and CTO of Vikastra Technologies. He oversees the company's technical strategy, software architecture, and product development — ensuring every solution is built with quality, scalability, and cutting-edge technology.",
    initials: "SF",
    accent: "from-rose-400 to-rose-600",
    badge: "Technology",
    socialLinks: { instagram: "https://www.instagram.com/_sa.lman__?igsh=ZXhkbmJsbWFmZ2l6" }
  },
  {
    name: "Adarsh S",
    role: "Co-Founder & Chief Operations Officer (COO)",
    short: "COO",
    focus: "Operations, project management, and execution.",
    bio: "Adarsh S is the Co-Founder and COO of Vikastra Technologies. He manages operational excellence, project delivery, and team coordination — ensuring client projects are executed efficiently and meet the highest standards of quality and performance.",
    initials: "AS",
    accent: "from-violet-400 to-violet-600",
    badge: "Operations",
    socialLinks: { instagram: "https://www.instagram.com/_adarshhhh____?igsh=MXhuaWw4ZGQ5bTRvdA==" }
  },
  {
    name: "Sneha S Lal",
    role: "Chief Creative Officer (CCO)",
    short: "CCO",
    focus: "Creative direction, brand identity, user experience, and design strategy.",
    bio: "Sneha S Lal serves as the Chief Creative Officer (CCO) at Vikastra Technologies. She guides the company's creative vision, shaping brand identity and ensuring user-centric design across all products to deliver engaging visual experiences.",
    initials: "SL",
    accent: "from-amber-400 to-amber-600",
    badge: "Creative",
    socialLinks: { instagram: "https://www.instagram.com/_snehas_lal_?igsh=azFseXY5d3lzMWtl" }
  } 
];

const socials = [
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: XIcon, label: "X" },
  { Icon: ThreadsIcon, label: "Threads" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Mail, label: "Email" },
];

export default function Team() {
  return (
    <section id="team" className="section relative overflow-hidden" data-testid="team-section">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-sky-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[120px]" />
      </div>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="container-vk relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              The Team
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5">
              Meet the <span className="gradient-text">founders</span>.
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-base">
            Four minds, one studio — the people shipping Vikastra's vision into
            the future.
          </p>
        </motion.div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              data-testid={`team-card-${i}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md hover:bg-white/[0.05] transition-all duration-500 flex flex-col"
            >
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-sky-400 to-transparent" />
                <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-sky-400 to-transparent" />
              </div>

              {/* Avatar + short title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative shrink-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.accent} grid place-items-center font-display text-xl font-black text-[#05050A] relative z-10`}
                  >
                    {m.initials}
                  </div>
                  <div
                    className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${m.accent} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-1">
                    {m.badge}
                  </div>
                  <div className={`font-display text-2xl font-black tracking-tight bg-gradient-to-br ${m.accent} bg-clip-text text-transparent`}>
                    {m.short}
                  </div>
                </div>
              </div>

              {/* Name + role */}
              <h3 className="font-display text-xl font-semibold tracking-tight text-white mb-2 leading-tight">
                {m.name}
              </h3>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-400 mb-4 leading-relaxed">
                {m.role}
              </div>

              {/* Focus tag */}
              <div className="text-[13px] text-slate-300 italic border-l-2 border-sky-400/40 pl-3 mb-5">
                {m.focus}
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">{m.bio}</p>

              {/* Social row */}
              {/* Social row */}
<div className="flex items-center gap-2 pt-6 border-t border-white/5">
  {socials.slice(0, 4).map(({ Icon, label }, k) => (
    <a
      key={k}
      // This line dynamically pulls the link based on the icon's label (e.g., 'instagram')
      href={m.socialLinks?.[label.toLowerCase()] || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${m.name} — ${label}`}
      data-testid={`team-${i}-social-${label.toLowerCase()}`}
      className="w-9 h-9 rounded-full grid place-items-center border border-white/10 text-slate-400 hover:text-sky-300 hover:border-sky-400/40 hover:bg-sky-400/5 transition"
    >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-4 h-4 text-sky-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* About the Founding Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 lg:p-16"
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
                / About the Founding Team
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mt-4 mb-6">
                Four founders. <span className="gradient-text">One vision.</span>
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Vikastra Technologies was founded by{" "}
                <span className="text-white font-medium">D. Bhagath Bhaskar Unnithan</span>,{" "}
                <span className="text-white font-medium">Salman Fariz</span>,{" "}
                <span className="text-white font-medium">Sneha S Lal</span>, and{" "}
                <span className="text-white font-medium">Adarsh S</span> — four technology
                enthusiasts united by a vision to create innovative digital solutions.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Combining expertise in software development, web and mobile
                applications, IoT systems, AI-powered technologies, and project
                development, the team is dedicated to transforming ideas into impactful
                technological solutions that drive progress and innovation.
              </p>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4">
                Tagline
              </div>
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight">
                <span className="block text-white">"Innovating Today,</span>
                <span className="block gradient-text">Building Tomorrow."</span>
              </blockquote>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {members.map((m) => (
                    <div
                      key={m.name}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.accent} grid place-items-center font-display text-xs font-black text-[#05050A] ring-2 ring-[#05050A]`}
                    >
                      {m.initials}
                    </div>
                  ))}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  The Vikastra founding team
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

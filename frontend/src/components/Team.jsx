import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";

const members = [
  {
    name: "D Bhagath Bhaskar Unnithan",
    role: "Co-Founder",
    bio: "Architects the engineering vision — leads systems design, scalability and the technology direction of every product Vikastra ships.",
    initials: "DB",
    accent: "from-sky-400 to-sky-600",
    badge: "Engineering",
  },
  {
    name: "Salman Fariz",
    role: "Co-Founder",
    bio: "Drives product strategy and client partnerships — translates ambitious roadmaps into shipped experiences that move businesses forward.",
    initials: "SF",
    accent: "from-rose-400 to-rose-600",
    badge: "Product",
  },
  {
    name: "Adarsh S",
    role: "Co-Founder",
    bio: "Shapes design language and brand craft — owns the cinematic detail across every Vikastra interface, from pixel to micro-interaction.",
    initials: "AS",
    accent: "from-violet-400 to-violet-600",
    badge: "Design",
  },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              / 04 — The Team
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5">
              Meet the <span className="gradient-text">founders</span>.
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-base">
            Three minds, one studio — the people shipping Vikastra's vision into
            the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              data-testid={`team-card-${i}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md hover:bg-white/[0.05] transition-all duration-500"
            >
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-sky-400 to-transparent" />
                <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-sky-400 to-transparent" />
              </div>

              {/* Avatar */}
              <div className="relative mb-8">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${m.accent} grid place-items-center font-display text-2xl font-black text-[#05050A] relative z-10`}
                >
                  {m.initials}
                </div>
                <div
                  className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${m.accent} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}
                />
              </div>

              {/* Role badge */}
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2 inline-block">
                {m.badge}
              </span>

              {/* Name + role */}
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white mb-1 leading-tight">
                {m.name}
              </h3>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-400 mb-5">
                {m.role}
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-400 leading-relaxed mb-8">{m.bio}</p>

              {/* Social row */}
              <div className="flex items-center gap-2 pt-6 border-t border-white/5">
                {[Linkedin, Twitter, Mail].map((Icon, k) => (
                  <a
                    key={k}
                    href="#"
                    aria-label="social link"
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
      </div>
    </section>
  );
}

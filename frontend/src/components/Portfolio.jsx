import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Aurora Commerce",
    cat: "E-commerce Platform",
    tag: "Web / Cloud",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-emerald-500 to-blue-600",
  },
  {
    title: "PulseGrid IoT",
    cat: "Smart Home Network",
    tag: "IoT / Embedded",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    title: "Nimbus AI Assistant",
    cat: "Enterprise AI Chatbot",
    tag: "AI / LLM",
    img: "https://images.unsplash.com/photo-1517512006864-7edc3b933137?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-teal-500 to-indigo-600",
  },
  {
    title: "MedSync Mobile",
    cat: "Healthcare App",
    tag: "Mobile / Cross-Platform",
    img: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-indigo-500 to-teal-500",
  },
  {
    title: "Quantum Dashboard",
    cat: "SaaS Analytics Platform",
    tag: "Software / Data",
    img: "https://images.unsplash.com/photo-1637393933151-d37306ed606d?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-orange-400 to-rose-500",
  },
  {
    title: "Stellar Learn",
    cat: "EdTech Training Platform",
    tag: "Web / Courses",
    img: "https://images.unsplash.com/photo-1615803697515-3cb782c2a65a?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
    color: "from-indigo-400 to-emerald-500",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section relative" data-testid="portfolio-section">
      <div className="container-vk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
              / 03 — Selected Work
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5">
              Recent <span className="gradient-text">launches</span>.
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-base">
            A curated showcase of products we've crafted across web, mobile, IoT,
            and AI — each engineered for scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href="#contact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              data-testid={`portfolio-card-${i}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer block"
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/40 to-transparent" />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-0 mix-blend-overlay group-hover:opacity-40 transition-opacity duration-500`}
              />

              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  {p.tag}
                </span>
                <div className="w-10 h-10 rounded-full grid place-items-center bg-white/10 backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  {p.cat}
                </div>
                <h3 className="font-display text-2xl font-semibold text-white tracking-tight">
                  {p.title}
                </h3>
              </div>

              {/* Hover border accent */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-emerald-400/50 transition-colors duration-500 pointer-events-none" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

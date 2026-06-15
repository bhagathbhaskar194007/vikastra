import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Globe2,
  Smartphone,
  Code2,
  Cpu,
  Layers,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Globe2,
    title: "Web Development",
    desc: "Pixel-perfect, blazing-fast websites and web apps built with modern stacks — Next.js, React, and headless architectures.",
    tags: ["React", "Next.js", "Node"],
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform iOS & Android apps with butter-smooth UX, offline-first design, and store-ready polish.",
    tags: ["React Native", "Flutter", "Swift"],
    color: "from-violet-400 to-rose-500",
  },
  {
    icon: Code2,
    title: "Software Development",
    desc: "Enterprise-grade software, custom SaaS platforms, and internal tools engineered for scale, security, and resilience.",
    tags: ["Python", "Go", "Cloud"],
    color: "from-sky-400 to-sky-500",
  },
  {
    icon: Cpu,
    title: "IoT Solutions",
    desc: "End-to-end IoT — firmware, edge gateways, cloud telemetry, and dashboards for smart devices and industrial automation.",
    tags: ["ESP32", "MQTT", "Edge"],
    color: "from-orange-400 to-rose-500",
  },
  {
    icon: Layers,
    title: "Project Development",
    desc: "Academic and industry projects — final-year, dissertation, and prototype builds delivered with mentorship and docs.",
    tags: ["B.Tech", "M.Tech", "PoC"],
    color: "from-violet-400 to-sky-500",
  },
];

function ServiceCard({ s, i }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const transform = useTransform([rotateX, rotateY], ([x, y]) =>
    `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`
  );

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${px}%`);
    e.currentTarget.style.setProperty("--my", `${py}%`);
    rotateY.set(((x / rect.width) - 0.5) * 10);
    rotateX.set(-((y / rect.height) - 0.5) * 10);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const Icon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: i * 0.05 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ transform, transformStyle: "preserve-3d" }}
      data-testid={`service-card-${i}`}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-8 backdrop-blur-md cursor-default"
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(16, 229, 160,0.12), transparent 50%)",
        }}
      />
      <div
        className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center mb-6`}
        style={{ transform: "translateZ(40px)" }}
      >
        <Icon className="w-6 h-6 text-[#05050A]" strokeWidth={2.4} />
      </div>

      <h3 className="font-display text-2xl font-semibold tracking-tight mb-3 text-white">
        {s.title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{s.desc}</p>

      <div className="flex items-center gap-2 text-sky-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Corner accent */}
      <div className="absolute -top-px -right-px w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-sky-400 to-transparent" />
        <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-sky-400 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section relative" data-testid="services-section">
      <div className="container-vk">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              Capabilities
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Five verticals.
            <br />
            <span className="gradient-text">One studio.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            From idea to production — we design, engineer, and ship technology that
            moves businesses forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

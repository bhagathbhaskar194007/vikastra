import { motion } from "framer-motion";

const logos = [
  "TESLA",
  "STRIPE",
  "VERCEL",
  "OPENAI",
  "FIGMA",
  "NVIDIA",
  "GOOGLE",
  "SPACEX",
];

export default function LogoMarquee() {
  return (
    <section className="py-16 border-y border-white/5 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container-vk mb-8"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 text-center">
          Trusted by ambitious teams worldwide
        </div>
      </motion.div>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#05050A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#05050A] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-16 px-8">
              {logos.map((logo, i) => (
                <div
                  key={`${k}-${i}`}
                  className="font-display text-3xl font-black tracking-tighter text-slate-500 hover:text-white transition-colors"
                >
                  {logo}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

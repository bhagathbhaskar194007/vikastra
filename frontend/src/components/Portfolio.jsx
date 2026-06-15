import { motion } from "framer-motion";

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
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              Selected Work
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5">
              Featured <span className="gradient-text">projects</span>.
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-base">
            A curated showcase of products we've crafted across web, mobile, IoT —
            each engineered for scale.
          </p>
        </motion.div>

        {/* Empty state — projects coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl glass-strong px-6 py-16 sm:py-24 text-center"
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-4">
              Coming Soon
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 max-w-2xl mx-auto">
              We're crafting something
              <span className="gradient-text"> extraordinary</span>.
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
              Our case studies and selected work will be unveiled here shortly.
              Want a sneak peek of what we've been building? Get in touch.
            </p>
            <a
              href="#contact"
              data-testid="portfolio-cta-contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-[#05050A] bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-200 hover:to-sky-400 transition-all duration-300 glow-cyan hover:-translate-y-0.5"
            >
              Request a Preview
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

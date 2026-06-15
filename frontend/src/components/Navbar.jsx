import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV } from "../constants/testIds";

const links = [
  { href: "#services", label: "Services", id: NAV.linkServices },
  { href: "#about", label: "About", id: NAV.linkAbout },
  { href: "#portfolio", label: "Work", id: NAV.linkPortfolio },
  { href: "#contact", label: "Contact", id: NAV.linkContact },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container-vk flex items-center justify-between h-16 md:h-20">
        <a href="#top" data-testid={NAV.logo} className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 glow-cyan">
            <span className="font-display text-lg font-black text-[#05050A]">V</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 blur-md opacity-50 group-hover:opacity-80 transition" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            VIKASTRA<span className="text-sky-400">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={l.id}
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-sky-400 to-violet-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-testid={NAV.cta}
          className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#05050A] bg-gradient-to-r from-sky-300 to-sky-500 hover:shadow-[0_0_20px_rgba(16, 229, 160,0.5)] transition-all"
        >
          Get Started
        </a>

        <button
          data-testid={NAV.mobileToggle}
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 grid place-items-center rounded-lg border border-white/10 text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-[#05050A]/95 backdrop-blur-xl"
          >
            <nav className="container-vk py-6 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  data-testid={`${l.id}-mobile`}
                  onClick={() => setOpen(false)}
                  className="text-base text-slate-200 hover:text-sky-400 transition py-2"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center rounded-full px-5 py-3 text-sm font-semibold text-[#05050A] bg-gradient-to-r from-sky-300 to-sky-500"
              >
                Get Started
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

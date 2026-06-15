import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior is already in CSS; add Lenis for premium momentum
    let lenis;
    (async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({ duration: 1.2, smoothWheel: true });
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      } catch (e) {
        // fallback to native
      }
    })();
    return () => lenis?.destroy?.();
  }, []);

  return (
    <div id="top" className="relative bg-[#05050A] text-white">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}

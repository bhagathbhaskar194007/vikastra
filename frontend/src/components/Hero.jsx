import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HERO } from "../constants/testIds";

function useHeroScene(mountRef) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0x10e5a0, 2.5, 50);
    l1.position.set(10, 10, 10);
    scene.add(l1);
    const l2 = new THREE.PointLight(0x5e7cff, 2.5, 50);
    l2.position.set(-10, -5, -10);
    scene.add(l2);
    const l3 = new THREE.PointLight(0xffffff, 1.2, 30);
    l3.position.set(0, 5, 5);
    scene.add(l3);

    // V Monogram-inspired group: torus knot + sphere core
    const group = new THREE.Group();
    group.position.x = 2.5;
    group.scale.setScalar(0.85);
    scene.add(group);

    // Inner glowing sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a18,
      metalness: 1,
      roughness: 0.15,
      emissive: new THREE.Color(0x10e5a0),
      emissiveIntensity: 0.45,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Wireframe outer
    const wireGeo = new THREE.IcosahedronGeometry(1.55, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x14e5e5,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Orbiting torus rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x10e5a0, transparent: true, opacity: 0.85 })
    );
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.012, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x5e7cff, transparent: true, opacity: 0.75 })
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    group.add(ring2);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.01, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x14e5e5, transparent: true, opacity: 0.55 })
    );
    ring3.rotation.z = Math.PI / 3;
    group.add(ring3);

    // Glow orbs
    const orb1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x10e5a0, transparent: true, opacity: 0.5 })
    );
    orb1.position.set(3, 1.5, -2);
    scene.add(orb1);

    const orb2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x5e7cff, transparent: true, opacity: 0.5 })
    );
    orb2.position.set(-3, -1.5, -2);
    scene.add(orb2);

    // Particle field
    const PARTICLE_COUNT = 1200;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x10e5a0,
      size: 0.03,
      sizeAttenuation: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const handleMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);

    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = Math.sin(t * 0.4) * 0.4 + t * 0.1;
      group.rotation.x = Math.sin(t * 0.3) * 0.12;
      group.position.y = Math.sin(t * 0.8) * 0.15;
      ring1.rotation.z = t * 0.3;
      ring2.rotation.z = -t * 0.25;
      ring3.rotation.x = t * 0.2;
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;

      // mouse parallax
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      wireGeo.dispose();
      pGeo.dispose();
      pMat.dispose();
      coreMat.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, [mountRef]);
}

export default function Hero() {
  const mountRef = useRef(null);
  useHeroScene(mountRef);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 grid-bg z-[1] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[120px] z-[1] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] z-[1] pointer-events-none" />

      <div className="container-vk relative z-10 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">
              Innovating Since 2020
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] max-w-5xl"
        >
          Building the <span className="gradient-text">Future</span>
          <br />
          Through <span className="gradient-text-silver">Technology</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Vikastra Technologies engineers premium digital experiences — web, mobile,
          IoT, and AI systems crafted for ambitious brands shaping tomorrow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-4 items-center"
        >
          <a
            href="#contact"
            data-testid={HERO.ctaStart}
            className="group relative inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-[#05050A] bg-gradient-to-r from-emerald-300 to-emerald-500 hover:from-emerald-200 hover:to-emerald-400 transition-all duration-300 glow-cyan hover:-translate-y-0.5"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#services"
            data-testid={HERO.ctaExplore}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium text-white border border-white/15 hover:border-emerald-400/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-md"
          >
            Explore Services
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl"
        >
          {[
            { k: "5", v: "Projects Delivered" },
            { k: "5", v: "Global Clients" },
            { k: "5", v: "Service Verticals" },
            { k: "99.9%", v: "Client Retention" },
          ].map((s) => (
            <div key={s.v} className="border-l border-white/10 pl-4">
              <div className="font-display text-3xl sm:text-4xl font-bold gradient-text">{s.k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        data-testid={HERO.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity }, opacity: { duration: 1, delay: 1.2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-400"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-emerald-400 to-transparent" />
      </motion.div>
    </section>
  );
}

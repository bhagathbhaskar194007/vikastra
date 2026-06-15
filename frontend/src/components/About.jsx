import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Award, Rocket, Users, ShieldCheck } from "lucide-react";

/**
 * "Vikastra Service Universe"
 * A central rotating torus knot (the company core) with five orbiting
 * platforms — each representing one of our verticals (Web, Mobile,
 * Software, IoT, Project Dev). Data ribbons stream between core and
 * platforms; subtle dust ambience fills the space.
 */
function useUniverseScene(mountRef) {
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
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const l1 = new THREE.PointLight(0x0ea5e9, 2.5, 60);
    l1.position.set(6, 6, 6);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xa855f7, 2.2, 60);
    l2.position.set(-6, -4, -6);
    scene.add(l2);
    const l3 = new THREE.PointLight(0xf43f5e, 1.5, 40);
    l3.position.set(0, -5, 5);
    scene.add(l3);

    const root = new THREE.Group();
    scene.add(root);

    // -------- Core: rotating torus knot ("Vikastra hub") --------
    const knotGeo = new THREE.TorusKnotGeometry(0.85, 0.22, 200, 24, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a18,
      metalness: 1,
      roughness: 0.15,
      emissive: new THREE.Color(0x0ea5e9),
      emissiveIntensity: 0.5,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    root.add(knot);

    // Core halo
    const haloGeo = new THREE.SphereGeometry(1.45, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    root.add(halo);

    // -------- Orbiting platforms (services) --------
    // Each platform is a flat hexagonal disc representing a vertical.
    const services = [
      { color: 0x0ea5e9, label: "WEB", speed: 0.30, radius: 3.2, axis: [0.1, 1, 0.05] },
      { color: 0xf43f5e, label: "MOBILE", speed: 0.45, radius: 3.5, axis: [0.4, 0.9, -0.2] },
      { color: 0xa855f7, label: "SOFTWARE", speed: 0.22, radius: 3.8, axis: [-0.3, 0.7, 0.4] },
      { color: 0x38bdf8, label: "IOT", speed: 0.55, radius: 2.9, axis: [0.5, 0.5, 0.5] },
      { color: 0xe879f9, label: "PROJECTS", speed: 0.36, radius: 3.4, axis: [-0.5, 0.6, -0.3] },
    ];

    const platforms = [];
    const trailLineSegs = [];
    services.forEach((s) => {
      // Hex platform
      const hexGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 6);
      const hexMat = new THREE.MeshStandardMaterial({
        color: s.color,
        metalness: 0.6,
        roughness: 0.3,
        emissive: new THREE.Color(s.color),
        emissiveIntensity: 0.7,
      });
      const platform = new THREE.Mesh(hexGeo, hexMat);
      root.add(platform);

      // Glowing outer ring around the hex
      const outerGeo = new THREE.TorusGeometry(0.42, 0.012, 8, 32);
      const outerMat = new THREE.MeshBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.8,
      });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      platform.add(outer);

      // Tiny accent cube on top
      const accGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const accMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.1,
        emissive: new THREE.Color(s.color),
        emissiveIntensity: 1,
      });
      const accent = new THREE.Mesh(accGeo, accMat);
      accent.position.y = 0.18;
      platform.add(accent);

      // Trail line from core to platform (data stream)
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const trailMat = new THREE.LineBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const trail = new THREE.LineSegments(trailGeo, trailMat);
      root.add(trail);
      trailLineSegs.push(trail);

      platforms.push({
        mesh: platform,
        outer,
        accent,
        offset: Math.random() * Math.PI * 2,
        speed: s.speed,
        radius: s.radius,
        axis: new THREE.Vector3(...s.axis).normalize(),
      });
    });

    // -------- Orbit rings (faint guides) --------
    const orbits = [];
    [2.9, 3.2, 3.5, 3.8].forEach((r, i) => {
      const g = new THREE.TorusGeometry(r, 0.004, 8, 100);
      const m = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.12,
      });
      const ring = new THREE.Mesh(g, m);
      ring.rotation.x = Math.PI / 2 + i * 0.18;
      ring.rotation.y = i * 0.25;
      root.add(ring);
      orbits.push(ring);
    });

    // -------- Ambient dust particles --------
    const DUST = 200;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const r = 4 + Math.random() * 3;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.025,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.7,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    root.add(dust);

    // Pause when off-screen (perf)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (isVisible = e.isIntersecting)),
      { threshold: 0.01 }
    );
    observer.observe(mount);

    const clock = new THREE.Clock();
    let rafId = 0;
    const tmpV = new THREE.Vector3();
    const basisX = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const bitangent = new THREE.Vector3();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      // Core rotation
      knot.rotation.x = t * 0.45;
      knot.rotation.y = t * 0.6;

      // Halo pulse
      const pulse = 1 + Math.sin(t * 1.4) * 0.08;
      halo.scale.setScalar(pulse);
      haloMat.opacity = 0.06 + Math.sin(t * 1.4) * 0.04;

      // Platforms orbit on inclined axes
      platforms.forEach((p, i) => {
        const angle = t * p.speed + p.offset;
        basisX.set(1, 0, 0);
        if (Math.abs(p.axis.dot(basisX)) > 0.9) basisX.set(0, 1, 0);
        tangent.crossVectors(p.axis, basisX).normalize();
        bitangent.crossVectors(p.axis, tangent).normalize();
        tmpV.copy(tangent).multiplyScalar(Math.cos(angle) * p.radius)
          .addScaledVector(bitangent, Math.sin(angle) * p.radius);
        p.mesh.position.copy(tmpV);

        // Make the platform face the camera-ish (tilt)
        p.mesh.lookAt(0, 0, 0);
        p.mesh.rotateX(Math.PI / 2);

        // Spin accent
        p.accent.rotation.y = t * 2;
        p.accent.rotation.x = t * 1.4;

        // Trail line from core (0,0,0) to platform
        const arr = trailLineSegs[i].geometry.attributes.position.array;
        arr[0] = 0; arr[1] = 0; arr[2] = 0;
        arr[3] = tmpV.x; arr[4] = tmpV.y; arr[5] = tmpV.z;
        trailLineSegs[i].geometry.attributes.position.needsUpdate = true;
      });

      // Slow universe sway
      root.rotation.y = t * 0.06;
      root.rotation.x = Math.sin(t * 0.2) * 0.06;
      dust.rotation.y = -t * 0.04;

      renderer.render(scene, camera);
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
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      knotGeo.dispose(); knotMat.dispose();
      haloGeo.dispose(); haloMat.dispose();
      platforms.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        p.outer.geometry.dispose();
        p.outer.material.dispose();
        p.accent.geometry.dispose();
        p.accent.material.dispose();
      });
      trailLineSegs.forEach((l) => { l.geometry.dispose(); l.material.dispose(); });
      orbits.forEach((o) => { o.geometry.dispose(); o.material.dispose(); });
      dustGeo.dispose(); dustMat.dispose();
      renderer.dispose();
    };
  }, [mountRef]);
}

const pillars = [
  { icon: Rocket, label: "Innovation", value: "01" },
  { icon: Award, label: "Expertise", value: "02" },
  { icon: Users, label: "Client-Focused", value: "03" },
  { icon: ShieldCheck, label: "Reliability", value: "04" },
];

export default function About() {
  const mountRef = useRef(null);
  useUniverseScene(mountRef);

  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="container-vk relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[480px] lg:h-[560px] order-2 lg:order-1"
          >
            <div className="absolute inset-0 rounded-3xl border border-white/5 overflow-hidden glass">
              <div ref={mountRef} className="absolute inset-0" />
              {/* HUD overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
                <span className="text-sky-400">● core online</span>
                <span>VERTICALS 5 / 5</span>
              </div>
              {/* Service legend */}
              <div className="absolute left-4 bottom-12 flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 pointer-events-none">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Web</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Mobile</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Software</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-300" /> IoT</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" /> Projects</div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
                <span>Sync 99.8%</span>
                <span>Latency 12ms</span>
                <span>v.0.4.2</span>
              </div>
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l border-t border-sky-400/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-sky-400/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-sky-400/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-sky-400/40 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              / 02 — About Vikastra
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5 mb-6">
              Engineering teams
              <br />
              that <span className="gradient-text">ship at velocity</span>.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              We are a technology studio fusing design intuition with deep
              engineering. Every product we touch is built on three principles:
              cinematic craft, rigorous testing, and a relentless bias toward
              shipping.
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-10">
              From startups to enterprise leaders, our team partners with founders
              and CTOs to translate ambitious roadmaps into shipped products — fast.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.label}
                    className="glass rounded-xl p-5 hover:bg-white/[0.06] transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                      <span className="font-mono text-[10px] text-slate-600">{p.value}</span>
                    </div>
                    <div className="font-display text-base font-semibold text-white">
                      {p.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

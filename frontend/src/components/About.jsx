import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Award, Rocket, Users, ShieldCheck } from "lucide-react";

function useGlobeScene(mountRef) {
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
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0x00e5ff, 2, 50);
    l1.position.set(5, 5, 5);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xb026ff, 2, 50);
    l2.position.set(-5, -5, -5);
    scene.add(l2);

    const group = new THREE.Group();
    scene.add(group);

    // Globe sphere (metallic)
    const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a18,
      metalness: 0.9,
      roughness: 0.2,
      emissive: new THREE.Color(0x00e5ff),
      emissiveIntensity: 0.3,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(2.02, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Orbit rings
    const r1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    group.add(r1);

    const r2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.01, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xb026ff })
    );
    r2.rotation.x = Math.PI / 2.5;
    group.add(r2);

    // Connection dots on sphere surface
    const dotCount = 80;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      dotPositions[i * 3] = 2.05 * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = 2.05 * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = 2.05 * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.06,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    group.add(dots);

    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.2;
      group.position.y = Math.sin(t * 0.7) * 0.1;
      r1.rotation.z = t * 0.3;
      r2.rotation.z = -t * 0.2;
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
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
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
  useGlobeScene(mountRef);

  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
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
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
                <span>Lat 9.9312 ° N</span>
                <span>Lon 76.2673 ° E</span>
                <span className="text-cyan-400">● live</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              / 02 — About Vikastra
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5 mb-6">
              Engineering teams
              <br />
              that <span className="gradient-text">ship at velocity</span>.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              We are a global technology studio fusing design intuition with deep
              engineering. Every product we touch is built on three principles:
              cinematic craft, rigorous testing, and a relentless bias toward
              shipping.
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-10">
              From silicon valley startups to enterprise leaders, our team partners
              with founders and CTOs to translate ambitious roadmaps into shipped
              products — fast.
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
                      <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
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

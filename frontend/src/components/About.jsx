import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Award, Rocket, Users, ShieldCheck } from "lucide-react";

/**
 * Replaces the previous "globe" with a neural-network/holographic cube
 * animation — a wireframe icosahedron containing an inner rotating
 * octahedron, surrounded by orbiting nodes connected by lines.
 */
function useNetworkScene(mountRef) {
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
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0x10e5a0, 2.2, 50);
    l1.position.set(5, 5, 5);
    scene.add(l1);
    const l2 = new THREE.PointLight(0x5e7cff, 2.2, 50);
    l2.position.set(-5, -5, -5);
    scene.add(l2);

    const root = new THREE.Group();
    scene.add(root);

    // -------- Outer wireframe icosahedron --------
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x14e5e5,
      transparent: true,
      opacity: 0.6,
    });
    const outerWire = new THREE.LineSegments(outerEdges, outerMat);
    root.add(outerWire);

    // -------- Inner glowing octahedron --------
    const innerGeo = new THREE.OctahedronGeometry(1, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a18,
      metalness: 1,
      roughness: 0.2,
      emissive: new THREE.Color(0x10e5a0),
      emissiveIntensity: 0.6,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    root.add(inner);

    // Inner wireframe
    const innerWireGeo = new THREE.OctahedronGeometry(1.05, 0);
    const innerWireEdges = new THREE.EdgesGeometry(innerWireGeo);
    const innerWireMat = new THREE.LineBasicMaterial({
      color: 0x10e5a0,
      transparent: true,
      opacity: 0.9,
    });
    const innerWire = new THREE.LineSegments(innerWireEdges, innerWireMat);
    root.add(innerWire);

    // -------- Orbiting nodes --------
    const NODE_COUNT = 14;
    const nodes = [];
    const nodeData = [];
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x10e5a0 });
    const altNodeMat = new THREE.MeshBasicMaterial({ color: 0x5e7cff });

    for (let i = 0; i < NODE_COUNT; i++) {
      const radius = 2.8 + Math.random() * 0.6;
      const speed = 0.15 + Math.random() * 0.25;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const axis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        i % 3 === 0 ? altNodeMat : nodeMat
      );
      root.add(node);
      nodes.push(node);
      nodeData.push({ radius, speed, phi, theta, axis, offset: Math.random() * Math.PI * 2 });
    }

    // -------- Connection lines between near nodes --------
    const linePositions = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x10e5a0,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    root.add(lines);

    // -------- Particle dust --------
    const DUST = 250;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const r = 3.5 + Math.random() * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x5e7cff,
      size: 0.025,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    root.add(dust);

    const clock = new THREE.Clock();
    let rafId = 0;
    const tmpV = new THREE.Vector3();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Outer wire — slow tumble
      outerWire.rotation.x = t * 0.12;
      outerWire.rotation.y = t * 0.18;

      // Inner octahedron — opposite rotation
      inner.rotation.x = -t * 0.4;
      inner.rotation.y = t * 0.5;
      innerWire.rotation.x = -t * 0.4;
      innerWire.rotation.y = t * 0.5;

      // Pulsing glow
      const pulse = 1 + Math.sin(t * 1.5) * 0.12;
      inner.scale.setScalar(pulse);
      innerWire.scale.setScalar(pulse);

      // Update nodes orbiting on inclined axes
      for (let i = 0; i < NODE_COUNT; i++) {
        const d = nodeData[i];
        const angle = t * d.speed + d.offset;
        // Position on great-circle plane perpendicular to axis
        const basis = new THREE.Vector3(1, 0, 0);
        if (Math.abs(d.axis.dot(basis)) > 0.9) basis.set(0, 1, 0);
        const tangent = new THREE.Vector3().crossVectors(d.axis, basis).normalize();
        const bitangent = new THREE.Vector3().crossVectors(d.axis, tangent).normalize();
        tmpV.copy(tangent).multiplyScalar(Math.cos(angle) * d.radius)
          .addScaledVector(bitangent, Math.sin(angle) * d.radius);
        nodes[i].position.copy(tmpV);
      }

      // Update connection lines (closest pairs only)
      let idx = 0;
      const maxDist = 2.5;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const a = nodes[i].position;
          const b = nodes[j].position;
          const dist = a.distanceTo(b);
          if (dist < maxDist) {
            linePositions[idx++] = a.x;
            linePositions[idx++] = a.y;
            linePositions[idx++] = a.z;
            linePositions[idx++] = b.x;
            linePositions[idx++] = b.y;
            linePositions[idx++] = b.z;
          }
        }
      }
      for (let k = idx; k < linePositions.length; k++) linePositions[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, idx / 3);

      dust.rotation.y = t * 0.05;

      // Subtle root sway
      root.rotation.y = Math.sin(t * 0.2) * 0.15;
      root.position.y = Math.sin(t * 0.6) * 0.08;

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
      outerGeo.dispose();
      outerEdges.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      innerWireGeo.dispose();
      innerWireEdges.dispose();
      innerWireMat.dispose();
      nodeMat.dispose();
      altNodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
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
  useNetworkScene(mountRef);

  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
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
                <span className="text-emerald-400">● network online</span>
                <span>NODES 14 / 14</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
                <span>Sync 99.8%</span>
                <span>Latency 12ms</span>
                <span>v.0.4.2</span>
              </div>
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l border-t border-emerald-400/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-emerald-400/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-emerald-400/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-emerald-400/40 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
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
                      <Icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
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

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { CONTACT } from "../constants/testIds";

const services = [
  "Web Development",
  "Mobile App Development",
  "Software Development",
  "IoT Solutions",
  "Project Development",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill name, email and message");
      return;
    }
    setLoading(true);
    try {
      await fetch(
  "https://script.google.com/macros/s/AKfycbxq1cC_ZDrRGRxyEZYftGRXoT_AXdGG-drhhdNVLa03MOJh4hshIXFEpqVPAIbpyrY8/exec",
  {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }
);
      setSent(true);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[140px] pointer-events-none" />

      <div className="container-vk relative">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
              Let's Build
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mt-5 mb-6">
              Start your
              <br />
              <span className="gradient-text">next chapter</span>.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-10">
              Tell us about your idea. Our team will respond with a tailored plan
              within 24 hours.
            </p>

            <div className="space-y-5">
              <a
                href="mailto:vikasthratechnologies@gmail.com"
                className="flex items-start gap-4 group"
                data-testid="contact-info-email"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-400/10 border border-sky-400/20 grid place-items-center group-hover:bg-sky-400/20 transition">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Email
                  </div>
                  <div className="text-white group-hover:text-sky-300 transition break-all">
                    vikasthratechnologies@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="tel:+917012845860"
                className="flex items-start gap-4 group"
                data-testid="contact-info-phone-1"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-400/10 border border-violet-400/20 grid place-items-center group-hover:bg-violet-400/20 transition">
                  <Phone className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Primary
                  </div>
                  <div className="text-white group-hover:text-violet-300 transition">
                    +91 70128 45860
                  </div>
                </div>
              </a>

              <a
                href="tel:+918086756642"
                className="flex items-start gap-4 group"
                data-testid="contact-info-phone-2"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-400/10 border border-violet-400/20 grid place-items-center group-hover:bg-violet-400/20 transition">
                  <Phone className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Secondary
                  </div>
                  <div className="text-white group-hover:text-violet-300 transition">
                    +91 80867 56642
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                  <MapPin className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Headquarters
                  </div>
                  <div className="text-white">Kerala, India</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={submit}
            data-testid={CONTACT.form}
            className="lg:col-span-3 glass-strong rounded-3xl p-8 sm:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                  Your Name *
                </label>
                <input
                  data-testid={CONTACT.name}
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Name"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.06] transition"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                  Email *
                </label>
                <input
                  data-testid={CONTACT.email}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.06] transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                  Phone
                </label>
                <input
                  data-testid={CONTACT.phone}
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+91 00000 00000"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.06] transition"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                  Service
                </label>
                <select
                  data-testid={CONTACT.service}
                  name="service"
                  value={form.service}
                  onChange={onChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.06] transition appearance-none"
                >
                  <option value="" className="bg-[#0A0A12]">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-[#0A0A12]">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                Project Brief *
              </label>
              <textarea
                data-testid={CONTACT.message}
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="Tell us about your project, timeline, and goals…"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.06] transition resize-none"
              />
            </div>

            <button
              type="submit"
              data-testid={CONTACT.submit}
              disabled={loading || sent}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-[#05050A] bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-200 hover:to-sky-400 glow-cyan transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Message Sent
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

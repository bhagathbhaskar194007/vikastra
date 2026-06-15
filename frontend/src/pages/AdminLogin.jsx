import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { ADMIN } from "../constants/testIds";

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-400">Loading…</div>;
  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to site
      </a>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={submit}
        data-testid={ADMIN.loginForm}
        className="relative w-full max-w-md glass-strong rounded-3xl p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 grid place-items-center glow-cyan">
            <Lock className="w-5 h-5 text-[#05050A]" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              Vikastra • Console
            </div>
            <div className="font-display text-xl font-bold">Admin Sign In</div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
              Email
            </label>
            <input
              data-testid={ADMIN.loginEmail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition"
              placeholder="admin@vikastra.com"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2 block">
              Password
            </label>
            <input
              data-testid={ADMIN.loginPassword}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          data-testid={ADMIN.loginSubmit}
          disabled={submitting}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-[#05050A] bg-gradient-to-r from-emerald-300 to-emerald-500 hover:from-emerald-200 hover:to-emerald-400 glow-cyan transition-all disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Authenticating…
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          Restricted • Vikastra internal only
        </div>
      </motion.form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Inbox,
  Clock,
  CheckCircle2,
  PhoneCall,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { ADMIN } from "../constants/testIds";

const statusStyle = {
  new: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  contacted: "bg-indigo-400/10 text-indigo-300 border-indigo-400/30",
  closed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
};

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0, recent_7d: 0 });
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const refresh = async () => {
    setBusy(true);
    try {
      const [a, b] = await Promise.all([api.get("/admin/leads"), api.get("/admin/stats")]);
      setLeads(a.data);
      setStats(b.data);
    } catch (e) {
      toast.error("Failed to load");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-400">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/leads/${id}?status=${status}`);
      toast.success(`Marked as ${status}`);
      refresh();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/admin/leads/${id}`);
      toast.success("Lead deleted");
      if (selected?.id === id) setSelected(null);
      refresh();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const filtered = leads.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.service || "").toLowerCase().includes(q) ||
      l.message.toLowerCase().includes(q)
    );
  });

  const statCards = [
    { label: "Total Leads", value: stats.total, icon: Inbox, color: "from-emerald-400 to-blue-500" },
    { label: "New", value: stats.new, icon: Clock, color: "from-indigo-400 to-teal-500" },
    { label: "Contacted", value: stats.contacted, icon: PhoneCall, color: "from-orange-400 to-rose-500" },
    { label: "Last 7 days", value: stats.recent_7d, icon: CheckCircle2, color: "from-emerald-400 to-emerald-500" },
  ];

  return (
    <div
      className="min-h-screen relative"
      data-testid={ADMIN.dashboard}
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#05050A]/85 backdrop-blur-xl border-b border-white/5">
        <div className="container-vk flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 grid place-items-center glow-cyan">
              <span className="font-display font-black text-[#05050A]">V</span>
            </div>
            <div>
              <div className="font-display text-sm font-bold">VIKASTRA • Console</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Logged in as {user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-emerald-400/40 text-sm text-slate-300 hover:text-white transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate("/admin/login");
              }}
              data-testid={ADMIN.logoutBtn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-vk py-10 relative">
        {/* Heading */}
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            / Dashboard
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-3">
            Inbound <span className="gradient-text">leads</span>
          </h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                data-testid={`stat-${c.label.toLowerCase().replace(/ /g, "-")}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.color} grid place-items-center`}>
                    <Icon className="w-4 h-4 text-[#05050A]" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="font-display text-3xl font-bold">{c.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">
                  {c.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leads + Detail */}
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads…"
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {filtered.length} / {leads.length}
              </span>
            </div>

            <div className="divide-y divide-white/5 max-h-[640px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No leads yet. Share your contact form to start collecting inquiries.
                </div>
              ) : (
                filtered.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    data-testid={`${ADMIN.leadRow}-${lead.id}`}
                    className={`w-full text-left p-5 hover:bg-white/[0.03] transition flex items-start gap-4 ${
                      selected?.id === lead.id ? "bg-white/[0.05]" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/30 to-indigo-500/30 grid place-items-center font-display font-bold text-white shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate">{lead.name}</span>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                            statusStyle[lead.status] || statusStyle.new
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 truncate">{lead.email}</div>
                      {lead.service && (
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 mt-1">
                          {lead.service}
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/[0.02] p-6 h-fit sticky top-24">
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                    Lead Detail
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${
                      statusStyle[selected.status] || statusStyle.new
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-1">{selected.name}</h3>
                <div className="text-sm text-slate-400 mb-6">
                  {new Date(selected.created_at).toLocaleString()}
                </div>

                <div className="space-y-3 mb-6">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-400/40 transition"
                  >
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-white break-all">{selected.email}</span>
                  </a>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-400/40 transition"
                    >
                      <Phone className="w-4 h-4 text-indigo-300" />
                      <span className="text-sm text-white">{selected.phone}</span>
                    </a>
                  )}
                  {selected.service && (
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                        Service
                      </div>
                      <div className="text-sm text-white">{selected.service}</div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Message
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    {selected.message}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["new", "contacted", "closed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s}
                      className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] border transition ${
                        selected.status === s
                          ? "bg-emerald-400/20 border-emerald-400/50 text-emerald-200"
                          : "border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => remove(selected.id)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] border border-red-400/20 text-red-300 hover:bg-red-400/10 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Inbox className="w-8 h-8 mx-auto mb-4 opacity-40" />
                <div className="text-sm">Select a lead to view details</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

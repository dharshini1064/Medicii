import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:5001";

function Dashboard() {
  const navigate = useNavigate();
  // SANITY CHECK: Forcibly clean the userId to prevent [object Object] errors
  let userId = localStorage.getItem("userId");
  if (userId && userId.includes("[object")) {
    userId = null;
    localStorage.removeItem("userId");
  }
  const userName = localStorage.getItem("userName") || "User";

  const [logs, setLogs] = useState([]);
  const [meds, setMeds] = useState([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [medForm, setMedForm] = useState({ name: "", dosage: "", unit: "mg", frequency: "Daily", mealTiming: "After meal", time: "08:00" });
  const [medLoading, setMedLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchLogs();
    fetchMeds();
    
    // Auto-refresh every 30s during active session
    const puller = setInterval(fetchLogs, 30000);
    return () => clearInterval(puller);
  }, [userId, navigate]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/api/logs/today?userId=${userId}`);
      const newLogs = res.data || [];
      
      // Check for newly due doses to notify
      newLogs.forEach(log => {
        if (log.status === "pending" && !logs.find(l => l._id === log._id)) {
           sendNotification(log);
        }
      });
      
      setLogs(newLogs);
    } catch (e) { console.error("Logs error", e); }
  };

  const sendNotification = (log) => {
    if (Notification.permission === "granted") {
      new Notification("💊 Time for your Medication!", {
        body: `It's time for ${log.scheduleId?.medicationId?.name || 'your dose'}.`,
        icon: "/logo192.png"
      });
    }
  };

  const fetchMeds = async () => {
    try {
      const res = await axios.get(`${API}/api/medications?userId=${userId}`);
      setMeds(res.data || []);
    } catch (e) { console.error("Meds error", e); }
  };

  const markAs = async (logId, status) => {
    try {
      await axios.post(`${API}/api/logs/take`, { logId, status });
      showToast(status === "taken" ? "✅ Marked as Taken!" : "⏭️ Skipped");
      fetchLogs();
    } catch (e) { console.error("Mark error", e); }
  };

  const addMedication = async () => {
    if (!medForm.name || !medForm.dosage) return;
    setMedLoading(true);
    try {
      // 1. Create medication
      const medRes = await axios.post(`${API}/api/medications`, {
        name: medForm.name,
        dosage: medForm.dosage,
        unit: medForm.unit,
        frequency: medForm.frequency,
        mealTiming: medForm.mealTiming,
        userId,
        isActive: true,
      });
      // 2. Create schedule for it
      await axios.post(`${API}/api/ai/schedule/approve`, {
        userId,
        draftSchedule: [{
          medicine: medForm.name,
          dosage: medForm.dosage,
          unit: medForm.unit,
          frequency: medForm.frequency,
          mealTiming: medForm.mealTiming,
          timeOfDay: medForm.time,
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        }]
      });
      showToast("💊 Medication added & scheduled!");
      setShowAddMed(false);
      setMedForm({ name: "", dosage: "", unit: "mg", frequency: "Daily", mealTiming: "After meal", time: "08:00" });
      fetchMeds();
    } catch (e) {
      console.error("Add med error", e);
      showToast("❌ Failed to add medication");
    } finally { setMedLoading(false); }
  };

  const deleteMed = async (id) => {
    if (!window.confirm("Delete this medication?")) return;
    try {
      await axios.delete(`${API}/api/medications/${id}`);
      showToast("🗑️ Deleted");
      fetchMeds();
    } catch (e) { console.error("Delete error", e); }
  };

  const deleteLog = async (id) => {
    if (!id) return;
    // 1. Instant optimistic removal
    setLogs(prev => prev.filter(l => l._id !== id));
    showToast("🗑️ Removing entry...");

    try {
      // 2. Direct Backend Call
      const res = await axios.delete(`${API}/api/logs/${id}`);
      if (res.status === 204 || res.status === 200) {
        showToast("✅ Discarded");
      } else {
        throw new Error("Deletion failed on server");
      }
    } catch (e) {
      console.error("Critical Delete Error:", e);
      window.alert("⚠️ Could not delete. Is the server running?");
      fetchLogs(); // Recovery
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const adherenceNum = () => {
    if (!logs.length) return 100;
    return Math.floor((logs.filter(l => l.status === "taken").length / logs.length) * 100);
  };

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="dashboard-root">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 24, right: 24, background: "#1E293B", color: "white", padding: "14px 24px", borderRadius: 16, zIndex: 999, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="header-row">
        <div className="welcome-text">
          <h1>Hey, {userName}! 🙌</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{today} — Stay on track with your medications</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/ai-scheduler")}
            style={{ padding: "10px 20px", background: "var(--accent-blue)", color: "white", border: "none", borderRadius: 14, fontWeight: 600, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
          >
            ✨ AI Scheduler
          </motion.button>
          <div className="glass-card-premium" style={{ width: 44, height: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>🔔</div>
        </div>
      </div>

      <div className="grid-main">
        {/* Left Column */}
        <div className="center-column">
          {/* Stats */}
          <div className="grid-stats">
            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="stat-label">Today's Adherence</span>
                <span className={`pill-status ${adherenceNum() >= 80 ? "pill-positive" : "pill-negative"}`}>{adherenceNum() >= 80 ? "Good" : "Needs Attention"}</span>
              </div>
              <div className="stat-num">{adherenceNum()}%</div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{logs.filter(l => l.status === "taken").length} of {logs.length} doses taken</p>
              <div className="progress-bar-container">
                <motion.div className="progress-bar" initial={{ width: 0 }} animate={{ width: `${adherenceNum()}%` }} transition={{ duration: 1 }} />
              </div>
            </motion.div>

            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="stat-label">Active Medications</span>
              <div className="stat-num">{meds.length}</div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                {meds.length === 0 ? "No medications yet" : meds.slice(0, 2).map(m => m.name).join(", ")}
              </p>
              <div className="progress-bar-container" style={{ background: "#E0F2FE" }}>
                <div className="progress-bar" style={{ width: `${Math.min(meds.length * 20, 100)}%`, background: "linear-gradient(90deg, #38BDF8, #0EA5E9)" }} />
              </div>
            </motion.div>

            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span className="stat-label">Missed Today</span>
              <div className="stat-num" style={{ color: logs.filter(l=>l.status==="missed").length > 0 ? "#EF4444" : "#10B981" }}>
                {logs.filter(l => l.status === "missed").length}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                {logs.filter(l=>l.status==="missed").length === 0 ? "All caught up! 🎉" : "Please take your missed doses"}
              </p>
              <div className="progress-bar-container" style={{ background: "#FEE2E2" }}>
                <div className="progress-bar" style={{ width: `${logs.length ? (logs.filter(l=>l.status==="missed").length / logs.length) * 100 : 0}%`, background: "linear-gradient(90deg, #F87171, #EF4444)" }} />
              </div>
            </motion.div>
          </div>

          {/* Weekly Chart */}
          <motion.div className="glass-card-premium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>Adherence History</h3>
              <span className="pill-status" style={{ background: "#CBD5E1" }}>This Week</span>
            </div>
            <div className="chart-sim">
              {[70, 85, 60, 90, adherenceNum(), 75, 80].map((h, i) => (
                <motion.div key={i} className="chart-bar" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, type: "spring" }}
                  style={{ opacity: i === 4 ? 1 : 0.55, background: i === 4 ? "linear-gradient(to top, #3B82F6, #60A5FA)" : "linear-gradient(to top, rgba(59,130,246,0.3), rgba(96,165,250,0.6))" }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
              {["Mon", "Tue", "Wed", "Thu", "Today", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
            </div>
          </motion.div>

          {/* My Medications List */}
          <motion.div className="glass-card-premium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>My Medications</h3>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddMed(true)}
                style={{ padding: "8px 16px", background: "var(--accent-blue)", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                + Add Medication
              </motion.button>
            </div>

            {meds.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
                <p>No medications yet. Add your first one!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {meds.map(med => (
                  <div key={med._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.5)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.8)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #60A5FA, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💊</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{med.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{med.dosage} {med.unit} • {med.frequency} • {med.mealTiming}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className={`pill-status ${med.isActive ? "pill-positive" : "pill-negative"}`}>{med.isActive ? "Active" : "Inactive"}</span>
                      <button onClick={() => deleteMed(med._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5 }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column — Today's Schedule */}
        <div className="right-column">
          <motion.div className="glass-card-premium" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h3 style={{ marginBottom: 8 }}>Today's Schedule</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Track your doses for {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>

            {logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
                <p style={{ fontSize: 14 }}>No pending doses right now!</p>
                <p style={{ fontSize: 12, marginTop: 6 }}>Doses appear here when they're due</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {logs.map(log => (
                  <div key={log._id} className="inner-card" 
                    style={{ 
                      border: `1px solid ${log.status === "taken" ? "#10B981" : log.status === "missed" ? "#EF4444" : "var(--border-glass)"}`,
                      cursor: 'pointer' 
                    }}
                    onClick={() => log.status === "missed" ? markAs(log._id, "taken") : log.status === "taken" ? markAs(log._id, "missed") : null}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: log.status === "taken" ? "#065F46" : "inherit" }}>
                          {log.scheduleId?.medicationId?.name || "Unknown Med"}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          {log.scheduleId?.timeOfDay} • {log.scheduleId?.medicationId?.dosage} {log.scheduleId?.medicationId?.unit}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`pill-status ${log.status === 'taken' ? 'pill-positive' : log.status === 'missed' ? 'pill-negative' : ''}`}
                          style={log.status === "pending" ? { background: "var(--accent-amber)", color: "white" } : {}}>
                          {log.status === "taken" ? "✓" : log.status === "missed" ? "✗" : "⏳"}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); deleteLog(log._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', opacity: 0.3 }}>🗑️</button>
                      </div>
                    </div>
                    {log.status === "pending" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={(e) => { e.stopPropagation(); markAs(log._id, "taken"); }}
                          style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: "var(--accent-blue)", color: "white", fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                          Take
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); markAs(log._id, "skipped"); }}
                          style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border-glass)", background: "transparent", color: "var(--text-muted)", cursor: 'pointer', fontSize: 13 }}>
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddMed(true)}
              style={{ width: "100%", marginTop: 20, padding: 14, background: "rgba(59,130,246,0.06)", border: "1px dashed var(--accent-blue)", borderRadius: 14, color: "var(--accent-blue)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              + Add Medication
            </motion.button>
          </motion.div>

          {/* ✅ ACTIVITY TRACKER / MARKED DONE HISTORY */}
          <motion.div className="glass-card-premium" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Activity Log (Marked Done)</h3>
              <span className="pill-status" style={{ background: "#DCFCE7", color: "#166534", fontSize: 10 }}>HISTORY</span>
            </div>
            
            <div style={{ maxHeight: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
               {logs.filter(l => l.status === "taken").length === 0 ? (
                 <div style={{ textAlign: "center", padding: "24px 0" }}>
                   <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No doses marked as done yet.</p>
                 </div>
               ) : (
                 logs.filter(l => l.status === "taken").map(log => (
                   <div key={log._id + "_hist"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255,255,255,0.4)", borderRadius: 12, border: "1px solid rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                         <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                         <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{log.scheduleId?.medicationId?.name || "Medicine"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(log.loggedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Completed</div>
                         </div>
                      </div>
                      <span style={{ fontSize: 14 }}>✅</span>
                   </div>
                 ))
               )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {showAddMed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={(e) => e.target === e.currentTarget && setShowAddMed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-card-premium"
              style={{ width: "100%", maxWidth: 480, background: "white" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ margin: 0 }}>💊 Add New Medication</h3>
                <button onClick={() => setShowAddMed(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Medicine Name *</label>
                  <input value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} placeholder="e.g. Paracetamol"
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Dosage *</label>
                    <input value={medForm.dosage} onChange={e => setMedForm({...medForm, dosage: e.target.value})} placeholder="e.g. 500"
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Unit</label>
                    <select value={medForm.unit} onChange={e => setMedForm({...medForm, unit: e.target.value})}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit", background: "white" }}>
                      <option>mg</option><option>ml</option><option>tablet</option><option>capsule</option><option>drops</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Frequency</label>
                    <select value={medForm.frequency} onChange={e => setMedForm({...medForm, frequency: e.target.value})}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit", background: "white" }}>
                      <option>Daily</option><option>Twice Daily</option><option>Weekly</option><option>As Needed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Time</label>
                    <input type="time" value={medForm.time} onChange={e => setMedForm({...medForm, time: e.target.value})}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Meal Timing</label>
                  <select value={medForm.mealTiming} onChange={e => setMedForm({...medForm, mealTiming: e.target.value})}
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "inherit", background: "white" }}>
                    <option>After meal</option><option>Before meal</option><option>With food</option><option>Empty stomach</option><option>Anytime</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => setShowAddMed(false)}
                  style={{ flex: 1, padding: 14, borderRadius: 14, border: "1px solid #E2E8F0", background: "white", fontWeight: 600, cursor: "pointer", fontSize: 15, fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button onClick={addMedication} disabled={medLoading || !medForm.name || !medForm.dosage}
                  style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: medLoading ? "#93C5FD" : "var(--accent-blue)", color: "white", fontWeight: 700, cursor: medLoading ? "not-allowed" : "pointer", fontSize: 15, fontFamily: "inherit" }}>
                  {medLoading ? "Saving..." : "💊 Add & Schedule"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;

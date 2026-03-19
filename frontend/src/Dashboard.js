import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [userId] = useState("current_user_id"); // Mocking current user

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/logs/today?userId=${userId}`);
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  const markAs = async (logId, status) => {
    try {
      await axios.post("http://localhost:5001/api/logs/take", { logId, status });
      fetchLogs();
    } catch (error) {
      console.error("Error updating log", error);
    }
  };

  const adherenceNum = () => {
    if (!logs.length) return 100;
    return Math.floor((logs.filter(l => l.status === "taken").length / logs.length) * 100);
  };

  return (
    <div className="dashboard-root">
      <div className="header-row">
        <div className="welcome-text">
          <h1>Hey, Amanda! Glad to have you back 🙌</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your health today.</p>
        </div>
        <div className="user-controls" style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card-premium" style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
          <div className="glass-card-premium" style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</div>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#CBD5E1' }}></div>
        </div>
      </div>

      <div className="grid-main">
        <div className="center-column">
          <div className="grid-stats">
            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="stat-label">Progress Tracking</span>
                <span className="pill-status pill-positive">+15%</span>
              </div>
              <div className="stat-num">{adherenceNum()}%</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Adherence over last 3 days</p>
              <div className="progress-bar-container">
                 <motion.div className="progress-bar" style={{ width: `${adherenceNum()}%` }} initial={{ width: 0 }} animate={{ width: `${adherenceNum()}%` }} />
              </div>
            </motion.div>

            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="stat-label">Educational Sources</span>
              <div className="stat-num">22</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Articles read this week</p>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-teal)' }}>✓</span> Breathing techniques
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-teal)' }}>✓</span> Identifying stress
                </div>
              </div>
            </motion.div>

            <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span className="stat-label">Medical Contacts</span>
              <div className="stat-num">6</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Active prescriptions</p>
              <div className="progress-bar-container" style={{ background: '#FEE2E2' }}>
                 <div className="progress-bar" style={{ width: '65%', background: 'linear-gradient(90deg, #F87171, #EF4444)' }} />
              </div>
            </motion.div>
          </div>

          <motion.div className="glass-card-premium" style={{ marginBottom: '32px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Medication Adherence History</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="pill-status" style={{ background: '#CBD5E1', cursor: 'pointer' }}>Week</span>
                <span className="pill-status" style={{ background: 'transparent', cursor: 'pointer' }}>Month</span>
              </div>
            </div>
            <div className="chart-sim">
               {[40, 60, 45, 80, 50, 65, 55].map((h, i) => (
                 <motion.div 
                  key={i} 
                  className="chart-bar" 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  transition={{ delay: i * 0.1 }}
                  style={{ opacity: i === 3 ? 1 : 0.6 }}
                 />
               ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>16 Aug</span><span>17 Aug</span><span>18 Aug</span><span>19 Aug</span><span>20 Aug</span><span>21 Aug</span><span>22 Aug</span>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <motion.div className="glass-card-premium btn-urgent" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚨</div>
                <div>Urgent SOS Support</div>
                <div style={{ fontSize: '12px', fontWeight: 400, marginTop: '4px', opacity: 0.9 }}>Connect to emergency services</div>
             </motion.div>
             <motion.div className="glass-card-premium btn-urgent">
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
                <div>AI Schedule Assistant</div>
                <div style={{ fontSize: '12px', fontWeight: 400, marginTop: '4px', opacity: 0.9 }}>Optimize your health routine</div>
             </motion.div>
          </div>
        </div>

        <div className="right-column">
          <motion.div className="glass-card-premium" style={{ height: '100%' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <h3 style={{ marginBottom: '24px' }}>Today's Schedule</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Medications due today</p>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {logs.map((log) => (
                 <div key={log._id} className="glass-card-premium" style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: 'none' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{log.scheduleId.medicationId.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.scheduleId.timeOfDay} • {log.scheduleId.medicationId.dosage}</div>
                      </div>
                      <span className={`pill-status ${log.status === 'taken' ? 'pill-positive' : 'pill-negative'}`} style={{ fontSize: '11px' }}>
                        {log.status.toUpperCase()}
                      </span>
                   </div>
                   {log.status === "pending" && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={() => markAs(log._id, "taken")} style={{ flex: 1, padding: '8px', borderRadius: '12px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Take</button>
                      <button onClick={() => markAs(log._id, "skipped")} style={{ padding: '8px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>Skip</button>
                    </div>
                   )}
                 </div>
               ))}
               {!logs.length && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No meds for today 🎉</div>}
             </div>

             <div className="glass-card-premium" style={{ marginTop: 'auto', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--accent-blue)', textAlign: 'center', padding: '20px', cursor: 'pointer' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>+ Add new medication</span>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

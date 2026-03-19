import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AIScheduleAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [userId] = useState("current_user_id");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/schedule", { prompt });
      setDraft(res.data);
    } catch (error) {
      console.error("Failed to generate schedule", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/ai/schedule/approve", {
        draftSchedule: draft.draftSchedule,
        userId: userId || "default_user_id"
      });
      alert("✅ Schedule Approved & Saved!");
      setDraft(null);
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-root" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header className="header-row">
        <div className="welcome-text">
          <h1>✨ AI Schedule Assistant</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tell me your medications and routine, I'll organize them.</p>
        </div>
      </header>

      <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ marginBottom: '16px' }}>Input medications or routine</h3>
        <textarea
          style={{ width: '100%', height: '120px', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', fontSize: '15px', color: 'var(--text-active)', background: 'white', resize: 'none' }}
          placeholder="e.g. I take Metformin 500mg once in morning and evening, and Aspirin 81mg every night."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            onClick={handleGenerate} 
            disabled={loading || !prompt}
            style={{ padding: '12px 32px', borderRadius: '16px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 600, cursor: (loading || !prompt) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
          >
            {loading ? "Analyzing..." : "Generate Schedule"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {draft && (
          <motion.div 
            className="glass-card-premium" 
            style={{ marginTop: '32px', border: '1px solid var(--accent-blue)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Proposed Schedule</h3>
              <span className="pill-status" style={{ background: '#E0F2FE', color: '#0369A1' }}>DRAFT</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {draft.draftSchedule.map((item, idx) => (
                <div key={idx} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.medicine}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.dosage} • {item.timeOfDay} • {item.frequency}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600 }}>{item.daysOfWeek?.length === 7 ? 'DAILY' : 'SELECTED DAYS'}</div>
                </div>
              ))}
            </div>

            <div className="glass-card-premium" style={{ background: 'rgba(59, 130, 246, 0.05)', border: 'none', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-amber)' }}>⚠️ AI Disclaimer</div>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{draft.disclaimer || "Ask doctor/pharmacist before acting on this."}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleApprove} 
                disabled={loading}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--accent-teal)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Approve & Save Schedule
              </button>
              <button 
                onClick={() => setDraft(null)}
                style={{ padding: '16px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', background: 'white' }}
              >
                Reject
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIScheduleAssistant;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AIScheduleAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleGenerate = async () => {
    setLoading(true);
    setDraft(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/ai/schedule`, { prompt });
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
      await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/ai/schedule/approve`, {
        draftSchedule: draft.draftSchedule,
        userId: userId
      });
      alert("✅ Schedule Approved & Successfully Saved! Check your dashboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-root" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="header-row">
        <div className="welcome-text">
          <h1>✨ AI Schedule Assistant</h1>
          <p style={{ color: 'var(--text-muted)' }}>Describe your medications and routine below.</p>
        </div>
      </header>

      <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Your Routine</h3>
        <textarea
          style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-active)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '16px', fontSize: '15px', resize: 'none', outline: 'none' }}
          placeholder="e.g. I take Metformin 500mg in the morning and Gliclazide 80mg at night. I also have high BP so I take Lisinopril."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button 
            onClick={handleGenerate} 
            disabled={loading || !prompt}
            style={{ padding: '14px 40px', borderRadius: '14px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 700, cursor: (loading || !prompt) ? 'not-allowed' : 'pointer' }}
          >
            {loading ? "AI is thinking..." : "Generate Plan ✨"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {draft && (
          <motion.div 
            className="glass-card-premium" 
            style={{ marginTop: '32px', border: '1px solid var(--accent-blue)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Proposed Schedule</h3>
              <span className="pill-status" style={{ background: 'var(--accent-blue)', color: 'white' }}>DRAFT</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {draft.draftSchedule.map((item, idx) => (
                <div key={idx} className="inner-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.medicine}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.dosage} • {item.timeOfDay} • {item.frequency}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: 700 }}>{item.daysOfWeek?.length === 7 ? 'DAILY' : 'SCHEDULED'}</div>
                </div>
              ))}
            </div>

            <div className="inner-card" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-amber)' }}>⚠️ Medical Disclaimer</div>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{draft.disclaimer || "Always consult with a licensed doctor or pharmacist before starting a new medication routine."}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleApprove} 
                disabled={loading}
                style={{ flex: 1, padding: '18px', borderRadius: '16px', border: 'none', background: 'var(--accent-teal)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '16px' }}
              >
                Approve & Save Schedule
              </button>
              <button 
                onClick={() => setDraft(null)}
                style={{ padding: '18px 30px', borderRadius: '16px', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', background: 'transparent' }}
              >
                Discard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIScheduleAssistant;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5001") + "/api";

const AIScheduleAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/ai/schedule`, { prompt });
      setDraft(res.data.draftSchedule || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const updateDraft = (idx, field, val) => {
    const updated = [...draft];
    updated[idx][field] = val;
    setDraft(updated);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/ai/schedule/approve`, { draftSchedule: draft, userId });
      navigate("/dashboard");
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <div className="ai-assistant-root" style={{ maxWidth: '850px', margin: '0 auto', padding: '60px 20px' }}>
      <header className="header-row">
        <h1>✨ AI Schedule Assistant</h1>
        <p className="label-cap">Describe your routine and let AI build the cards.</p>
      </header>

      <div className="glass-card-premium" style={{ marginBottom: '40px' }}>
        <textarea
          style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.02)', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', fontSize: '15px', outline: 'none' }}
          placeholder="e.g. I take 500mg Metformin twice daily. Once in morning, once at night."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-primary" onClick={handleGenerate} disabled={loading || !prompt} style={{ padding: '16px 40px' }}>
            {loading ? "Generating..." : "Generate Draft ✨"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div className="glass-card-premium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ border: '2px solid var(--accent-blue)' }}>
            <h3 style={{ marginBottom: '24px' }}>Draft Proposal (Editable) ✏️</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {draft.map((item, idx) => (
                <div key={idx} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
                      <div>
                         <label style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>MEDICINE NAME</label>
                         <input placeholder="e.g. Advil" value={item.medicine} onChange={e => updateDraft(idx, 'medicine', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(255,255,255,1)', color: '#1E293B', fontSize: '14px', fontWeight: 600 }} />
                      </div>
                      <div>
                         <label style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>DOSAGE</label>
                         <input placeholder="200mg" value={item.dosage} onChange={e => updateDraft(idx, 'dosage', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(255,255,255,1)', color: '#1E293B', fontSize: '14px', fontWeight: 600 }} />
                      </div>
                      <div>
                         <label style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>TIME</label>
                         <input type="time" value={item.timeOfDay} onChange={e => updateDraft(idx, 'timeOfDay', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(255,255,255,1)', color: '#1E293B', fontSize: '14px', fontWeight: 600 }} />
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={handleApprove} style={{ flex: 1.5, padding: '16px', background: 'var(--accent-teal)', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Confirm & Save All</button>
               <button onClick={() => setDraft(null)} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Discard</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIScheduleAssistant;

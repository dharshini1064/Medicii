import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5001") + "/api";

const Details = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null); // 'add' or 'edit'
  const [currentMed, setCurrentMed] = useState(null);
  const [interactionResults, setInteractionResults] = useState(null);
  const navigate = useNavigate();
  
  // SANITY CHECK: Clean the ID
  let rawId = localStorage.getItem("userId");
  const userId = (rawId && rawId.includes("[object")) ? null : rawId;

  const [formData, setFormData] = useState({
    name: "", dosage: "", unit: "mg", frequency: "Daily", mealTiming: "After meal", notes: ""
  });

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchMedications();
  }, [userId]);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/medications?userId=${userId}`);
      setMedications(res.data);
      if (res.data.length > 1) checkInteractions(res.data.map(m => m.name));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const checkInteractions = async (names) => {
    try {
      const res = await axios.post(`${API_BASE}/check-interaction`, { medications: names });
      setInteractionResults(res.data);
    } catch (e) {}
  };

  const openEdit = (med) => {
    setCurrentMed(med);
    setFormData({ 
      name: med.name, dosage: med.dosage, unit: med.unit, 
      frequency: med.frequency, mealTiming: med.mealTiming, notes: med.notes || "" 
    });
    setShowModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (showModal === 'edit') {
        await axios.put(`${API_BASE}/medications/${currentMed._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/medications`, { ...formData, userId });
      }
      setShowModal(null);
      fetchMedications();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (med) => {
    try {
      await axios.put(`${API_BASE}/medications/${med._id}`, { isActive: !med.isActive });
      fetchMedications();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/medications/${id}`);
      fetchMedications();
    } catch (e) {}
  };

  return (
    <div className="medication-manager-root">
      <header className="header-row">
        <div className="welcome-text">
          <h1>💊 My Medications</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your active prescriptions and check for interactions.</p>
        </div>
        <button className="glass-card-premium" style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => { setFormData({name: "", dosage: "", unit: "mg", frequency: "Daily", mealTiming: "After meal", notes: ""}); setShowModal('add'); }}>
          + Add Medication
        </button>
      </header>

      {interactionResults?.interactions && (
        <motion.div className="glass-card-premium" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h4 style={{ color: '#B91C1C', margin: 0 }}>Interaction Detected</h4>
              <p style={{ fontSize: '14px', color: '#7F1D1D', marginTop: '4px' }}>{interactionResults.message}</p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {medications.map((med) => (
            <motion.div key={med._id} className="glass-card-premium" style={{ opacity: med.isActive ? 1 : 0.6, padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    💊
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(med)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.5 }}>✏️</button>
                    <button onClick={() => handleDelete(med._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.3 }}>🗑️</button>
                 </div>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                 <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>{med.name}</h3>
                 <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>🕗 {med.mealTiming}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="pill-status" style={{ background: 'var(--accent-blue)', color: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>{med.dosage} {med.unit}</span>
                    <span className="pill-status" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(56,189,248,0.2)', padding: '5px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>{med.frequency}</span>
                 </div>
                 <button onClick={() => toggleActive(med)} style={{ padding: '6px 12px', borderRadius: '10px', border: `1px solid ${med.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, background: 'transparent', cursor: 'pointer', fontSize: '10px', fontWeight: 800, color: med.isActive ? '#10B981' : '#EF4444', textTransform: 'uppercase' }}>
                    {med.isActive ? "● Active" : "● Paused"}
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔹 EDIT / ADD MODAL */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <motion.div className="glass-card-premium" style={{ width: '100%', maxWidth: '500px', padding: '40px', background: 'white' }} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <h2 style={{ marginBottom: '32px' }}>{showModal === 'edit' ? "✏️ Edit Medication" : "➕ Add Medication"}</h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="label-input" style={{ fontSize: '13px', fontWeight: 700 }}>Medicine Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '13px', fontWeight: 700 }}>Dosage</label><input required value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} /></div>
                  <div style={{ width: '100px' }}><label style={{ fontSize: '13px', fontWeight: 700 }}>Unit</label><select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white' }}><option>mg</option><option>tablet</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                   <div style={{ flex: 1 }}><label style={{ fontSize: '13px', fontWeight: 700 }}>Frequency</label><select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white' }}><option>Daily</option><option>Twice Daily</option></select></div>
                   <div style={{ flex: 1 }}><label style={{ fontSize: '13px', fontWeight: 700 }}>Meal Timing</label><select value={formData.mealTiming} onChange={e => setFormData({...formData, mealTiming: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white' }}><option>After meal</option><option>Before meal</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                   <button type="button" onClick={() => setShowModal(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 600 }}>Cancel</button>
                   <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 700 }}>Update Medication</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Details;

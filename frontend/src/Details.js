import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5001/api";

const Details = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [interactionResults, setInteractionResults] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    unit: "mg",
    frequency: "Daily",
    mealTiming: "After meal",
    notes: ""
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchMedications();
  }, [userId, navigate]);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/medications?userId=${userId}`);
      setMedications(res.data);
      checkInteractions(res.data.map(m => m.name));
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkInteractions = async (names) => {
    if (names.length < 2) return;
    try {
      const res = await axios.post(`http://localhost:5001/api/check-interaction`, { medications: names });
      setInteractionResults(res.data);
    } catch (error) {
      console.error("Interaction check failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/medications`, { ...formData, userId });
      setShowAddModal(false);
      setFormData({ name: "", dosage: "", unit: "mg", frequency: "Daily", mealTiming: "After meal", notes: "" });
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;
    try {
      await axios.delete(`${API_BASE}/medications/${id}`);
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  return (
    <div className="medication-manager-root">
      <header className="header-row">
        <div className="welcome-text">
          <h1>💊 My Medications</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your active prescriptions and check for interactions.</p>
        </div>
        <button 
          className="glass-card-premium" 
          style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setShowAddModal(true)}
        >
          + Add Medication
        </button>
      </header>

      {interactionResults && interactionResults.interactions && (
        <motion.div 
          className="glass-card-premium" 
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', marginBottom: '32px' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h4 style={{ color: '#B91C1C', margin: 0 }}>Interaction Warning Detected</h4>
              <p style={{ fontSize: '14px', color: '#7F1D1D', marginTop: '4px' }}>
                {interactionResults.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>Loading medications...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {medications.map((med) => (
            <motion.div 
              key={med._id} 
              className="glass-card-premium"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  💊
                </div>
                <button 
                  onClick={() => handleDelete(med._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3 }}
                >
                  🗑️
                </button>
              </div>
              
              <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>{med.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <span className="pill-status" style={{ background: '#F1F5F9' }}>{med.dosage} {med.unit}</span>
                <span className="pill-status" style={{ background: '#F1F5F9' }}>{med.frequency}</span>
                <span className="pill-status" style={{ background: '#F1F5F9' }}>{med.mealTiming}</span>
              </div>
              
              {med.notes && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
                  {med.notes}
                </p>
              )}
            </motion.div>
          ))}
          
          {medications.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
              No medications added yet. Click "+ Add Medication" to start.
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              className="glass-card-premium" 
              style={{ width: '100%', maxWidth: '500px', padding: '32px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h2 style={{ marginBottom: '24px' }}>Add Medication</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Medicine Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Advil" 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Dosage</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. 200" 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    />
                  </div>
                  <div style={{ width: '100px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Unit</label>
                    <select 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                      <option>mg</option>
                      <option>mcg</option>
                      <option>ml</option>
                      <option>tablet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Notes (optional)</label>
                  <textarea 
                    placeholder="Heart disease, take with water" 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', resize: 'none', height: '80px' }}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Save Medication
                  </button>
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

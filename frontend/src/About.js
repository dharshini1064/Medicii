import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const steps = [
    { title: "🚀 Get Started", description: "Create an account to securely store your medication records and set up your health profile." },
    { title: "✨ AI Assistant", description: "Use our AI Schedule Assistant to parse your natural language routine (e.g. 'I take Advil every morning') into a structured medication plan." },
    { title: "📅 Tracking", description: "View your daily medication schedule in a bento-grid dashboard and mark doses as 'Taken' or 'Skipped' with a single click." },
    { title: "🔔 Reminders", description: "Our system automatically schedules reminders and triggers email alerts to you (and your doctor/family) if a dose is missed." },
    { title: "🚨 Safety First", description: "Get real-time interaction warnings if you add medications that might cross-react dangerously with each other." }
  ];

  return (
    <div className="about-root" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="header-row">
        <div className="welcome-text">
          <h1>📖 How Medicii Works</h1>
          <p style={{ color: "var(--text-muted)" }}>Your comprehensive guide to mastering your health with AI.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
        {steps.map((step, idx) => (
          <motion.div 
            key={idx} 
            className="glass-card-premium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 style={{ marginBottom: '8px', color: 'var(--accent-blue)' }}>{step.title}</h3>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-active)' }}>
              {step.description}
            </p>
          </motion.div>
        ))}
        
        <motion.div 
          className="glass-card-premium" 
          style={{ background: 'var(--text-active)', color: 'white', cursor: 'pointer', textAlign: 'center', marginTop: '32px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = "/dashboard"}
        >
          <h3 style={{ margin: 0 }}>Got it! Go to Dashboard 🏠</h3>
        </motion.div>
      </div>
      
      <footer style={{ marginTop: '64px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        <p>© 2026 Medicii - Powered by AI & Advanced Adherence Tracking</p>
      </footer>
    </div>
  );
};

export default About;

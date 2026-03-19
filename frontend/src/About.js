import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const sections = [
    {
      title: "Secure Onboarding & Profile Setup",
      content: "Begin your journey by creating a secure, encrypted account. Medicii uses enterprise-grade authentication to protect your clinical records. During setup, you'll define your primary health goals, allowing the system to tailor reminders and adherence scores to your specific needs."
    },
    {
      title: "Natural Language AI Assistant",
      content: "Our system utilizes advanced Natural Language Processing to decode complex medical routines. You can describe your schedule in plain English—for example: 'I take 500mg Metformin after dinner and once before breakfast.' The AI parses these sentences into structured data, considering meal timings, dosages, and exact intervals to prevent drug-scheduling errors."
    },
    {
      title: "Draft Review & Customization",
      content: "Before any schedule is committed to the database, you are presented with an interactive draft. This human-in-the-loop system allows you to verify every AI-generated card, manually adjusting times or names to perfectly match your doctor's instructions. This ensures 100% accuracy in your final tracking log."
    },
    {
      title: "Intelligent Adherence Tracking",
      content: "Track your doses in real-time through our high-contrast bento-grid dashboard. Every 'Taken' or 'Skipped' action is logged with a millisecond timestamp, providing you with a dynamic Adherence Score. This percentage helps you visualize your progress and identifies patterns in missed doses that may need schedule adjustment."
    },
    {
      title: "Smart Alerts & Caregiver Sync",
      content: "The system automatically triggers email notifications and mobile push alerts exactly when your doses are due. If a critical dose is repeatedly missed, our automated reconciliation protocols ensure that you (or an optional emergency contact) are notified, maintaining safety around the clock."
    }
  ];

  return (
    <div className="ai-assistant-root" style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '16px' }}>Mastering Your Health with Medicii</h1>
        <p className="label-cap" style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>A comprehensive technical guide to our AI-driven medication adherence platform.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map((sec, idx) => (
          <motion.div 
            key={idx}
            className="glass-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ padding: '40px', border: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--accent-blue)' }}>{sec.title}</h3>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-muted)' }}>{sec.content}</p>
          </motion.div>
        ))}
      </div>

      <footer style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '13px' }}>Medicii AI Adherence Engine v1.0.4 — Optimized for Clinical Accuracy</p>
      </footer>
    </div>
  );
};

export default About;

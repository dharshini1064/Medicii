import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Submitted:", { email, password });
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <motion.div 
        className="glass-card-premium" 
        style={{ width: '100%', maxWidth: '440px', padding: '48px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="logo-heart" style={{ margin: '0 auto 24px', display: 'flex' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.553 0 2.946.643 3.935 1.674C12.67 3.643 14.063 3 15.615 3c3.037 0 5.501 2.322 5.501 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage your health with precision.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-active)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-card-premium"
              style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '16px' }}
              placeholder="name@company.com"
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-active)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-card-premium"
              style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '16px' }}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

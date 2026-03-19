import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/details", icon: "💊", label: "Medications" },
    { path: "/ai-scheduler", icon: "✨", label: "AI Assist" },
    { path: "/about", icon: "📖", label: "Help" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleSOS = async () => {
    if (!window.confirm("🚨 SOS ALERT? \nEmergency contacts will be notified.")) return;
    try {
      await axios.post("http://localhost:5001/api/send-sos", { userId, timestamp: new Date() });
      alert("✅ SOS Sent!");
    } catch (e) { alert("❌ Failed to send SOS"); }
  };

  return (
    <aside className="sidebar-modern">
      <div className="logo-heart">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
           <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.553 0 2.946.643 3.935 1.674C12.67 3.643 14.063 3 15.615 3c3.037 0 5.501 2.322 5.501 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>

      <nav style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
            </motion.div>
          </Link>
        ))}

        <motion.div
          className="nav-item"
          style={{ marginTop: '24px', opacity: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
        >
          <span style={{ fontSize: '20px' }}>{theme === "light" ? "🌙" : "☀️"}</span>
        </motion.div>

        <motion.div
          className="nav-item"
          style={{ marginTop: '12px' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
        </motion.div>
      </nav>

      <motion.div 
        className="nav-item"
        style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
        whileHover={{ background: '#EF4444', color: 'white' }}
        onClick={handleSOS}
      >
        <span style={{ fontSize: '20px' }}>🚨</span>
      </motion.div>
    </aside>
  );
};

export default Navbar;

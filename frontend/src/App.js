import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import Details from "./Details";
import About from "./About";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

import AIScheduleAssistant from "./AIScheduleAssistant";

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="layout-wrapper">
      {!hideSidebar && <Navbar />}
      <main className="content-area" style={{ padding: hideSidebar ? 0 : '40px' }}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<Details />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-scheduler" element={<AIScheduleAssistant />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Ask for notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log(`Notification permission: ${permission}`);
      });
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

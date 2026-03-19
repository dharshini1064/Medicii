import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>About Medicine Tracker</h1>
        <p style={styles.description}>
          The <strong>Medicine Tracker</strong> is a smart solution designed to help users keep track of their medications effortlessly.
          Whether you are managing daily prescriptions, tracking expiry dates, or setting reminders for refills, our system ensures that you never miss a dose.
        </p>

        <h2 style={styles.subtitle}>How It Works</h2>
        <ul style={styles.list}>
          <li><strong>Sign Up/Login:</strong> Create an account to securely store your medication records.</li>
          <li><strong>Add Medicines:</strong> Enter medicine names, dosage, frequency, and expiry dates.</li>
          <li><strong>Track Usage:</strong> View your medication schedule and get alerts for missed doses.</li>
          <li><strong>Refill Reminders:</strong> Receive notifications when it’s time to buy new medicine.</li>
          <li><strong>Dashboard:</strong> Get an overview of your medications, health insights, and history.</li>
        </ul>

        <h2 style={styles.subtitle}>Why Choose Medicine Tracker?</h2>
        <p style={styles.description}>
          ✅ Simple & User-Friendly Interface <br />
          ✅ Automated Medication Reminders <br />
          ✅ Secure Cloud Storage <br />
          ✅ Helps Prevent Missed Doses & Overdoses <br />
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Arial', sans-serif",
    padding: "20px", // Added padding for small screens
  },
  content: {
    width: "80%", // Adjusted for responsiveness
    maxWidth: "800px", // Prevents it from being too wide on larger screens
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "15px",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginTop: "20px",
    marginBottom: "10px",
    color: "#007BFF",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
  },
  list: {
    textAlign: "left",
    fontSize: "1rem",
    color: "#444",
    lineHeight: "1.6",
    margin: "10px 0",
  },
};

// Media Queries for Responsiveness
const mediaQuery = `
  @media (max-width: 768px) {
    .content {
      width: 90%;
      padding: 20px;
    }
    .title {
      font-size: 1.8rem;
    }
    .subtitle {
      font-size: 1.3rem;
    }
    .description, .list {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    .content {
      width: 95%;
      padding: 15px;
    }
    .title {
      font-size: 1.6rem;
    }
    .subtitle {
      font-size: 1.2rem;
    }
    .description, .list {
      font-size: 0.9rem;
    }
  }
`;

// Inject the media queries into the document
const styleTag = document.createElement("style");
styleTag.innerHTML = mediaQuery;
document.head.appendChild(styleTag);

export default About;

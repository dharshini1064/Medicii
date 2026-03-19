import React from "react";
import Navbar from "./Navbar"; // Import Navbar

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Add Navbar here */}
      <div style={styles.container}>
        <h1>Welcome to Medicine Tracker</h1>
        <p>Track your medicines, stay healthy, and never miss a dose!</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "20px",
    color: "#333",
  },
};

export default Home;

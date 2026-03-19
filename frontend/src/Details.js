import React, { useState, useEffect } from "react";

function Details({ onSave }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familyMail, setFamilyMail] = useState("");
  const [doctorMail, setDoctorMail] = useState("");
  const [disease, setDisease] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", timing: "" }]);
  const [adherenceData, setAdherenceData] = useState(
    JSON.parse(localStorage.getItem("adherenceData")) || []
  );

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log(`Notification permission: ${permission}`);
      });
    }
  }, []);

  const handleSave = () => {
    const userData = {
      name,
      age,
      gender,
      familyMail,
      doctorMail,
      disease,
      medicines,
    };

    if (onSave) {
      onSave(userData);
      alert("Details Saved Successfully!");
    }

    medicines.forEach((medicine) => {
      scheduleNotification(medicine);
    });

    clearForm();
  };

  const clearForm = () => {
    setName("");
    setAge("");
    setGender("");
    setFamilyMail("");
    setDoctorMail("");
    setDisease("");
    setMedicines([{ name: "", timing: "" }]);
  };

  const scheduleNotification = (medicine) => {
    const [hour, minute] = medicine.timing.split(":").map(Number);
    const now = new Date();
    const reminderTime = new Date();

    reminderTime.setHours(hour);
    reminderTime.setMinutes(minute);
    reminderTime.setSeconds(0);

    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeDiff = reminderTime - now;

    setTimeout(() => {
      showNotification(medicine);
    }, timeDiff);
  };

  const showNotification = (medicine) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Medicine Reminder", {
        body: `Time to take ${medicine.name}!`,
        icon: "https://cdn-icons-png.flaticon.com/512/126/126509.png",
      });

      notification.onclick = () => {
        const userResponse = window.confirm(`Did you take ${medicine.name}?`);
        saveMedicineStatus(medicine.name, userResponse);
      };
    }
  };

  const saveMedicineStatus = (medicineName, taken) => {
    const newEntry = {
      medicine: medicineName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      taken,
    };

    const updatedData = [...adherenceData, newEntry];
    setAdherenceData(updatedData);
    localStorage.setItem("adherenceData", JSON.stringify(updatedData));

    if (!taken) {
      sendMissedDoseAlert(medicineName);
    }
  };

  // Send alert to family & doctor if medicine is missed
  const sendMissedDoseAlert = async (medicineName) => {
    const emailData = {
      to: [familyMail, doctorMail],
      subject: "Missed Medication Alert",
      body: `Alert: ${name} missed their medicine (${medicineName}) on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.`,
    };

    try {
      await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      console.log("Missed dose email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="details-container">
      <h2>Enter Details</h2>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Age:</label>
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

      <label>Gender:</label>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label>Family Email:</label>
      <input type="email" value={familyMail} onChange={(e) => setFamilyMail(e.target.value)} />

      <label>Doctor Email:</label>
      <input type="email" value={doctorMail} onChange={(e) => setDoctorMail(e.target.value)} />

      <label>Disease:</label>
      <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} />

      <h3>Medicines</h3>
      {medicines.map((medicine, index) => (
        <div key={index} className="medicine-row">
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicine.name}
            onChange={(e) => setMedicines((prev) =>
              prev.map((m, i) => (i === index ? { ...m, name: e.target.value } : m))
            )}
          />
          <input
            type="time"
            value={medicine.timing}
            onChange={(e) => setMedicines((prev) =>
              prev.map((m, i) => (i === index ? { ...m, timing: e.target.value } : m))
            )}
          />
        </div>
      ))}

      <button className="btn-add" onClick={() => setMedicines([...medicines, { name: "", timing: "" }])}>+ Add Medicine</button>
      <button className="btn-save" onClick={handleSave}>Save Profile</button>
    </div>
  );
}

export default Details;

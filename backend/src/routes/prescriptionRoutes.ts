import express from "express";
import Prescription from "../models/Prescription";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 📌 Create Prescription
router.post("/create-prescription", async (req, res) => {
  try {
    const { doctorId, patientId, medicines, notes, fileUrl } = req.body;

    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: patientId,
      medicines,
      notes,
      fileUrl,
    });

    await newPrescription.save();

    res.status(201).json({ message: "✅ Prescription created successfully", newPrescription });
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({ message: "Error creating prescription", error });
  }
});

// 📌 Get Prescriptions for a Patient
router.get("/get-prescriptions/:patientId", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate("doctor", "name email");

    res.status(200).json({ message: "✅ Prescriptions retrieved", prescriptions });
  } catch (error) {
    console.error("❌ Error retrieving prescriptions:", error);
    res.status(500).json({ message: "Error retrieving prescriptions", error });
  }
});

// 📌 Send Prescription via Email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

router.post("/send-prescription", async (req, res) => {
  try {
    const { patientEmail, prescriptionId } = req.body;

    const prescription = await Prescription.findById(prescriptionId).populate<{ doctor: { name: string, email: string } }>("doctor", "name email");

    if (!prescription) return res.status(404).json({ message: "❌ Prescription not found" });

    const doctorName = (prescription.doctor as any)?.name || "Doctor";

    const emailContent = `
      📜 **Prescription from Dr. ${doctorName}**  
      - **Patient**: ${patientEmail}  
      - **Medicines**: ${prescription.medicines.map(m => `${m.name} - ${m.dosage} (${m.frequency})`).join(", ")}  
      - **Notes**: ${prescription.notes}  
      - **Date Issued**: ${prescription.dateIssued.toDateString()}  
      ${prescription.fileUrl ? `- 📎 [Download Prescription](${prescription.fileUrl})` : ""}
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: patientEmail,
      subject: "📄 Your E-Prescription",
      text: emailContent,
    });

    res.status(200).json({ message: "✅ Prescription sent via email" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

export default router;

# 💊 Smart Medicine Tracker

A comprehensive medicine tracking and reminder system that helps users manage their medication schedules effectively. The system sends smart notifications, tracks adherence, provides alerts to caregivers, and generates insightful reports — all through an intuitive interface.

---

## 🚀 Key Features

### 🕒 Personalized Medication Scheduler
- Collects details like medicine name, dosage timings, course period
- Sets up daily medicine reminders based on user input

### 🔔 Smart Notifications & Alerts
- Sends timely reminders to the user for each scheduled dose
- Asks for confirmation: "Did you take your medicine?"

### 📈 Adherence Tracking & Reports
- Stores user responses
- Displays adherence trends and missed doses on the dashboard

### 👪 Family & Caregiver Notifications
- Sends alerts to family members or doctors if doses are repeatedly missed

### 📷 Medicine Identification
- Scan medicine packages via camera to auto-fill name and details

### 💬 Personalized Chatbot
- Chatbot support for medicine info, guidance, and FAQs

### 🆘 Emergency SOS
- One-click emergency button for help in case of critical health issues

---

## 📁 Modules Overview

```text
MedicineTracker/
│
├── Signup.js                  # User registration and login
├── DetailsPage.js            # Collects user & medicine details
├── Dashboard.js              # Displays adherence data & reminders
├── NotificationService.js    # Handles scheduled alerts
├── CameraScanner.js          # Barcode/label scanning for medicine
├── SOS.js                    # Emergency feature
└── README.md

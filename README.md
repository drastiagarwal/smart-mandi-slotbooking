# KisanFlow 🌾

### Smart Agricultural Procurement & Queue Management System

> **SIH 2026 Project** — A farmer-first digital platform for smart procurement slot booking, real-time queue tracking, notifications, and procurement-center management.

KisanFlow is designed to reduce overcrowding and waiting time at agricultural procurement centers while giving farmers transparent, real-time information about their booking and queue status.

---

## 🚀 Overview

Traditional procurement-center workflows can lead to:

* Long and unpredictable waiting times
* Overcrowding at procurement centers
* Limited visibility into queue status
* Difficulty managing daily slots and capacity
* Poor communication about delays and schedule changes

**KisanFlow** addresses these challenges through a simple farmer interface and a powerful admin dashboard.

### Core Flow

```text
Farmer Registration
        ↓
Select Crop & Quantity
        ↓
Choose Procurement Center
        ↓
Select Available Slot
        ↓
Booking Confirmation + Token
        ↓
Live Queue Tracking
        ↓
Notifications
        ↓
Procurement Process
        ↓
Completion / Payment Status
```

---

## ✨ Key Features

### 👨‍🌾 Farmer Module

* Farmer registration and profile
* Crop and quantity selection
* Procurement-center discovery
* Slot availability and booking
* Digital token generation
* QR code for booking verification
* Real-time queue position
* Estimated waiting time
* Procurement status timeline
* Notifications for slot and queue updates
* English / Hindi bilingual interface
* Mobile-first, farmer-friendly UI

### 🏛️ Admin Module

* Admin dashboard
* Live procurement-center overview
* Farmer management
* Slot management
* Queue monitoring
* Center capacity monitoring
* Procurement analytics
* Completed and pending procurement statistics
* Average waiting-time insights
* Predicted crowd information
* Live queue visualization

### ⚡ Smart Features

* Dynamic queue visualization
* Estimated waiting time
* Capacity-aware slot management
* Crowd prediction concept
* Real-time UI updates using mock data
* QR-based token verification
* Responsive design for desktop and mobile

---

## 🎯 Problem We Solve

KisanFlow focuses on improving the procurement experience for both farmers and government/procurement-center staff.

### For Farmers

**Before:**

```text
Uncertain arrival times
        ↓
Long queues
        ↓
Limited information
        ↓
More waiting
```

**With KisanFlow:**

```text
Book a slot
    ↓
Receive a token
    ↓
Track queue
    ↓
Get notified
    ↓
Reach at the right time
```

### For Administrators

**Before:**

```text
Manual coordination
        ↓
Unpredictable crowd
        ↓
Difficult capacity management
```

**With KisanFlow:**

```text
Live Dashboard
      ↓
Slot Management
      ↓
Queue Visibility
      ↓
Analytics
      ↓
Better Resource Planning
```

---

## 🖥️ Application Screens

### Farmer

1. Landing / Welcome
2. Farmer Registration
3. Farmer Home Dashboard
4. Crop & Quantity Selection
5. Procurement Center Selection
6. Slot Booking
7. Booking Confirmation
8. Token & QR Code
9. Live Queue
10. Notifications
11. Procurement Status

### Admin

1. Admin Dashboard
2. Procurement Centers
3. Slot Management
4. Farmer Management
5. Live Queue Monitoring
6. Analytics
7. Crowd Prediction

---

## 🧠 Smart Queue System

KisanFlow estimates waiting time based on current queue conditions.

A basic prototype calculation:

```text
Estimated Wait Time
≈ Farmers Ahead × Average Processing Time
```

### Example

```text
Farmers ahead = 12
Average processing time = 8 minutes

Estimated wait
= 12 × 8
= 96 minutes
```

The production version can make this prediction more intelligent using:

* Historical processing times
* Number of active counters
* Current processing speed
* Center capacity
* Crop quantity
* Time-of-day traffic
* Historical crowd patterns

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Responsive UI
* Component-based architecture

### Backend / Data

The current prototype uses **mock data** and is structured so that a backend/database can be integrated later.

Recommended production stack:

* Firebase / Firestore or PostgreSQL
* Node.js + Express
* Firebase Authentication
* REST APIs

### Additional Technologies

* QR code generation
* Analytics charts
* Role-based routing
* Internationalization
* Responsive mobile-first design

---

## 📁 Project Structure

```text
src/
│
├── components/
│   ├── QueueViz/
│   ├── QRCode/
│   └── ...
│
├── pages/
│   ├── Landing/
│   ├── FarmerHome/
│   ├── Register/
│   ├── Centers/
│   ├── Token/
│   ├── Queue/
│   ├── AdminDashboard/
│   └── ...
│
├── i18n/
│   └── translations/
│
├── App.tsx
└── main.tsx
```

> The exact folder structure may vary depending on your implementation.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open the Application

Open the local URL displayed by Vite in your browser.

---

## 🧪 Build & Type Check

Create a production build:

```bash
npm run build
```

Run TypeScript checking:

```bash
npm run typecheck
```

---

## 🔐 User Roles

### Farmer

```text
Register
   ↓
Book Slot
   ↓
Get Token
   ↓
Track Queue
   ↓
Receive Notifications
   ↓
Complete Procurement
```

### Admin

```text
Login
   ↓
View Dashboard
   ↓
Manage Centers
   ↓
Manage Slots
   ↓
Monitor Queue
   ↓
View Analytics
   ↓
Optimize Capacity
```

---

## 🌐 Localization

KisanFlow currently supports:

* 🇬🇧 English
* 🇮🇳 Hindi

The architecture can be extended to support additional regional languages.

---

## 🏆 SIH 2026 Innovation Highlights

| Feature                 | Benefit                              |
| ----------------------- | ------------------------------------ |
| 📅 Smart Slot Booking   | Reduces unplanned arrivals           |
| 🎫 Digital Token        | Gives farmers a clear queue identity |
| 📱 Live Queue           | Reduces unnecessary waiting          |
| ⏱️ Wait-Time Estimation | Helps farmers plan arrival           |
| 🔔 Notifications        | Keeps farmers informed               |
| 📊 Admin Analytics      | Supports operational decisions       |
| 🤖 Crowd Prediction     | Helps anticipate demand              |
| 📱 Mobile-First UI      | Improves accessibility               |
| 🌐 Hindi Support        | Supports local users                 |
| 🔳 QR Token             | Enables fast verification            |

---

## 🔮 Future Enhancements

* Real Firebase/PostgreSQL backend
* Secure authentication and role-based authorization
* Real SMS notifications
* WhatsApp notifications
* IVR / voice-based farmer assistance
* GPS-based procurement-center discovery
* Offline-first support
* Real-time WebSocket/Firebase queue updates
* AI-based crowd prediction
* Intelligent slot recommendations
* Multi-language voice interface
* Payment-status integration
* QR scanning from the admin side
* Government procurement API integration
* Advanced analytics and reporting

---

## 📸 SIH Demo Flow

For the hackathon demonstration, use this scenario:

```text
1. Farmer opens KisanFlow
2. Registers
3. Selects Wheat + Quantity
4. Selects nearest procurement center
5. Gets recommended slot
6. Confirms booking
7. Receives Token + QR Code
8. Opens Live Queue
9. Queue position updates
10. Farmer receives notification
11. Admin monitors the same queue
12. Procurement is completed
```

This demonstrates the complete **farmer-to-admin workflow**.

---

## 👥 Team Contributions

Suggested team responsibilities:

| Role               | Responsibility                            |
| ------------------ | ----------------------------------------- |
| Frontend Developer | UI and farmer flow                        |
| Backend Developer  | APIs, database and authentication         |
| AI/ML Developer    | Crowd prediction and wait-time estimation |
| UI/UX Designer     | Figma, accessibility and localization     |
| Tester             | Functional and usability testing          |
| Presenter          | SIH pitch and product demonstration       |

---

## 📌 Project Vision

> **Less waiting. Better planning. Smarter procurement.**

KisanFlow aims to make agricultural procurement more **transparent, efficient, accessible, and farmer-friendly** through digital scheduling and real-time queue intelligence.

---

## 📄 License

This project is developed as a hackathon prototype for **Smart India Hackathon 2026**.

Add your preferred open-source license if the project will be publicly distributed.

---

### ⭐ KisanFlow

**Smart Agricultural Procurement & Queue Management System**

`Book → Track → Get Notified → Procure`

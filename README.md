# 🏍️ Vahan Bazar — Peer-to-Peer Vehicle & Bike Marketplace

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Vahan_Bazar-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://vahan-bhazar.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://vahan-bhazar-backend.onrender.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**A modern, full-stack peer-to-peer bike and vehicle marketplace built with a luxury glassmorphism UI, real-time listings, and email OTP authentication.**

[🚀 Explore Live Demo](https://vahan-bhazar.vercel.app) • [📖 API Reference](#-backend-api-endpoints) • [🛠️ Getting Started](#-getting-started)

</div>

---

## 🌐 Live Demo & Deployment

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://vahan-bhazar.vercel.app](https://vahan-bhazar.vercel.app) |
| **Backend REST API** | **Render** | [https://vahan-bhazar-backend.onrender.com](https://vahan-bhazar-backend.onrender.com) |
| **Database** | **MongoDB Atlas** | Cloud Replica Set |

> 💡 **Live Demo Link**: Visit **[vahan-bhazar.vercel.app](https://vahan-bhazar.vercel.app)** to experience the marketplace directly in your browser.

---

## 📌 Project Overview

**Vahan Bazar** is an end-to-end full-stack web application engineered for buyers and sellers of two-wheelers. It bridges the gap between vehicle owners and prospective buyers through a fluid, premium user experience.

### 🌟 Key Highlights
- **Split-flow Experience**: Dedicated paths for **Buyers** (explore, filter, view vehicle specifications, contact sellers) and **Sellers** (upload images, set prices, manage inventory).
- **Glassmorphic Aesthetic**: Deep midnight background (`#0f172a`) paired with warm metallic gold accents (`#d4af37`), backdrop blur effects, and smooth Framer Motion micro-interactions.
- **Secure Authentication**: JWT-based session security, salted password hashing (`bcryptjs`), and 6-digit email OTP verification.
- **Mobile-First Responsiveness**: Custom animated hamburger navigation drawer, touch-friendly tap targets, and adaptive grid layouts.

---

## ✨ Features

- **🛒 Interactive Marketplace**:
  - Filter by price range, brand, engine displacement (CC), and model year.
  - Dynamic live search with instant client-side filtering.
  - Comprehensive vehicle detail modal/page with high-res photos and seller details.

- **📢 Seller Portal**:
  - Intuitive listing flow with image uploads via Multer.
  - Real-time form validation for technical specifications (KM driven, ownership, fuel type).

- **🔐 Robust Auth & Email Verification**:
  - User registration and login protected with JSON Web Tokens.
  - Automated 6-digit OTP dispatch via Nodemailer (with resilient fallback mechanisms).
  - Unverified account recovery flow so users never get locked out.

- **📱 Fully Mobile Responsive**:
  - Smooth sliding drawer menu on viewports under `900px`.
  - Zero horizontal overflow and optimized touch interactions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (Lightning-fast HMR)
- **Styling**: Vanilla CSS, Modern Glassmorphism, CSS Grid & Flexbox
- **Animations**: Framer Motion & Parallax Scroll Hooks
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer
- **Email Service**: Nodemailer (SMTP / Gmail)
- **Hosting**: Render

---

## 📁 Project Structure

```text
vahan-bhazar/
├── backend/
│   ├── config/             # MongoDB connection setup
│   ├── models/             # Mongoose schemas (User, Vehicle, Bike)
│   ├── routes/             # RESTful endpoints (auth, vehicles, bookings)
│   ├── utils/              # Email transporter, OTP generator, helpers
│   ├── uploads/            # Uploaded vehicle photos
│   └── server_clean.js     # Express server entry point
│
├── frontend/
│   ├── public/             # Static assets & icons
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, PreLoader, CustomCursor, ProtectedRoute)
│   │   ├── pages/          # Application views (Dashboard, Buyer, Seller, VehicleDetail, Login, About)
│   │   ├── App.tsx         # Route configuration & global providers
│   │   ├── App.css         # Component & layout styling
│   │   └── main.tsx        # Application root entry
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── vercel.json             # SPA rewrite configuration for Vercel
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run Vahan Bazar locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

---

### 1. Clone the Repository

```bash
git clone https://github.com/komminenivenkatesh/vahan-bhazar.git
cd vahan-bhazar
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
# or
node server_clean.js
```

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 📡 Backend API Endpoints

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account & send verification OTP |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit code & activate account |
| `POST` | `/api/auth/resend-otp` | Re-generate and dispatch new OTP code |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |

### 🏍️ Vehicles & Marketplace (`/api/vehicles`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Fetch all active vehicle listings with optional query filters |
| `GET` | `/api/vehicles/:id` | Retrieve detailed specifications for a single vehicle |
| `POST` | `/api/vehicles` | Create a new listing with image upload (Auth required) |
| `DELETE` | `/api/vehicles/:id` | Remove a listing (Owner/Admin only) |

---

## 👨‍💻 Author

**Kommineni Venkateswarlu**
- GitHub: [@komminenivenkatesh](https://github.com/komminenivenkatesh)
- Repository: [vahan-bhazar](https://github.com/komminenivenkatesh/vahan-bhazar)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

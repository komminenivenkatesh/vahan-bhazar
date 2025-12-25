import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PreLoader from "./components/PreLoader";
import CustomCursor from "./components/CustomCursor";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import About from "./pages/About";
import Buyer from "./pages/Buyer";
import Seller from "./pages/Seller";
import MotorcyclePage from "./pages/MotorcyclePage";
import VehicleDetail from "./pages/VehicleDetail";
import ProductDetail from "./pages/ProductDetail";
import Payment from "./pages/Payment";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  if (!loadingComplete) {
    return <PreLoader onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp/:userId" element={<OtpVerification />} />
          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/buyer" element={<ProtectedRoute><Buyer /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Buyer /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
          <Route path="/motorcycle" element={<ProtectedRoute><MotorcyclePage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;

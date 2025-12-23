import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Support from "./pages/Support";
import About from "./pages/About";
import Buyer from "./pages/Buyer";
import Seller from "./pages/Seller";
import MotorcyclePage from "./pages/MotorcyclePage";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification"; // ✨ NEW import
import ForgotPassword from "./pages/ForgotPassword";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Main feature pages */}
      <Route path="/buyer" element={<Buyer />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/motorcycle" element={<MotorcyclePage />} />
      <Route path="/login" element={<Login />} />

      {/* OTP verification routes */}
      <Route path="/verify-otp/:userId" element={<OtpVerification />} />
      <Route path="/verify-otp" element={<OtpVerification />} />

      {/* Info pages */}
      <Route path="/support" element={<Support />} />
      <Route path="/about" element={<About />} />

      {/* Any wrong/unknown URL -> Home */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;

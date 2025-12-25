import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../App.css";

const Payment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const isValid = useMemo(() => cardNumber.length >= 12 && name.length > 2 && cvv.length >= 3 && expiry.length >= 4, [cardNumber, name, cvv, expiry]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setStatus("Please fill all fields correctly.");
      return;
    }
    setStatus("Payment simulated: booking confirmed.");
  };

  return (
    <>
      <Navbar />
      <section className="payment-shell">
        <div className="payment-grid">
          <motion.div className="payment-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <span className="hero-kicker">Checkout</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(2.1rem,3.2vw,2.8rem)" }}>Secure Payment</h1>
            <p className="hero-subtitle" style={{ maxWidth: "48ch" }}>
              Finalize your booking. This is a demo checkout—no real charges are made.
            </p>

            <div className="payment-summary">
              <div>
                <strong>Vehicle</strong>
                <p>Selected ride</p>
              </div>
              <div>
                <strong>Amount</strong>
                <p>₹ 2,000 (booking)</p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handlePay}>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on card" />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
              </div>
              <div className="dual-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={!isValid}>Pay & Confirm</button>
              {status && <div className="auth-message success" style={{ marginTop: 10 }}>{status}</div>}
            </form>
          </motion.div>

          <motion.div className="payment-visual" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.08 }}>
            <div className="payment-visual-card">
              <h3>Workflow</h3>
              <ul>
                <li>Choose a bike, open details.</li>
                <li>Login / create account.</li>
                <li>Proceed to payment to reserve.</li>
                <li>Receive confirmation instantly.</li>
              </ul>
              <div className="hero-stats" style={{ marginTop: 12 }}>
                <div className="stat-card">
                  <div className="stat-value">AES</div>
                  <div className="stat-label">Secure channel</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">Demo</div>
                  <div className="stat-label">No real charge</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Payment;


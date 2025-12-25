import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrderData(JSON.parse(lastOrder));
    } else {
      navigate("/market");
    }
  }, [navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div style={{ 
        minHeight: '100vh', 
        background: '#000000',
        padding: '120px clamp(1.5rem, 5vw, 4rem) 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 600,
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            borderRadius: '32px',
            padding: 60,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              margin: '0 auto 32px',
              boxShadow: '0 20px 60px rgba(20, 184, 166, 0.4)'
            }}
          >
            ✓
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: 16,
            background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Payment Successful!
          </h1>

          <p style={{ 
            color: 'rgba(241, 245, 249, 0.8)', 
            fontSize: '1.1rem', 
            marginBottom: 40,
            lineHeight: 1.6
          }}>
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div style={{
            background: 'rgba(20, 184, 166, 0.05)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 40,
            textAlign: 'left'
          }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: '0.9rem' }}>Order ID</span>
              <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '1.1rem' }}>
                {orderData.orderId}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: '0.9rem' }}>Product</span>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem' }}>
                {orderData.product.title}
              </div>
            </div>
            <div>
              <span style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: '0.9rem' }}>Amount Paid</span>
              <div style={{ 
                fontSize: '1.8rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ₹{((orderData.amount || 0) * 1.18).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/market")}
              style={{
                padding: '16px 32px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 12px 32px rgba(20, 184, 166, 0.4)'
              }}
            >
              Continue Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              style={{
                padding: '16px 32px',
                borderRadius: 999,
                background: 'transparent',
                border: '2px solid rgba(20, 184, 166, 0.3)',
                color: '#d4af37',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentSuccess;


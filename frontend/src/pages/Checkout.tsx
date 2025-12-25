import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";

type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  cc?: number;
  price?: number;
  imageUrl?: string;
  images?: string[];
};

type PaymentMethod = "card" | "upi" | "netbanking";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Vehicle | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    // Card details
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    // UPI
    upiId: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedProduct");
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct));
    } else {
      navigate("/market");
    }

    // Load user data
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill all required fields");
      return;
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        alert("Please fill all card details");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId) {
        alert("Please enter UPI ID");
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderData = {
        product,
        customer: formData,
        paymentMethod,
        amount: product?.price || 0,
        orderId: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      localStorage.removeItem("selectedProduct");
      navigate("/payment-success");
    }, 2000);
  };

  const resolveImageSrc = (img?: string) => {
    if (!img) return "/default-bike.png";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
    return img;
  };

  const imageSrc = product?.images && product.images.length > 0 
    ? resolveImageSrc(product.images[0]) 
    : resolveImageSrc(product?.imageUrl);

  const totalAmount = (product?.price || 0);
  const tax = totalAmount * 0.18; // 18% GST
  const grandTotal = totalAmount + tax;

  return (
    <>
      <Navbar />

      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(70px)',
            y: y1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '35%',
            right: '5%',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,192,192,0.12) 0%, rgba(192,192,192,0) 70%)',
            filter: 'blur(90px)',
            y: y2,
          }}
        />

        <motion.section
          style={{
            padding: '120px clamp(1.5rem, 5vw, 4rem) 80px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 60,
              letterSpacing: '-0.03em'
            }}
          >
            Secure Checkout
          </motion.h1>

          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: 40
          }}>
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: '24px',
                padding: 40,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)'
              }}
            >
              <h2 style={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>
                Billing Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <InputField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                <InputField label="Email *" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <InputField label="Phone *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                <InputField label="Address *" name="address" value={formData.address} onChange={handleInputChange} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} />
                  <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} />
                </div>

                <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
              </div>

              {/* Payment Method */}
              <h2 style={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 800, marginTop: 40, marginBottom: 24 }}>
                Payment Method
              </h2>

              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {[
                  { value: "card", label: "💳 Card", icon: "card" },
                  { value: "upi", label: "📱 UPI", icon: "upi" },
                  { value: "netbanking", label: "🏦 Net Banking", icon: "bank" }
                ].map((method) => (
                  <motion.button
                    key={method.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 12,
                      border: paymentMethod === method.value 
                        ? '2px solid #d4af37' 
                        : '2px solid rgba(20, 184, 166, 0.2)',
                      background: paymentMethod === method.value 
                        ? 'rgba(20, 184, 166, 0.15)' 
                        : 'rgba(20, 184, 166, 0.05)',
                      color: paymentMethod === method.value ? '#d4af37' : 'rgba(241, 245, 249, 0.7)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {method.label}
                  </motion.button>
                ))}
              </div>

              {/* Payment Details */}
              {paymentMethod === "card" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <InputField label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleInputChange} />
                  <InputField label="Cardholder Name" name="cardName" value={formData.cardName} onChange={handleInputChange} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <InputField label="Expiry (MM/YY)" name="expiryDate" placeholder="12/25" value={formData.expiryDate} onChange={handleInputChange} />
                    <InputField label="CVV" name="cvv" type="password" placeholder="123" value={formData.cvv} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <InputField label="UPI ID" name="upiId" placeholder="yourname@upi" value={formData.upiId} onChange={handleInputChange} />
              )}

              {paymentMethod === "netbanking" && (
                <div style={{
                  padding: 20,
                  background: 'rgba(20, 184, 166, 0.05)',
                  borderRadius: 12,
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  color: 'rgba(241, 245, 249, 0.8)',
                  textAlign: 'center'
                }}>
                  You will be redirected to your bank's website
                </div>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: '24px',
                padding: 40,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)',
                height: 'fit-content',
                position: 'sticky',
                top: 120
              }}
            >
              <h2 style={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>
                Order Summary
              </h2>

              {product && (
                <>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                    <img
                      src={imageSrc}
                      alt={product.title}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 12,
                        border: '2px solid rgba(20, 184, 166, 0.2)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                        {product.title}
                      </h3>
                      <p style={{ color: 'rgba(241, 245, 249, 0.7)', fontSize: '0.9rem' }}>
                        {product.brand} • {product.cc} cc
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(20, 184, 166, 0.2)', paddingTop: 24 }}>
                    <SummaryRow label="Subtotal" value={`₹${totalAmount.toLocaleString()}`} />
                    <SummaryRow label="GST (18%)" value={`₹${tax.toLocaleString()}`} />
                    <SummaryRow label="Delivery" value="FREE" highlight />
                    
                    <div style={{ 
                      borderTop: '2px solid rgba(20, 184, 166, 0.3)', 
                      marginTop: 20, 
                      paddingTop: 20 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#d4af37', fontSize: '1.3rem', fontWeight: 900 }}>Total</span>
                        <span style={{
                          fontSize: '2rem',
                          fontWeight: 900,
                          background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          ₹{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={processing}
                    style={{
                      width: '100%',
                      marginTop: 32,
                      padding: '18px',
                      borderRadius: 999,
                      background: processing 
                        ? 'rgba(20, 184, 166, 0.5)' 
                        : 'linear-gradient(135deg, #d4af37, #c9a22e)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      cursor: processing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 12px 32px rgba(20, 184, 166, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {processing ? "Processing..." : "Complete Purchase"}
                  </motion.button>

                  <div style={{
                    marginTop: 24,
                    padding: 16,
                    background: 'rgba(20, 184, 166, 0.05)',
                    borderRadius: 12,
                    textAlign: 'center',
                    color: 'rgba(241, 245, 249, 0.7)',
                    fontSize: '0.85rem'
                  }}>
                    🔒 Secure payment • Your data is protected
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

const InputField = ({ label, name, type = "text", placeholder, value, onChange }: any) => (
  <div>
    <label style={{ 
      display: 'block', 
      marginBottom: 8, 
      color: '#d4af37', 
      fontWeight: 700, 
      fontSize: '0.9rem' 
    }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '14px',
        borderRadius: 12,
        border: '1px solid rgba(20, 184, 166, 0.3)',
        background: 'rgba(15, 23, 42, 0.6)',
        color: '#f1f5f9',
        fontSize: '1rem',
        fontFamily: 'inherit'
      }}
    />
  </div>
);

const SummaryRow = ({ label, value, highlight = false }: any) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    color: highlight ? '#d4af37' : 'rgba(241, 245, 249, 0.8)'
  }}>
    <span style={{ fontWeight: 600 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

export default Checkout;


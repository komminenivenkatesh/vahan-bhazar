import React, { useEffect, useState, useRef } from "react";
import type { MotionProps } from "framer-motion";
import { motion, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";

type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  cc?: number;
  engine_cc?: number;
  displacement?: number;
  price?: number;
  type?: string;
  imageUrl?: string;
  images?: string[];
  odometer_km?: number;
};

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const heroStats = [
  { label: "Verified listings", value: "1.2k+", icon: "✓" },
  { label: "Avg. response", value: "< 15m", icon: "⚡" },
  { label: "Cities", value: "18", icon: "📍" },
];

const features = [
  {
    icon: "🔒",
    title: "Secure Transactions",
    desc: "Bank-grade encryption for all payments",
  },
  {
    icon: "🎯",
    title: "Verified Listings",
    desc: "Every bike manually inspected and certified",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Expert assistance whenever you need",
  },
  {
    icon: "🚀",
    title: "Instant Booking",
    desc: "Reserve your ride in under 2 minutes",
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Buyer",
    text: "Found my dream bike in just 2 days. The process was smooth and professional!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Seller",
    text: "Sold my scooter at a great price. The platform made everything so easy.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Buyer",
    text: "Best bike marketplace! Love the dark theme and smooth animations.",
    rating: 5,
  },
];

const Home: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.9 });
  
  // Multi-layer parallax
  const y1 = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const y2 = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const y3 = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/vehicles`);
        if (!res.ok) {
          console.error("Failed to fetch vehicles", res.status);
          setVehicles([]);
          setLoading(false);
          return;
        }
        const body = await res.json().catch(() => null);
        const data = Array.isArray(body) ? body : (body?.data ?? body?.vehicles ?? []);
        setVehicles(Array.isArray(data) ? data.slice(0, 6) : []); // Show only 6 bikes
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function resolveImageSrc(v: any) {
    const img = v?.images?.[0] || v?.imageUrl;
    const fallback = `${BACKEND_BASE}/uploads/default-bike.png`;
    if (!img) return fallback;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
    return `${BACKEND_BASE}/uploads/${img}`;
  }

  return (
    <>
      <Navbar />

      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        {/* Animated Background Orbs - Dark Professional */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 70%)',
            filter: 'blur(80px)',
            y: y1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192, 192, 192, 0.12) 0%, rgba(192, 192, 192, 0) 70%)',
            filter: 'blur(90px)',
            y: y2,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 229, 229, 0.08) 0%, rgba(229, 229, 229, 0) 70%)',
            filter: 'blur(70px)',
            y: y3,
          }}
        />

        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3,
        }} />

        {/* Hero Section */}
        <motion.section
          style={{ scale }}
          className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32"
        >
          <div style={{ maxWidth: 1200, width: '100%', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 999,
                color: '#d4af37',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: 24,
                letterSpacing: '0.5px',
              }}>
                ✨ Premium Bike Marketplace
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #d4af37 0%, #e5e5e5 50%, #d4af37 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 24,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            >
              Find Your Perfect Ride
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                color: '#c0c0c0',
                maxWidth: 700,
                margin: '0 auto 40px',
                lineHeight: 1.6,
              }}
            >
              Experience the most elegant bike marketplace with dark professional design, 
              smooth parallax animations, and secure transactions
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/market')}
                style={{
                  padding: '16px 40px',
                  background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                  color: '#000',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                }}
              >
                Browse Bikes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/sell')}
                style={{
                  padding: '16px 40px',
                  background: 'transparent',
                  color: '#d4af37',
                  border: '2px solid #d4af37',
                  borderRadius: 999,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sell Your Bike
              </motion.button>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              {heroStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  style={{
                    textAlign: 'center',
                    padding: '20px 30px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    borderRadius: 16,
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d4af37', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.9rem', color: '#c0c0c0' }}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section ref={featuresRef} style={{ position: 'relative', zIndex: 10, padding: '80px 24px', background: 'rgba(10, 10, 10, 0.8)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #d4af37, #e5e5e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 60,
              }}
            >
              Why Choose BikeX?
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)' }}
                  style={{
                    padding: 32,
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.95))',
                    borderRadius: 20,
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    backdropFilter: 'blur(20px)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#d4af37', marginBottom: 12 }}>{feature.title}</h3>
                  <p style={{ fontSize: '1rem', color: '#c0c0c0', lineHeight: 1.6 }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Bikes Section */}
        <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #d4af37, #e5e5e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 60,
              }}
            >
              Featured Bikes
            </motion.h2>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#c0c0c0', fontSize: '1.2rem' }}>Loading bikes...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
                {vehicles.slice(0, 6).map((bike, idx) => (
                  <motion.div
                    key={bike._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)' }}
                    onClick={() => navigate(`/product/${bike._id}`)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.95))',
                      borderRadius: 20,
                      overflow: 'hidden',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      cursor: 'pointer',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                      <img
                        src={resolveImageSrc(bike)}
                        alt={bike.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        padding: '6px 12px',
                        background: 'rgba(212, 175, 55, 0.9)',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#000',
                      }}>
                        ✓ Verified
                      </div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e5e5e5', marginBottom: 12 }}>{bike.title}</h3>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: '0.95rem', color: '#c0c0c0' }}>
                        <span>🏍️ {bike.brand || "—"}</span>
                        <span>⚡ {bike.cc || bike.engine_cc || bike.displacement || 150} cc</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4af37' }}>
                          ₹{(bike.price ?? 0).toLocaleString()}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                            borderRadius: 8,
                            color: '#000',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        >
                          View Details
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} style={{ position: 'relative', zIndex: 10, padding: '80px 24px', background: 'rgba(10, 10, 10, 0.8)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #d4af37, #e5e5e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 60,
              }}
            >
              What Our Users Say
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ y: -10 }}
                  style={{
                    padding: 32,
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.95))',
                    borderRadius: 20,
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} style={{ color: '#d4af37', fontSize: '1.2rem' }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '1.1rem', color: '#e5e5e5', marginBottom: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d4af37' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#c0c0c0' }}>{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ position: 'relative', zIndex: 10, padding: '120px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: 900,
              margin: '0 auto',
              textAlign: 'center',
              padding: 60,
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(192, 192, 192, 0.05))',
              borderRadius: 30,
              border: '2px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #d4af37, #e5e5e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 24,
            }}>
              Ready to Find Your Dream Bike?
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#c0c0c0', marginBottom: 40, lineHeight: 1.6 }}>
              Join thousands of satisfied customers who found their perfect ride on BikeX
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(212, 175, 55, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/market')}
              style={{
                padding: '18px 50px',
                background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                color: '#000',
                border: 'none',
                borderRadius: 999,
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
              }}
            >
              Start Browsing Now
            </motion.button>
          </motion.div>
        </section>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </>
  );
};

export default Home;


import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const cardHover = {
    scale: 1.05,
    y: -12,
    boxShadow: "0 40px 80px rgba(212, 175, 55, 0.4)",
    transition: { duration: 0.4, ease: "easeOut" as const },
  };

  return (
    <>
      <Navbar />
      
      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Parallax Background Layers */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
          zIndex: 0
        }} />

        {/* Parallax Floating Elements */}
        <motion.div
          style={{
            position: 'fixed',
            top: '15%',
            right: '10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            y: y1,
            zIndex: 0
          }}
        />

        <motion.div
          style={{
            position: 'fixed',
            bottom: '10%',
            left: '5%',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192, 192, 192, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
            y: y2,
            zIndex: 0
          }}
        />

        <motion.div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
            filter: 'blur(90px)',
            y: y3,
            zIndex: 0
          }}
        />

        {/* Animated Grid Pattern */}
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            zIndex: 0
          }}
        />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '120px clamp(1.5rem, 5vw, 4rem) 80px',
            minHeight: '100vh'
          }}
        >
          {/* Hero Section with Parallax */}
          <motion.div 
            style={{ 
              textAlign: 'center', 
              marginBottom: 'clamp(4rem, 8vw, 6rem)',
              scale
            }}
          >
            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #d4af37 0%, #e5e5e5 50%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2rem',
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.1
              }}
            >
              Elite<br/>Motorcycle<br/>Marketplace
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                color: '#808080',
                maxWidth: 700,
                margin: '0 auto 3rem',
                lineHeight: 1.8,
                fontWeight: 300,
                letterSpacing: '0.02em'
              }}
            >
              Experience luxury in every transaction. Premium bikes,<br/>verified sellers, seamless buying.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              style={{
                maxWidth: 650,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 999,
                  padding: '1.2rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 20px 60px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.4s ease'
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search premium bikes, brands, models..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#e5e5e5',
                    fontSize: '1.1rem',
                    fontWeight: 300
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Action Cards */}
          <motion.div
            variants={containerVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              marginBottom: '5rem',
              maxWidth: 1400,
              margin: '0 auto'
            }}
          >
            {/* BUY CARD - Parallax Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              onClick={() => navigate("/market")}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 32,
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Gold Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '70%',
                  height: '100%',
                  background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.12), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <svg
                    width="45"
                    height="45"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #d4af37, #e5e5e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  DISCOVER
                </h2>

                <p
                  style={{
                    color: '#808080',
                    fontSize: '1.15rem',
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                    fontWeight: 300
                  }}
                >
                  Explore our curated collection of verified premium motorcycles. Each listing meticulously inspected for quality.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    color: '#d4af37',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  Browse Inventory
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* SELL CARD - Parallax Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              onClick={() => navigate("/sell")}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(192, 192, 192, 0.3)',
                borderRadius: 32,
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Silver Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '70%',
                  height: '100%',
                  background: 'radial-gradient(circle at top left, rgba(192, 192, 192, 0.12), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #c0c0c0, #a8a8a8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 40px rgba(192, 192, 192, 0.3)',
                  }}
                >
                  <svg
                    width="45"
                    height="45"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #c0c0c0, #e5e5e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  MONETIZE
                </h2>

                <p
                  style={{
                    color: '#808080',
                    fontSize: '1.15rem',
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                    fontWeight: 300
                  }}
                >
                  Transform your motorcycle into value. List with confidence and connect with serious buyers instantly.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    color: '#c0c0c0',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  Create Listing
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Section with Parallax */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              marginTop: '5rem',
              maxWidth: 1400,
              margin: '5rem auto 0'
            }}
          >
            {[
              { label: 'Premium Listings', value: '2,500+', color: '#d4af37' },
              { label: 'Verified Deals', value: '8,200+', color: '#c0c0c0' },
              { label: 'Avg Response', value: '< 12min', color: '#d4af37' },
              { label: 'Cities Served', value: '25+', color: '#c0c0c0' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -8 }}
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid rgba(${stat.color === '#d4af37' ? '212, 175, 55' : '192, 192, 192'}, 0.2)`,
                  borderRadius: 24,
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.4s ease'
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${stat.color}, #e5e5e5)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.8rem',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: '#808080',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;


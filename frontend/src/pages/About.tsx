import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";

const workflowSteps = [
  { title: "Browse", text: "Explore curated listings with live filters." },
  { title: "Select", text: "Open a bike card to view specs, images, and price." },
  { title: "Secure", text: "Login or sign up to reserve or message sellers." },
  { title: "Payment", text: "Head to payment to confirm your booking." },
];

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <>
      <Navbar />

      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        {/* Animated Background Orbs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
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

        {/* Hero Section */}
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
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}
          >
            About Vahan Bazar
           </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(241, 245, 249, 0.7)',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto 80px',
              lineHeight: 1.8
            }}
          >
            Vahan Bazar is your premier peer-to-peer motorcycle marketplace, connecting buyers and sellers with seamless technology and premium user experience.
          </motion.p>

          {/* Workflow Steps */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              padding: '0 clamp(1rem, 3vw, 2rem)'
            }}
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                whileHover={{ y: -8, scale: 1.03 }}
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '20px',
                  padding: '32px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#000',
                  boxShadow: '0 12px 32px rgba(212, 175, 55, 0.4)'
                }}>
                  {index + 1}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginBottom: '12px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'rgba(241, 245, 249, 0.7)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  {step.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              maxWidth: '900px',
              margin: '80px auto 0',
              padding: '48px',
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)',
              textAlign: 'center'
            }}
          >
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 900,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(241, 245, 249, 0.8)',
              lineHeight: 1.8,
              marginBottom: '16px'
            }}>
              At Vahan Bazar, we believe in empowering riders with a transparent, secure, and efficient platform to buy and sell motorcycles.
            </p>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(241, 245, 249, 0.8)',
              lineHeight: 1.8
            }}>
              Our cutting-edge technology, combined with a user-first approach, ensures every transaction is smooth, reliable, and rewarding.
            </p>
          </motion.div>

          {/* Meet the Team */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '1200px',
              margin: '100px auto 0',
              textAlign: 'center'
            }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              marginBottom: '60px',
              background: 'linear-gradient(135deg, #d4af37 0%, #e5e5e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Meet The Team
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              padding: '0 20px'
            }}>
                {[
                { name: "k.venkateswarlu", role: "Technical Lead & Team Leader", img: "/uploads/venky.jpeg" },
                { name: "Akash", role: "Decumentation Specialist", img: "/uploads/akash.jpeg" },
                { name: "Mahesh", role: "Database & Research", img: "/uploads/mahesh.jpeg" }
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  style={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }}
                >
                  <div style={{ height: '300px', overflow: 'hidden' }}>
                    <img 
                      src={member.img} 
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ color: '#e5e5e5', fontSize: '1.5rem', marginBottom: '8px' }}>{member.name}</h3>
                    <p style={{ color: '#d4af37', fontWeight: 600, letterSpacing: '0.05em' }}>{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
};

export default About;


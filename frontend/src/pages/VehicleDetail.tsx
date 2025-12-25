import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FALLBACK_LOCAL_IMAGE = "/default-bike.png";

export type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  cc?: number;
  engine_cc?: number;
  displacement?: number;
  price?: number;
  type?: string;
  category?: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  year?: number;
  fuel_type?: string;
  condition?: string;
  odometer_km?: number;
};

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const resolveImageSrc = (v: Vehicle | null) => {
    if (!v) return FALLBACK_LOCAL_IMAGE;
    const img = v.images?.[0] || v.imageUrl;
    if (!img) return `${BACKEND_BASE}/uploads/default-bike.png`;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
    return `${BACKEND_BASE}/uploads/${img}`;
  };

  const ccValue = useMemo(() => {
    if (!vehicle) return 0;
    if (typeof vehicle.cc === "number") return vehicle.cc;
    if (typeof vehicle.engine_cc === "number") return vehicle.engine_cc;
    if (typeof vehicle.displacement === "number") return vehicle.displacement;
    if ((vehicle.type || vehicle.category || "").toLowerCase().includes("ev")) return 0;
    return 150;
  }, [vehicle]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/vehicles/${id}`);
        if (!res.ok) {
          setError("Vehicle not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setVehicle(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const imgSrc = resolveImageSrc(vehicle);

  if (loading) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0c0c0' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', background: '#000000', overflow: 'hidden' }}>
        
        {/* Background Elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            y: y1,
            zIndex: 0
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: '40px clamp(1.5rem, 5vw, 4rem)' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c0c0c0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '40px',
              fontSize: '1rem'
            }}
          >
            ← Back to Market
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}>
            
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{
                position: 'relative',
                borderRadius: '30px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
              }}>
                <img 
                  src={imgSrc} 
                  alt={vehicle?.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '30px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ 
                      background: '#d4af37', 
                      color: '#000', 
                      padding: '6px 16px', 
                      borderRadius: '99px', 
                      fontWeight: 700, 
                      fontSize: '0.9rem' 
                    }}>
                      {vehicle?.condition || "Used"}
                    </span>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      color: '#fff', 
                      padding: '6px 16px', 
                      borderRadius: '99px', 
                      fontWeight: 600, 
                      fontSize: '0.9rem' 
                    }}>
                      {vehicle?.year || "2023"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #fff 0%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {vehicle?.title}
              </h1>
              
              <p style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '32px', fontWeight: 300 }}>
                {vehicle?.brand}
              </p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px',
                marginBottom: '40px'
              }}>
                {[
                  { label: 'Engine', value: `${ccValue} cc` },
                  { label: 'Mileage', value: `${vehicle?.odometer_km || 0} km` },
                  { label: 'Fuel', value: vehicle?.fuel_type || 'Petrol' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(26, 26, 26, 0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#808080', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                    <div style={{ color: '#e5e5e5', fontSize: '1.2rem', fontWeight: 700 }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '40px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span style={{ color: '#c0c0c0', fontSize: '1.1rem' }}>Asking Price</span>
                  <span style={{ color: '#d4af37', fontSize: '2.5rem', fontWeight: 900 }}>
                    ₹{(vehicle?.price ?? 0).toLocaleString()}
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                  border: 'none',
                  color: '#000',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
                }}>
                  Contact Seller
                </button>
              </div>

              <div>
                <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.5rem' }}>Description</h3>
                <p style={{ color: '#a0a0a0', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {vehicle?.description || "No description provided for this vehicle."}
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;

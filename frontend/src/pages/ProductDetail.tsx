import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  description?: string;
  year?: number;
  color?: string;
  owner?: string;
};

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/vehicles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVehicle(data);
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleBuyNow = () => {
    if (vehicle) {
      localStorage.setItem("selectedProduct", JSON.stringify(vehicle));
      navigate("/checkout");
    }
  };

  const getCC = (v: Vehicle) => {
    return v.cc || v.engine_cc || v.displacement || 150;
  };

  const resolveImageSrc = (img: string) => {
    if (!img) return "/default-bike.png";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
    return img;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "#0f172a",
          color: "#d4af37",
          fontSize: "1.5rem"
        }}>
          Loading...
        </div>
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <div style={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "#0f172a",
          color: "#ef4444",
          fontSize: "1.5rem"
        }}>
          Product not found
        </div>
      </>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : vehicle.imageUrl 
      ? [vehicle.imageUrl] 
      : ["/default-bike.png"];

  return (
    <>
      <Navbar />

      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        {/* Animated Background Orbs */}
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
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 40,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              color: 'rgba(241, 245, 249, 0.6)',
              fontSize: '0.9rem'
            }}
          >
            <span onClick={() => navigate('/market')} style={{ cursor: 'pointer', color: '#d4af37' }}>Market</span>
            <span>→</span>
            <span>{vehicle.title}</span>
          </motion.div>

          {/* Product Grid */}
          <div style={{ 
            maxWidth: '1400px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: 60,
            alignItems: 'start'
          }}>
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Image */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: 20,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)'
              }}>
                <img
                  src={resolveImageSrc(images[selectedImage])}
                  alt={vehicle.title}
                  style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
                  gap: 12
                }}>
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        cursor: 'pointer',
                        border: selectedImage === index 
                          ? '2px solid #d4af37' 
                          : '2px solid rgba(20, 184, 166, 0.2)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'rgba(30, 41, 59, 0.4)'
                      }}
                    >
                      <img
                        src={resolveImageSrc(img)}
                        alt={`${vehicle.title} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          opacity: selectedImage === index ? 1 : 0.6
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: '24px',
                padding: 48,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)',
                position: 'sticky',
                top: 120
              }}
            >
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 900,
                marginBottom: 16,
                background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {vehicle.title}
              </h1>

              <div style={{ 
                display: 'flex', 
                gap: 12, 
                marginBottom: 32,
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  color: '#d4af37',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {vehicle.brand || 'Unknown Brand'}
                </span>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  background: 'rgba(14, 165, 233, 0.1)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  color: '#c0c0c0',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {getCC(vehicle)} cc
                </span>
                {vehicle.year && (
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#a855f7',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>
                    {vehicle.year}
                  </span>
                )}
              </div>

              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                marginBottom: 32,
                background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ₹{(vehicle.price || 0).toLocaleString()}
              </div>

              {/* Specifications */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  marginBottom: 16,
                  color: '#d4af37'
                }}>
                  Specifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <SpecRow label="Engine" value={`${getCC(vehicle)} cc`} />
                  <SpecRow label="Brand" value={vehicle.brand || "—"} />
                  <SpecRow label="Type" value={vehicle.type || "Motorcycle"} />
                  {vehicle.odometer_km && <SpecRow label="Mileage" value={`${vehicle.odometer_km.toLocaleString()} km`} />}
                  {vehicle.color && <SpecRow label="Color" value={vehicle.color} />}
                  {vehicle.owner && <SpecRow label="Owner" value={vehicle.owner} />}
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  style={{
                    padding: '16px 32px',
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 12px 32px rgba(20, 184, 166, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Buy Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/market')}
                  style={{
                    padding: '16px 32px',
                    borderRadius: 999,
                    background: 'transparent',
                    border: '2px solid rgba(20, 184, 166, 0.3)',
                    color: '#d4af37',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Back to Market
                </motion.button>
              </div>

              {/* Trust Badge */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: 'rgba(20, 184, 166, 0.05)',
                borderRadius: 16,
                border: '1px solid rgba(20, 184, 166, 0.2)'
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'rgba(241, 245, 249, 0.8)' }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#d4af37', marginBottom: 4 }}>Verified Listing</div>
                    <div style={{ fontSize: '0.9rem' }}>Secure payment · Free inspection · 7-day return</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
  }}>
    <span style={{ color: 'rgba(241, 245, 249, 0.6)', fontWeight: 600 }}>{label}</span>
    <span style={{ color: 'rgba(241, 245, 249, 0.9)', fontWeight: 700 }}>{value}</span>
  </div>
);

export default ProductDetail;


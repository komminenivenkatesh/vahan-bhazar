// src/pages/Buyer.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  category?: string;
  imageUrl?: string;
  images?: string[];
  odometer_km?: number;
};

type Tab = "motorcycles" | "scooters";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FALLBACK_LOCAL_IMAGE = "/mnt/data/833ac447-1bd5-4653-85d8-18d4e6a105a0.png";

const Buyer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>("motorcycles");
  const [engineMin, setEngineMin] = useState(50);
  const [engineMax, setEngineMax] = useState(1000);
  const [priceMin, setPriceMin] = useState(30000);
  const [priceMax, setPriceMax] = useState(500000);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/vehicles`);
        if (!res.ok) {
          console.error("Failed to fetch vehicles", res.status);
          setVehicles([]);
          return;
        }
        const body = await res.json().catch(() => null);
        const data = Array.isArray(body)
          ? body
          : body?.data ?? (body?.vehicles ?? []);
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCC = (b: Vehicle) => {
    if (typeof b.cc === "number") return b.cc;
    if (typeof b.engine_cc === "number") return b.engine_cc;
    if (typeof b.displacement === "number") return b.displacement;
    if (b.type?.toLowerCase().includes("ev")) return 0;
    return 150;
  };

  function resolveImageSrc(v: any) {
    const img = (v.images && v.images.length > 0)
      ? v.images[0]
      : (v.imageUrl || "");

    if (!img) return FALLBACK_LOCAL_IMAGE;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
    return img || FALLBACK_LOCAL_IMAGE;
  }

  const filteredVehicles = vehicles.filter((b) => {
    // Support both 'type' and 'category' fields
    const typeStr = (b.type || b.category || "").toString().toLowerCase();
    const isMotorcycle = typeStr.includes("motor") || typeStr === "bike" || typeStr === "motorcycles";
    const isScooter = typeStr.includes("scooter") || typeStr === "scooters";

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title?.toLowerCase().includes(q);
      const matchBrand = b.brand?.toLowerCase().includes(q);
      const matchType = (b.type || b.category || "").toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchType) return false;
    }

    const cc = getCC(b);
    const price = b.price ?? 0;

    if (currentTab === "motorcycles" && !isMotorcycle) return false;
    if (currentTab === "scooters" && !isScooter) return false;
    if (cc < engineMin || cc > engineMax) return false;
    if (price < priceMin || price > priceMax) return false;
    return true;
  });

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
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(60px)',
            y: y1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,192,192,0.12) 0%, rgba(192,192,192,0) 70%)',
            filter: 'blur(80px)',
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
            transition={{ duration: 0.8, ease: "easeOut" }}
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
            Find Your Perfect Ride
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(241, 245, 249, 0.7)',
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto 60px',
              lineHeight: 1.6
            }}
          >
            Browse our curated collection of premium motorcycles and scooters
          </motion.p>

          {/* Tab Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '50px'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentTab("motorcycles")}
              style={{
                padding: '14px 36px',
                borderRadius: '999px',
                border: currentTab === 'motorcycles' ? 'none' : '2px solid rgba(20, 184, 166, 0.3)',
                background: currentTab === 'motorcycles' 
                  ? 'linear-gradient(135deg, #d4af37, #c9a22e)' 
                  : 'rgba(20, 184, 166, 0.05)',
                color: currentTab === 'motorcycles' ? '#fff' : '#d4af37',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: currentTab === 'motorcycles' 
                  ? '0 12px 32px rgba(20, 184, 166, 0.4)' 
                  : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Motorcycles
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentTab("scooters")}
              style={{
                padding: '14px 36px',
                borderRadius: '999px',
                border: currentTab === 'scooters' ? 'none' : '2px solid rgba(20, 184, 166, 0.3)',
                background: currentTab === 'scooters' 
                  ? 'linear-gradient(135deg, #d4af37, #c9a22e)' 
                  : 'rgba(20, 184, 166, 0.05)',
                color: currentTab === 'scooters' ? '#fff' : '#d4af37',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: currentTab === 'scooters' 
                  ? '0 12px 32px rgba(20, 184, 166, 0.4)' 
                  : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Scooters
            </motion.button>
          </motion.div>

          {/* Filters Section - Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              maxWidth: '900px',
              margin: '0 auto 60px',
              padding: '32px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {/* Engine Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Engine (cc)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    value={engineMin}
                    onChange={(e) => setEngineMin(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((engineMin - 50) / 950) * 100}%, rgba(212,175,55,0.2) ${((engineMin - 50) / 950) * 100}%, rgba(212,175,55,0.2) 100%)`,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    value={engineMax}
                    onChange={(e) => setEngineMax(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((engineMax - 50) / 950) * 100}%, rgba(212,175,55,0.2) ${((engineMax - 50) / 950) * 100}%, rgba(212,175,55,0.2) 100%)`,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px' }}>
                    {engineMin} cc - {engineMax} cc
                  </p>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Price Range (₹)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="range"
                    min={30000}
                    max={500000}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((priceMin - 30000) / 470000) * 100}%, rgba(212,175,55,0.2) ${((priceMin - 30000) / 470000) * 100}%, rgba(212,175,55,0.2) 100%)`,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="range"
                    min={30000}
                    max={500000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((priceMax - 30000) / 470000) * 100}%, rgba(212,175,55,0.2) ${((priceMax - 30000) / 470000) * 100}%, rgba(212,175,55,0.2) 100%)`,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px' }}>
                    ₹ {priceMin.toLocaleString()} - ₹ {priceMax.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bike Cards Grid */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  color: 'rgba(241, 245, 249, 0.7)',
                  fontSize: '1.25rem',
                  padding: '60px 20px'
                }}
              >
                Loading bikes...
              </motion.div>
            ) : filteredVehicles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  color: 'rgba(241, 245, 249, 0.7)',
                  fontSize: '1.25rem',
                  padding: '60px 20px'
                }}
              >
                No bikes match your filter.
              </motion.div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '28px',
                padding: '0 clamp(1rem, 3vw, 2rem)'
              }}>
                {filteredVehicles.map((b, index) => {
                  const imgSrc = resolveImageSrc(b);
                  const ccVal = getCC(b);
                  return (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(20, 184, 166, 0.2)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ 
                        height: '220px', 
                        overflow: 'hidden', 
                        background: 'rgba(15, 23, 42, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={imgSrc}
                          alt={b.title}
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (!t.dataset.tried) {
                              t.dataset.tried = "1";
                              t.src = FALLBACK_LOCAL_IMAGE;
                            }
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                          }}
                        />
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h3 style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#f1f5f9',
                          marginBottom: '12px',
                          background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {b.title}
                        </h3>
                        <p style={{ color: 'rgba(241, 245, 249, 0.7)', marginBottom: '6px', fontSize: '0.95rem' }}>
                          <strong style={{ color: '#d4af37' }}>Brand:</strong> {b.brand || "—"}
                        </p>
                        <p style={{ color: 'rgba(241, 245, 249, 0.7)', marginBottom: '6px', fontSize: '0.95rem' }}>
                          <strong style={{ color: '#d4af37' }}>Engine:</strong> {ccVal} cc
                        </p>
                        <p style={{ 
                          color: '#fff', 
                          fontSize: '1.25rem', 
                          fontWeight: 800, 
                          marginTop: '12px',
                          marginBottom: '20px',
                          background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          ₹{(b.price ?? 0).toLocaleString()}
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("selectedProduct", JSON.stringify(b));
                              navigate("/checkout");
                            }}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 999,
                              background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                              border: 'none',
                              color: '#fff',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 8px 20px rgba(20, 184, 166, 0.3)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Buy Now
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${b._id}`);
                            }}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 999,
                              background: 'transparent',
                              border: '2px solid rgba(20, 184, 166, 0.4)',
                              color: '#d4af37',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Buyer;


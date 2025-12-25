import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import "../App.css";

type VehicleCreateResponse = {
  _id: string;
  title: string;
  brand: string;
  cc: number;
  price: number;
  type: "motorcycles" | "scooters";
  imageUrl: string;
  createdAt?: string;
};

const Seller: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [cc, setCc] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"motorcycles" | "scooters">("motorcycles");
  const [image, setImage] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVehicle, setUploadedVehicle] = useState<VehicleCreateResponse | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setMessage(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBrand("");
    setCc("");
    setPrice("");
    setType("motorcycles");
    setImage(null);
    setPreviewUrl(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select an image");
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("brand", brand);
      formData.append("cc", cc);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("image", image);

      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/vehicles/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = json?.message || "Failed to upload";
        setMessage(errMsg);
        setIsUploading(false);
        return;
      }

      const created = json?.data ?? json;
      if (!created) {
        setMessage("Upload succeeded but server returned unexpected response.");
        setIsUploading(false);
        return;
      }

      const vehicleObj: VehicleCreateResponse = {
        _id: (created._id as string) || "",
        title: created.title || title,
        brand: created.brand || brand,
        cc: Number(created.cc || cc || 0),
        price: Number(created.price || price || 0),
        type: (created.type as any) || type,
        imageUrl: created.imageUrl || "",
        createdAt: created.createdAt || undefined,
      };

      setUploadedVehicle(vehicleObj);
      setMessage("Bike uploaded successfully ✅");
      setIsUploading(false);

      setTitle("");
      setBrand("");
      setCc("");
      setPrice("");
      setImage(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("Network error");
      setIsUploading(false);
    }
  };

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

        {/* Seller Section */}
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
            Sell Your Bike
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
            List your motorcycle on BikeX and connect with thousands of buyers
          </motion.p>

          {/* Seller Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto 60px',
              padding: '48px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)'
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Bike Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hero Splendor Plus 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hero, Honda, Bajaj"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: '#d4af37', 
                    fontWeight: 700, 
                    fontSize: '0.95rem' 
                  }}>
                    Engine CC
                  </label>
                  <input
                    type="number"
                    placeholder="125"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: '#f1f5f9',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: '#d4af37', 
                    fontWeight: 700, 
                    fontSize: '0.95rem' 
                  }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="75000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: '#f1f5f9',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Vehicle Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "motorcycles" | "scooters")}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <option value="motorcycles">Motorcycle</option>
                  <option value="scooters">Scooter</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#d4af37', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {previewUrl && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid rgba(20, 184, 166, 0.2)'
                }}>
                  <p style={{ color: '#d4af37', fontWeight: 700, marginBottom: '12px' }}>Preview:</p>
                  <img src={previewUrl} alt="preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUploading}
                  style={{
                    padding: '14px 36px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isUploading ? 'rgba(20, 184, 166, 0.5)' : 'linear-gradient(135deg, #d4af37, #c9a22e)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 12px 32px rgba(20, 184, 166, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isUploading ? "Uploading..." : "Upload Bike"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    resetForm();
                    setUploadedVehicle(null);
                    setMessage(null);
                  }}
                  style={{
                    padding: '14px 36px',
                    borderRadius: '999px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    background: 'rgba(20, 184, 166, 0.05)',
                    color: '#d4af37',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Clear Form
                </motion.button>
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: message.includes('success') || message.includes('✅') ? '#d4af37' : '#ef4444',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {message}
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Upload Success Summary */}
          {uploadedVehicle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '40px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)'
              }}
            >
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 900,
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Upload Successful! 🎉
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <img
                    src={uploadedVehicle.imageUrl.startsWith("http") ? uploadedVehicle.imageUrl : `http://localhost:5000${uploadedVehicle.imageUrl}`}
                    alt={uploadedVehicle.title}
                    style={{ width: '100%', borderRadius: '16px', border: '2px solid rgba(20, 184, 166, 0.3)' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/mnt/data/5428fc45-d6cc-4ed3-91b6-27d62a99cb8a.png";
                    }}
                  />
                </div>

                <div>
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', marginBottom: '12px', fontSize: '1rem' }}>
                    <strong style={{ color: '#d4af37' }}>Title:</strong> {uploadedVehicle.title}
                  </p>
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', marginBottom: '12px', fontSize: '1rem' }}>
                    <strong style={{ color: '#d4af37' }}>Brand:</strong> {uploadedVehicle.brand}
                  </p>
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', marginBottom: '12px', fontSize: '1rem' }}>
                    <strong style={{ color: '#d4af37' }}>Engine:</strong> {uploadedVehicle.cc} cc
                  </p>
                  <p style={{ color: 'rgba(241, 245, 249, 0.9)', marginBottom: '12px', fontSize: '1rem' }}>
                    <strong style={{ color: '#d4af37' }}>Price:</strong> ₹{uploadedVehicle.price.toLocaleString()}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/market")}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '999px',
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: '#d4af37',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                      }}
                    >
                      View in Market
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setUploadedVehicle(null);
                        resetForm();
                        setMessage(null);
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(20, 184, 166, 0.4)'
                      }}
                    >
                      Upload Another
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/buy")}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '999px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        background: 'rgba(20, 184, 166, 0.05)',
                        color: '#d4af37',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Listings
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/dashboard")}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '999px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        background: 'rgba(20, 184, 166, 0.05)',
                        color: '#d4af37',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Dashboard
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      </div>
    </>
  );
};

export default Seller;


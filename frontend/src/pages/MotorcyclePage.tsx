// frontend/src/pages/MotorcyclePage.tsx
import React, { useEffect, useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
};

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FALLBACK_LOCAL_IMAGE = "/fallback-bike.png";

const MotorcyclePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const data = Array.isArray(body) ? body : body?.data ?? body?.vehicles ?? [];
        const vehArray = Array.isArray(data) ? data : [];

        const motorcycles = vehArray.filter((v: Vehicle) => {
          const t = (v.type || "").toString().toLowerCase();
          return ["motorcycle","motorcycles","motor","bike","bikes","cruiser","scooter","ev","electric"]
            .some(k => t.includes(k));
        });

        setVehicles(motorcycles);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resolveImageSrc = (v: Vehicle) => {
    const img = (v.images && v.images.length > 0) ? v.images[0] : (v.imageUrl || "");
    if (!img) return FALLBACK_LOCAL_IMAGE;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) {
      return `${BACKEND_BASE.replace(/\/$/, "")}${img}`;
    }
    return img || FALLBACK_LOCAL_IMAGE;
  };

  const getCC = (v: Vehicle) => {
    if (typeof v.cc === "number") return v.cc;
    if (typeof v.engine_cc === "number") return v.engine_cc;
    if (typeof v.displacement === "number") return v.displacement;
    if (v.type?.toLowerCase().includes("ev")) return 0;
    return 150;
  };

  return (
    <>
      <Navbar />

      <section className="filter-section">
        <h2>All Motorcycles</h2>

        <div className="bike-list">
          {loading ? (
            <p>Loading motorcycles...</p>
          ) : vehicles.length === 0 ? (
            <p>No motorcycles available.</p>
          ) : (
            <div className="grid-cards">
              {vehicles.map((b) => {
                const imgSrc = resolveImageSrc(b);
                const ccVal = getCC(b);
                return (
                  <div className="bike-card" key={b._id}>
                    <div className="bike-image-wrap">
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
                      />
                    </div>

                    <h3>{b.title}</h3>
                    <p>Brand: {b.brand || "—"}</p>
                    <p>{ccVal} cc</p>
                    <p>Price: ₹{(b.price ?? 0).toLocaleString()}</p>

                    {/* Explore button */}
                    <div style={{ marginTop: 10 }}>
                      <button
                        className="explore-btn"
                        onClick={() => navigate(`/vehicle/${b._id}`)}
                        aria-label={`Explore ${b.title}`}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MotorcyclePage;


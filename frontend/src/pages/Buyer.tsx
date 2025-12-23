// src/pages/Buyer.tsx
import React, { useEffect, useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";

type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  // possible engine fields
  cc?: number;
  engine_cc?: number;
  displacement?: number;
  price?: number;
  type?: string; // could be 'motorcycles' | 'scooters' | 'bike' | 'scooter' | 'ev'
  imageUrl?: string;
  images?: string[];
  odometer_km?: number;
};

type Tab = "motorcycles" | "scooters";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Fallback local uploaded image path (your uploaded test image)
const FALLBACK_LOCAL_IMAGE = "/mnt/data/833ac447-1bd5-4653-85d8-18d4e6a105a0.png";

const Buyer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>("motorcycles");
  const [engineMin, setEngineMin] = useState(50);
  const [engineMax, setEngineMax] = useState(1000);
  const [priceMin, setPriceMin] = useState(30000);
  const [priceMax, setPriceMax] = useState(500000);

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
        // handle both shapes: [] or { success:true, data: [...] } or { vehicles: [...] }
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
    return 150; // default guess
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
    const typeStr = (b.type || "").toString().toLowerCase();
    const isMotorcycle = typeStr.includes("motor") || typeStr === "bike" || typeStr === "motorcycles";
    const isScooter = typeStr.includes("scooter") || typeStr === "scooters";

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

      <section className="filter-section">
        <h2>Browse All Bikes</h2>

        <div className="tabs">
          <button
            className={`tab ${currentTab === "motorcycles" ? "active" : ""}`}
            onClick={() => setCurrentTab("motorcycles")}
          >
            Motorcycles
          </button>
          <button
            className={`tab ${currentTab === "scooters" ? "active" : ""}`}
            onClick={() => setCurrentTab("scooters")}
          >
            Scooters
          </button>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Engine (cc):</label>
            <input
              type="range"
              min={50}
              max={1000}
              value={engineMin}
              onChange={(e) => setEngineMin(Number(e.target.value))}
            />
            <input
              type="range"
              min={50}
              max={1000}
              value={engineMax}
              onChange={(e) => setEngineMax(Number(e.target.value))}
            />
            <p>
              {engineMin} cc - {engineMax} cc
            </p>
          </div>

          <div className="filter-group">
            <label>Price (₹):</label>
            <input
              type="range"
              min={30000}
              max={500000}
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
            />
            <input
              type="range"
              min={30000}
              max={500000}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <p>
              ₹ {priceMin.toLocaleString()} - ₹ {priceMax.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bike-list">
          {loading ? (
            <p>Loading bikes...</p>
          ) : filteredVehicles.length === 0 ? (
            <p>No bikes match your filter.</p>
          ) : (
            <div className="grid-cards">
              {filteredVehicles.map((b) => {
                const imgSrc = resolveImageSrc(b);
                const ccVal = getCC(b);
                return (
                  <div className="bike-card" key={b._id}>
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
                    <h3>{b.title}</h3>
                    <p>Brand: {b.brand || "—"}</p>
                    <p>{ccVal} cc</p>
                    <p>Price: ₹{(b.price ?? 0).toLocaleString()}</p>
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

export default Buyer;

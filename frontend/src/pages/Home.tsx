// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { initHomePage } from "../slide_function";

type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  // possible engine fields
  cc?: number;
  engine_cc?: number;
  displacement?: number;
  price?: number;
  type?: string;
  imageUrl?: string;
  images?: string[];
  odometer_km?: number;
};

type Tab = "motorcycles" | "scooters";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Fallback local uploaded image path (you provided this file earlier)
const FALLBACK_LOCAL_IMAGE = "/default-bike.png";

const Home: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>("motorcycles");
  const [engineMin, setEngineMin] = useState(100);
  const [engineMax, setEngineMax] = useState(500);
  const [priceMin, setPriceMin] = useState(50000);
  const [priceMax, setPriceMax] = useState(200000);
  const [loading, setLoading] = useState(true);

  // Initialize robust slider (preloads images)
  useEffect(() => {
    const cleanup = initHomePage();
    return cleanup;
  }, []);

  // Fetch vehicles (handles array or { success, data } shapes)
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
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // normalize cc fields
  const getCC = (b: Vehicle) => {
    if (typeof b.cc === "number") return b.cc;
    if (typeof b.engine_cc === "number") return b.engine_cc;
    if (typeof b.displacement === "number") return b.displacement;
    if (b.type && b.type.toString().toLowerCase().includes("ev")) return 0;
    return 150;
  };

  // Resolve image src: prefer images[0], then imageUrl, then fallback
  function resolveImageSrc(v: any) {
  // prefer images array then imageUrl
  const img = v?.images?.[0] || v?.imageUrl;
  // fallback to backend default placeholder
  const fallback = `${BACKEND_BASE}/uploads/default-bike.png`;

  if (!img) return fallback;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  // relative path from backend (e.g. /uploads/seed-xxx.png)
  if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
  // last resort
  return `${BACKEND_BASE}/uploads/${img}`;
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

      {/* HERO SLIDER */}
   <section className="hero-slider">

  <div className="slide active">
    <img className="slide-img" src="/Bike-1.jpg" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <h1>Royal Classic 650</h1>
      <p>A legend reborn. Ride like a king.</p>
      <a href="/bike-detail" className="hero-btn">Explore</a>
    </div>
  </div>

  <div className="slide">
    <img className="slide-img" src="/Bike-2.jpg" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <h1>KTM Duke 390</h1>
      <p>Feel the adrenaline rush.</p>
      <a href="/bike-detail" className="hero-btn">Explore</a>
    </div>
  </div>

  <div className="slide">
    <img className="slide-img" src="/Bike-3.jpg" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <h1>Yamaha R15 V4</h1>
      <p>Style. Speed. Performance.</p>
      <a href="/bike-detail" className="hero-btn">Explore</a>
    </div>
  </div>

  <div className="slide-dots" id="slideDots"></div>

</section>


      {/* BUYER/SELLER CHOICE */}
      <section className="gta-choice">
        <h2>Are you a Buyer or a Seller?</h2>
        <div className="gta-buttons">
          <button className="gta-btn" onClick={() => (window.location.href = "/buyer")}>
            Buyer
          </button>
          <button className="gta-btn" onClick={() => (window.location.href = "/seller")}>
            Seller
          </button>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="filter-section">
        <h2>Find Your Ride</h2>

        {/* Tabs */}
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

        {/* Filter controls */}
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

        {/* Bike list */}
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

export default Home;

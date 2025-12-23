import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // After successful upload, we hold the created vehicle to show a summary
  const [uploadedVehicle, setUploadedVehicle] = useState<VehicleCreateResponse | null>(null);

  // handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setMessage(null);

    if (file) {
      // show local preview while user is on the form
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
      imageUrl: created.imageUrl || created.imageUrl || "",
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
    <div className="seller-page" style={{ padding: 24 }}>
      <h2>Sell Your Bike</h2>

      {/* Form */}
      <form className="seller-form" onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <input
          type="text"
          placeholder="Bike title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Engine CC"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "motorcycles" | "scooters")}
        >
          <option value="motorcycles">Motorcycle</option>
          <option value="scooters">Scooter</option>
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Preview while on form */}
        {previewUrl && (
          <div style={{ marginTop: 10 }}>
            <p style={{ margin: "6px 0" }}>Preview:</p>
            <img src={previewUrl} alt="preview" style={{ width: 220, borderRadius: 8 }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <button type="submit" className="btn" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Bike"}
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setUploadedVehicle(null);
              setMessage(null);
            }}
            style={{ background: "#ddd", border: "none", padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ background: "#f44", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Go to Home
          </button>
        </div>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </form>

      {/* SUCCESS SUMMARY + ACTIONS */}
      {uploadedVehicle && (
        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 12,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            maxWidth: 800,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Upload successful 🎉</h3>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* preview from server (imageUrl should be a path like /uploads/...) */}
            <div style={{ width: 200 }}>
              <img
                // If backend returned imageUrl like "/uploads/abc.jpg", prefix backend origin:
                src={uploadedVehicle.imageUrl.startsWith("http") ? uploadedVehicle.imageUrl : `http://localhost:5000${uploadedVehicle.imageUrl}`}
                alt={uploadedVehicle.title}
                style={{ width: "100%", borderRadius: 8 }}
                onError={(e) => {
                  // fallback to the screenshot you shared for demo (local path in this conversation)
                  (e.currentTarget as HTMLImageElement).src = "/mnt/data/5428fc45-d6cc-4ed3-91b6-27d62a99cb8a.png";
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Title:</strong> {uploadedVehicle.title}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Brand:</strong> {uploadedVehicle.brand}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Engine:</strong> {uploadedVehicle.cc} cc
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Price:</strong> ₹{uploadedVehicle.price.toLocaleString()}
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    // user wants to upload another bike — reset state & show form again
                    setUploadedVehicle(null);
                    resetForm();
                    setMessage(null);
                    // keep user on Seller page (form is still visible above)
                  }}
                  style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                >
                  Upload another
                </button>

                <button
                  onClick={() => {
                    // go back to home
                    navigate("/");
                  }}
                  style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                >
                  Go to Home
                </button>

                <button
                  onClick={() => {
                    // go to buyer page (show listing)
                    navigate("/buyer");
                  }}
                  style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                >
                  View in Buyer listings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;

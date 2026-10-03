// frontend/src/api.ts
export type Vehicle = {
  _id: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  category?: string;
  fuel_type?: string;
  battery_range?: number;
  description?: string;
  images?: string[];
};

export const API_BASE = import.meta.env.VITE_API_URL || 'https://vahan-bhazar-backend.onrender.com';

export async function fetchVehicles(): Promise<{ total: number; vehicles: Vehicle[] }> {
  const base = API_BASE;
  const res = await fetch(`${base}/api/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

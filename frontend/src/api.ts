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

export async function fetchVehicles(): Promise<{ total: number; vehicles: Vehicle[] }> {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const res = await fetch(`${base}/api/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

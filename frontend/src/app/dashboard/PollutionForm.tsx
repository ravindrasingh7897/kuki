"use client";
import { useState } from "react";
import { toast } from "react-toastify";

interface PollutionFormProps {
  onSuccess: () => void;
  initial?: any;
}

export default function PollutionForm({ onSuccess, initial }: PollutionFormProps) {
  const [year, setYear] = useState(initial?.year || 2021);
  const [month, setMonth] = useState(initial?.month || 1);
  const [location, setLocation] = useState(initial?.location || "");
  const [Benzene, setBenzene] = useState(initial?.Benzene || 0);
  const [Toluene, setToluene] = useState(initial?.Toluene || 0);
  const [NO, setNO] = useState(initial?.NO || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/data" + (initial?._id ? `/${initial._id}` : ""), {
        method: initial?._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ year, month, location, Benzene, Toluene, NO }),
      });
      if (res.ok) {
        toast.success(initial?._id ? "Record updated!" : "Record added!");
        onSuccess();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save record");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div>
          <label className="block font-medium mb-1">Year</label>
          <input type="number" min={2015} max={2024} value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-2 py-1 w-24" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Month</label>
          <input type="number" min={1} max={12} value={month} onChange={e => setMonth(Number(e.target.value))} className="border rounded px-2 py-1 w-24" required />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Location</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="border rounded px-2 py-1 w-full" required />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block font-medium mb-1">Benzene</label>
          <input type="number" value={Benzene} onChange={e => setBenzene(Number(e.target.value))} className="border rounded px-2 py-1 w-24" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Toluene</label>
          <input type="number" value={Toluene} onChange={e => setToluene(Number(e.target.value))} className="border rounded px-2 py-1 w-24" required />
        </div>
        <div>
          <label className="block font-medium mb-1">NO</label>
          <input type="number" value={NO} onChange={e => setNO(Number(e.target.value))} className="border rounded px-2 py-1 w-24" required />
        </div>
      </div>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition" disabled={loading}>
        {loading ? (initial?._id ? "Updating..." : "Adding...") : (initial?._id ? "Update Record" : "Add Record")}
      </button>
    </form>
  );
}

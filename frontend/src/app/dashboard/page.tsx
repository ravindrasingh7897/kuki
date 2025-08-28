"use client";
import { useEffect, useState } from "react";
import PollutionModal from "./PollutionModal";
import DataFilters from "./DataFilters";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [trends, setTrends] = useState<any[]>([]);
  const [year, setYear] = useState(2021);
  const [filterType, setFilterType] = useState("single");
  const [startYear, setStartYear] = useState(2021);
  const [endYear, setEndYear] = useState(2021);
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    handleApplyFilters();
    // eslint-disable-next-line
  }, []);

  const fetchData = async (token: string, params: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const records = await res.json();
      setData(records);
      setPage(1); // Reset to first page on new data
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (token: string, year: number) => {
    try {
      const res = await fetch(`/api/data/trends?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const trendData = await res.json();
      setTrends(trendData.monthlyTrends || []);
    } catch (err) {
      toast.error("Failed to load trends");
    }
  };

  const handleApplyFilters = () => {
    const token = localStorage.getItem("token");
    let params = "";
    if (filterType === "single") {
      params = `?year=${year}`;
      fetchData(token!, params);
      fetchTrends(token!, year);
    } else if (filterType === "range") {
      params = `?startYear=${startYear}&endYear=${endYear}`;
      fetchData(token!, params);
      fetchTrends(token!, startYear); // default to startYear for chart
    } else if (filterType === "monthRange") {
      params = `?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`;
      fetchData(token!, params);
      fetchTrends(token!, year);
    }
  };

  const handleResetFilters = () => {
    setFilterType("single");
    setYear(2021);
    setStartYear(2021);
    setEndYear(2021);
    setStartMonth(1);
    setEndMonth(12);
    handleApplyFilters();
  };

  const handleAdd = () => {
    setEditRecord(null);
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/data/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Record deleted");
        handleApplyFilters();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ToastContainer />
  <PollutionModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); handleApplyFilters(); }} initial={editRecord} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Environmental Monitor</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Summary Cards */}
          {loading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} height={80} />)
          ) : (
            <>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <span className="text-yellow-500 font-bold text-lg">Avg Benzene</span>
                <span className="text-2xl font-bold">{(data.reduce((a, b) => a + b.Benzene, 0) / data.length || 0).toFixed(1)}</span>
                <span className="text-xs text-gray-500">μg/m³</span>
              </div>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <span className="text-blue-500 font-bold text-lg">Avg Toluene</span>
                <span className="text-2xl font-bold">{(data.reduce((a, b) => a + b.Toluene, 0) / data.length || 0).toFixed(1)}</span>
                <span className="text-xs text-gray-500">μg/m³</span>
              </div>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <span className="text-red-400 font-bold text-lg">Avg NO</span>
                <span className="text-2xl font-bold">{(data.reduce((a, b) => a + b.NO, 0) / data.length || 0).toFixed(1)}</span>
                <span className="text-xs text-gray-500">μg/m³</span>
              </div>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <span className="text-green-600 font-bold text-lg">Total Records</span>
                <span className="text-2xl font-bold">{data.length}</span>
                <span className="text-xs text-gray-500">entries</span>
              </div>
            </>
          )}
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <DataFilters
            filterType={filterType}
            setFilterType={setFilterType}
            year={year}
            setYear={setYear}
            startYear={startYear}
            setStartYear={setStartYear}
            endYear={endYear}
            setEndYear={setEndYear}
            startMonth={startMonth}
            setStartMonth={setStartMonth}
            endMonth={endMonth}
            setEndMonth={setEndMonth}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>
        {/* Chart */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-bold mb-2">Pollution Trends - {year}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Benzene" stroke="#facc15" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Toluene" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="NO" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Data Table */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Pollution Data Records</h2>
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition flex items-center gap-2">
              <span className="text-xl font-bold">+</span> Add Record
            </button>
          </div>
          {loading ? (
            <Skeleton count={6} height={40} />
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Benzene (μg/m³)</th>
                    <th>Toluene (μg/m³)</th>
                    <th>NO (μg/m³)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice((page-1)*rowsPerPage, page*rowsPerPage).map((row, i) => (
                    <tr key={row._id || i} className="border-t">
                      <td>{String(row.month).padStart(2, '0')}/{row.year}</td>
                      <td>{row.location}</td>
                      <td>{row.Benzene}</td>
                      <td>{row.Toluene}</td>
                      <td>{row.NO}</td>
                      <td>
                        <button onClick={() => handleEdit(row)} className="mr-2 text-blue-600 hover:underline" title="Edit">✏️</button>
                        <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:underline" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(data.length === 0) ? 0 : ((page-1)*rowsPerPage+1)} to {Math.min(page*rowsPerPage, data.length)} of {data.length} records
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
                  <span>Page {page} of {Math.max(1, Math.ceil(data.length/rowsPerPage))}</span>
                  <button onClick={() => setPage(p => Math.min(Math.ceil(data.length/rowsPerPage), p+1))} disabled={page === Math.ceil(data.length/rowsPerPage) || data.length === 0} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

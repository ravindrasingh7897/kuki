"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.46243 6.46243 3 9.5 3C11.1569 3 12 4.5 12 4.5C12 4.5 12.8431 3 14.5 3C17.5376 3 20 5.46243 20 8.5C20 13.5 12 21 12 21Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="text-2xl font-bold">Environmental Monitor</h2>
          <p className="text-gray-500 text-center">Sign in to access the pollution data dashboard</p>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="text-center mt-4 text-sm">
          Don&apos;t have an account? <a href="/register" className="text-green-600 font-medium">Sign up</a>
        </div>
      </form>
    </div>
  );
}

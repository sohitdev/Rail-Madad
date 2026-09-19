import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Train } from "@phosphor-icons/react";
import api from "../lib/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/admin/login", { username, password });
      if (response.data.success) {
        localStorage.setItem("admin_token", response.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-6">
      <div className="mb-8 flex flex-col items-center">
        <Train size={48} className="text-emerald-500 mb-4" />
        <h1 className="text-white text-3xl font-bold tracking-tight">Admin Portal</h1>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-md">
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">{error}</div>}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500" 
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-600 text-white py-3 rounded-md font-medium mt-4 hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

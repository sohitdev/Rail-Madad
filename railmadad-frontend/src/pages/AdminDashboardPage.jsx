import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Train, SignOut } from "@phosphor-icons/react";
import api, { API_BASE_URL } from "../lib/api";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const response = await api.get("/admin/complaints");
        if (response.data.success) {
          setComplaints(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("admin_token");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();

    const socket = io(API_BASE_URL);

    socket.on("new_complaint", () => {
      // Refresh the list when a new complaint arrives
      fetchComplaints();
    });

    socket.on("complaint_updated", () => {
      fetchComplaints();
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/complaint/${id}`, { status: newStatus, remark: "Updated by admin" });
      // Socket event will trigger refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 font-sans text-zinc-900 flex flex-col">
      <header className="bg-zinc-950 text-white h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Train size={24} className="text-emerald-500" />
          Command Center
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <SignOut size={16} /> Logout
        </button>
      </header>
      <main className="flex-grow p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Active Grievances</h1>
            <p className="text-zinc-600 mt-1">Real-time incoming reports.</p>
          </div>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-sm font-semibold text-zinc-600">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-zinc-500">Loading complaints...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-zinc-500">No complaints found.</td></tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-4 px-6 font-medium">#{c.id}</td>
                    <td className="py-4 px-6">{c.department || "General"}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${
                        c.priority === 'High' ? 'bg-red-100 text-red-800' :
                        c.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {c.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-6 truncate max-w-xs text-zinc-600">
                      <div className="truncate">{c.description}</div>
                      {c.file_path && (
                        <a href={`${API_BASE_URL}/uploads/${c.file_path}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-xs hover:underline mt-1 flex items-center gap-1">
                          View Attachment
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {c.status !== 'Resolved' && (
                        <button onClick={() => updateStatus(c.id, "Resolved")} className="text-emerald-600 font-medium text-sm hover:underline cursor-pointer">Resolve</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

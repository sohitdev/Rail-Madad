import { useState } from "react";
import api, { API_BASE_URL } from "../../../lib/api";

export function StatusTracker() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await api.get(`/track-complaint?mobile_number=${mobile}`);
      if (res.data.success) {
        setResults(res.data.data); // Should be an array of complaints
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="track" className="px-6 lg:px-12 py-32 bg-zinc-50 flex justify-center w-full">
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 lg:p-12 w-full max-w-2xl shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Track existing complaint</h2>
          <p className="text-zinc-600 text-sm">Enter your registered mobile number to see live status.</p>
        </div>
        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">{error}</div>}
          <div className="flex flex-col gap-2">
            <label htmlFor="mobile" className="text-sm font-semibold text-zinc-900 text-left">Mobile Number</label>
            <input 
              type="tel" 
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10 digit number"
              className="border border-zinc-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-shadow"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-zinc-900 text-white w-full py-3 rounded-md font-medium mt-2 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Searching..." : "Lookup Status"}
          </button>
        </form>

        {results && results.length > 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-200 flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Found {results.length} record(s)</h3>
            {results.map(c => (
              <div key={c.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">#{c.id} - {c.department}</span>
                    {c.priority && (
                      <span className={`text-xs font-semibold w-fit px-2 py-0.5 rounded-md ${
                        c.priority === 'High' ? 'bg-red-100 text-red-800' :
                        c.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {c.priority} Priority
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${
                    c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 line-clamp-2 mb-2">{c.description}</p>
                {c.file_path && (
                  <a href={`${API_BASE_URL}/uploads/${c.file_path}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-xs hover:underline mt-1 inline-block mb-2">
                    View Uploaded Image
                  </a>
                )}
                {c.remark && (
                  <div className="bg-zinc-50 border border-zinc-200 p-3 rounded text-sm text-zinc-700 mt-2">
                    <strong>Admin Note:</strong> {c.remark}
                  </div>
                )}
                <div className="text-xs text-zinc-400 mt-3 flex justify-between">
                  <span>Filed: {new Date(c.created_at).toLocaleDateString()}</span>
                  <span>Station: {c.recent_station || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {results && results.length === 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-200 text-center text-zinc-500">
            No complaints found for this number.
          </div>
        )}
      </div>
    </section>
  );
}

import { Navbar } from "../features/core/components/Navbar";
import { Footer } from "../features/core/components/Footer";
import { HowItWorks } from "../features/core/components/HowItWorks";
import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function FileComplaintPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = otp verification
  const [formData, setFormData] = useState({
    mobile_number: "",
    email: "",
    description: "",
    otp: "",
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async () => {
    if (!formData.mobile_number || !formData.email || !formData.description) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/request-otp", { email: formData.email });
      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("mobile_number", formData.mobile_number);
    data.append("email", formData.email);
    data.append("description", formData.description);
    data.append("otp", formData.otp);
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const res = await api.post("/submit-complaint", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        alert(`Complaint submitted! Your Tracking ID is #${res.data.complaintId}`);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-emerald-200 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HowItWorks />
        <section className="px-6 lg:px-12 py-24 flex justify-center bg-zinc-50">
           <div className="bg-white border border-zinc-200 rounded-2xl p-8 lg:p-12 w-full max-w-2xl shadow-sm">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bold tracking-tight mb-2">File a new grievance</h2>
               <p className="text-zinc-600 text-sm">Our AI will automatically route your issue.</p>
             </div>
             
             {error && <div className="mb-6 bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">{error}</div>}

             {step === 1 ? (
               <form className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-zinc-900">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={formData.mobile_number}
                        onChange={e => setFormData({...formData, mobile_number: e.target.value})}
                        className="border border-zinc-300 rounded-md px-4 py-3" 
                        placeholder="10 digit number" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-zinc-900">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="border border-zinc-300 rounded-md px-4 py-3" 
                        placeholder="For OTP verification" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Describe the issue</label>
                    <textarea 
                      rows="4" 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="border border-zinc-300 rounded-md px-4 py-3" 
                      placeholder="E.g., Fan is not working in coach B4..."
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Attach a photo (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setFormData({...formData, file: e.target.files[0]})}
                      className="border border-zinc-300 rounded-md px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRequestOTP}
                    disabled={loading}
                    className="bg-emerald-700 text-white w-full py-3 rounded-md font-medium mt-2 hover:bg-emerald-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
               </form>
             ) : (
               <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Enter OTP</label>
                    <input 
                      type="text" 
                      value={formData.otp}
                      onChange={e => setFormData({...formData, otp: e.target.value})}
                      className="border border-zinc-300 rounded-md px-4 py-3 text-center tracking-widest text-lg" 
                      placeholder="6 digit code" 
                      maxLength={6}
                    />
                    <p className="text-xs text-zinc-500 mt-1">Sent to {formData.email}</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-emerald-700 text-white w-full py-3 rounded-md font-medium mt-2 hover:bg-emerald-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Submitting..." : "Submit Grievance"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  >
                    Back to edit details
                  </button>
               </form>
             )}
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { Navbar } from "../features/core/components/Navbar";
import { StatusTracker } from "../features/complaints/components/StatusTracker";
import { Footer } from "../features/core/components/Footer";

export default function TrackStatusPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-emerald-200 flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center">
        <StatusTracker />
      </main>
      <Footer />
    </div>
  );
}

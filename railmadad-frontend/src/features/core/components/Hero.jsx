import { Link } from "react-router-dom";

export function Hero() {
  return (
    <header className="px-6 lg:px-12 pt-16 lg:pt-24 pb-12 lg:pb-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[85vh]">
      <div className="max-w-xl">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-zinc-950">
          Railway support when you need it most.
        </h1>
        <p className="text-lg text-zinc-600 mb-8 max-w-[45ch] leading-relaxed">
          Report issues, track resolutions in real time, and help us improve the national railway network for millions of daily passengers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/file-complaint" className="bg-emerald-700 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-800 transition-colors cursor-pointer text-center">
            File a Grievance
          </Link>
          <Link to="/track" className="bg-zinc-200 text-zinc-900 px-6 py-3 rounded-md font-medium hover:bg-zinc-300 transition-colors cursor-pointer text-center">
            Check Status
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-200">
        <img 
          src="/images/hero_train_station_1789807145591.jpg" 
          alt="Modern Indian Railway Station" 
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}

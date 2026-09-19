import { Train } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 lg:px-12 h-20 border-b border-zinc-200 bg-white">
      <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight hover:text-emerald-800 transition-colors">
        <Train size={24} weight="bold" className="text-emerald-700" />
        RailMadad
      </Link>
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
        <Link to="/file-complaint" className="hover:text-zinc-950 transition-colors">File Complaint</Link>
        <Link to="/track" className="hover:text-zinc-950 transition-colors">Track Status</Link>
      </div>
      <Link to="/admin/login" className="bg-zinc-950 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer inline-flex">
        Admin Login
      </Link>
    </nav>
  );
}

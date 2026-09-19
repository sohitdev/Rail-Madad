import { Train } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-lg text-white mb-4">
            <Train size={24} className="text-emerald-500" />
            RailMadad
          </div>
          <p className="text-sm max-w-sm">
            The official grievance redressal portal. Designed to ensure safe, clean, and reliable journeys for all citizens.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Citizen Charter</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Emergency: 139</li>
            <li>Support: care@railmadad.example.in</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto border-t border-zinc-800 pt-8 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <p>Not affiliated with real railway entities. This is a portfolio project.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

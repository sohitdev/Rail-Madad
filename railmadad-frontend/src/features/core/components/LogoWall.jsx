import { ShieldCheck, Ticket, Lifebuoy } from "@phosphor-icons/react";

export function LogoWall() {
  return (
    <section className="border-y border-zinc-200 bg-white py-12 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <p className="text-xs font-medium text-zinc-500 mb-8 tracking-[0.2em] uppercase">Integrated with National Services</p>
        <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck size={28} /> RPF Security</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Ticket size={28} /> IRCTC</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Lifebuoy size={28} /> RailHelp</div>
        </div>
      </div>
    </section>
  );
}

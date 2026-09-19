import { Navbar } from "../features/core/components/Navbar";
import { Hero } from "../features/core/components/Hero";
import { LogoWall } from "../features/core/components/LogoWall";
import { DepartmentsBento } from "../features/complaints/components/DepartmentsBento";
import { ImageBreak } from "../features/core/components/ImageBreak";
import { Footer } from "../features/core/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-emerald-200 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <LogoWall />
        <DepartmentsBento />
        <ImageBreak />
      </main>
      <Footer />
    </div>
  );
}

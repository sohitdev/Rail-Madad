export function HowItWorks() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-white border-y border-zinc-200">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-16 text-center">How to file a report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
            <h3 className="text-xl font-semibold mb-3">Verify PNR</h3>
            <p className="text-zinc-600 text-sm max-w-[28ch]">Enter your ticket number and mobile to verify your journey details securely.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
            <h3 className="text-xl font-semibold mb-3">Upload Media</h3>
            <p className="text-zinc-600 text-sm max-w-[28ch]">Attach a photo or video of the issue to provide clear evidence for the staff.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
            <h3 className="text-xl font-semibold mb-3">Get Resolved</h3>
            <p className="text-zinc-600 text-sm max-w-[28ch]">Staff on the next upcoming station will attend to the carriage immediately.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

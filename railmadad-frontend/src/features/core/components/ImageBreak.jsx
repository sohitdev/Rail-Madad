export function ImageBreak() {
  return (
    <section className="w-full h-[60vh] min-h-[500px] relative flex items-center justify-center">
      <img 
        src="/images/clean_train_interior_1789807170135.jpg"
        alt="Clean train interior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Maintaining world class standards.
        </h2>
        <p className="text-zinc-200 text-lg">Your reports directly fund cleaning and maintenance schedules across all zones.</p>
      </div>
    </section>
  );
}

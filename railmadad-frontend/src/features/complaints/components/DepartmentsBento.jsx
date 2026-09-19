import { ClockClockwise, PhoneCall } from "@phosphor-icons/react";

export function DepartmentsBento() {
  return (
    <section id="departments" className="px-6 lg:px-12 py-24 bg-zinc-50 max-w-[1400px] mx-auto">
      <div className="mb-16 max-w-2xl">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Everything in one place.</h2>
        <p className="text-zinc-600 text-lg">Our AI instantly routes your complaint to the exact department responsible, bypassing the bureaucracy.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[320px]">
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-zinc-200">
          <img 
            src="/images/app_usage_mobile_1789807157484.jpg" 
            alt="Passenger using mobile app"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h3 className="text-white text-2xl font-semibold">Mobile ready tracking.</h3>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between">
          <ClockClockwise size={32} className="text-emerald-700" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Real time updates</h3>
            <p className="text-zinc-600 text-sm">Watch the status of your complaint move from pending to resolved with exact timestamps.</p>
          </div>
        </div>
        <div className="bg-emerald-900 text-emerald-50 rounded-2xl p-8 flex flex-col justify-between">
          <PhoneCall size={32} className="text-emerald-400" />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Emergency Response</h3>
            <p className="text-emerald-200 text-sm">Medical and security emergencies are escalated immediately to the nearest station master.</p>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-center items-start">
          <h3 className="text-2xl font-bold mb-3">AI Classification Engine</h3>
          <p className="text-zinc-600 max-w-lg mb-6">You do not need to know which department handles dirty coaches versus broken fans. Describe the issue in plain text, and our system routes it perfectly.</p>
          <div className="inline-block bg-zinc-100 px-4 py-2 rounded-full text-sm font-medium border border-zinc-200">
            Powered by Gemini
          </div>
        </div>
      </div>
    </section>
  );
}

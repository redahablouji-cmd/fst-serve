import React from 'react';

export default function Driver() {
  // Static data representing exactly what your API will push to the app
  const activeRequest = {
    vehicle: "Porsche Taycan 4S",
    location: "DIFC Parking, Level B2",
    targetSoc: "80%",
    mapLink: "https://www.google.com/maps/search/?api=1&query=25.212,55.282" 
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full font-sans text-gray-900 flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex justify-center items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-black">
          FST <span className="text-[#84cc16]">serve</span>
        </h1>
      </header>

      {/* --- MAIN DISPATCH SCREEN (FIXED & STATIC) --- */}
      <main className="flex-1 p-5 w-full max-w-md mx-auto flex flex-col pt-8">
        
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 relative overflow-hidden flex-1 flex flex-col">
          
          <div className="bg-black text-[#B5F573] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest inline-block mb-6 shadow-sm self-start">
            Active Dispatch
          </div>

          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Target Vehicle</p>
          <h2 className="text-3xl font-black text-black leading-tight mb-8">{activeRequest.vehicle}</h2>
          
          {/* LOCATION & DETAILS BOX */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 space-y-6">
            
            {/* EXACT LOCATION */}
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-400 bg-white p-3 rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Exact Location</p>
                <p className="font-black text-xl text-gray-800 leading-tight">{activeRequest.location}</p>
              </div>
            </div>

            {/* TARGET SOC */}
            <div className="flex items-start gap-4">
              <div className="mt-1 text-lime-600 bg-lime-100 p-3 rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Charge Required</p>
                <p className="font-black text-xl text-lime-600 leading-tight">{activeRequest.targetSoc}</p>
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-auto space-y-4">
            <a 
              href={activeRequest.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#B5F573] text-black font-black text-xl py-6 rounded-2xl shadow-[0_10px_20px_rgba(181,245,115,0.3)] active:scale-95 transition-transform flex justify-center items-center gap-3 border border-[#a3e362] hover:bg-[#a4e060]"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              OPEN IN MAPS
            </a>

            <button 
              className="w-full py-4 text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors rounded-xl hover:bg-gray-50"
            >
              Mark as Completed
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}

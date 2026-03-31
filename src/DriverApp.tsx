import React, { useState, useEffect } from 'react';

export default function DriverApp() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [pileBattery, setPileBattery] = useState(100);
  const [missionStage, setMissionStage] = useState(0); 
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    let watchId: number;
    if (isAvailable) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            console.log("Live GPS:", position.coords.latitude, position.coords.longitude);
          },
          (error) => console.error("GPS Error:", error),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isAvailable]);

  const handleNextStage = () => {
    if (missionStage === 4) {
      setMissionStage(0);
      return;
    }
    setMissionStage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#B5F573] selection:text-black pb-20">
      
      <header className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-lg">⏻</div>
          <h1 className="text-2xl font-black tracking-tighter">FST <span className="text-blue-500">serve</span></h1>
        </div>
        
        <div className="flex items-center gap-2 text-[#B5F573] font-bold text-sm bg-[#B5F573]/10 px-3 py-1.5 rounded-full border border-[#B5F573]/20 shadow-[0_0_10px_rgba(181,245,115,0.1)]">
          <span>⚡ PILE SOC:</span>
          <span>{pileBattery}%</span>
        </div>
      </header>

      <main className="p-5 max-w-lg mx-auto space-y-6 mt-4">
        
        <button 
          onClick={() => setIsAvailable(!isAvailable)}
          className={`w-full p-5 rounded-2xl border-2 transition-all font-black text-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
            isAvailable 
            ? "border-[#B5F573] bg-[#B5F573]/10 text-[#B5F573] shadow-[0_0_20px_rgba(181,245,115,0.15)]" 
            : "border-gray-700 bg-gray-900 text-gray-400"
          }`}
        >
          <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-[#B5F573] animate-pulse" : "bg-gray-500"}`}></div>
          {isAvailable ? "AVAILABLE" : "OFFLINE"}
        </button>

        {isAvailable && (
          <div className="bg-[#111] rounded-[24px] border border-gray-800 shadow-2xl overflow-hidden">
            
            <div className="bg-blue-600/10 border-b border-blue-900/50 p-4 flex justify-between items-center">
              <h2 className="text-blue-400 font-bold tracking-widest text-sm uppercase">Active Dispatch</h2>
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Urgent</span>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Reda H.</h3>
                  <p className="text-gray-400 font-medium flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    2.4 km away
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black border border-gray-800 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehicle</p>
                  <p className="font-bold text-lg leading-tight">Porsche<br/>Taycan 4S</p>
                </div>
                <div className="bg-black border border-gray-800 p-4 rounded-2xl flex flex-col justify-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Target</p>
                  <p className="font-bold text-3xl text-[#B5F573]">80%</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">[Automatic Routing]</h4>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=33.5731,-7.5898" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-800 active:scale-[0.98] transition-transform group"
                >
                  <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-4 cursor-pointer">
                    <div className="bg-[#B5F573] text-[#1C1C1E] px-6 py-2.5 rounded-full font-black text-sm shadow-[0_0_20px_rgba(181,245,115,0.4)] flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                      TAP TO NAVIGATE
                    </div>
                  </div>
                  <iframe
                    title="Map"
                    width="100%" height="100%" loading="lazy" allowFullScreen
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
                    src="https://maps.google.com/maps?q=Casablanca&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  ></iframe>
                </a>
              </div>

              {missionStage === 0 && (
                <button onClick={handleNextStage} className="w-full bg-blue-600 text-white font-black text-xl p-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  ACCEPT & NAVIGATE
                </button>
              )}
              
              {missionStage === 1 && (
                <button onClick={handleNextStage} className="w-full bg-yellow-500 text-black font-black text-xl p-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ARRIVED AT VEHICLE
                </button>
              )}

              {missionStage === 2 && (
                <button onClick={handleNextStage} className="w-full bg-orange-500 text-black font-black text-xl p-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                  START TRANSACTION (OCPP)
                </button>
              )}

              {missionStage === 3 && (
                <button onClick={handleNextStage} className="w-full bg-[#B5F573] text-[#1C1C1E] font-black text-xl p-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_20px_rgba(181,245,115,0.4)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  CHARGE COMPLETE
                </button>
              )}
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

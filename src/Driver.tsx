import React, { useState, useEffect } from 'react';

export default function Driver() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        // 1. Get the Record ID from the URL (?driver=rec...)
        const params = new URLSearchParams(window.location.search);
        const recordId = params.get('driver');

        if (!recordId || recordId === 'true') {
          setError("No dispatch ID found. Please use the link sent by the Command Center.");
          setLoading(false);
          return;
        }

        // 2. Pull keys from Vercel Environment Variables
        const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
        const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

        // 3. Fetch from Airtable
        const response = await fetch(
          `https://api.airtable.com/v0/${BASE_ID}/Orders/${recordId}`,
          {
            headers: { Authorization: `Bearer ${API_KEY}` }
          }
        );

        if (!response.ok) throw new Error("Dispatch not found in database.");

        const result = await response.json();
        
        // 4. Map the Airtable fields to our clean UI
        setData({
          client: result.fields["Name"],
          vehicle: result.fields["Vehicle"],
          plate: result.fields["Plate"] || "N/A",
          location: result.fields["Location"],
          mapLink: result.fields["Location"], // Assuming this is the Google Maps URL
          phone: result.fields["Phone"],
          energy: result.fields["Energy"]
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatch();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="w-12 h-12 border-4 border-[#B5F573] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Accessing Dispatch...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10 text-center">
      <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">⚠️</div>
      <h2 className="text-xl font-black mb-2">Access Denied</h2>
      <p className="text-gray-500 text-sm mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="text-blue-500 font-bold underline">Try Again</button>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen w-full font-sans text-gray-900 flex flex-col">
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex justify-center items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-black">
          FST <span className="text-[#84cc16]">serve</span>
        </h1>
      </header>

      <main className="flex-1 p-5 w-full max-w-md mx-auto flex flex-col pt-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 relative overflow-hidden flex-1 flex flex-col">
          
          <div className="flex justify-between items-start mb-6">
            <div className="bg-black text-[#B5F573] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              Active Dispatch
            </div>
          </div>

          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Target Vehicle</p>
          <h2 className="text-3xl font-black text-black leading-tight mb-1">{data.vehicle}</h2>
          <p className="text-lg font-bold text-gray-500 mb-6">{data.client}</p>
          
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-400 bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Location</p>
                <p className="font-black text-md text-gray-800 leading-tight">View Details in Maps</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 text-lime-600 bg-lime-50 p-3 rounded-full shadow-sm border border-lime-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Charge Required</p>
                <p className="font-black text-xl text-lime-600 leading-tight">{data.energy}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex gap-3">
              <a href={`tel:${data.phone}`} className="flex-1 bg-gray-100 text-gray-700 font-black py-4 rounded-2xl border border-gray-200 flex justify-center items-center gap-2 active:scale-95 transition-transform text-sm">
                 CALL
              </a>
              <a href={`https://wa.me/${data.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener" className="flex-1 bg-emerald-50 text-emerald-600 font-black py-4 rounded-2xl border border-emerald-100 flex justify-center items-center gap-2 active:scale-95 transition-transform text-sm">
                 WHATSAPP
              </a>
            </div>

            <a 
              href={data.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#B5F573] text-black font-black text-xl py-6 rounded-2xl shadow-[0_10px_20px_rgba(181,245,115,0.2)] active:scale-95 transition-transform flex justify-center items-center gap-3 border border-[#a3e362]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              OPEN IN MAPS
            </a>
          </div>
          
        </div>
      </main>
    </div>
  );
}

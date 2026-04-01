import React, { useState, useEffect } from 'react';

export default function Driver() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNextJob = async () => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

      // This query asks Airtable for 1 record that is "Pending", sorted by oldest first
      const filter = encodeURIComponent("AND({Status} = '🔴 Pending')");
      const url = `https://api.airtable.com/v0/${BASE_ID}/Orders?filterByFormula=${filter}&maxRecords=1&sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=asc`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });

      if (!response.ok) throw new Error("Could not connect to Command Center.");

      const result = await response.json();
      
      if (result.records.length === 0) {
        setData(null); // No jobs left!
      } else {
        const record = result.records[0];
        setData({
          id: record.id,
          client: record.fields["Name"],
          vehicle: record.fields["Vehicle"],
          plate: record.fields["Plate"] || "NO PLATE", // <-- The Plate you asked for
          location: record.fields["Location"],
          phone: record.fields["Phone"],
          energy: record.fields["Energy"]
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNextJob(); }, []);

  // Function to clear the job and get the next one
  const completeJob = async () => {
    if (!data) return;
    const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
    const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

    // Update Airtable to "Completed"
    await fetch(`https://api.airtable.com/v0/${BASE_ID}/Orders/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: { "Status": "✅ Completed" } })
    });

    fetchNextJob(); // Instantly load the next one!
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="w-12 h-12 border-4 border-[#B5F573] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen w-full font-sans text-gray-900 flex flex-col">
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex justify-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-black">FST <span className="text-[#84cc16]">serve</span></h1>
      </header>

      <main className="flex-1 p-5 w-full max-w-md mx-auto flex flex-col pt-8">
        {!data ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-20 opacity-40 text-center">
            <h2 className="text-2xl font-black mb-2">ALL CLEAR</h2>
            <p className="text-sm font-bold">No pending dispatches in Morocco.</p>
            <button onClick={fetchNextJob} className="mt-6 text-blue-600 font-bold underline">Refresh Feed</button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 relative overflow-hidden flex-1 flex flex-col">
            
            <div className="flex justify-between items-start mb-6">
              <div className="bg-black text-[#B5F573] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                Current Dispatch
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Plate</p>
                <p className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">{data.plate}</p>
              </div>
            </div>

            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Target Vehicle</p>
            <h2 className="text-3xl font-black text-black leading-tight mb-1">{data.vehicle}</h2>
            <p className="text-lg font-bold text-gray-500 mb-6">{data.client}</p>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-lime-600 bg-lime-50 p-3 rounded-full border border-lime-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Charge Required</p>
                  <p className="font-black text-xl text-lime-600 leading-tight">{data.energy}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <a href={data.location} target="_blank" className="w-full bg-[#B5F573] text-black font-black text-xl py-6 rounded-2xl flex justify-center items-center gap-3 border border-[#a3e362]">
                OPEN IN MAPS
              </a>
              
              <button 
                onClick={completeJob}
                className="w-full bg-black text-white font-black py-4 rounded-2xl active:scale-95 transition-transform"
              >
                JOB COMPLETED →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

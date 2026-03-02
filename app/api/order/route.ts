import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("Missing API Keys in Vercel!");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              // --- MATCHED EXACTLY TO YOUR SCREENSHOTS ---
              "Name": body.name,
              "Phone": body.phone,
              "Email": body.email,
              "Status": body.status || "🔴 Pending",
              "Date": body.date, 
              "Time": body.time_only, // Make sure you added this column!
              "Vehicle": body.vehicle,
              "Location": body.location,
              "Loc Notes": body.location_notes,
              "Energy": body.energy,
              "Price": body.price,
              "Notes": body.notes,
              "Reason": body.reason
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable's Exact Rejection Reason:", errorText);
      throw new Error('Failed to save to Airtable');
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Vault Error:", error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Receive the order from the public app
    const body = await request.json();

    // 2. 99.9% Security: Pull the secret keys from Vercel's encrypted memory
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("Missing API Keys in Vercel!");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 3. Send the expanded data securely to Airtable
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
              "Location": body.location,
              "Loc Notes": body.location_notes,
              "Vehicle": body.vehicle,
              "Energy": body.energy,
              "Price": body.price,
              "Time": body.time,
              "Notes": body.notes,
              "Reason": body.reason,
              "Status": "🔴 Pending"
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save to Airtable');
    }

    // 4. Tell the app it was a success!
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Vault Error:", error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

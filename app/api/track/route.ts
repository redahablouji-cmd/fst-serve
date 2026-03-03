import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Get the secret receipt ID the phone is asking about
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    // 2. Ask Airtable securely for this specific order
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      },
      // Airtable caches sometimes, this forces fresh data!
      cache: 'no-store' 
    });

    if (!response.ok) throw new Error('Failed to fetch from Vault');

    const data = await response.json();
    
    // 3. Send ONLY the Live Status back to the phone
    return NextResponse.json({ 
      status: data.fields.Status 
    });

  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}

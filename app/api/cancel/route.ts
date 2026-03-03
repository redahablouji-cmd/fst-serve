import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, reason } = body;

    if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    // Tells Airtable to change status and safely save the specific cancellation reason in the "Notes"
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Orders`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            id: id,
            fields: {
              Status: "⚫ Canceled",
              Notes: `CANCEL REASON: ${reason}` // Safely logs why they canceled!
            }
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Failed to cancel in Vault');

    return NextResponse.json({ success: true, status: "⚫ Canceled" });

  } catch (error) {
    console.error("Cancel Error:", error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}

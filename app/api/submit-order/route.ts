import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location_coordinates, vehicle, energy_requested, ...otherData } = body;

    // Security 1: Validation
    if (!location_coordinates || !vehicle || !energy_requested) {
      return NextResponse.json(
        { error: 'Missing critical fields' },
        { status: 400 }
      );
    }

    // Security 2: Environment Variables
    const webhookUrl = process.env.AIRTABLE_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Forward to Airtable
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_coordinates,
        vehicle,
        energy_requested,
        ...otherData
      }),
    });

    if (!response.ok) {
      throw new Error(`Airtable webhook failed: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting order:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}

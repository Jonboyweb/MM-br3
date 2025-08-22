import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'gbp', bookingData, paymentType } = body;

    // Validate required fields
    if (!amount || amount < 50) { // Minimum £0.50
      return NextResponse.json(
        { error: 'Amount must be at least £0.50' },
        { status: 400 }
      );
    }

    if (!bookingData || !bookingData.email) {
      return NextResponse.json(
        { error: 'Booking data with email is required' },
        { status: 400 }
      );
    }

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer (pence)
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingData.bookingId || 'pending',
        venueId: bookingData.venueId || 'backroom-leeds',
        customerEmail: bookingData.email,
        customerName: `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim(),
        customerPhone: bookingData.phone || '',
        partySize: bookingData.partySize?.toString() || '',
        bookingDate: bookingData.bookingDate || '',
        startTime: bookingData.startTime || '',
        endTime: bookingData.endTime || '',
        selectedTables: Array.isArray(bookingData.selectedTables) 
          ? bookingData.selectedTables.join(',') 
          : bookingData.selectedTables || '',
        paymentType: paymentType || 'deposit',
        specialRequests: bookingData.specialRequests || '',
      },
      description: `${paymentType === 'deposit' ? 'Deposit for' : 'Full payment for'} table booking at The Backroom Leeds`,
      receipt_email: bookingData.email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
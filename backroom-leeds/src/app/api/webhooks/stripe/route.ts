import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  const supabase = createClient();
  const metadata = paymentIntent.metadata;

  try {
    // First, create or update the booking
    const bookingData = {
      venue_id: await getVenueId(metadata.venueId || 'backroom-leeds'),
      customer_email: metadata.customerEmail,
      customer_name: metadata.customerName,
      customer_phone: metadata.customerPhone || null,
      party_size: parseInt(metadata.partySize || '2'),
      booking_date: metadata.bookingDate,
      start_time: metadata.startTime,
      end_time: metadata.endTime,
      status: 'confirmed',
      payment_status: metadata.paymentType === 'deposit' ? 'deposit_paid' : 'paid_in_full',
      special_requests: metadata.specialRequests || null,
      total_amount: paymentIntent.amount,
      deposit_amount: metadata.paymentType === 'deposit' ? paymentIntent.amount : null,
      stripe_payment_intent_id: paymentIntent.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select('id')
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw bookingError;
    }

    // Create table reservations if tables are specified
    const selectedTables = metadata.selectedTables?.split(',').filter(Boolean) || [];
    if (selectedTables.length > 0 && booking?.id) {
      const tableReservations = selectedTables.map(tableId => ({
        booking_id: booking.id,
        table_id: tableId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      }));

      const { error: reservationError } = await supabase
        .from('table_reservations')
        .insert(tableReservations);

      if (reservationError) {
        console.error('Error creating table reservations:', reservationError);
        throw reservationError;
      }
    }

    // Log the payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        payment_type: metadata.paymentType || 'deposit',
        payment_method: 'card',
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Error logging payment:', paymentError);
      throw paymentError;
    }

    // TODO: Send confirmation email here
    console.log('Booking confirmed with payment:', {
      bookingId: booking.id,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      customerEmail: metadata.customerEmail,
    });

  } catch (error) {
    console.error('Error processing successful payment:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  const supabase = createClient();
  const metadata = paymentIntent.metadata;

  try {
    // Find any existing booking and update status
    const { data: booking } = await supabase
      .from('bookings')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (booking) {
      // Update booking status to failed
      await supabase
        .from('bookings')
        .update({
          status: 'payment_failed',
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id);
    }

    // Log the failed payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking?.id || null,
        stripe_payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        payment_type: metadata.paymentType || 'deposit',
        payment_method: 'card',
        failure_reason: 'Payment processing failed',
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Error logging failed payment:', paymentError);
    }

  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment canceled:', paymentIntent.id);
  
  const supabase = createClient();
  
  try {
    // Find any existing booking and update status
    const { data: booking } = await supabase
      .from('bookings')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (booking) {
      // Update booking status to canceled
      await supabase
        .from('bookings')
        .update({
          status: 'canceled',
          payment_status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id);
    }

  } catch (error) {
    console.error('Error processing canceled payment:', error);
  }
}

async function getVenueId(venueSlug: string): Promise<string> {
  const supabase = createClient();
  
  const { data: venue, error } = await supabase
    .from('venues')
    .select('id')
    .eq('slug', venueSlug)
    .single();

  if (error || !venue) {
    throw new Error(`Venue not found: ${venueSlug}`);
  }

  return venue.id;
}
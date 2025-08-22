import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get venue information
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('slug', slug)
      .single();

    if (venueError || !venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      venue: {
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        description: venue.description,
        address: venue.address,
        phone: venue.phone,
        email: venue.email,
        capacity: {
          total: venue.capacity_total,
          main_bar: venue.capacity_main_bar,
          private_room: venue.capacity_private_room,
        },
        opening_hours: venue.opening_hours,
        is_active: venue.is_active,
      }
    });

  } catch (error) {
    console.error('Error fetching venue:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
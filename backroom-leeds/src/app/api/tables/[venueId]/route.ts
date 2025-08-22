import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ venueId: string }> }
) {
  try {
    const { venueId } = await params;
    const { searchParams } = new URL(request.url);
    
    const bookingDate = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    // Get all tables for the venue
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('venue_id', venueId)
      .eq('is_active', true)
      .order('display_order');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return NextResponse.json(
        { error: 'Failed to fetch tables' },
        { status: 500 }
      );
    }

    // If availability parameters are provided, check availability for each table
    let tablesWithAvailability = tables;
    
    if (bookingDate && startTime && endTime) {
      tablesWithAvailability = await Promise.all(
        tables.map(async (table) => {
          try {
            const { data: isAvailable, error: availabilityError } = await supabase
              .rpc('check_table_availability', {
                p_table_id: table.id,
                p_booking_date: bookingDate,
                p_start_time: startTime,
                p_end_time: endTime
              });

            if (availabilityError) {
              console.error('Availability check error for table', table.id, ':', availabilityError);
              return { ...table, is_available: false }; // Default to unavailable on error
            }

            return {
              ...table,
              is_available: isAvailable
            };
          } catch (error) {
            console.error('Error checking availability for table', table.id, ':', error);
            return { ...table, is_available: false };
          }
        })
      );
    }

    // Transform tables to match the component interface
    const formattedTables = tablesWithAvailability.map(table => ({
      id: table.id,
      number: table.table_number,
      displayName: table.display_name || `Table ${table.table_number}`,
      location: table.location,
      minCapacity: table.min_capacity,
      maxCapacity: table.max_capacity,
      preferredCapacity: table.preferred_capacity,
      isPremium: table.is_premium,
      isBooth: table.is_booth,
      minSpend: table.min_spend,
      depositRequired: table.deposit_required,
      amenities: table.amenities || [],
      description: table.description,
      isAvailable: table.is_available ?? true,
      position: {
        x: table.floor_position_x || 0,
        y: table.floor_position_y || 0
      }
    }));

    return NextResponse.json({
      success: true,
      tables: formattedTables,
      counts: {
        total: formattedTables.length,
        upstairs: formattedTables.filter(t => t.location === 'upstairs').length,
        downstairs: formattedTables.filter(t => t.location === 'downstairs').length,
        available: formattedTables.filter(t => t.isAvailable).length
      }
    });

  } catch (error) {
    console.error('Error in tables API:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('slug', 'backroom-leeds')
      .single()

    if (venueError) {
      throw venueError
    }

    // Test table query
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('venue_id', venue.id)
      .eq('is_active', true)
      .order('display_order')

    if (tablesError) {
      throw tablesError
    }

    // Test availability function
    const { data: availabilityTest, error: availabilityError } = await supabase
      .rpc('check_table_availability', {
        p_table_id: tables[0]?.id,
        p_booking_date: new Date().toISOString().split('T')[0],
        p_start_time: '23:00',
        p_end_time: '06:00'
      })

    if (availabilityError) {
      throw availabilityError
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        venue: {
          id: venue.id,
          name: venue.name,
          capacity: venue.capacity_total
        },
        tables: {
          count: tables.length,
          upstairs: tables.filter(t => t.location === 'upstairs').length,
          downstairs: tables.filter(t => t.location === 'downstairs').length
        },
        availability_test: {
          table_id: tables[0]?.id,
          is_available: availabilityTest
        }
      }
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message || 'Unknown error'
    }, {
      status: 500
    })
  }
}
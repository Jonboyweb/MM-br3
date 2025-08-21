import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Database = {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string
          name: string
          slug: string
          address: string
          city: string
          postcode: string
          phone: string | null
          email: string | null
          capacity_total: number
          capacity_main_bar: number | null
          capacity_private_room: number | null
          amenities: any
          opening_hours: any
          settings: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      tables: {
        Row: {
          id: string
          venue_id: string
          table_number: string
          display_name: string | null
          location: 'upstairs' | 'downstairs'
          min_capacity: number
          max_capacity: number
          preferred_capacity: number
          is_premium: boolean
          is_booth: boolean
          floor_position_x: number | null
          floor_position_y: number | null
          description: string | null
          amenities: any
          images: any
          min_spend: number
          deposit_required: number
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
      }
      bookings: {
        Row: {
          id: string
          venue_id: string
          customer_id: string | null
          booking_reference: string
          event_id: string | null
          customer_email: string
          customer_phone: string
          customer_name: string
          booking_date: string
          start_time: string
          end_time: string
          party_size: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          special_requests: string | null
          dietary_requirements: any
          occasion: string | null
          internal_notes: string | null
          confirmed_at: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
      }
      booking_tables: {
        Row: {
          id: string
          booking_id: string
          table_id: string
          is_primary: boolean
          created_at: string
        }
      }
      table_combinations: {
        Row: {
          id: string
          venue_id: string
          primary_table_id: string
          secondary_table_id: string
          combined_capacity: number
          is_active: boolean
          created_at: string
        }
      }
    }
    Functions: {
      check_table_availability: {
        Args: {
          p_table_id: string
          p_booking_date: string
          p_start_time: string
          p_end_time: string
          p_exclude_booking_id?: string
        }
        Returns: boolean
      }
      get_available_tables: {
        Args: {
          p_venue_id: string
          p_booking_date: string
          p_start_time: string
          p_end_time: string
          p_party_size: number
        }
        Returns: Array<{
          table_id: string
          table_number: string
          display_name: string
          location: 'upstairs' | 'downstairs'
          max_capacity: number
          is_premium: boolean
          min_spend: number
        }>
      }
      get_optimal_table_combinations: {
        Args: {
          p_venue_id: string
          p_booking_date: string
          p_start_time: string
          p_end_time: string
          p_party_size: number
          p_location?: 'upstairs' | 'downstairs'
        }
        Returns: Array<{
          combination_id: number
          table_ids: string[]
          table_names: string[]
          total_capacity: number
          total_min_spend: number
          total_deposit: number
          is_optimal: boolean
          combination_type: string
        }>
      }
      create_booking_atomic: {
        Args: {
          p_venue_id: string
          p_customer_email: string
          p_customer_phone: string
          p_customer_name: string
          p_table_ids: string[]
          p_booking_date: string
          p_start_time: string
          p_end_time: string
          p_party_size: number
          p_customer_id?: string
          p_special_requests?: string
          p_occasion?: string
          p_stripe_payment_intent_id?: string
        }
        Returns: {
          booking_id: string
          booking_reference: string
          total_deposit: number
          success: boolean
          error_message: string | null
        }[]
      }
    }
  }
}

// Helper function to get venue by slug
export async function getVenueBySlug(slug: string) {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
    
  if (error) throw error
  return data
}

// Helper function to get tables for a venue
export async function getVenueTables(venueId: string, location?: 'upstairs' | 'downstairs') {
  let query = supabase
    .from('tables')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_active', true)
    .order('display_order')
    
  if (location) {
    query = query.eq('location', location)
  }
    
  const { data, error } = await query
  if (error) throw error
  return data
}

// Helper function to check table availability
export async function checkTableAvailability(
  tableId: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
) {
  const { data, error } = await supabase.rpc('check_table_availability', {
    p_table_id: tableId,
    p_booking_date: bookingDate,
    p_start_time: startTime,
    p_end_time: endTime,
    p_exclude_booking_id: excludeBookingId
  })
  
  if (error) throw error
  return data
}

// Helper function to get available tables
export async function getAvailableTables(
  venueId: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
  partySize: number
) {
  const { data, error } = await supabase.rpc('get_available_tables', {
    p_venue_id: venueId,
    p_booking_date: bookingDate,
    p_start_time: startTime,
    p_end_time: endTime,
    p_party_size: partySize
  })
  
  if (error) throw error
  return data
}

// Helper function to get optimal table combinations
export async function getOptimalTableCombinations(
  venueId: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
  partySize: number,
  location?: 'upstairs' | 'downstairs'
) {
  const { data, error } = await supabase.rpc('get_optimal_table_combinations', {
    p_venue_id: venueId,
    p_booking_date: bookingDate,
    p_start_time: startTime,
    p_end_time: endTime,
    p_party_size: partySize,
    p_location: location
  })
  
  if (error) throw error
  return data
}

// Helper function to create booking atomically
export async function createBookingAtomic(params: {
  venueId: string
  customerEmail: string
  customerPhone: string
  customerName: string
  tableIds: string[]
  bookingDate: string
  startTime: string
  endTime: string
  partySize: number
  customerId?: string
  specialRequests?: string
  occasion?: string
  stripePaymentIntentId?: string
}) {
  const { data, error } = await supabase.rpc('create_booking_atomic', {
    p_venue_id: params.venueId,
    p_customer_email: params.customerEmail,
    p_customer_phone: params.customerPhone,
    p_customer_name: params.customerName,
    p_table_ids: params.tableIds,
    p_booking_date: params.bookingDate,
    p_start_time: params.startTime,
    p_end_time: params.endTime,
    p_party_size: params.partySize,
    p_customer_id: params.customerId,
    p_special_requests: params.specialRequests,
    p_occasion: params.occasion,
    p_stripe_payment_intent_id: params.stripePaymentIntentId
  })
  
  if (error) throw error
  return data?.[0] // Function returns array, we want the first result
}
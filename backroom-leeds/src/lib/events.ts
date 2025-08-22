import { supabase } from './supabase'
import { Event, RegularEvent, EventSchedule } from '@/types/events'

// Get all regular events from database
export async function getRegularEvents(): Promise<RegularEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'regular')
    .eq('is_active', true)
    .order('day_of_week')
    
  if (error) {
    console.error('Error fetching regular events:', error)
    throw error
  }
  
  return data as RegularEvent[]
}

// Get specific event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching event:', error)
    throw error
  }
  
  return data
}

// Get events for a specific venue
export async function getVenueEvents(venueId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_active', true)
    .order('day_of_week')
    
  if (error) {
    console.error('Error fetching venue events:', error)
    throw error
  }
  
  return data
}

// Calculate next event dates for regular events
export function calculateEventSchedule(events: RegularEvent[]): EventSchedule[] {
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
  
  return events.map(event => {
    const eventDayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      .indexOf(event.day_of_week!)
    
    // Calculate upcoming dates (next 4 weeks)
    const upcomingDates = []
    for (let week = 0; week < 4; week++) {
      let daysUntilEvent = eventDayIndex - currentDay + (week * 7)
      if (daysUntilEvent <= 0 && week === 0) {
        daysUntilEvent += 7 // Next week if already passed this week
      }
      
      const eventDate = new Date(today)
      eventDate.setDate(today.getDate() + daysUntilEvent)
      
      const isTonight = daysUntilEvent === 0
      const isThisWeek = daysUntilEvent > 0 && daysUntilEvent <= 7
      
      upcomingDates.push({
        date: eventDate.toISOString().split('T')[0],
        day_name: eventDate.toLocaleDateString('en-GB', { weekday: 'long' }),
        is_tonight: isTonight,
        is_this_week: isThisWeek,
        ticket_status: 'available' as const,
        expected_capacity: week === 0 ? 'high' as const : 'medium' as const
      })
    }
    
    return {
      event_id: event.id,
      event_name: event.name,
      event_slug: event.slug,
      upcoming_dates: upcomingDates
    }
  })
}

// Check if an event has table booking available for a specific date
export async function checkEventTableAvailability(
  eventId: string, 
  eventDate: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('events')
    .select('table_booking_available')
    .eq('id', eventId)
    .single()
    
  if (error || !data) {
    return false
  }
  
  return data.table_booking_available
}

// Real-time subscription for event updates
export function subscribeToEventUpdates(
  venueId: string,
  onEventUpdate: (payload: any) => void
) {
  const channel = supabase
    .channel(`events-${venueId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'events',
      filter: `venue_id=eq.${venueId}`
    }, onEventUpdate)
    .subscribe()
    
  return () => {
    supabase.removeChannel(channel)
  }
}

// Utility functions for event calculations
export function getNextEventDate(dayOfWeek: string): string {
  const today = new Date()
  const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    .indexOf(dayOfWeek.toLowerCase())
  const currentDay = today.getDay()
  
  let daysUntilEvent = targetDay - currentDay
  if (daysUntilEvent <= 0) {
    daysUntilEvent += 7 // Next week
  }
  
  const eventDate = new Date(today)
  eventDate.setDate(today.getDate() + daysUntilEvent)
  
  return eventDate.toISOString().split('T')[0]
}

export function isEventTonight(dayOfWeek: string): boolean {
  const today = new Date()
  const todayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()]
  return todayName === dayOfWeek.toLowerCase()
}

export function isEventThisWeek(dayOfWeek: string): boolean {
  const today = new Date()
  const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    .indexOf(dayOfWeek.toLowerCase())
  const currentDay = today.getDay()
  
  const daysUntilEvent = targetDay - currentDay
  return daysUntilEvent >= 0 && daysUntilEvent <= 7
}

// Format event times for display
export function formatEventTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatEventDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000-01-01T${startTime}`)
  let end = new Date(`2000-01-01T${endTime}`)
  
  // Handle overnight events
  if (end < start) {
    end = new Date(`2000-01-02T${endTime}`)
  }
  
  const durationMs = end.getTime() - start.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  
  return `${hours} hours`
}

// Integration with booking system
export function getEventBookingUrl(
  eventSlug: string, 
  eventDate: string, 
  partySize?: number
): string {
  const baseUrl = `/booking?event=${eventSlug}&date=${eventDate}`
  return partySize ? `${baseUrl}&party_size=${partySize}` : baseUrl
}

// Check if event allows table bookings
export function canBookTablesForEvent(event: Event): boolean {
  return event.table_booking_available && event.is_active
}

// Get event theme colors
export function getEventThemeColors(eventSlug: string) {
  const themes = {
    'la-fiesta': {
      primary: '#FF6B35',
      secondary: '#E91E63', 
      accent: '#FFC107'
    },
    'shhh': {
      primary: '#9C27B0',
      secondary: '#673AB7',
      accent: '#FFD700'
    },
    'nostalgia': {
      primary: '#FF5722',
      secondary: '#795548',
      accent: '#FFC107'
    }
  }
  
  return themes[eventSlug as keyof typeof themes] || themes['shhh']
}
// Event types and interfaces for The Backroom Leeds

export type EventType = 'regular' | 'private' | 'special'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type MusicGenre = 'Reggaeton' | 'Latin' | 'Commercial' | 'Hip-Hop' | 'R&B' | 'House' | '2000s' | '2010s' | 'Throwback' | 'Pop' | 'Disco'

export interface Event {
  id: string
  venue_id: string
  name: string
  slug: string
  event_type: EventType
  day_of_week: DayOfWeek | null
  event_date: string | null
  start_time: string
  end_time: string
  description: string | null
  music_genres: MusicGenre[]
  featured_djs: string[]
  ticket_price: number | null
  advance_ticket_price: number | null
  table_booking_available: boolean
  capacity_override: number | null
  images: string[]
  is_ticketed: boolean
  external_ticket_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RegularEvent extends Event {
  event_type: 'regular'
  day_of_week: DayOfWeek
  event_date: null
}

export interface SpecialEvent extends Event {
  event_type: 'special'
  day_of_week: null
  event_date: string
}

export interface DJ {
  name: string
  instagram_handle: string
  bio?: string
  specialties: MusicGenre[]
  image_url?: string
  is_resident: boolean
}

export interface EventDetails {
  event: RegularEvent
  djs: DJ[]
  next_date: string
  is_tonight: boolean
  is_this_week: boolean
  doors_open: string
  music_description: string
  atmosphere: string
  target_audience: string
  dress_code?: string
  special_features: string[]
}

// La Fiesta specific data
export interface LaFiestaEvent extends EventDetails {
  event: RegularEvent & { slug: 'la-fiesta' }
  floor_breakdown: {
    upstairs: {
      music: MusicGenre[]
      atmosphere: string
      capacity: number
    }
    downstairs: {
      music: MusicGenre[]
      atmosphere: string
      capacity: number
    }
  }
  alternative_name: 'Bella Gente'
}

// Shhh! specific data
export interface ShhhEvent extends EventDetails {
  event: RegularEvent & { slug: 'shhh' }
  legacy_info: {
    established: string
    reputation: string
    achievements: string[]
  }
  resident_djs: DJ[]
}

// Nostalgia specific data
export interface NostalgiaEvent extends EventDetails {
  event: RegularEvent & { slug: 'nostalgia' }
  music_eras: {
    primary: '2000s' | '2010s'
    secondary: MusicGenre[]
  }
  throwback_highlights: string[]
  earlier_finish: string // 5am vs 6am
}

// Event page props
export interface EventPageProps {
  eventSlug: string
  showBookingIntegration?: boolean
  showUpcomingDates?: boolean
}

// Event card props for listings
export interface EventCardProps {
  event: RegularEvent
  isTonight?: boolean
  isThisWeek?: boolean
  nextEventDate?: string
  onBookTable?: (eventId: string, date: string) => void
  compact?: boolean
}

// Event booking integration
export interface EventBookingProps {
  event: RegularEvent
  selectedDate: string
  partySize: number
  onDateChange: (date: string) => void
  onPartySizeChange: (size: number) => void
  onProceedToFloorPlan: () => void
}

// Event timeline for upcoming dates
export interface EventSchedule {
  event_id: string
  event_name: string
  event_slug: string
  upcoming_dates: Array<{
    date: string
    day_name: string
    is_tonight: boolean
    is_this_week: boolean
    special_notes?: string
    ticket_status: 'available' | 'limited' | 'sold_out'
    expected_capacity: 'low' | 'medium' | 'high' | 'sold_out'
  }>
}

// Music genre styling
export interface MusicGenreStyle {
  genre: MusicGenre
  color: string
  backgroundColor: string
  emoji: string
  description: string
}

// Event status for real-time updates
export interface EventStatus {
  event_id: string
  is_live: boolean
  current_capacity: number
  table_availability: {
    upstairs_available: number
    downstairs_available: number
    total_available: number
  }
  last_updated: string
}

// Social media integration
export interface EventSocialMedia {
  event_slug: string
  instagram_posts: Array<{
    id: string
    image_url: string
    caption: string
    post_date: string
  }>
  dj_social_links: Array<{
    dj_name: string
    instagram: string
    soundcloud?: string
    mixcloud?: string
  }>
}

// Event SEO and metadata
export interface EventSEO {
  title: string
  description: string
  keywords: string[]
  og_image: string
  schema_data: {
    '@type': 'Event'
    name: string
    description: string
    startDate: string
    endDate: string
    location: {
      '@type': 'Place'
      name: string
      address: string
    }
    performer: string[]
    organizer: string
  }
}
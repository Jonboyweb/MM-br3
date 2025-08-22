import { LaFiestaEvent, ShhhEvent, NostalgiaEvent, DJ, MusicGenreStyle } from '@/types/events'

// DJ roster for The Backroom Leeds regular events
export const RESIDENT_DJS: Record<string, DJ> = {
  djdyl: {
    name: 'DJ Dyl',
    instagram_handle: '@djdyl',
    bio: 'Resident DJ bringing the hottest Latin beats to La Fiesta',
    specialties: ['Reggaeton', 'Latin', 'Commercial'],
    is_resident: true
  },
  djdiogovaz: {
    name: 'DJ Diogo Vaz', 
    instagram_handle: '@djdiogovaz',
    bio: 'Latin music specialist and party starter',
    specialties: ['Reggaeton', 'Latin', 'Hip-Hop'],
    is_resident: true
  },
  djborris_paulo: {
    name: 'DJ Borris Paulo',
    instagram_handle: '@djborris_paulo', 
    bio: 'Bringing authentic Latin vibes to Leeds nightlife',
    specialties: ['Reggaeton', 'Latin'],
    is_resident: true
  },
  onlydjflex: {
    name: 'DJ Flex',
    instagram_handle: '@onlydjflex',
    bio: 'Mixing Latin classics with modern hits',
    specialties: ['Latin', 'Commercial', 'Hip-Hop'],
    is_resident: true
  },
  djcp01: {
    name: 'DJ CP',
    instagram_handle: '@djcp01',
    bio: 'Shhh! resident bringing the best R&B and commercial hits',
    specialties: ['R&B', 'Commercial', 'Hip-Hop'],
    is_resident: true
  },
  danhillsonline: {
    name: 'Dan Hills',
    instagram_handle: '@danhillsonline',
    bio: 'Master of R&B and party anthems',
    specialties: ['R&B', 'Commercial', 'House'],
    is_resident: true
  },
  djindyuk02: {
    name: 'DJ Indy',
    instagram_handle: '@djindyuk02',
    bio: 'Multi-night resident specializing in throwbacks and R&B',
    specialties: ['R&B', '2000s', '2010s', 'Throwback', 'Hip-Hop'],
    is_resident: true
  },
  vybzindahouse: {
    name: 'Vybz',
    instagram_handle: '@vybzindahouse',
    bio: 'Bringing the vybz to Shhh! with infectious energy',
    specialties: ['R&B', 'Hip-Hop', 'Commercial'],
    is_resident: true
  }
}

// Music genre styling for visual consistency
export const MUSIC_GENRE_STYLES: Record<string, MusicGenreStyle> = {
  Reggaeton: {
    genre: 'Reggaeton',
    color: '#FF6B35',
    backgroundColor: '#FFF4F0',
    emoji: '🎵',
    description: 'Latin urban music with infectious beats'
  },
  Latin: {
    genre: 'Latin',
    color: '#E91E63',
    backgroundColor: '#FCE4EC',
    emoji: '💃',
    description: 'Traditional and modern Latin rhythms'
  },
  Commercial: {
    genre: 'Commercial',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    emoji: '🎤',
    description: 'Chart-topping hits and crowd favorites'
  },
  'Hip-Hop': {
    genre: 'Hip-Hop',
    color: '#9C27B0',
    backgroundColor: '#F3E5F5',
    emoji: '🎧',
    description: 'Classic and contemporary hip-hop anthems'
  },
  'R&B': {
    genre: 'R&B',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    emoji: '🎶',
    description: 'Smooth R&B and soulful vocals'
  },
  House: {
    genre: 'House',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    emoji: '🏠',
    description: 'Electronic house beats and dance anthems'
  },
  '2000s': {
    genre: '2000s',
    color: '#FF5722',
    backgroundColor: '#FBE9E7',
    emoji: '📼',
    description: 'Nostalgic hits from the 2000s era'
  },
  '2010s': {
    genre: '2010s',
    color: '#795548',
    backgroundColor: '#EFEBE9',
    emoji: '💿',
    description: 'Classic tracks from the 2010s decade'
  },
  Throwback: {
    genre: 'Throwback',
    color: '#607D8B',
    backgroundColor: '#ECEFF1',
    emoji: '⏪',
    description: 'Timeless classics that never get old'
  },
  Pop: {
    genre: 'Pop',
    color: '#E91E63',
    backgroundColor: '#FCE4EC',
    emoji: '🌟',
    description: 'Popular hits across the decades'
  },
  Disco: {
    genre: 'Disco',
    color: '#FFD700',
    backgroundColor: '#FFFDE7',
    emoji: '🕺',
    description: 'Classic disco and funk grooves'
  }
}

// La Fiesta (Friday) event data
export const LA_FIESTA_EVENT: LaFiestaEvent = {
  event: {
    id: '', // Will be populated from database
    venue_id: '',
    name: 'La Fiesta',
    slug: 'la-fiesta',
    event_type: 'regular',
    day_of_week: 'friday',
    event_date: null,
    start_time: '23:00',
    end_time: '06:00',
    description: 'Leeds hottest Latin party! Reggaeton, Latin trap, and commercial hits all night long.',
    music_genres: ['Reggaeton', 'Latin', 'Commercial', 'Hip-Hop'],
    featured_djs: ['@djdyl', '@djdiogovaz', '@djborris_paulo', '@onlydjflex'],
    ticket_price: null,
    advance_ticket_price: null,
    table_booking_available: true,
    capacity_override: null,
    images: ['/event-artwork/bella-gente-friday-event-art.jpeg'],
    is_ticketed: false,
    external_ticket_url: null,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  djs: [
    RESIDENT_DJS.djdyl,
    RESIDENT_DJS.djdiogovaz,
    RESIDENT_DJS.djborris_paulo,
    RESIDENT_DJS.onlydjflex
  ],
  next_date: '',
  is_tonight: false,
  is_this_week: false,
  doors_open: '11:00 PM',
  music_description: 'Two floors of Latin heat - R&B/Hip Hop upstairs, Reggaeton/Latin downstairs',
  atmosphere: 'High-energy Latin party with infectious rhythms and party vibes',
  target_audience: 'Latin music lovers, dancers, party enthusiasts',
  dress_code: 'Smart casual - no sportswear',
  special_features: ['Two floor music split', 'Latin dancers', 'Themed cocktails', 'VIP bottle service'],
  floor_breakdown: {
    upstairs: {
      music: ['R&B', 'Hip-Hop', 'Commercial'],
      atmosphere: 'Main party floor with premium tables and dance area',
      capacity: 350
    },
    downstairs: {
      music: ['Reggaeton', 'Latin'],
      atmosphere: 'Intimate Latin lounge with specialized Latin music',
      capacity: 150
    }
  },
  alternative_name: 'Bella Gente'
}

// Shhh! (Saturday) event data  
export const SHHH_EVENT: ShhhEvent = {
  event: {
    id: '',
    venue_id: '',
    name: 'Shhh!',
    slug: 'shhh',
    event_type: 'regular',
    day_of_week: 'saturday',
    event_date: null,
    start_time: '23:00',
    end_time: '06:00',
    description: 'The ultimate Saturday night experience. Commercial, R&B, and party anthems.',
    music_genres: ['Commercial', 'R&B', 'Hip-Hop', 'House'],
    featured_djs: ['@djcp01', '@danhillsonline', '@djindyuk02', '@vybzindahouse'],
    ticket_price: null,
    advance_ticket_price: null,
    table_booking_available: true,
    capacity_override: null,
    images: ['/event-artwork/shhh-saturday-event-art.jpg'],
    is_ticketed: false,
    external_ticket_url: null,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  djs: [
    RESIDENT_DJS.djcp01,
    RESIDENT_DJS.danhillsonline,
    RESIDENT_DJS.djindyuk02,
    RESIDENT_DJS.vybzindahouse
  ],
  next_date: '',
  is_tonight: false,
  is_this_week: false,
  doors_open: '11:00 PM',
  music_description: "Leeds' longest running weekly R&B party with commercial hits and party anthems",
  atmosphere: 'Premium Saturday night experience with top-tier DJs and party atmosphere',
  target_audience: 'R&B enthusiasts, party-goers, weekend celebrants',
  dress_code: 'Smart casual to smart - dress to impress',
  special_features: ['Longest running R&B night', 'Resident DJ lineup', 'Premium atmosphere', 'Late license until 6am'],
  legacy_info: {
    established: '2010s',
    reputation: "Leeds' longest running weekly R&B party",
    achievements: [
      'Most consistent Saturday night in Leeds',
      'Established loyal customer base',
      'Premier R&B destination',
      'Award-winning DJ lineup'
    ]
  },
  resident_djs: [
    RESIDENT_DJS.djcp01,
    RESIDENT_DJS.danhillsonline,
    RESIDENT_DJS.djindyuk02,
    RESIDENT_DJS.vybzindahouse
  ]
}

// Nostalgia (Sunday) event data
export const NOSTALGIA_EVENT: NostalgiaEvent = {
  event: {
    id: '',
    venue_id: '',
    name: 'Nostalgia',
    slug: 'nostalgia',
    event_type: 'regular',
    day_of_week: 'sunday',
    event_date: null,
    start_time: '23:00',
    end_time: '06:00', // Note: Database shows 06:00 but description mentions 5am
    description: 'Throwback Sunday! All your favorite 2000s and 2010s hits.',
    music_genres: ['2000s', '2010s', 'Throwback', 'Pop', 'R&B'],
    featured_djs: ['@djindyuk02'],
    ticket_price: null,
    advance_ticket_price: null,
    table_booking_available: true,
    capacity_override: null,
    images: ['/event-artwork/nostalgia-sunday-event-art.jpg'],
    is_ticketed: false,
    external_ticket_url: null,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  djs: [
    RESIDENT_DJS.djindyuk02
  ],
  next_date: '',
  is_tonight: false,
  is_this_week: false,
  doors_open: '11:00 PM',
  music_description: 'The best throwback hits from 2000s and 2010s with classic R&B and pop anthems',
  atmosphere: 'Nostalgic party atmosphere perfect for singing along to your favorite classics',
  target_audience: 'Nostalgia lovers, millennials, anyone who loves classic hits',
  dress_code: 'Relaxed smart casual - comfortable for dancing',
  special_features: ['Sunday session vibes', 'Sing-along classics', 'Relaxed atmosphere', 'Extended set times'],
  music_eras: {
    primary: '2000s',
    secondary: ['2010s', 'Throwback', 'Pop', 'R&B']
  },
  throwback_highlights: [
    'Classic R&B anthems',
    '2000s pop favorites', 
    '2010s dance hits',
    'Throwback hip-hop',
    'Sing-along classics'
  ],
  earlier_finish: '5:00 AM' // Earlier than weekend nights
}

// All regular events array
export const REGULAR_EVENTS = [LA_FIESTA_EVENT, SHHH_EVENT, NOSTALGIA_EVENT]

// Event artwork mapping
export const EVENT_ARTWORK = {
  'la-fiesta': '/venue-specific-information/event-artwork/bella-gente-friday-event-art.jpeg',
  'shhh': '/venue-specific-information/event-artwork/shhh-saturday-event-art.jpg',
  'nostalgia': '/venue-specific-information/event-artwork/nostalgia-sunday-event-art.jpg'
} as const

// Event color schemes for branding
export const EVENT_THEMES = {
  'la-fiesta': {
    primary: '#FF6B35', // Orange-red for Latin energy
    secondary: '#E91E63', // Pink for vibrant atmosphere
    accent: '#FFC107', // Gold for premium feel
    background: 'linear-gradient(135deg, #FF6B35 0%, #E91E63 100%)'
  },
  'shhh': {
    primary: '#9C27B0', // Purple for sophisticated R&B
    secondary: '#673AB7', // Deep purple for premium feel
    accent: '#FFD700', // Gold for luxury
    background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
  },
  'nostalgia': {
    primary: '#FF5722', // Retro orange
    secondary: '#795548', // Brown for vintage feel
    accent: '#FFC107', // Gold for nostalgia
    background: 'linear-gradient(135deg, #FF5722 0%, #795548 100%)'
  }
} as const

// Event schedule helpers
export function getNextEventDate(dayOfWeek: string): string {
  const today = new Date()
  const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayOfWeek.toLowerCase())
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
  const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayOfWeek.toLowerCase())
  const currentDay = today.getDay()
  
  const daysUntilEvent = targetDay - currentDay
  return daysUntilEvent >= 0 && daysUntilEvent <= 7
}

// Event timing helpers
export function formatEventTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function getEventDuration(startTime: string, endTime: string): string {
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

// Event-specific booking integration
export function getEventBookingConfig(eventSlug: string) {
  const baseConfig = {
    allowTableBooking: true,
    recommendedTables: ['premium', 'dance_floor'],
    minimumPartySize: 2,
    maximumPartySize: 25
  }
  
  switch (eventSlug) {
    case 'la-fiesta':
      return {
        ...baseConfig,
        recommendedLocation: 'downstairs' as const, // Latin music focus
        specialOffers: ['Latin cocktail packages', 'Reggaeton bottle service'],
        peakTimes: ['00:00', '01:00', '02:00'],
        musicHighlights: ['Latin hour', 'Reggaeton sets', 'Commercial breaks']
      }
      
    case 'shhh':
      return {
        ...baseConfig,
        recommendedLocation: 'upstairs' as const, // Main party floor
        specialOffers: ['R&B bottle packages', 'Premium table service'],
        peakTimes: ['00:30', '01:30', '02:30'],
        musicHighlights: ['R&B classics', 'Commercial hits', 'Party anthems']
      }
      
    case 'nostalgia':
      return {
        ...baseConfig,
        recommendedLocation: null, // Both floors good
        specialOffers: ['Throwback cocktail menu', 'Sunday session packages'],
        peakTimes: ['00:00', '01:00'], // Earlier peak for Sunday
        musicHighlights: ['2000s classics', '2010s favorites', 'Sing-along moments'],
        earlierFinish: true
      }
      
    default:
      return baseConfig
  }
}

// Social media and promotional content
export const EVENT_SOCIAL_CONTENT = {
  'la-fiesta': {
    hashtags: ['#LaFiesta', '#BellaGente', '#LatinNight', '#BackroomLeeds', '#Reggaeton'],
    tagline: 'Where Latin meets Leeds',
    promotional_text: 'Get ready for the hottest Latin party in Leeds!',
    call_to_action: 'Book your table for the ultimate Latin experience'
  },
  'shhh': {
    hashtags: ['#Shhh', '#RnBNight', '#BackroomLeeds', '#SaturdayNight', '#LeedsNightlife'],
    tagline: "Leeds' longest running R&B party", 
    promotional_text: 'The ultimate Saturday night R&B experience',
    call_to_action: 'Secure your spot at the legendary Shhh!'
  },
  'nostalgia': {
    hashtags: ['#Nostalgia', '#Throwback', '#BackroomLeeds', '#SundaySession', '#2000s'],
    tagline: 'Sunday sessions done right',
    promotional_text: 'Relive the best music from the 2000s and 2010s',
    call_to_action: 'Book your table for the ultimate throwback experience'
  }
} as const
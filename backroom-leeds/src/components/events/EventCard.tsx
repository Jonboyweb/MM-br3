'use client'

import { motion } from 'framer-motion'
import { EventCardProps } from '@/types/events'
import { MUSIC_GENRE_STYLES, EVENT_THEMES, getNextEventDate, isEventTonight, isEventThisWeek } from '@/data/events'
import { Calendar, Clock, Users, Music, MapPin, ArrowRight, Star } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

export function EventCard({ 
  event, 
  isTonight, 
  isThisWeek, 
  nextEventDate,
  onBookTable,
  compact = false 
}: EventCardProps) {
  // Calculate event timing
  const eventDate = nextEventDate || getNextEventDate(event.day_of_week!)
  const eventIsTonight = isTonight ?? isEventTonight(event.day_of_week!)
  const eventIsThisWeek = isThisWeek ?? isEventThisWeek(event.day_of_week!)
  
  // Get event theme colors
  const theme = EVENT_THEMES[event.slug as keyof typeof EVENT_THEMES]
  
  // Format times
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get event artwork
  const getEventImage = () => {
    if (event.images && event.images.length > 0) {
      return event.images[0]
    }
    return `/venue-specific-information/event-artwork/${event.slug}-event-art.jpg`
  }

  // Handle book table action
  const handleBookTable = () => {
    if (onBookTable) {
      onBookTable(event.id, eventDate)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden border border-amber-200 ${
        compact ? 'max-w-sm' : 'max-w-lg'
      }`}
    >
      {/* Event image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-90"
          style={{ background: theme.background }}
        />
        
        {/* Status badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {eventIsTonight && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              TONIGHT
            </span>
          )}
          {eventIsThisWeek && !eventIsTonight && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              THIS WEEK
            </span>
          )}
          {event.day_of_week === 'saturday' && (
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              PREMIER
            </span>
          )}
        </div>

        {/* Event title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
          <h3 className="text-3xl font-bold text-white mb-2">
            {event.name}
          </h3>
          <p className="text-white/90 text-sm">
            {event.description}
          </p>
        </div>
      </div>

      {/* Event details */}
      <div className="p-6">
        {/* Date and time info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium capitalize">
                {event.day_of_week}s
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          </div>
          
          {/* Next event date */}
          <div className="text-right">
            <div className="text-sm text-gray-500">Next event</div>
            <div className="font-bold text-gray-900">
              {format(new Date(eventDate), 'MMM d')}
            </div>
          </div>
        </div>

        {/* Music genres */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Music</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.music_genres.slice(0, compact ? 3 : 5).map((genre) => {
              const style = MUSIC_GENRE_STYLES[genre]
              return (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    color: style.color,
                    backgroundColor: style.backgroundColor
                  }}
                >
                  {style.emoji} {genre}
                </span>
              )
            })}
            {event.music_genres.length > (compact ? 3 : 5) && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                +{event.music_genres.length - (compact ? 3 : 5)} more
              </span>
            )}
          </div>
        </div>

        {/* Featured DJs */}
        {!compact && event.featured_djs && event.featured_djs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Featured DJs</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.featured_djs.map((dj, index) => (
                <span
                  key={index}
                  className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {dj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Table booking availability */}
        {event.table_booking_available && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Table Booking Available</span>
            </div>
            <p className="text-xs text-green-600">
              Reserve your table for the best experience with priority entry and table service
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-colors flex items-center justify-center gap-2"
          >
            Event Details
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {event.table_booking_available && (
            <button
              onClick={handleBookTable}
              className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Book Table
            </button>
          )}
        </div>

        {/* Special event info */}
        {event.slug === 'shhh' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-purple-600 font-medium">
              🏆 Leeds' longest running weekly R&B party
            </div>
          </div>
        )}
        
        {event.slug === 'la-fiesta' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-orange-600 font-medium">
              🌶️ Two floors: R&B upstairs, Latin downstairs
            </div>
          </div>
        )}
        
        {event.slug === 'nostalgia' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-orange-600 font-medium">
              📻 Sunday sessions with all your favorite throwbacks
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { EventCardProps } from '@/types/events'
import { MUSIC_GENRE_STYLES, EVENT_THEMES, getNextEventDate, isEventTonight, isEventThisWeek } from '@/data/events'
import { Calendar, Clock, Users, Music, MapPin, ArrowRight, Star, ExternalLink, Share2, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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

  // Handle social sharing
  const handleShare = async () => {
    const shareData = {
      title: `${event.name} at The Backroom Leeds`,
      text: `Join us for ${event.name} - ${event.description}`,
      url: `${window.location.origin}/events/${event.slug}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareData.url);
    }
  };

  // Handle ticket purchasing (Fatsoma integration placeholder)
  const handleTicketPurchase = () => {
    // This will integrate with Fatsoma API
    window.open(`https://www.fatsoma.com/events/${event.slug}`, '_blank');
  };

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'group relative bg-secondary rounded-xl shadow-elevated overflow-hidden border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300',
        compact ? 'max-w-sm' : 'max-w-lg'
      )}
    >
      {/* Event image */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-80"
          style={{ background: theme.background }}
        />
        <div className="absolute inset-0 noise-overlay"></div>
        
        {/* Status badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {eventIsTonight && (
            <motion.span 
              className="bg-danger text-white px-3 py-1 rounded-full text-sm font-headline tracking-wide animate-pulse glow-burgundy"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              TONIGHT!
            </motion.span>
          )}
          {eventIsThisWeek && !eventIsTonight && (
            <span className="bg-info text-white px-3 py-1 rounded-full text-sm font-headline tracking-wide">
              THIS WEEK
            </span>
          )}
          {event.day_of_week === 'saturday' && (
            <span className="bg-prohibition-burgundy text-white px-3 py-1 rounded-full text-sm font-headline tracking-wide flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              PREMIER
            </span>
          )}
        </div>

        {/* Social sharing button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-speakeasy-black/50 hover:bg-deco-gold border border-deco-gold/30 hover:border-deco-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <Share2 className="w-4 h-4 text-white hover:text-speakeasy-black" />
          </button>
        </div>

        {/* Event title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-speakeasy-black via-speakeasy-black/80 to-transparent p-6">
          <h3 className="text-3xl md:text-4xl font-headline text-white mb-2 tracking-wide">
            {event.name.toUpperCase()}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Art Deco corner decorations */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-deco-gold/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-deco-gold/20 to-transparent"></div>
      </div>

      {/* Event details */}
      <div className="p-6 space-y-6">
        {/* Date and time info */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-deco-gold">
              <Calendar className="w-5 h-5" />
              <span className="font-headline text-lg capitalize tracking-wide">
                {event.day_of_week}s
              </span>
            </div>
            <div className="flex items-center gap-2 text-content-secondary">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          </div>
          
          {/* Next event date */}
          <div className="text-right bg-deco-gold/10 rounded-lg p-3 border border-deco-gold/20">
            <div className="text-sm text-content-tertiary">Next event</div>
            <div className="font-headline text-xl text-deco-gold">
              {format(new Date(eventDate), 'MMM d')}
            </div>
          </div>
        </div>

        {/* Music genres */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-deco-gold" />
            <span className="font-headline text-lg text-deco-gold tracking-wide">MUSIC</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.music_genres.slice(0, compact ? 3 : 5).map((genre) => {
              const style = MUSIC_GENRE_STYLES[genre]
              return (
                <motion.span
                  key={genre}
                  className="px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105"
                  style={{
                    color: style.color,
                    backgroundColor: style.backgroundColor,
                    borderColor: style.color + '40'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {style.emoji} {genre}
                </motion.span>
              )
            })}
            {event.music_genres.length > (compact ? 3 : 5) && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-speakeasy-smoke border border-speakeasy-ash text-content-tertiary">
                +{event.music_genres.length - (compact ? 3 : 5)} more
              </span>
            )}
          </div>
        </div>

        {/* Featured DJs */}
        {!compact && event.featured_djs && event.featured_djs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-deco-gold" />
              <span className="font-headline text-lg text-deco-gold tracking-wide">RESIDENT DJs</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {event.featured_djs.slice(0, 4).map((dj, index) => (
                <motion.div
                  key={index}
                  className="bg-speakeasy-smoke border border-deco-gold/20 rounded-lg p-3 hover:border-deco-gold/50 transition-all duration-200 group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-deco-gold rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-speakeasy-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-content-primary truncate">
                        {dj}
                      </p>
                      <p className="text-xs text-content-tertiary">
                        Resident DJ
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-deco-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Table booking availability */}
        {event.table_booking_available && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-headline text-sm tracking-wide">TABLE BOOKING AVAILABLE</span>
            </div>
            <p className="text-sm text-content-secondary">
              Reserve your table for the ultimate experience with priority entry, bottle service, and VIP treatment
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href={`/events/${event.slug}`}>
            <Button variant="primary" size="md" fullWidth className="font-headline">
              EVENT DETAILS
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="md" 
            fullWidth 
            onClick={handleTicketPurchase}
            className="font-headline"
          >
            <Ticket className="w-4 h-4 mr-2" />
            TICKETS
          </Button>
          
          {event.table_booking_available && (
            <Button
              variant="gold"
              size="md"
              fullWidth
              onClick={handleBookTable}
              className="font-headline"
            >
              <MapPin className="w-4 h-4 mr-2" />
              BOOK TABLE
            </Button>
          )}
        </div>

        {/* Special event info */}
        <div className="pt-4 border-t border-deco-gold/20">
          {event.slug === 'shhh' && (
            <div className="bg-prohibition-burgundy/10 rounded-lg p-3 border border-prohibition-burgundy/20">
              <div className="flex items-center gap-2 text-prohibition-burgundy font-headline text-sm tracking-wide">
                <Star className="w-4 h-4" />
                LEEDS&apos; LONGEST RUNNING WEEKLY R&B PARTY
              </div>
            </div>
          )}
          
          {event.slug === 'la-fiesta' && (
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-500 font-headline text-sm tracking-wide">
                <span className="text-lg">🌶️</span>
                TWO FLOORS: R&B UPSTAIRS, LATIN DOWNSTAIRS
              </div>
            </div>
          )}
          
          {event.slug === 'nostalgia' && (
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-600 font-headline text-sm tracking-wide">
                <span className="text-lg">📻</span>
                SUNDAY SESSIONS WITH ALL YOUR FAVORITE THROWBACKS
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
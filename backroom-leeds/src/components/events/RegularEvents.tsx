'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Music, MapPin, Star, Crown, Radio, Flame } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { format, addDays, nextFriday, nextSaturday, nextSunday } from 'date-fns';
import { cn } from '@/lib/utils';

interface RegularEvent {
  id: string;
  name: string;
  slug: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  description: string;
  tagline: string;
  musicGenres: string[];
  djs: string[];
  icon: string;
  theme: {
    primary: string;
    secondary: string;
    gradient: string;
    background: string;
  };
  features: string[];
  isPopular?: boolean;
}

const regularEvents: RegularEvent[] = [
  {
    id: 'la-fiesta',
    name: 'La Fiesta',
    slug: 'la-fiesta',
    dayOfWeek: 'Friday',
    startTime: '23:00',
    endTime: '06:00',
    description: 'Two floors of pure Latin energy with the hottest reggaeton, Latin hits, and commercial bangers',
    tagline: 'The Ultimate Latin Night Experience',
    musicGenres: ['Latin', 'Reggaeton', 'Commercial', 'Hip Hop'],
    djs: ['DJ Carlos', 'DJ Maria', 'MC Fuego'],
    icon: '🌶️',
    theme: {
      primary: '#EA580C',
      secondary: '#DC2626', 
      gradient: 'from-orange-600 to-red-600',
      background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)'
    },
    features: ['Two Dance Floors', 'Latin & Reggaeton', 'Commercial Hits', 'Live MC'],
    isPopular: true
  },
  {
    id: 'shhh',
    name: 'Shhh!',
    slug: 'shhh',
    dayOfWeek: 'Saturday',
    startTime: '23:00',
    endTime: '06:00',
    description: 'Leeds\' legendary R&B and commercial night - the longest running weekly R&B party in the city',
    tagline: 'Leeds\' Premier R&B Experience',
    musicGenres: ['R&B', 'Commercial', 'Hip Hop', 'Afrobeat'],
    djs: ['DJ Soul', 'DJ Rhythm', 'DJ Smooth'],
    icon: '👑',
    theme: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      gradient: 'from-purple-600 to-pink-600',
      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'
    },
    features: ['Premier R&B', 'Commercial Hits', 'VIP Experience', 'Legacy Brand'],
    isPopular: true
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    slug: 'nostalgia',
    dayOfWeek: 'Sunday',
    startTime: '23:00',
    endTime: '05:00',
    description: 'Sunday sessions featuring the best throwbacks from 2000s and 2010s that feel like home',
    tagline: 'Sunday Sessions That Feel Like Home',
    musicGenres: ['2000s', '2010s', 'Throwbacks', 'Pop Classics'],
    djs: ['DJ Retro', 'DJ Memories'],
    icon: '📻',
    theme: {
      primary: '#D97706',
      secondary: '#F59E0B',
      gradient: 'from-amber-600 to-yellow-500',
      background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)'
    },
    features: ['2000s Classics', '2010s Hits', 'Nostalgic Vibes', 'Sunday Sessions']
  }
];

interface RegularEventsProps {
  layout?: 'grid' | 'list' | 'carousel';
  showAll?: boolean;
  onBookTable?: (eventId: string, date: Date) => void;
  onTicketPurchase?: (eventSlug: string) => void;
  className?: string;
}

export function RegularEvents({ 
  layout = 'grid',
  showAll = true,
  onBookTable,
  onTicketPurchase,
  className 
}: RegularEventsProps) {
  
  const getNextEventDate = (dayOfWeek: string) => {
    const today = new Date();
    switch (dayOfWeek.toLowerCase()) {
      case 'friday':
        return nextFriday(today);
      case 'saturday':
        return nextSaturday(today);
      case 'sunday':
        return nextSunday(today);
      default:
        return addDays(today, 7);
    }
  };

  const isEventTonight = (dayOfWeek: string) => {
    const today = new Date();
    return format(today, 'EEEE').toLowerCase() === dayOfWeek.toLowerCase();
  };

  const handleBookTable = (eventId: string) => {
    if (onBookTable) {
      const event = regularEvents.find(e => e.id === eventId);
      if (event) {
        onBookTable(eventId, getNextEventDate(event.dayOfWeek));
      }
    }
  };

  const handleTicketPurchase = (eventSlug: string) => {
    if (onTicketPurchase) {
      onTicketPurchase(eventSlug);
    } else {
      // Default Fatsoma integration
      window.open(`https://www.fatsoma.com/events/${eventSlug}`, '_blank');
    }
  };

  const displayEvents = showAll ? regularEvents : regularEvents.slice(0, 3);

  if (layout === 'list') {
    return (
      <div className={cn('space-y-6', className)}>
        {displayEvents.map((event, index) => {
          const nextDate = getNextEventDate(event.dayOfWeek);
          const isTonight = isEventTonight(event.dayOfWeek);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary rounded-xl p-6 border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Icon & Branding */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-bold text-white shadow-elevated"
                    style={{ background: event.theme.background }}
                  >
                    {event.icon}
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-headline text-deco-gold tracking-wide">
                        {event.name.toUpperCase()}
                      </h3>
                      {isTonight && (
                        <span className="bg-danger text-white px-2 py-1 rounded-full text-xs font-headline animate-pulse">
                          TONIGHT!
                        </span>
                      )}
                      {event.isPopular && (
                        <Star className="w-5 h-5 text-deco-gold fill-current" />
                      )}
                    </div>
                    <p className="text-content-secondary text-sm italic">
                      {event.tagline}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-content-secondary">
                      <Calendar className="w-4 h-4 text-deco-gold" />
                      <span>{event.dayOfWeek}s • {format(nextDate, 'MMM d')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-content-secondary">
                      <Clock className="w-4 h-4 text-deco-gold" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-content-secondary">
                      <Music className="w-4 h-4 text-deco-gold" />
                      <span>{event.musicGenres.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs bg-deco-gold/10 text-deco-gold border border-deco-gold/20 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex-shrink-0 flex flex-col gap-3 md:w-48">
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="primary" size="md" fullWidth className="font-headline">
                      VIEW EVENT
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="md" 
                    fullWidth
                    onClick={() => handleTicketPurchase(event.slug)}
                    className="font-headline"
                  >
                    GET TICKETS
                  </Button>
                  <Button
                    variant="gold"
                    size="md"
                    fullWidth
                    onClick={() => handleBookTable(event.id)}
                    className="font-headline"
                  >
                    BOOK TABLE
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn(
      layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
        : 'flex overflow-x-auto space-x-6 pb-4',
      className
    )}>
      {displayEvents.map((event, index) => {
        const nextDate = getNextEventDate(event.dayOfWeek);
        const isTonight = isEventTonight(event.dayOfWeek);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={cn(
              'group relative bg-secondary rounded-xl overflow-hidden border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300 hover:shadow-glow-gold',
              layout === 'carousel' && 'flex-shrink-0 w-80'
            )}
          >
            {/* Event Header */}
            <div 
              className="relative p-8 text-white"
              style={{ background: event.theme.background }}
            >
              <div className="absolute inset-0 noise-overlay opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{event.icon}</div>
                  {isTonight && (
                    <motion.span 
                      className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-headline tracking-wide animate-pulse"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      TONIGHT!
                    </motion.span>
                  )}
                </div>
                
                <h3 className="text-3xl font-headline tracking-wider mb-2">
                  {event.name.toUpperCase()}
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  {event.tagline}
                </p>
                
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.dayOfWeek}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6 space-y-6">
              {/* Music Genres */}
              <div>
                <h4 className="flex items-center gap-2 text-deco-gold font-headline text-sm tracking-wide mb-3">
                  <Music className="w-4 h-4" />
                  MUSIC GENRES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.musicGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 text-xs bg-deco-gold/10 text-deco-gold border border-deco-gold/20 rounded-full font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured DJs */}
              <div>
                <h4 className="flex items-center gap-2 text-deco-gold font-headline text-sm tracking-wide mb-3">
                  <Users className="w-4 h-4" />
                  RESIDENT DJs
                </h4>
                <div className="space-y-2">
                  {event.djs.map((dj) => (
                    <div 
                      key={dj}
                      className="flex items-center gap-3 p-2 bg-speakeasy-smoke rounded-lg border border-speakeasy-ash hover:border-deco-gold/30 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-deco-gold rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-speakeasy-black" />
                      </div>
                      <span className="font-medium text-content-primary group-hover:text-deco-gold transition-colors">
                        {dj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Event */}
              <div className="bg-deco-gold/5 rounded-lg p-4 border border-deco-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline text-deco-gold text-sm tracking-wide">NEXT EVENT</h4>
                    <p className="text-content-secondary text-lg font-medium">
                      {format(nextDate, 'EEEE, MMMM do')}
                    </p>
                  </div>
                  <div className="text-right text-sm text-content-tertiary">
                    <p>{format(nextDate, 'h:mm a')}</p>
                    <p>Entry from {event.startTime}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/events/${event.slug}`}>
                  <Button variant="primary" size="md" fullWidth className="font-headline">
                    DETAILS
                  </Button>
                </Link>
                <Button
                  variant="gold"
                  size="md"
                  fullWidth
                  onClick={() => handleBookTable(event.id)}
                  className="font-headline"
                >
                  BOOK TABLE
                </Button>
              </div>
            </div>

            {/* Special indicators */}
            {event.isPopular && (
              <div className="absolute top-6 right-6">
                <div className="bg-deco-gold text-speakeasy-black px-2 py-1 rounded-full text-xs font-headline tracking-wide">
                  POPULAR
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
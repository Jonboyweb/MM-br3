'use client'

import { motion } from 'framer-motion'
import { RegularEvents } from '@/components/events/RegularEvents'
import { DJLineup } from '@/components/events/DJLineup'
import { SocialShare } from '@/components/events/SocialShare'
import { MusicGenreIndicators } from '@/components/events/MusicGenreIndicators'
import { Calendar, Clock, MapPin, Music, Users, ArrowRight, Star, Zap, Crown, Radio } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EventsPage() {
  const handleBookTable = (eventId: string, date: Date) => {
    // Navigate to booking page with pre-filled event data
    window.location.href = `/booking?event=${eventId}&date=${date.toISOString().split('T')[0]}`;
  };

  const handleTicketPurchase = (eventSlug: string) => {
    // Fatsoma integration
    window.open(`https://www.fatsoma.com/events/${eventSlug}`, '_blank');
  };

  return (
    <div className="bg-primary">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-prohibition-burgundy via-speakeasy-black to-deco-gold/20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-deco-pattern"></div>
        <div className="absolute inset-0 noise-overlay"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-headline text-shadow-gold mb-6 tracking-wider"
            >
              OUR EVENTS
            </motion.h1>
            
            <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8"></div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-deco-champagne mb-4"
            >
              Three Legendary Nights, Three Different Vibes
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-content-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              From Latin fire to R&B royalty to nostalgic Sunday sessions - 
              discover why The Backroom Leeds defines weekend nightlife
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 text-sm mb-8"
            >
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Crown className="w-4 h-4 text-deco-gold" />
                <span>VIP Table Service</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-deco-gold" />
                <span>Live DJs Every Night</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Radio className="w-4 h-4 text-deco-gold" />
                <span>Premium Sound System</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="gold" size="xl" className="font-headline">
                BOOK YOUR TABLE NOW
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-deco-gold to-transparent"></div>
      </section>

      {/* Regular Events Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-headline text-deco-gold mb-6 tracking-wider">
                WEEKLY EVENTS
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary max-w-3xl mx-auto">
                Every week brings three distinct musical experiences, each with its own character and legendary following
              </p>
            </motion.div>

            <RegularEvents
              layout="grid"
              onBookTable={handleBookTable}
              onTicketPurchase={handleTicketPurchase}
            />
          </div>
        </div>
      </section>

      {/* DJ Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-speakeasy-black to-prohibition-burgundy/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-headline text-deco-gold mb-6 tracking-wider">
                RESIDENT DJs
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary max-w-3xl mx-auto">
                Meet the masters behind the music - our resident DJs who create the perfect atmosphere every night
              </p>
            </motion.div>

            <DJLineup
              djs={[]}
              eventSlug="all"
              layout="grid"
              showBios={false}
            />
          </div>
        </div>
      </section>

      {/* Music Experience Section */}
      <section className="py-20 bg-deco-gold/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-headline text-deco-gold mb-6 tracking-wider">
                MUSIC EXPERIENCE
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary max-w-3xl mx-auto">
                From Latin fire to R&B smoothness to nostalgic throwbacks - experience the full spectrum of nightlife music
              </p>
            </motion.div>

            <MusicGenreIndicators
              genres={['R&B', 'Latin', 'Reggaeton', 'Commercial', 'Hip Hop', '2000s', '2010s', 'Throwbacks']}
              layout="grid"
              variant="showcase"
              showDescriptions={true}
              showPopularity={true}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-prohibition-burgundy to-deco-gold/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-headline text-white mb-6 tracking-wider">
                READY TO EXPERIENCE THE NIGHT?
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Join thousands who&apos;ve discovered Leeds&apos; best-kept secret
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button variant="gold" size="xl" className="min-w-48 font-headline">
                  BOOK YOUR TABLE
                </Button>
                <Button variant="outline" size="xl" className="min-w-48 font-headline border-white text-white hover:bg-white hover:text-prohibition-burgundy">
                  GET EVENT TICKETS
                </Button>
              </div>
              
              <div className="mt-8">
                <SocialShare
                  title="The Backroom Leeds Events"
                  description="Discover Leeds' premier prohibition experience with legendary weekly events"
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  hashtags={['LeedsNightlife', 'TheBackroomLeeds', 'WeekendPlans']}
                  variant="inline"
                  className="justify-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
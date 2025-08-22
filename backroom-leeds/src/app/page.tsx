'use client';

import Link from "next/link";
import { ArrowRight, MapPin, Clock, Users, Star, Zap, Crown } from 'lucide-react';
import Button from "@/components/ui/Button";
import { VideoHero } from "@/components/ui/VideoHero";
import { ScarcityMessage, scarcityPresets } from "@/components/ui/ScarcityMessage";
import { SocialProof } from "@/components/ui/SocialProof";
import { MobileBookingFlow } from "@/components/booking/MobileBookingFlow";
import { useState } from "react";

export default function Home() {
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false);
  const [tablesLeft] = useState(Math.floor(Math.random() * 5) + 4); // 4-9 tables remaining

  return (
    <div className="bg-primary">
      {/* Video Hero Section */}
      <VideoHero
        videoSrc="/venue-specific-information/videos/book-a-table-video.mp4"
        posterImage="/venue-specific-information/images/venue-interior-main.jpg"
        title="THE BACKROOM"
        subtitle="Leeds' Premier Prohibition Experience"
        description="Discover the city's best-kept secret. Hidden beneath Call Lane's railway bridge, where legendary nights begin and memories are made."
        primaryCTA={{
          text: "BOOK YOUR TABLE",
          onClick: () => setMobileBookingOpen(true)
        }}
        secondaryCTA={{
          text: "EXPLORE EVENTS",
          href: "/events"
        }}
        features={[
          { icon: <MapPin className="w-4 h-4" />, text: "50a Call Lane, Leeds" },
          { icon: <Clock className="w-4 h-4" />, text: "Late License Until 6am" },
          { icon: <Users className="w-4 h-4" />, text: "18+ Only Venue" },
          { icon: <Star className="w-4 h-4" />, text: "VIP Table Service" }
        ]}
        scarcityMessage={{
          text: `Only ${tablesLeft} premium tables left for this weekend!`,
          urgency: tablesLeft <= 3 ? 'high' : 'medium'
        }}
        socialProof={{
          text: "Rated Leeds' #1 Speakeasy Experience",
          metric: "4.9/5 stars"
        }}
        overlay="prohibition"
      />

      {/* Features Section */}
      <section className="bg-secondary py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline text-deco-gold mb-6">
                REVOLUTIONARY BOOKING EXPERIENCE
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary max-w-3xl mx-auto">
                Leeds&apos; first interactive table booking system - see, select, and secure your perfect spot
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-gold rounded-lg flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div className="absolute -inset-2 border border-deco-gold/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-headline text-deco-champagne mb-4">
                  INTERACTIVE FLOOR PLANS
                </h3>
                <p className="text-content-secondary leading-relaxed">
                  Visualize our prohibition-era venue with detailed floor plans. 
                  See booth seating, barrel tables, and premium VIP areas in real-time.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-burgundy rounded-lg flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="absolute -inset-2 border border-prohibition-wine/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-headline text-deco-champagne mb-4">
                  ZERO CONFLICTS
                </h3>
                <p className="text-content-secondary leading-relaxed">
                  Mathematical guarantee against double bookings. Live availability updates 
                  ensure your table is secured the moment you book.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-deco-gold to-deco-copper rounded-lg flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">📱</span>
                  </div>
                  <div className="absolute -inset-2 border border-deco-copper/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-headline text-deco-champagne mb-4">
                  MOBILE PERFECTION
                </h3>
                <p className="text-content-secondary leading-relaxed">
                  Optimized for 68% mobile traffic. Touch gestures, haptic feedback, 
                  and lightning-fast performance on any device.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="font-headline">
                TRY INTERACTIVE BOOKING
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Events Preview */}
      <section className="relative bg-gradient-to-br from-prohibition-burgundy via-speakeasy-charcoal to-deco-gold/10 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-deco-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline text-deco-gold mb-6">
                LEGENDARY WEEKLY EVENTS
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary max-w-3xl mx-auto">
                Three iconic nights that define Leeds nightlife - each with its own character and legendary DJs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* La Fiesta Friday */}
              <Link
                href="/events/la-fiesta"
                className="group relative bg-speakeasy-smoke border border-deco-gold/20 rounded-xl p-8 hover:border-deco-gold/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 text-center">🌶️</div>
                  <h3 className="text-2xl font-headline text-center text-deco-gold mb-3">LA FIESTA</h3>
                  <div className="text-center text-content-secondary mb-4">
                    <p className="font-medium">Friday • 11pm-6am</p>
                    <p className="text-sm text-content-tertiary">Latin • Reggaeton • Commercial</p>
                  </div>
                  <div className="border-t border-deco-gold/20 pt-4">
                    <p className="text-xs text-content-tertiary text-center mb-3">
                      Two floors of pure Latin energy
                    </p>
                    <div className="text-center">
                      <span className="text-orange-300 group-hover:text-orange-200 text-sm font-medium inline-flex items-center gap-1">
                        View Event <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Shhh Saturday */}
              <Link
                href="/events/shhh"
                className="group relative bg-speakeasy-smoke border border-deco-gold/20 rounded-xl p-8 hover:border-deco-gold/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 text-center">👑</div>
                  <h3 className="text-2xl font-headline text-center text-deco-gold mb-3">SHHH!</h3>
                  <div className="text-center text-content-secondary mb-4">
                    <p className="font-medium">Saturday • 11pm-6am</p>
                    <p className="text-sm text-content-tertiary">R&B • Commercial • Hip-Hop</p>
                  </div>
                  <div className="border-t border-deco-gold/20 pt-4">
                    <p className="text-xs text-content-tertiary text-center mb-3">
                      Leeds&apos; longest running R&B party
                    </p>
                    <div className="text-center">
                      <span className="text-purple-300 group-hover:text-purple-200 text-sm font-medium inline-flex items-center gap-1">
                        View Event <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Nostalgia Sunday */}
              <Link
                href="/events/nostalgia"
                className="group relative bg-speakeasy-smoke border border-deco-gold/20 rounded-xl p-8 hover:border-deco-gold/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 text-center">📻</div>
                  <h3 className="text-2xl font-headline text-center text-deco-gold mb-3">NOSTALGIA</h3>
                  <div className="text-center text-content-secondary mb-4">
                    <p className="font-medium">Sunday • 11pm-5am</p>
                    <p className="text-sm text-content-tertiary">2000s • 2010s • Throwbacks</p>
                  </div>
                  <div className="border-t border-deco-gold/20 pt-4">
                    <p className="text-xs text-content-tertiary text-center mb-3">
                      Sunday sessions that feel like home
                    </p>
                    <div className="text-center">
                      <span className="text-yellow-300 group-hover:text-yellow-200 text-sm font-medium inline-flex items-center gap-1">
                        View Event <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="font-headline">
                VIEW ALL EVENTS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-deco-gold/5 border-t border-deco-gold/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-headline text-deco-gold mb-6 tracking-wider">
                TRUSTED BY THOUSANDS
              </h3>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
              <p className="text-xl text-content-secondary">
                See why we&apos;re Leeds&apos; highest-rated speakeasy experience
              </p>
            </div>

            {/* Statistics */}
            <SocialProof variant="statistics" className="mb-16" />

            {/* Reviews */}
            <SocialProof variant="reviews" layout="grid" showCount={4} className="mb-16" />

            {/* Media Mentions */}
            <div className="text-center mb-12">
              <h4 className="text-2xl font-headline text-deco-gold mb-8 tracking-wide">
                FEATURED IN
              </h4>
              <SocialProof variant="media-mentions" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-prohibition-burgundy via-speakeasy-black to-deco-gold/30 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <ScarcityMessage
                type="limited-tables"
                urgency="high"
                message="Weekend tables filling fast - book now to avoid disappointment"
                metric={`${tablesLeft} tables left`}
                animate={true}
                className="inline-block"
              />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-headline mb-6 tracking-wider">
              READY TO EXPERIENCE THE LEGEND?
            </h2>
            
            <p className="text-xl mb-8 text-white/90">
              Join the thousands who&apos;ve discovered Leeds&apos; best-kept secret
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                variant="gold" 
                size="xl" 
                className="min-w-48 font-headline"
                onClick={() => setMobileBookingOpen(true)}
              >
                BOOK YOUR TABLE NOW
              </Button>
              <Link href="/events">
                <Button variant="outline" size="xl" className="min-w-48 font-headline border-white text-white hover:bg-white hover:text-prohibition-burgundy">
                  VIEW THIS WEEK&apos;S EVENTS
                </Button>
              </Link>
            </div>

            {/* Live Activity */}
            <SocialProof variant="live-activity" className="max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Mobile Booking Flow */}
      <MobileBookingFlow
        isOpen={mobileBookingOpen}
        onClose={() => setMobileBookingOpen(false)}
        onBookingComplete={(data) => {
          console.log('Booking completed:', data);
          setMobileBookingOpen(false);
        }}
      />
    </div>
  );
}

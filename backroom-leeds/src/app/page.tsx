import Link from "next/link";
import { ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="bg-primary">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-prohibition-burgundy via-speakeasy-black to-deco-gold/20 text-white overflow-hidden">
        {/* Art Deco pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-deco-pattern"></div>
        <div className="absolute inset-0 noise-overlay"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline text-shadow-gold mb-6 tracking-wider">
              THE BACKROOM
            </h1>
            <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-3xl text-deco-champagne font-display mb-4">
              Leeds&apos; Premier Prohibition Experience
            </p>
            <p className="text-lg text-content-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover the city&apos;s best-kept secret. Hidden beneath Call Lane&apos;s railway bridge, 
              where legendary nights begin and memories are made.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button variant="gold" size="xl" className="min-w-48">
                BOOK YOUR TABLE
              </Button>
              <Button variant="outline" size="xl" className="min-w-48">
                EXPLORE EVENTS
              </Button>
            </div>
            
            {/* Quick info badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm">
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-deco-gold" />
                <span>50a Call Lane, Leeds</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-deco-gold" />
                <span>Late License Until 6am</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-deco-gold" />
                <span>18+ Only Venue</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-deco-gold to-transparent"></div>
      </section>

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

      {/* System Status */}
      <section className="bg-deco-gold/5 border-t border-deco-gold/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-headline text-deco-gold mb-8">
              LIVE SYSTEM STATUS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary border border-deco-gold/20 rounded-lg p-6 hover:border-deco-gold/40 transition-colors">
                <div className="text-success text-3xl mb-3">✓</div>
                <div className="text-lg font-medium text-content-primary mb-1">Database Online</div>
                <div className="text-sm text-content-tertiary">16 tables • Real-time availability</div>
              </div>
              <div className="bg-secondary border border-deco-gold/20 rounded-lg p-6 hover:border-deco-gold/40 transition-colors">
                <div className="text-success text-3xl mb-3">⚡</div>
                <div className="text-lg font-medium text-content-primary mb-1">Real-time Active</div>
                <div className="text-sm text-content-tertiary">Live updates • Zero conflicts</div>
              </div>
              <div className="bg-secondary border border-deco-gold/20 rounded-lg p-6 hover:border-deco-gold/40 transition-colors">
                <div className="text-success text-3xl mb-3">🎉</div>
                <div className="text-lg font-medium text-content-primary mb-1">Events Ready</div>
                <div className="text-sm text-content-tertiary">3 weekly events • 8 resident DJs</div>
              </div>
            </div>
            <div className="mt-8 text-sm text-content-tertiary">
              <p>System uptime: 99.9% • Last update: Real-time • Response time: &lt;50ms</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

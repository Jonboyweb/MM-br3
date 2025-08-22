import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            THE BACKROOM
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8">
            Leeds&apos; Premier Prohibition Experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Book Your Table
            </Link>
            <Link
              href="/events"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">
            Experience Our Interactive Booking System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Interactive Floor Plans
              </h3>
              <p className="text-amber-700">
                Visualize and select your perfect table with our real-time interactive floor plans
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Real-time Updates
              </h3>
              <p className="text-amber-700">
                See live table availability as other customers book - no more double bookings
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Mobile Optimized
              </h3>
              <p className="text-amber-700">
                Touch-friendly interface with pan, zoom, and tap gestures for mobile users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Events Preview */}
      <div className="bg-gradient-to-r from-purple-900 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">This Week&apos;s Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* La Fiesta Friday */}
              <Link
                href="/events/la-fiesta"
                className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-colors group"
              >
                <div className="text-4xl mb-3">🌶️</div>
                <h3 className="text-xl font-bold mb-2">La Fiesta</h3>
                <p className="text-white/80 text-sm mb-3">Friday • 11pm-6am</p>
                <p className="text-white/70 text-xs">Latin, Reggaeton, Commercial</p>
                <div className="mt-4 text-orange-300 group-hover:text-orange-200 text-sm font-medium">
                  View Event →
                </div>
              </Link>

              {/* Shhh Saturday */}
              <Link
                href="/events/shhh"
                className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-colors group"
              >
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-xl font-bold mb-2">Shhh!</h3>
                <p className="text-white/80 text-sm mb-3">Saturday • 11pm-6am</p>
                <p className="text-white/70 text-xs">R&B, Commercial, Hip-Hop</p>
                <div className="mt-4 text-purple-300 group-hover:text-purple-200 text-sm font-medium">
                  View Event →
                </div>
              </Link>

              {/* Nostalgia Sunday */}
              <Link
                href="/events/nostalgia"
                className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-colors group"
              >
                <div className="text-4xl mb-3">📻</div>
                <h3 className="text-xl font-bold mb-2">Nostalgia</h3>
                <p className="text-white/80 text-sm mb-3">Sunday • 11pm-5am</p>
                <p className="text-white/70 text-xs">2000s, 2010s, Throwbacks</p>
                <div className="mt-4 text-yellow-300 group-hover:text-yellow-200 text-sm font-medium">
                  View Event →
                </div>
              </Link>
            </div>
            
            <div className="mt-8">
              <Link
                href="/events"
                className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="bg-amber-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-bold text-amber-900 mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4">
              <div className="text-green-500 text-2xl mb-2">✓</div>
              <div className="text-sm font-medium text-gray-700">Database Ready</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-green-500 text-2xl mb-2">✓</div>
              <div className="text-sm font-medium text-gray-700">Real-time Active</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-green-500 text-2xl mb-2">✓</div>
              <div className="text-sm font-medium text-gray-700">Events Loaded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

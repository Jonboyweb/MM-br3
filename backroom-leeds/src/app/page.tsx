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
              href="/test-floor-plan"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Interactive Floor Plan Demo
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
              <div className="text-sm font-medium text-gray-700">Floor Plans Loaded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

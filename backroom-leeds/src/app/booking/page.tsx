'use client'

import { useState } from 'react'
import { TableBookingInterface } from '@/components/booking/TableBookingInterface'
import { format, addDays } from 'date-fns'
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react'

export default function BookingPage() {
  // Demo booking parameters
  const [bookingParams, setBookingParams] = useState({
    bookingDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'), // Next week
    startTime: '23:00',
    endTime: '06:00',
    partySize: 6
  })
  
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [selectionSummary, setSelectionSummary] = useState<any>(null)

  // Handle selection changes from floor plan
  const handleSelectionChange = (tableIds: string[], summary: any) => {
    setSelectedTables(tableIds)
    setSelectionSummary(summary)
  }

  // Handle booking parameter changes
  const updateBookingParams = (updates: Partial<typeof bookingParams>) => {
    setBookingParams(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your Table
            </h1>
            <p className="text-xl text-amber-100 mb-6">
              Select your perfect spot at The Backroom Leeds
            </p>
            <div className="text-amber-200 text-sm">
              Interactive floor plans • Real-time availability • Instant booking
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Booking parameters panel */}
          <div className="bg-white rounded-lg shadow-md border border-amber-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">
              Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date selector */}
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={bookingParams.bookingDate}
                  onChange={(e) => updateBookingParams({ bookingDate: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 180), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Start time selector */}
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Arrival Time
                </label>
                <select
                  value={bookingParams.startTime}
                  onChange={(e) => updateBookingParams({ startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="23:00">11:00 PM</option>
                  <option value="23:30">11:30 PM</option>
                  <option value="00:00">12:00 AM</option>
                  <option value="00:30">12:30 AM</option>
                  <option value="01:00">1:00 AM</option>
                </select>
              </div>

              {/* End time (usually whole night) */}
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  End Time
                </label>
                <select
                  value={bookingParams.endTime}
                  onChange={(e) => updateBookingParams({ endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="04:00">4:00 AM (Mon-Wed)</option>
                  <option value="05:00">5:00 AM (Thu-Sun)</option>
                  <option value="06:00">6:00 AM (Fri-Sat)</option>
                </select>
              </div>

              {/* Party size selector */}
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Party Size
                </label>
                <input
                  type="number"
                  value={bookingParams.partySize}
                  onChange={(e) => updateBookingParams({ partySize: parseInt(e.target.value) || 1 })}
                  min={1}
                  max={25}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            
            {/* Quick info */}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">
                <strong>Note:</strong> Tables are booked for the entire evening. 
                You can arrive any time between your selected arrival time and 1:00 AM.
                The venue operates until {bookingParams.endTime === '06:00' ? '6:00 AM on weekends' : 
                bookingParams.endTime === '05:00' ? '5:00 AM on weekdays' : '4:00 AM on quiet nights'}.
              </p>
            </div>
          </div>

          {/* Interactive floor plan interface */}
          <TableBookingInterface
            venueSlug="backroom-leeds"
            bookingDate={bookingParams.bookingDate}
            startTime={bookingParams.startTime}
            endTime={bookingParams.endTime}
            partySize={bookingParams.partySize}
            onSelectionChange={handleSelectionChange}
            onRecommendationAccept={(recommendation) => {
              console.log('Recommendation accepted:', recommendation)
            }}
          />

          {/* Proceed to booking button */}
          {selectedTables.length > 0 && selectionSummary?.combined && (
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 shadow-lg">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Ready to Book!</h3>
                      <p className="text-green-100">
                        {selectedTables.length} table{selectedTables.length !== 1 ? 's' : ''} selected 
                        for {bookingParams.partySize} people
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">{selectionSummary.combined.totalCapacity}</div>
                      <div className="text-sm text-green-100">Total Seats</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">£{selectionSummary.combined.totalMinSpend}</div>
                      <div className="text-sm text-green-100">Min Spend</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">£{selectionSummary.combined.totalDeposit}</div>
                      <div className="text-sm text-green-100">Deposit</div>
                    </div>
                  </div>
                  
                  <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-2 mx-auto">
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Demo information */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              🎯 Interactive Floor Plan Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Real-time Features:</h4>
                <ul className="space-y-1">
                  <li>• Live table availability updates</li>
                  <li>• Instant conflict prevention</li>
                  <li>• Smart table combinations</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Interaction Guide:</h4>
                <ul className="space-y-1">
                  <li>• Click tables to select/deselect</li>
                  <li>• Hover for detailed information</li>
                  <li>• Switch between floors</li>
                  <li>• View AI-powered recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
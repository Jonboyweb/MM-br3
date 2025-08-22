'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EventCard } from '@/components/events/EventCard'
import { REGULAR_EVENTS, getNextEventDate, isEventTonight, isEventThisWeek } from '@/data/events'
import { Calendar, Clock, MapPin, Music, Users, ArrowRight, Star } from 'lucide-react'
import { format, addDays } from 'date-fns'
import Link from 'next/link'

export default function EventsPage() {
  const [eventSchedule, setEventSchedule] = useState<Array<{
    event: any
    nextDate: string
    isTonight: boolean
    isThisWeek: boolean
  }>>([])

  useEffect(() => {
    // Calculate schedule for all regular events
    const schedule = REGULAR_EVENTS.map(eventData => ({
      event: eventData.event,
      nextDate: getNextEventDate(eventData.event.day_of_week!),
      isTonight: isEventTonight(eventData.event.day_of_week!),
      isThisWeek: isEventThisWeek(eventData.event.day_of_week!)
    }))
    
    // Sort by next occurrence (tonight first, then this week, then next week)
    schedule.sort((a, b) => {
      if (a.isTonight && !b.isTonight) return -1
      if (!a.isTonight && b.isTonight) return 1
      if (a.isThisWeek && !b.isThisWeek) return -1
      if (!a.isThisWeek && b.isThisWeek) return 1
      return new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()
    })
    
    setEventSchedule(schedule)
  }, [])

  // Get tonight's event
  const tonightEvent = eventSchedule.find(e => e.isTonight)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              Our Events
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-amber-100 mb-8"
            >
              Three legendary nights, three different vibes
            </motion.p>

            {/* Tonight highlight */}
            {tonightEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white bg-opacity-20 rounded-lg p-6 mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                  <span className="font-bold text-lg">HAPPENING TONIGHT</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{tonightEvent.event.name}</h2>
                <p className="text-white/90">{tonightEvent.event.description}</p>
              </motion.div>
            )}

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">3 Weekly Events</div>
                <div className="text-sm text-white/80">Friday • Saturday • Sunday</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">500 Capacity</div>
                <div className="text-sm text-white/80">Two floors of entertainment</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Late License</div>
                <div className="text-sm text-white/80">Until 6am Fri-Sat</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Weekly schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Weekly Schedule
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {eventSchedule.map((scheduleItem, index) => (
                <motion.div
                  key={scheduleItem.event.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <EventCard
                    event={scheduleItem.event}
                    isTonight={scheduleItem.isTonight}
                    isThisWeek={scheduleItem.isThisWeek}
                    nextEventDate={scheduleItem.nextDate}
                    onBookTable={(eventId, date) => {
                      window.location.href = `/booking?event=${scheduleItem.event.slug}&date=${date}`
                    }}
                    compact={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Event comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Find Your Perfect Night
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Day</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Music</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Vibe</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Book</th>
                  </tr>
                </thead>
                <tbody>
                  {eventSchedule.map((item, index) => (
                    <motion.tr
                      key={item.event.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {item.isTonight && (
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{item.event.name}</div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(item.nextDate), 'MMM d')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize font-medium">{item.event.day_of_week}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.event.music_genres.slice(0, 2).map((genre: string) => (
                            <span key={genre} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {item.event.slug === 'la-fiesta' ? 'High-energy Latin' :
                           item.event.slug === 'shhh' ? 'Premium R&B' :
                           'Relaxed throwbacks'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/booking?event=${item.event.slug}&date=${item.nextDate}`}
                          className="bg-amber-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-amber-700 transition-colors"
                        >
                          Book
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center"
          >
            <Star className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Experience The Backroom?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Choose your night, book your table, and join Leeds&apos; most exclusive party destinations. 
              Every event offers a unique atmosphere with premium service and unforgettable experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Book Any Event
              </Link>
              
              <Link
                href="/"
                className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-700 transition-colors flex items-center gap-2"
              >
                Back to Home
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NOSTALGIA_EVENT, EVENT_THEMES, getNextEventDate, isEventTonight } from '@/data/events'
import { Calendar, Clock, Users, Music, MapPin, ArrowRight, Rewind, Heart, Radio } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function NostalgiaEventPage() {
  const [nextEventDate, setNextEventDate] = useState('')
  const [isTonight, setIsTonight] = useState(false)
  
  useEffect(() => {
    const eventDate = getNextEventDate('sunday')
    setNextEventDate(eventDate)
    setIsTonight(isEventTonight('sunday'))
  }, [])

  const theme = EVENT_THEMES['nostalgia']
  const event = NOSTALGIA_EVENT

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-orange-600 via-red-500 to-amber-600 text-white py-20"
        style={{ background: theme.background }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {isTonight && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-red-500 px-6 py-3 rounded-full mb-6"
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-bold text-lg">TONIGHT!</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Rewind className="w-8 h-8 text-yellow-300" />
                <Radio className="w-8 h-8 text-yellow-300" />
                <Heart className="w-8 h-8 text-yellow-300" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              NOSTALGIA
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-orange-100 mb-2"
            >
              Sunday Sessions
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            >
              {event.event.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={`/booking?event=nostalgia&date=${nextEventDate}`}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Book Your Sunday Session
              </Link>
              <Link
                href="/events"
                className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors flex items-center gap-2"
              >
                All Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Next event info */}
          {nextEventDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-6 mb-8 border border-orange-200"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-orange-900 mb-2">
                  {isTonight ? 'Tonight!' : 'Next Nostalgia'}
                </h2>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {format(new Date(nextEventDate), 'EEEE, MMMM do')}
                </div>
                <div className="text-orange-700">
                  Sunday session vibes • Perfect end to your weekend
                </div>
              </div>
            </motion.div>
          )}

          {/* Event highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Throwback Highlights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.throwback_highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
                >
                  <div className="text-3xl mb-3">
                    {index === 0 ? '🎤' : index === 1 ? '🎵' : index === 2 ? '💃' : '🎶'}
                  </div>
                  <h3 className="font-bold text-orange-900 text-sm">{highlight}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg p-8 text-center"
          >
            <Heart className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Sunday Session Vibes</h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              End your weekend on a high note with the ultimate throwback party.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/booking?event=nostalgia&date=${nextEventDate}`}
                className="bg-white text-amber-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <Radio className="w-5 h-5" />
                Book Sunday Session
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
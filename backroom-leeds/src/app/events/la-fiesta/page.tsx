'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LA_FIESTA_EVENT, EVENT_THEMES, getNextEventDate, isEventTonight } from '@/data/events'
import { Calendar, Clock, Users, Music, MapPin, ArrowRight, Volume2, Zap } from 'lucide-react'
import { format, addDays } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

export default function LaFiestaEventPage() {
  const [nextEventDate, setNextEventDate] = useState('')
  const [isTonight, setIsTonight] = useState(false)
  
  useEffect(() => {
    const eventDate = getNextEventDate('friday')
    setNextEventDate(eventDate)
    setIsTonight(isEventTonight('friday'))
  }, [])

  const theme = EVENT_THEMES['la-fiesta']
  const event = LA_FIESTA_EVENT

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 text-white py-20 overflow-hidden"
        style={{ background: theme.background }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEwTDMwIDIwTDIwIDMwTDEwIDIwTDIwIDEwWiIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=')] bg-repeat" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Event status badge */}
            {isTonight && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-6"
              >
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                <span className="font-bold text-lg">TONIGHT!</span>
              </motion.div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              LA FIESTA
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-orange-100 mb-2"
            >
              BELLA GENTE
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            >
              {event.event.description}
            </motion.p>

            {/* Key info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Every Friday</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="font-medium">11pm - 6am</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Two Floors</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={`/booking?event=la-fiesta&date=${nextEventDate}`}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Book Your Table
              </Link>
              <button className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors flex items-center gap-2">
                <Music className="w-5 h-5" />
                Listen to Mix
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Next event countdown */}
          {nextEventDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-6 mb-8 border border-orange-200"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-orange-900 mb-2">
                  {isTonight ? 'Tonight!' : 'Next La Fiesta'}
                </h2>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {format(new Date(nextEventDate), 'EEEE, MMMM do')}
                </div>
                <div className="text-orange-700">
                  Doors open at 11:00 PM • Party until 6:00 AM
                </div>
              </div>
            </motion.div>
          )}

          {/* Two floors breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Upstairs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 border border-orange-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Volume2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900">Upstairs Floor</h3>
                  <p className="text-orange-700">Main Party Area</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Music Style:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.floor_breakdown.upstairs.music.map(genre => (
                      <span key={genre} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Atmosphere:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.floor_breakdown.upstairs.atmosphere}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Capacity:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {event.floor_breakdown.upstairs.capacity} people
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Downstairs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 border border-pink-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Music className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pink-900">Downstairs Floor</h3>
                  <p className="text-pink-700">Latin Specialist Room</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Music Style:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.floor_breakdown.downstairs.music.map(genre => (
                      <span key={genre} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Atmosphere:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.floor_breakdown.downstairs.atmosphere}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Capacity:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {event.floor_breakdown.downstairs.capacity} people
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* DJ Lineup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Resident DJ Lineup
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.djs.map((dj, index) => (
                <motion.div
                  key={dj.instagram_handle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-orange-600" />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1">{dj.name}</h3>
                  <p className="text-orange-600 text-sm mb-2">{dj.instagram_handle}</p>
                  
                  <div className="flex flex-wrap justify-center gap-1">
                    {dj.specialties.map(genre => (
                      <span key={genre} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        {genre}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Event highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What to Expect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  The Experience
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {event.special_features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-pink-600 mb-3 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Music & Vibes
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Atmosphere:</span>
                    <p className="text-gray-600 text-sm mt-1">{event.atmosphere}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Music Style:</span>
                    <p className="text-gray-600 text-sm mt-1">{event.music_description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Table booking section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Party?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Book your table for La Fiesta and enjoy VIP treatment with priority entry, 
              table service, and the best spots to experience Leeds&apos; hottest Latin party.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">11PM</div>
                <div className="text-green-100 text-sm">Doors Open</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">2 Floors</div>
                <div className="text-green-100 text-sm">Different Vibes</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">6AM</div>
                <div className="text-green-100 text-sm">Party Until</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/booking?event=la-fiesta&date=${nextEventDate}`}
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Book Table for {nextEventDate ? format(new Date(nextEventDate), 'MMM d') : 'Friday'}
              </Link>
              
              <Link
                href="/events"
                className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-700 transition-colors flex items-center gap-2"
              >
                All Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Additional info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Dress code and info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Target Audience:</span>
                  <p className="text-gray-600 text-sm mt-1">{event.target_audience}</p>
                </div>
                {event.dress_code && (
                  <div>
                    <span className="font-medium text-gray-700">Dress Code:</span>
                    <p className="text-gray-600 text-sm mt-1">{event.dress_code}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Age Restriction:</span>
                  <p className="text-gray-600 text-sm mt-1">18+ only</p>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow the Party</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Hashtags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['#LaFiesta', '#BellaGente', '#LatinNight', '#BackroomLeeds'].map(tag => (
                      <span key={tag} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Follow our DJs:</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {event.djs.map(dj => (
                      <a
                        key={dj.instagram_handle}
                        href={`https://instagram.com/${dj.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 text-sm hover:underline"
                      >
                        {dj.instagram_handle}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
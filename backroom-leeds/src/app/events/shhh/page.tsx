'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SHHH_EVENT, EVENT_THEMES, getNextEventDate, isEventTonight } from '@/data/events'
import { Calendar, Clock, Users, Music, MapPin, ArrowRight, Crown, Award, Star, Zap } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function ShhhEventPage() {
  const [nextEventDate, setNextEventDate] = useState('')
  const [isTonight, setIsTonight] = useState(false)
  
  useEffect(() => {
    const eventDate = getNextEventDate('saturday')
    setNextEventDate(eventDate)
    setIsTonight(isEventTonight('saturday'))
  }, [])

  const theme = EVENT_THEMES['shhh']
  const event = SHHH_EVENT

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white py-20 overflow-hidden"
        style={{ background: theme.background }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Legacy badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-6"
            >
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">{event.legacy_info.reputation}</span>
            </motion.div>

            {/* Tonight badge */}
            {isTonight && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-red-500 px-6 py-3 rounded-full mb-6 ml-4"
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-bold text-lg">TONIGHT!</span>
              </motion.div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              SHHH!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto"
            >
              {event.event.description}
            </motion.p>

            {/* Key achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {event.legacy_info.achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {achievement}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={`/booking?event=shhh&date=${nextEventDate}`}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5 fill-current" />
                Book VIP Table
              </Link>
              <button className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-colors flex items-center gap-2">
                <Music className="w-5 h-5" />
                DJ Mixes
              </button>
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
              className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-8 border border-purple-200"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">
                  {isTonight ? 'Tonight!' : 'Next Shhh!'}
                </h2>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {format(new Date(nextEventDate), 'EEEE, MMMM do')}
                </div>
                <div className="text-purple-700">
                  The ultimate Saturday night experience awaits
                </div>
              </div>
            </motion.div>
          )}

          {/* Legacy section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                Leeds&apos; Legendary R&B Night
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Established as the premier Saturday night destination, Shhh! has built a reputation 
                for delivering the ultimate R&B experience week after week. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {event.legacy_info.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-purple-50 rounded-lg"
                >
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-3 fill-current" />
                  <div className="font-semibold text-purple-900 text-sm">
                    {achievement}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resident DJ showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Resident DJ All-Stars
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.resident_djs.map((dj, index) => (
                <motion.div
                  key={dj.instagram_handle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1">{dj.name}</h3>
                  <p className="text-purple-600 text-sm mb-2">{dj.instagram_handle}</p>
                  
                  {dj.bio && (
                    <p className="text-xs text-gray-600 mb-2">{dj.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-1">
                    {dj.specialties.map(genre => (
                      <span key={genre} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        {genre}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Music breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              The Sound of Shhh!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Music Selection
                </h3>
                <div className="space-y-3">
                  {event.event.music_genres.map((genre, index) => {
                    const style = require('@/data/events').MUSIC_GENRE_STYLES[genre]
                    return (
                      <div key={genre} className="flex items-center gap-3">
                        <span className="text-lg">{style?.emoji || '🎵'}</span>
                        <div>
                          <div className="font-medium text-gray-900">{genre}</div>
                          <div className="text-sm text-gray-600">{style?.description || 'Premium music selection'}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  What Makes It Special
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {event.special_features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Premium experience CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg p-8 text-center"
          >
            <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">The Ultimate Saturday Experience</h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Join Leeds&apos; most sophisticated crowd for an unforgettable night of R&B, 
              commercial hits, and premium atmosphere. Table service includes priority entry 
              and the best views of our legendary dance floor.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">11PM</div>
                <div className="text-amber-100 text-sm">Doors Open</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">Premium</div>
                <div className="text-amber-100 text-sm">R&B Experience</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">VIP</div>
                <div className="text-amber-100 text-sm">Table Service</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">6AM</div>
                <div className="text-amber-100 text-sm">Late License</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/booking?event=shhh&date=${nextEventDate}`}
                className="bg-white text-amber-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5 fill-current" />
                Book Premium Table
              </Link>
              
              <Link
                href="/events"
                className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-amber-700 transition-colors flex items-center gap-2"
              >
                Other Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Event details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Experience details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                The Shhh! Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Music Style:</span>
                  <p className="text-gray-600 text-sm mt-1">{event.music_description}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Atmosphere:</span>
                  <p className="text-gray-600 text-sm mt-1">{event.atmosphere}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Perfect For:</span>
                  <p className="text-gray-600 text-sm mt-1">{event.target_audience}</p>
                </div>
                {event.dress_code && (
                  <div>
                    <span className="font-medium text-gray-700">Dress Code:</span>
                    <p className="text-gray-600 text-sm mt-1">{event.dress_code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Practical information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Event Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Day</span>
                  <span className="font-medium">Every Saturday</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">11:00 PM - 6:00 AM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">Full venue (500 capacity)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">18+ only</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Entry</span>
                  <span className="font-medium">Free entry / Table bookings available</span>
                </div>
              </div>
            </div>
          </div>

          {/* DJ spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-lg p-8 mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Meet Your Saturday Night DJs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {event.resident_djs.slice(0, 2).map((dj, index) => (
                <div key={dj.instagram_handle} className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-purple-200" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{dj.name}</h3>
                  <p className="text-purple-200 mb-3">{dj.instagram_handle}</p>
                  
                  {dj.bio && (
                    <p className="text-purple-100 text-sm mb-3">{dj.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {dj.specialties.map(genre => (
                      <span key={genre} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {event.resident_djs.length > 2 && (
              <div className="text-center mt-6">
                <p className="text-purple-200 text-sm">
                  + {event.resident_djs.length - 2} more resident DJs rotating weekly
                </p>
              </div>
            )}
          </motion.div>

          {/* Social proof and testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Why Saturday Nights Belong to Shhh!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-gray-600 text-sm">Years Running</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">500</div>
                  <div className="text-gray-600 text-sm">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15k+</div>
                  <div className="text-gray-600 text-sm">Social Followers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
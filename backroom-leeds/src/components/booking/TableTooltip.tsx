'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TableTooltipProps } from '@/types/booking'
import { Users, Star, MapPin, PoundSterling } from 'lucide-react'

export function TableTooltip({ table, isVisible, position }: TableTooltipProps) {
  if (!isVisible) return null

  // Format amenities list
  const amenities = Array.isArray(table.amenities) ? table.amenities : []
  
  // Format minimum spend
  const formatCurrency = (amount: number) => `£${amount.toFixed(0)}`

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute z-50 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg shadow-xl p-4 min-w-64 max-w-80"
          style={{
            left: position.x,
            top: position.y - 10,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {/* Arrow pointer */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-100 border-b-2 border-r-2 border-amber-300 rotate-45" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {table.table_number}
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  {table.display_name || `Table ${table.table_number}`}
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <MapPin className="w-3 h-3" />
                  <span className="capitalize">{table.location}</span>
                </div>
              </div>
            </div>
            
            {/* Premium badge */}
            {table.is_premium && (
              <div className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>VIP</span>
              </div>
            )}
          </div>

          {/* Capacity info */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-amber-800">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {table.min_capacity === table.max_capacity 
                  ? `${table.max_capacity} people` 
                  : `${table.min_capacity}-${table.max_capacity} people`}
              </span>
            </div>
            
            {table.min_spend > 0 && (
              <div className="flex items-center gap-1 text-amber-800">
                <PoundSterling className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatCurrency(table.min_spend)} min spend
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {table.description && (
            <p className="text-sm text-amber-800 mb-3 leading-relaxed">
              {table.description}
            </p>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-amber-900 mb-1 uppercase tracking-wide">
                Features
              </h4>
              <div className="flex flex-wrap gap-1">
                {amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Table type indicator */}
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-sm ${
                table.is_booth 
                  ? 'bg-amber-600' 
                  : table.table_number.includes('6') || table.table_number.includes('7') || table.table_number.includes('8')
                  ? 'bg-amber-500 rounded-full'
                  : 'bg-amber-400'
              }`} />
              <span>
                {table.is_booth 
                  ? 'Booth Seating' 
                  : table.table_number.includes('6') || table.table_number.includes('7') || table.table_number.includes('8')
                  ? 'Barrel Table'
                  : 'High Table'
                }
              </span>
            </span>
            
            {table.deposit_required > 0 && (
              <span className="font-medium">
                £{table.deposit_required} deposit
              </span>
            )}
          </div>

          {/* Availability status */}
          <div className="mt-2 pt-2 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-700">Status</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  table.is_available ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-medium ${
                  table.is_available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {table.is_available ? 'Available' : 'Booked'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
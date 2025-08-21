'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TableCombination } from '@/types/booking'
import { Users, PoundSterling, Star, MapPin, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

interface TableRecommendationsProps {
  recommendations: TableCombination[]
  partySize: number
  onRecommendationSelect: (recommendation: TableCombination) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export function TableRecommendations({
  recommendations,
  partySize,
  onRecommendationSelect,
  isVisible,
  onToggleVisibility
}: TableRecommendationsProps) {
  // Format currency
  const formatCurrency = (amount: number) => `£${amount.toFixed(0)}`

  // Sort recommendations by optimality and value
  const sortedRecommendations = recommendations
    .sort((a, b) => {
      // Optimal recommendations first
      if (a.is_optimal && !b.is_optimal) return -1
      if (!a.is_optimal && b.is_optimal) return 1
      
      // Then by total deposit (lower is better)
      return a.total_deposit - b.total_deposit
    })
    .slice(0, 5) // Show top 5 recommendations

  // Get recommendation quality score
  const getRecommendationScore = (rec: TableCombination) => {
    let score = 0
    
    // Capacity match (best if within 2 seats of party size)
    const capacityDiff = Math.abs(rec.total_capacity - partySize)
    if (capacityDiff <= 2) score += 40
    else if (capacityDiff <= 4) score += 30
    else if (capacityDiff <= 6) score += 20
    else score += 10
    
    // Cost efficiency (lower deposit is better)
    if (rec.total_deposit <= 50) score += 30
    else if (rec.total_deposit <= 100) score += 20
    else score += 10
    
    // Combination type (single tables preferred for smaller groups)
    if (partySize <= 8 && rec.combination_type === 'single') score += 20
    else if (partySize > 8 && rec.combination_type === 'combination') score += 20
    else score += 10
    
    // Optimal flag from database
    if (rec.is_optimal) score += 10
    
    return Math.min(score, 100)
  }

  // Get recommendation badge
  const getRecommendationBadge = (score: number) => {
    if (score >= 90) return { label: 'Perfect Match', color: 'bg-green-500', textColor: 'text-white' }
    if (score >= 80) return { label: 'Great Choice', color: 'bg-blue-500', textColor: 'text-white' }
    if (score >= 70) return { label: 'Good Option', color: 'bg-amber-500', textColor: 'text-white' }
    return { label: 'Available', color: 'bg-gray-400', textColor: 'text-white' }
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={onToggleVisibility}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 hover:from-blue-700 hover:to-blue-800 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Smart Recommendations</h3>
              <p className="text-blue-100 text-sm">
                AI-powered table suggestions for {partySize} people
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-medium">
              {sortedRecommendations.length} options
            </span>
            {isVisible ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Recommendations list */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {sortedRecommendations.map((recommendation, index) => {
                const score = getRecommendationScore(recommendation)
                const badge = getRecommendationBadge(score)
                
                return (
                  <motion.div
                    key={recommendation.combination_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-amber-200 rounded-lg p-4 hover:bg-amber-50 transition-colors cursor-pointer group"
                    onClick={() => onRecommendationSelect(recommendation)}
                  >
                    {/* Recommendation header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Recommendation rank */}
                        <div className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-amber-900">
                              {recommendation.combination_type === 'single' 
                                ? `Table ${recommendation.table_names[0]?.split(' ')[1] || recommendation.table_names[0]}`
                                : `${recommendation.table_names.length} Table Combination`
                              }
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color} ${badge.textColor}`}>
                              {badge.label}
                            </span>
                          </div>
                          
                          <div className="text-sm text-amber-700">
                            {recommendation.table_names.join(' + ')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action arrow */}
                      <ArrowRight className="w-5 h-5 text-amber-600 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Table details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-medium">Capacity</span>
                        </div>
                        <div className="font-bold text-amber-900">
                          {recommendation.total_capacity}
                        </div>
                        <div className={`text-xs ${
                          recommendation.total_capacity >= partySize ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {recommendation.total_capacity >= partySize ? 'Fits party' : 'Too small'}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                          <PoundSterling className="w-4 h-4" />
                          <span className="text-xs font-medium">Min Spend</span>
                        </div>
                        <div className="font-bold text-amber-900">
                          {formatCurrency(recommendation.total_min_spend)}
                        </div>
                        <div className="text-xs text-amber-600">per party</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                          <span className="text-xs font-medium">Deposit</span>
                        </div>
                        <div className="font-bold text-amber-900">
                          {formatCurrency(recommendation.total_deposit)}
                        </div>
                        <div className="text-xs text-amber-600">to secure</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-medium">Location</span>
                        </div>
                        <div className="font-bold text-amber-900 capitalize">
                          {recommendation.tables?.[0]?.location || 'Mixed'}
                        </div>
                        <div className="text-xs text-amber-600">
                          {recommendation.combination_type}
                        </div>
                      </div>
                    </div>

                    {/* Table features */}
                    {recommendation.tables && recommendation.tables.length > 0 && (
                      <div className="space-y-2">
                        {recommendation.tables.map((table, tableIndex) => (
                          <div
                            key={table.id}
                            className="flex items-center justify-between bg-white rounded border border-amber-100 p-2"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                table.is_premium ? 'bg-amber-600' : 'bg-amber-500'
                              }`}>
                                {table.table_number}
                              </div>
                              
                              <span className="text-sm text-amber-900">
                                {table.display_name}
                              </span>
                              
                              {table.is_premium && (
                                <Star className="w-3 h-3 text-amber-600 fill-current" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-amber-700">
                              <span>{table.min_capacity}-{table.max_capacity} people</span>
                              <span>{formatCurrency(table.deposit_required)} deposit</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Why this recommendation */}
                    <div className="mt-3 pt-3 border-t border-amber-100">
                      <div className="text-xs text-amber-600">
                        <strong>Why recommended:</strong>
                        {' '}
                        {recommendation.is_optimal && 'Optimal capacity match. '}
                        {recommendation.combination_type === 'single' && 'Simple single table booking. '}
                        {recommendation.combination_type === 'combination' && 'Tables can be combined for your group. '}
                        {recommendation.total_deposit < 100 && 'Low deposit required. '}
                        {recommendation.tables?.some(t => t.is_premium) && 'Includes VIP experience. '}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* No recommendations message */}
              {sortedRecommendations.length === 0 && (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
                  <h3 className="font-semibold text-amber-900 mb-2">
                    No Recommendations Available
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Unfortunately, we don&apos;t have any suitable table combinations 
                    available for {partySize} people at your selected time.
                  </p>
                  <p className="text-amber-600 text-xs mt-2">
                    Try selecting a different date or time, or contact us directly for assistance.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
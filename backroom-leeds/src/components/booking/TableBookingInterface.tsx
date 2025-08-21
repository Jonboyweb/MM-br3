'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloorPlan } from './FloorPlan'
import { TableSelectionSummary } from './TableSelectionSummary'
import { TableRecommendations } from './TableRecommendations'
import { useTableAvailability, useTableSelection, useOptimisticBookings } from '@/hooks/useTableAvailability'
import { getVenueBySlug, getOptimalTableCombinations } from '@/lib/supabase'
import { TableCombination } from '@/types/booking'
import { ArrowUpDown, MapPin, Users, Clock, RefreshCw, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface TableBookingInterfaceProps {
  venueSlug: string
  bookingDate: string
  startTime: string
  endTime: string
  partySize: number
  onSelectionChange: (tableIds: string[], summary: any) => void
  onRecommendationAccept?: (combination: TableCombination) => void
}

export function TableBookingInterface({
  venueSlug,
  bookingDate,
  startTime,
  endTime,
  partySize,
  onSelectionChange,
  onRecommendationAccept
}: TableBookingInterfaceProps) {
  const [venue, setVenue] = useState<any>(null)
  const [activeFloor, setActiveFloor] = useState<'upstairs' | 'downstairs'>('upstairs')
  const [recommendations, setRecommendations] = useState<TableCombination[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Load venue data
  useEffect(() => {
    const loadVenue = async () => {
      try {
        const venueData = await getVenueBySlug(venueSlug)
        setVenue(venueData)
      } catch (error) {
        console.error('Error loading venue:', error)
      }
    }
    loadVenue()
  }, [venueSlug])

  // Table selection management
  const {
    selectedTables,
    toggleTable,
    clearSelection,
    selectionCount,
    maxSelections
  } = useTableSelection(3) // Max 3 tables can be combined

  // Upstairs tables availability
  const upstairsAvailability = useTableAvailability({
    venueId: venue?.id || '',
    bookingDate,
    startTime,
    endTime,
    partySize,
    location: 'upstairs'
  })

  // Downstairs tables availability
  const downstairsAvailability = useTableAvailability({
    venueId: venue?.id || '',
    bookingDate,
    startTime,
    endTime,
    partySize,
    location: 'downstairs'
  })

  // Optimistic booking management
  const {
    optimisticBookings,
    addOptimisticBooking,
    removeOptimisticBooking
  } = useOptimisticBookings(venue?.id || '', bookingDate)

  // Get current floor availability data
  const currentFloorData = activeFloor === 'upstairs' ? upstairsAvailability : downstairsAvailability
  
  // Combine both floors for recommendations
  const allTables = [...upstairsAvailability.tables, ...downstairsAvailability.tables]

  // Load smart recommendations
  const loadRecommendations = useCallback(async () => {
    if (!venue?.id) return

    try {
      const upstairsRecs = await getOptimalTableCombinations(
        venue.id,
        bookingDate,
        startTime,
        endTime,
        partySize,
        'upstairs'
      )

      const downstairsRecs = await getOptimalTableCombinations(
        venue.id,
        bookingDate,
        startTime,
        endTime,
        partySize,
        'downstairs'
      )

      const allRecs = [...upstairsRecs, ...downstairsRecs]
      
      // Enhance recommendations with table data
      const enhancedRecs = allRecs.map(rec => ({
        ...rec,
        tables: rec.table_ids.map(id => 
          allTables.find(table => table.id === id)
        ).filter(Boolean) as any[]
      }))

      setRecommendations(enhancedRecs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }, [venue?.id, bookingDate, startTime, endTime, partySize, allTables])

  // Load recommendations when data changes
  useEffect(() => {
    if (venue?.id && allTables.length > 0) {
      loadRecommendations()
    }
  }, [loadRecommendations])

  // Handle table selection
  const handleTableSelect = useCallback((tableId: string) => {
    toggleTable(tableId)
    
    // Update optimistic bookings
    if (selectedTables.includes(tableId)) {
      removeOptimisticBooking([tableId])
    } else {
      addOptimisticBooking([tableId])
    }
  }, [toggleTable, selectedTables, addOptimisticBooking, removeOptimisticBooking])

  // Handle table hover
  const handleTableHover = useCallback((tableId: string | null) => {
    upstairsAvailability.updateTableHover(tableId)
    downstairsAvailability.updateTableHover(tableId)
  }, [upstairsAvailability.updateTableHover, downstairsAvailability.updateTableHover])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      upstairsAvailability.refreshAvailability()
      downstairsAvailability.refreshAvailability()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, upstairsAvailability.refreshAvailability, downstairsAvailability.refreshAvailability])

  // Notify parent component of selection changes
  useEffect(() => {
    const summary = {
      upstairs: upstairsAvailability.selectionSummary,
      downstairs: downstairsAvailability.selectionSummary,
      combined: {
        totalCapacity: upstairsAvailability.selectionSummary.totalCapacity + 
                      downstairsAvailability.selectionSummary.totalCapacity,
        totalMinSpend: upstairsAvailability.selectionSummary.totalMinSpend + 
                      downstairsAvailability.selectionSummary.totalMinSpend,
        totalDeposit: upstairsAvailability.selectionSummary.totalDeposit + 
                     downstairsAvailability.selectionSummary.totalDeposit,
        tableCount: selectedTables.length
      }
    }
    
    onSelectionChange(selectedTables, summary)
  }, [selectedTables, upstairsAvailability.selectionSummary, downstairsAvailability.selectionSummary, onSelectionChange])

  if (!venue) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading venue information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with booking details */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Select Your Table
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{partySize} people</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(`2000-01-01T${startTime}`), 'h:mm a')} - {format(new Date(`2000-01-01T${endTime}`), 'h:mm a')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{format(new Date(bookingDate), 'EEEE, MMMM do')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <Zap className={`w-4 h-4 ${autoRefresh ? 'text-green-600' : 'text-gray-500'}`} />
              Live Updates
            </button>

            {/* Manual refresh */}
            <button
              onClick={() => {
                upstairsAvailability.forceRefresh()
                downstairsAvailability.forceRefresh()
              }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-200 hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Smart recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TableRecommendations
            recommendations={recommendations}
            partySize={partySize}
            onRecommendationSelect={(rec) => {
              // Clear current selection
              clearSelection()
              // Select recommended tables
              rec.table_ids.forEach(tableId => {
                handleTableSelect(tableId)
              })
              if (onRecommendationAccept) {
                onRecommendationAccept(rec)
              }
            }}
            isVisible={showRecommendations}
            onToggleVisibility={() => setShowRecommendations(!showRecommendations)}
          />
        </motion.div>
      )}

      {/* Floor selector */}
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-lg p-1 shadow-md border border-amber-200">
          <div className="flex">
            <button
              onClick={() => setActiveFloor('upstairs')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeFloor === 'upstairs'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                <span>Upstairs</span>
                <span className="text-xs opacity-75">
                  ({upstairsAvailability.availableTablesCount} available)
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveFloor('downstairs')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeFloor === 'downstairs'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 rotate-180" />
                <span>Downstairs</span>
                <span className="text-xs opacity-75">
                  ({downstairsAvailability.availableTablesCount} available)
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Active floor plan */}
      <motion.div
        key={activeFloor}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <FloorPlan
          location={activeFloor}
          tables={currentFloorData.tables}
          selectedTables={selectedTables}
          onTableSelect={handleTableSelect}
          onTableHover={handleTableHover}
          partySize={partySize}
          bookingDate={bookingDate}
          startTime={startTime}
          endTime={endTime}
          isLoading={currentFloorData.loading}
        />
      </motion.div>

      {/* Selection summary */}
      <AnimatePresence>
        {selectedTables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TableSelectionSummary
              selectedTables={[...upstairsAvailability.selectedTablesDetails, ...downstairsAvailability.selectedTablesDetails]}
              summary={{
                ...upstairsAvailability.selectionSummary,
                totalCapacity: upstairsAvailability.selectionSummary.totalCapacity + downstairsAvailability.selectionSummary.totalCapacity,
                totalMinSpend: upstairsAvailability.selectionSummary.totalMinSpend + downstairsAvailability.selectionSummary.totalMinSpend,
                totalDeposit: upstairsAvailability.selectionSummary.totalDeposit + downstairsAvailability.selectionSummary.totalDeposit,
                tableCount: selectedTables.length
              }}
              partySize={partySize}
              onClearSelection={clearSelection}
              onRemoveTable={(tableId) => toggleTable(tableId)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floor plan status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upstairs status */}
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-amber-900">Upstairs Floor</h3>
            <span className="text-xs text-amber-600">
              Updated {format(upstairsAvailability.lastUpdate, 'HH:mm:ss')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Available Tables</span>
            <span className={`font-medium ${
              upstairsAvailability.availableTablesCount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {upstairsAvailability.availableTablesCount} / {upstairsAvailability.tables.length}
            </span>
          </div>
        </div>

        {/* Downstairs status */}
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-amber-900">Downstairs Floor</h3>
            <span className="text-xs text-amber-600">
              Updated {format(downstairsAvailability.lastUpdate, 'HH:mm:ss')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Available Tables</span>
            <span className={`font-medium ${
              downstairsAvailability.availableTablesCount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {downstairsAvailability.availableTablesCount} / {downstairsAvailability.tables.length}
            </span>
          </div>
        </div>
      </div>

      {/* Error handling */}
      {(upstairsAvailability.error || downstairsAvailability.error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-red-700">
            <span className="font-medium">⚠️ Error loading table availability</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            {upstairsAvailability.error || downstairsAvailability.error}
          </p>
          <button
            onClick={() => {
              upstairsAvailability.retry()
              downstairsAvailability.retry()
            }}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* No available tables message */}
      {!currentFloorData.loading && 
       currentFloorData.availableTablesCount === 0 && 
       !currentFloorData.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center"
        >
          <div className="text-amber-600 mb-2">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-60" />
          </div>
          <h3 className="font-semibold text-amber-900 mb-2">
            No Tables Available on {activeFloor} Floor
          </h3>
          <p className="text-amber-700 text-sm mb-4">
            All tables are currently booked for your selected time slot.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => setActiveFloor(activeFloor === 'upstairs' ? 'downstairs' : 'upstairs')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              Check {activeFloor === 'upstairs' ? 'Downstairs' : 'Upstairs'} Floor
            </button>
            <button
              onClick={() => setShowRecommendations(true)}
              className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
            >
              See Recommendations
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
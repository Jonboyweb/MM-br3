'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, getVenueTables, getAvailableTables, checkTableAvailability } from '@/lib/supabase'
import { TableWithAvailability, RealTimeUpdate } from '@/types/booking'
import { debounce } from 'lodash'

interface UseTableAvailabilityProps {
  venueId: string
  bookingDate: string
  startTime: string
  endTime: string
  partySize: number
  location?: 'upstairs' | 'downstairs'
}

export function useTableAvailability({
  venueId,
  bookingDate,
  startTime,
  endTime,
  partySize,
  location
}: UseTableAvailabilityProps) {
  const [tables, setTables] = useState<TableWithAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Debounced availability refresh to prevent excessive API calls
  const debouncedRefresh = useCallback(
    debounce(async () => {
      await refreshAvailability()
    }, 500),
    [venueId, bookingDate, startTime, endTime, partySize, location]
  )

  // Load initial table data with availability
  const loadTables = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all tables for the venue/location
      const venueTablesData = await getVenueTables(venueId, location)
      
      // Check availability for each table
      const tablesWithAvailability = await Promise.all(
        venueTablesData.map(async (table) => {
          try {
            const isAvailable = await checkTableAvailability(
              table.id,
              bookingDate,
              startTime,
              endTime
            )
            
            return {
              ...table,
              is_available: isAvailable,
              is_selected: false,
              is_hovered: false
            } as TableWithAvailability
          } catch (error) {
            console.error(`Error checking availability for table ${table.table_number}:`, error)
            return {
              ...table,
              is_available: false,
              is_selected: false,
              is_hovered: false
            } as TableWithAvailability
          }
        })
      )

      setTables(tablesWithAvailability)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading tables:', error)
      setError('Failed to load table information')
    } finally {
      setLoading(false)
    }
  }, [venueId, bookingDate, startTime, endTime, location])

  // Refresh only availability status (faster than full reload)
  const refreshAvailability = useCallback(async () => {
    if (tables.length === 0) return

    try {
      const updatedTables = await Promise.all(
        tables.map(async (table) => {
          const isAvailable = await checkTableAvailability(
            table.id,
            bookingDate,
            startTime,
            endTime
          )
          
          return {
            ...table,
            is_available: isAvailable
          }
        })
      )

      setTables(updatedTables)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error refreshing availability:', error)
    }
  }, [tables, bookingDate, startTime, endTime])

  // Get available tables using optimized database function
  const getOptimizedAvailability = useCallback(async () => {
    try {
      const availableTablesData = await getAvailableTables(
        venueId,
        bookingDate,
        startTime,
        endTime,
        partySize
      )

      // Create a set of available table IDs for quick lookup
      const availableTableIds = new Set(availableTablesData.map(t => t.table_id))

      // Update availability status for all tables
      setTables(prevTables => 
        prevTables.map(table => ({
          ...table,
          is_available: availableTableIds.has(table.id)
        }))
      )

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error getting optimized availability:', error)
    }
  }, [venueId, bookingDate, startTime, endTime, partySize])

  // Initial load
  useEffect(() => {
    loadTables()
  }, [loadTables])

  // Set up real-time subscription for booking changes
  useEffect(() => {
    const channel = supabase
      .channel(`table-availability-${location}-${bookingDate}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        // Check if the update affects our date/time
        const booking = payload.new || payload.old
        if (booking?.booking_date === bookingDate) {
          // Debounce the refresh to handle multiple rapid updates
          debouncedRefresh()
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [location, bookingDate, debouncedRefresh])

  // Update table selection state
  const updateTableSelection = useCallback((tableId: string, isSelected: boolean) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId
          ? { ...table, is_selected: isSelected }
          : table
      )
    )
  }, [])

  // Update table hover state
  const updateTableHover = useCallback((tableId: string | null) => {
    setTables(prevTables =>
      prevTables.map(table => ({
        ...table,
        is_hovered: table.id === tableId
      }))
    )
  }, [])

  // Get available tables count
  const availableTablesCount = useMemo(() => {
    return tables.filter(table => 
      table.is_available && 
      partySize >= table.min_capacity && 
      partySize <= table.max_capacity
    ).length
  }, [tables, partySize])

  // Get selected tables details
  const selectedTablesDetails = useMemo(() => {
    return tables.filter(table => table.is_selected)
  }, [tables])

  // Calculate total capacity and cost for selected tables
  const selectionSummary = useMemo(() => {
    const selectedTables = tables.filter(table => table.is_selected)
    
    return {
      totalCapacity: selectedTables.reduce((sum, table) => sum + table.max_capacity, 0),
      totalMinSpend: selectedTables.reduce((sum, table) => sum + table.min_spend, 0),
      totalDeposit: selectedTables.reduce((sum, table) => sum + table.deposit_required, 0),
      tableCount: selectedTables.length,
      isPremiumSelection: selectedTables.some(table => table.is_premium)
    }
  }, [tables])

  return {
    tables,
    loading,
    error,
    lastUpdate,
    availableTablesCount,
    selectedTablesDetails,
    selectionSummary,
    refreshAvailability,
    getOptimizedAvailability,
    updateTableSelection,
    updateTableHover,
    // Expose methods for parent components
    retry: loadTables,
    forceRefresh: () => {
      setLoading(true)
      loadTables()
    }
  }
}

// Hook for managing table selection state
export function useTableSelection(maxSelections: number = 3) {
  const [selectedTables, setSelectedTables] = useState<string[]>([])

  const toggleTable = useCallback((tableId: string) => {
    setSelectedTables(prev => {
      const isSelected = prev.includes(tableId)
      
      if (isSelected) {
        // Remove table from selection
        return prev.filter(id => id !== tableId)
      } else {
        // Add table to selection (respect max limit)
        if (prev.length >= maxSelections) {
          // Replace oldest selection
          return [...prev.slice(1), tableId]
        } else {
          return [...prev, tableId]
        }
      }
    })
  }, [maxSelections])

  const selectTable = useCallback((tableId: string) => {
    setSelectedTables(prev => {
      if (prev.includes(tableId)) return prev
      
      if (prev.length >= maxSelections) {
        return [...prev.slice(1), tableId]
      } else {
        return [...prev, tableId]
      }
    })
  }, [maxSelections])

  const deselectTable = useCallback((tableId: string) => {
    setSelectedTables(prev => prev.filter(id => id !== tableId))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTables([])
  }, [])

  const canSelectMore = selectedTables.length < maxSelections

  return {
    selectedTables,
    toggleTable,
    selectTable,
    deselectTable,
    clearSelection,
    canSelectMore,
    selectionCount: selectedTables.length,
    maxSelections
  }
}

// Hook for real-time booking updates with optimistic UI
export function useOptimisticBookings(venueId: string, bookingDate: string) {
  const [optimisticBookings, setOptimisticBookings] = useState<string[]>([])

  const addOptimisticBooking = useCallback((tableIds: string[]) => {
    setOptimisticBookings(prev => [...prev, ...tableIds])
  }, [])

  const removeOptimisticBooking = useCallback((tableIds: string[]) => {
    setOptimisticBookings(prev => prev.filter(id => !tableIds.includes(id)))
  }, [])

  const clearOptimisticBookings = useCallback(() => {
    setOptimisticBookings([])
  }, [])

  // Set up real-time subscription to clear optimistic bookings on conflicts
  useEffect(() => {
    const channel = supabase
      .channel(`optimistic-${venueId}-${bookingDate}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings',
        filter: `booking_date=eq.${bookingDate}`
      }, (payload) => {
        // Clear optimistic bookings when real bookings are confirmed
        clearOptimisticBookings()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [venueId, bookingDate, clearOptimisticBookings])

  return {
    optimisticBookings,
    addOptimisticBooking,
    removeOptimisticBooking,
    clearOptimisticBookings
  }
}
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FloorPlanProps, TableWithAvailability, RealTimeUpdate } from '@/types/booking'
import { InteractiveTable } from './InteractiveTable'
import { TableTooltip } from './TableTooltip'
import { 
  UPSTAIRS_LAYOUT, 
  DOWNSTAIRS_LAYOUT, 
  FLOOR_PLAN_COLORS,
  FLOOR_PLAN_BREAKPOINTS 
} from '@/data/floor-plans'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export function FloorPlan({
  location,
  tables,
  selectedTables,
  onTableSelect,
  onTableHover,
  partySize,
  bookingDate,
  startTime,
  endTime,
  isLoading = false
}: FloorPlanProps) {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [currentBreakpoint, setCurrentBreakpoint] = useState(FLOOR_PLAN_BREAKPOINTS[2])

  // Get layout based on location
  const layout = location === 'upstairs' ? UPSTAIRS_LAYOUT : DOWNSTAIRS_LAYOUT
  
  // Memoize table positions for performance
  const tablePositions = useMemo(() => {
    const positions = new Map()
    layout.tables.forEach(tablePos => {
      positions.set(tablePos.id, tablePos)
    })
    return positions
  }, [layout.tables])

  // Handle responsive design
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      const breakpoint = FLOOR_PLAN_BREAKPOINTS.find(bp => 
        width >= bp.minWidth && (!bp.maxWidth || width <= bp.maxWidth)
      ) || FLOOR_PLAN_BREAKPOINTS[2]
      
      setCurrentBreakpoint(breakpoint)
    }

    const updateContainerSize = () => {
      const container = document.getElementById(`floor-plan-${location}`)
      if (container) {
        const rect = container.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    updateBreakpoint()
    updateContainerSize()

    window.addEventListener('resize', updateBreakpoint)
    window.addEventListener('resize', updateContainerSize)

    return () => {
      window.removeEventListener('resize', updateBreakpoint)
      window.removeEventListener('resize', updateContainerSize)
    }
  }, [location])

  // Real-time availability updates
  useEffect(() => {
    const channel = supabase
      .channel(`floor-plan-${location}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `booking_date=eq.${bookingDate}`
      }, (payload) => {
        // Handle real-time booking updates
        console.log('Real-time booking update:', payload)
        // The parent component should handle refreshing the tables data
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [location, bookingDate])

  // Handle table hover with tooltip positioning
  const handleTableHover = useCallback((tableId: string | null, event?: React.MouseEvent) => {
    setHoveredTable(tableId)
    onTableHover(tableId)

    if (tableId && event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const container = document.getElementById(`floor-plan-${location}`)
      const containerRect = container?.getBoundingClientRect()
      
      if (containerRect) {
        setTooltipPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top
        })
      }
    }
  }, [location, onTableHover])

  // Handle table selection
  const handleTableSelect = useCallback((tableId: string) => {
    onTableSelect(tableId)
  }, [onTableSelect])

  // Render venue features (bars, DJ booth, etc.)
  const renderFeatures = () => {
    return layout.features.map(feature => (
      <g key={feature.id}>
        <rect
          x={feature.position.x}
          y={feature.position.y}
          width={feature.position.width}
          height={feature.position.height}
          fill={feature.style?.fill || FLOOR_PLAN_COLORS.surface}
          stroke={feature.style?.stroke || FLOOR_PLAN_COLORS.secondary}
          strokeWidth={feature.style?.strokeWidth || 1}
          opacity={0.7}
          className="pointer-events-none"
        />
        {currentBreakpoint.showLabels && (
          <text
            x={feature.position.x + feature.position.width / 2}
            y={feature.position.y + feature.position.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium pointer-events-none select-none"
            fill={FLOOR_PLAN_COLORS.primary}
          >
            {feature.label}
          </text>
        )}
      </g>
    ))
  }

  // Render tables with availability status
  const renderTables = () => {
    return tables.map(table => {
      const position = tablePositions.get(table.table_number)
      if (!position) return null

      const isSelected = selectedTables.includes(table.id)
      const isHovered = hoveredTable === table.id
      
      // Scale position and size based on breakpoint
      const scaledPosition = {
        x: position.x * currentBreakpoint.scale,
        y: position.y * currentBreakpoint.scale
      }
      
      const scaledSize = {
        width: position.width * currentBreakpoint.scale,
        height: position.height * currentBreakpoint.scale
      }

      return (
        <InteractiveTable
          key={table.id}
          table={table}
          isSelected={isSelected}
          isHovered={isHovered}
          isAvailable={table.is_available}
          partySize={partySize}
          onClick={handleTableSelect}
          onHover={handleTableHover}
          position={scaledPosition}
          size={scaledSize}
        />
      )
    })
  }

  // Render loading overlay
  const renderLoadingOverlay = () => {
    if (!isLoading) return null

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
          <span className="text-gray-700 font-medium">Updating availability...</span>
        </div>
      </div>
    )
  }

  // Calculate SVG dimensions based on breakpoint
  const svgDimensions = {
    width: layout.dimensions.width * currentBreakpoint.scale,
    height: layout.dimensions.height * currentBreakpoint.scale,
    viewBox: `0 0 ${layout.dimensions.width} ${layout.dimensions.height}`
  }

  // Get tooltip table data
  const tooltipTable = hoveredTable ? tables.find(t => t.id === hoveredTable) : null

  return (
    <div 
      id={`floor-plan-${location}`}
      className="relative w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden border-2 border-amber-200"
      style={{ minHeight: '400px' }}
    >
      {/* Floor plan title */}
      <div className="absolute top-4 left-4 z-20">
        <h3 className="text-lg font-bold text-amber-900 capitalize bg-white bg-opacity-90 px-3 py-1 rounded-full">
          {location} Floor
        </h3>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-20 bg-white bg-opacity-90 rounded-lg p-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded-full" />
            <span>VIP Table</span>
          </div>
        </div>
      </div>

      {/* SVG Floor Plan */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <motion.svg
          width={svgDimensions.width}
          height={svgDimensions.height}
          viewBox={svgDimensions.viewBox}
          className="max-w-full max-h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Background pattern */}
          <defs>
            <pattern id={`wood-pattern-${location}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill={FLOOR_PLAN_COLORS.background} />
              <line x1="0" y1="0" x2="0" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
              <line x1="10" y1="0" x2="10" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
              <line x1="20" y1="0" x2="20" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
              <line x1="30" y1="0" x2="30" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background */}
          <rect
            width="100%"
            height="100%"
            fill={`url(#wood-pattern-${location})`}
            opacity={0.3}
          />

          {/* Venue features */}
          {renderFeatures()}

          {/* Tables */}
          {renderTables()}
        </motion.svg>
      </div>

      {/* Table tooltip */}
      {currentBreakpoint.showTooltips && tooltipTable && (
        <TableTooltip
          table={tooltipTable}
          isVisible={!!hoveredTable}
          position={tooltipPosition}
        />
      )}

      {/* Loading overlay */}
      {renderLoadingOverlay()}

      {/* Mobile optimization notice */}
      {currentBreakpoint.name === 'mobile' && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-800">
              Tap tables to select. Pinch to zoom for better view.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
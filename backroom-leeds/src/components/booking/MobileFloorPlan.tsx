'use client'

import { useState, useEffect, useRef } from 'react'
import { FloorPlan } from './FloorPlan'
import { motion, PanInfo } from 'framer-motion'
import { FloorPlanProps, MobileFloorPlanProps } from '@/types/booking'
import { InteractiveTable } from './InteractiveTable'
import { 
  UPSTAIRS_LAYOUT, 
  DOWNSTAIRS_LAYOUT, 
  FLOOR_PLAN_COLORS,
  MOBILE_TABLE_POSITIONS 
} from '@/data/floor-plans'
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react'

export function MobileFloorPlan({
  location,
  tables,
  selectedTables,
  onTableSelect,
  onTableHover,
  partySize,
  bookingDate,
  startTime,
  endTime,
  isLoading = false,
  isMobile,
  orientation,
  touchMode
}: MobileFloorPlanProps) {
  const [scale, setScale] = useState(0.7)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Get layout based on location
  const layout = location === 'upstairs' ? UPSTAIRS_LAYOUT : DOWNSTAIRS_LAYOUT
  const mobileConfig = MOBILE_TABLE_POSITIONS[location]

  // Reset view function
  const resetView = () => {
    setScale(mobileConfig.scale)
    setPosition({ x: mobileConfig.offsetX, y: mobileConfig.offsetY })
  }

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.3))
  }

  // Handle pinch-to-zoom gesture
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        // Calculate distance between touches for zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        // Store initial distance on first move
        if (!containerRef.current?.dataset.initialDistance) {
          containerRef.current!.dataset.initialDistance = distance.toString()
        }
        
        const initialDistance = parseFloat(containerRef.current!.dataset.initialDistance)
        const scaleChange = distance / initialDistance
        
        setScale(prev => Math.max(0.3, Math.min(2.0, prev * scaleChange)))
        containerRef.current!.dataset.initialDistance = distance.toString()
      }
    }

    const handleTouchEnd = () => {
      if (containerRef.current?.dataset.initialDistance) {
        delete containerRef.current.dataset.initialDistance
      }
    }

    const container = containerRef.current
    if (container && touchMode) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false })
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd)

      return () => {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [touchMode])

  // Reset view when orientation changes
  useEffect(() => {
    resetView()
  }, [orientation, location])

  // Handle pan gesture
  const handlePan = (event: any, info: PanInfo) => {
    if (!isDragging) return
    
    setPosition(prev => ({
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y
    }))
  }

  // Handle table selection with touch feedback
  const handleTableSelect = (tableId: string) => {
    // Haptic feedback on mobile
    if ('vibrate' in navigator && touchMode) {
      navigator.vibrate(50)
    }
    
    onTableSelect(tableId)
  }

  // Render venue features (simplified for mobile)
  const renderMobileFeatures = () => {
    return layout.features
      .filter(feature => feature.type === 'bar' || feature.type === 'dj_booth' || feature.type === 'dance_floor')
      .map(feature => (
        <g key={feature.id}>
          <rect
            x={feature.position.x}
            y={feature.position.y}
            width={feature.position.width}
            height={feature.position.height}
            fill={feature.style?.fill || FLOOR_PLAN_COLORS.surface}
            stroke={feature.style?.stroke || FLOOR_PLAN_COLORS.secondary}
            strokeWidth={2}
            opacity={0.6}
            className="pointer-events-none"
          />
          <text
            x={feature.position.x + feature.position.width / 2}
            y={feature.position.y + feature.position.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold pointer-events-none select-none"
            fill={FLOOR_PLAN_COLORS.primary}
          >
            {feature.label}
          </text>
        </g>
      ))
  }

  // Render tables optimized for mobile
  const renderMobileTables = () => {
    return tables.map(table => {
      const layoutTable = layout.tables.find(t => t.id === table.table_number)
      if (!layoutTable) return null

      const isSelected = selectedTables.includes(table.id)
      
      // Mobile-optimized sizing
      const mobileSize = {
        width: Math.max(layoutTable.width * 1.2, 60), // Minimum 60px for touch
        height: Math.max(layoutTable.height * 1.2, 60)
      }

      return (
        <InteractiveTable
          key={table.id}
          table={table}
          isSelected={isSelected}
          isHovered={false} // Disable hover on mobile
          isAvailable={table.is_available}
          partySize={partySize}
          onClick={handleTableSelect}
          onHover={() => {}} // No hover on mobile
          position={{
            x: layoutTable.x,
            y: layoutTable.y
          }}
          size={mobileSize}
        />
      )
    })
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden border-2 border-amber-200"
      style={{ 
        height: orientation === 'landscape' ? '70vh' : '50vh',
        minHeight: '400px'
      }}
    >
      {/* Mobile controls */}
      <div className="absolute top-3 left-3 z-30 flex gap-2">
        <button
          onClick={zoomIn}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all active:scale-95"
        >
          <ZoomIn className="w-4 h-4 text-amber-700" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all active:scale-95"
        >
          <ZoomOut className="w-4 h-4 text-amber-700" />
        </button>
        <button
          onClick={resetView}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
        </button>
      </div>

      {/* Floor title */}
      <div className="absolute top-3 right-3 z-30">
        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1">
          <span className="text-sm font-bold text-amber-900 capitalize">
            {location}
          </span>
        </div>
      </div>

      {/* Pan instructions */}
      {!isDragging && (
        <div className="absolute bottom-3 left-3 right-3 z-30">
          <div className="bg-white bg-opacity-90 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-amber-700">
              <Move className="w-3 h-3" />
              <span>Drag to pan • Pinch to zoom • Tap tables to select</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SVG with pan and zoom */}
      <div className="w-full h-full flex items-center justify-center touch-pan-x touch-pan-y">
        <motion.div
          drag
          dragConstraints={{
            left: -layout.dimensions.width,
            right: layout.dimensions.width,
            top: -layout.dimensions.height,
            bottom: layout.dimensions.height
          }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onPan={handlePan}
          animate={{ 
            scale,
            x: position.x,
            y: position.y
          }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="cursor-grab active:cursor-grabbing"
          style={{
            willChange: 'transform'
          }}
        >
          <svg
            ref={svgRef}
            width={layout.dimensions.width}
            height={layout.dimensions.height}
            viewBox={layout.dimensions.viewBox}
            className="select-none"
          >
            {/* Background pattern */}
            <defs>
              <pattern 
                id={`mobile-wood-pattern-${location}`} 
                x="0" y="0" width="40" height="40" 
                patternUnits="userSpaceOnUse"
              >
                <rect width="40" height="40" fill={FLOOR_PLAN_COLORS.background} />
                <line x1="0" y1="0" x2="0" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
                <line x1="20" y1="0" x2="20" y2="40" stroke={FLOOR_PLAN_COLORS.surface} strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background */}
            <rect
              width="100%"
              height="100%"
              fill={`url(#mobile-wood-pattern-${location})`}
              opacity={0.2}
            />

            {/* Venue features (simplified for mobile) */}
            {renderMobileFeatures()}

            {/* Tables (mobile optimized) */}
            {renderMobileTables()}
          </svg>
        </motion.div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-amber-800 font-medium">Loading tables...</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-specific features */}
      {touchMode && (
        <>
          {/* Zoom level indicator */}
          <div className="absolute bottom-20 right-3 z-30">
            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1">
              <span className="text-xs font-medium text-amber-700">
                {Math.round(scale * 100)}%
              </span>
            </div>
          </div>

          {/* Table selection counter */}
          {selectedTables.length > 0 && (
            <div className="absolute top-16 left-3 z-30">
              <div className="bg-green-500 text-white rounded-full px-3 py-1 shadow-md">
                <span className="text-sm font-bold">
                  {selectedTables.length} selected
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Hook for mobile detection and orientation
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [touchMode, setTouchMode] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      const isTouch = 'ontouchstart' in window
      const currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      
      setIsMobile(mobile)
      setTouchMode(isTouch)
      setOrientation(currentOrientation)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  return { isMobile, orientation, touchMode }
}

// Adaptive floor plan component that switches between desktop and mobile versions
interface AdaptiveFloorPlanProps extends FloorPlanProps {}

export function AdaptiveFloorPlan(props: AdaptiveFloorPlanProps) {
  const { isMobile, orientation, touchMode } = useMobileDetection()

  if (isMobile || touchMode) {
    return (
      <MobileFloorPlan
        {...props}
        isMobile={isMobile}
        orientation={orientation}
        touchMode={touchMode}
      />
    )
  }

  return <FloorPlan {...props} />
}
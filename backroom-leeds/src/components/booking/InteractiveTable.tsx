'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { InteractiveTableProps } from '@/types/booking'
import { FLOOR_PLAN_COLORS, FLOOR_PLAN_ANIMATIONS } from '@/data/floor-plans'
import { useState } from 'react'

export function InteractiveTable({
  table,
  isSelected,
  isHovered,
  isAvailable,
  partySize,
  onClick,
  onHover,
  position,
  size
}: InteractiveTableProps) {
  const [isPressed, setIsPressed] = useState(false)

  // Determine table state for styling
  const getTableState = () => {
    if (!isAvailable) return 'unavailable'
    if (isSelected) return 'selected'
    if (isHovered) return 'hover'
    return 'available'
  }

  const state = getTableState()
  const animation = FLOOR_PLAN_ANIMATIONS[state]

  // Check if table can accommodate party size
  const canAccommodateParty = partySize <= table.max_capacity && partySize >= table.min_capacity
  const isOptimalSize = partySize === table.preferred_capacity

  // Generate table colors based on state
  const getTableColors = () => {
    if (!isAvailable) {
      return {
        fill: FLOOR_PLAN_COLORS.unavailable,
        stroke: FLOOR_PLAN_COLORS.unavailable,
        opacity: 0.4
      }
    }
    
    if (isSelected) {
      return {
        fill: FLOOR_PLAN_COLORS.selected,
        stroke: FLOOR_PLAN_COLORS.primary,
        opacity: 1.0
      }
    }
    
    if (isHovered) {
      return {
        fill: FLOOR_PLAN_COLORS.hover,
        stroke: FLOOR_PLAN_COLORS.primary,
        opacity: 0.9
      }
    }
    
    if (table.is_premium) {
      return {
        fill: FLOOR_PLAN_COLORS.primary,
        stroke: FLOOR_PLAN_COLORS.secondary,
        opacity: 0.8
      }
    }
    
    return {
      fill: FLOOR_PLAN_COLORS.available,
      stroke: FLOOR_PLAN_COLORS.secondary,
      opacity: 0.7
    }
  }

  const colors = getTableColors()

  // Handle click events
  const handleClick = () => {
    if (isAvailable && canAccommodateParty) {
      onClick(table.id)
    }
  }

  // Handle hover events
  const handleMouseEnter = () => {
    if (isAvailable && canAccommodateParty) {
      onHover(table.id)
    }
  }

  const handleMouseLeave = () => {
    onHover(null)
  }

  // Render table shape based on type
  const renderTableShape = () => {
    const commonProps = {
      fill: colors.fill,
      stroke: colors.stroke,
      strokeWidth: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: colors.opacity,
      className: cn(
        'transition-all duration-300 ease-in-out',
        isAvailable && canAccommodateParty && 'cursor-pointer',
        !isAvailable && 'cursor-not-allowed',
        !canAccommodateParty && 'cursor-help'
      )
    }

    switch (table.is_booth ? 'booth' : size.width === size.height ? 'circle' : 'rectangle') {
      case 'circle':
        return (
          <circle
            {...commonProps}
            cx={position.x + size.width / 2}
            cy={position.y + size.height / 2}
            r={size.width / 2}
          />
        )
      
      case 'booth':
        return (
          <rect
            {...commonProps}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            rx={8}
            ry={8}
          />
        )
      
      default:
        return (
          <rect
            {...commonProps}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            rx={4}
            ry={4}
          />
        )
    }
  }

  // Render glow effect for selected/hovered tables
  const renderGlowEffect = () => {
    if (!animation.glow) return null

    const glowProps = {
      fill: 'none',
      stroke: FLOOR_PLAN_COLORS.primary,
      strokeWidth: 4,
      opacity: 0.5,
      filter: 'blur(2px)'
    }

    switch (table.is_booth ? 'booth' : size.width === size.height ? 'circle' : 'rectangle') {
      case 'circle':
        return (
          <circle
            {...glowProps}
            cx={position.x + size.width / 2}
            cy={position.y + size.height / 2}
            r={size.width / 2 + 4}
          />
        )
      
      default:
        return (
          <rect
            {...glowProps}
            x={position.x - 2}
            y={position.y - 2}
            width={size.width + 4}
            height={size.height + 4}
            rx={6}
            ry={6}
          />
        )
    }
  }

  // Render table number label
  const renderTableLabel = () => (
    <text
      x={position.x + size.width / 2}
      y={position.y + size.height / 2 - 5}
      textAnchor="middle"
      dominantBaseline="middle"
      className="font-bold text-sm pointer-events-none select-none"
      fill={isSelected || isHovered ? '#1A0F08' : '#D4AF37'}
    >
      {table.table_number}
    </text>
  )

  // Render capacity label
  const renderCapacityLabel = () => (
    <text
      x={position.x + size.width / 2}
      y={position.y + size.height / 2 + 8}
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs pointer-events-none select-none"
      fill={isSelected || isHovered ? '#1A0F08' : '#B8860B'}
    >
      {table.min_capacity === table.max_capacity 
        ? `${table.max_capacity}` 
        : `${table.min_capacity}-${table.max_capacity}`}
    </text>
  )

  // Render premium badge
  const renderPremiumBadge = () => {
    if (!table.is_premium) return null
    
    return (
      <text
        x={position.x + size.width - 5}
        y={position.y + 15}
        textAnchor="end"
        dominantBaseline="middle"
        className="text-xs font-bold pointer-events-none select-none"
        fill={FLOOR_PLAN_COLORS.primary}
      >
        VIP
      </text>
    )
  }

  // Render unavailable overlay
  const renderUnavailableOverlay = () => {
    if (isAvailable) return null

    return (
      <g className="pointer-events-none">
        <line
          x1={position.x}
          y1={position.y}
          x2={position.x + size.width}
          y2={position.y + size.height}
          stroke={FLOOR_PLAN_COLORS.unavailable}
          strokeWidth={3}
          opacity={0.8}
        />
        <line
          x1={position.x + size.width}
          y1={position.y}
          x2={position.x}
          y2={position.y + size.height}
          stroke={FLOOR_PLAN_COLORS.unavailable}
          strokeWidth={3}
          opacity={0.8}
        />
      </g>
    )
  }

  // Render party size warning
  const renderPartySizeWarning = () => {
    if (canAccommodateParty || !isAvailable) return null

    return (
      <text
        x={position.x + size.width / 2}
        y={position.y - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold pointer-events-none select-none"
        fill={FLOOR_PLAN_COLORS.unavailable}
      >
        Too {partySize > table.max_capacity ? 'large' : 'small'}
      </text>
    )
  }

  return (
    <motion.g
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{
        scale: animation.scale,
        opacity: animation.opacity
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      style={{
        cursor: isAvailable && canAccommodateParty ? 'pointer' : 
               !isAvailable ? 'not-allowed' : 'help'
      }}
    >
      {/* Glow effect */}
      {renderGlowEffect()}
      
      {/* Main table shape */}
      {renderTableShape()}
      
      {/* Table number */}
      {renderTableLabel()}
      
      {/* Capacity */}
      {renderCapacityLabel()}
      
      {/* Premium badge */}
      {renderPremiumBadge()}
      
      {/* Unavailable overlay */}
      {renderUnavailableOverlay()}
      
      {/* Party size warning */}
      {renderPartySizeWarning()}
      
      {/* Pulse animation for selected tables */}
      {animation.pulse && isSelected && (
        <motion.circle
          cx={position.x + size.width / 2}
          cy={position.y + size.height / 2}
          r={Math.max(size.width, size.height) / 2}
          fill="none"
          stroke={FLOOR_PLAN_COLORS.primary}
          strokeWidth={2}
          opacity={0.6}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.6, 0.2, 0.6] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.g>
  )
}
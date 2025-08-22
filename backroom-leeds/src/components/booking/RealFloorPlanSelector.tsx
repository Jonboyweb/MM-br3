'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, MapPin, Info, CheckCircle, Crown, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UPSTAIRS_LAYOUT, DOWNSTAIRS_LAYOUT, TABLE_COMBINATIONS } from '@/data/floor-plans';
import { calculateBookingAmount, formatCurrency } from '@/lib/booking-utils';
import { cn } from '@/lib/utils';

interface DatabaseTable {
  id: string;
  number: string;
  displayName: string;
  location: 'upstairs' | 'downstairs';
  minCapacity: number;
  maxCapacity: number;
  preferredCapacity: number;
  isPremium: boolean;
  isBooth: boolean;
  minSpend: number;
  depositRequired: number;
  amenities: string[];
  description: string | null;
  isAvailable: boolean;
  position: { x: number; y: number };
}

interface RealFloorPlanSelectorProps {
  venueId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  partySize: number;
  onTablesSelected: (tableIds: string[], amount: number) => void;
  onBack?: () => void;
  selectedTables: string[];
  className?: string;
}

export function RealFloorPlanSelector({ 
  venueId,
  bookingDate,
  startTime,
  endTime,
  partySize, 
  onTablesSelected, 
  onBack,
  selectedTables,
  className 
}: RealFloorPlanSelectorProps) {
  const [activeFloor, setActiveFloor] = useState<'upstairs' | 'downstairs'>('upstairs');
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTable, setHoveredTable] = useState<DatabaseTable | null>(null);

  // Fetch tables with availability
  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/tables/${venueId}?date=${bookingDate}&startTime=${startTime}&endTime=${endTime}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch table availability');
        }

        const data = await response.json();
        setTables(data.tables);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tables');
        console.error('Error fetching tables:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, [venueId, bookingDate, startTime, endTime]);

  // Get current floor's tables
  const currentFloorTables = tables.filter(table => table.location === activeFloor);
  const currentLayout = activeFloor === 'upstairs' ? UPSTAIRS_LAYOUT : DOWNSTAIRS_LAYOUT;

  // Get selected table objects
  const getSelectedTableObjects = () => tables.filter(t => selectedTables.includes(t.id));
  const selectedTableObjects = getSelectedTableObjects();

  const handleTableClick = (table: DatabaseTable) => {
    if (!table.isAvailable) return;
    
    const isSelected = selectedTables.includes(table.id);
    let newSelection: string[];
    
    if (isSelected) {
      newSelection = selectedTables.filter(id => id !== table.id);
    } else {
      newSelection = [...selectedTables, table.id];
    }
    
    // Calculate total amount based on selected tables
    const selectedTableObjects = tables.filter(t => newSelection.includes(t.id));
    const totalAmount = calculateBookingAmount(selectedTableObjects);
    
    onTablesSelected(newSelection, totalAmount);
  };

  const getTableColor = (table: DatabaseTable) => {
    if (!table.isAvailable) return 'fill-red-500/20 stroke-red-500';
    if (selectedTables.includes(table.id)) return 'fill-deco-gold stroke-deco-gold';
    if (table.isPremium) return 'fill-purple-500/20 stroke-purple-400';
    if (table.isBooth) return 'fill-blue-500/20 stroke-blue-400';
    return 'fill-gray-500/20 stroke-gray-400 hover:fill-gray-400/30';
  };

  const renderTable = (table: DatabaseTable) => {
    const layoutTable = currentLayout.tables.find(t => t.id === table.number);
    if (!layoutTable) return null;

    const isSelected = selectedTables.includes(table.id);
    const isHovered = hoveredTable?.id === table.id;

    return (
      <motion.g
        key={table.id}
        className="cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleTableClick(table)}
        onMouseEnter={() => setHoveredTable(table)}
        onMouseLeave={() => setHoveredTable(null)}
      >
        {/* Table shape */}
        {layoutTable.shape === 'booth' ? (
          <rect
            x={layoutTable.x}
            y={layoutTable.y}
            width={layoutTable.width}
            height={layoutTable.height}
            rx="8"
            className={cn(
              'transition-all duration-200 stroke-2',
              getTableColor(table),
              isSelected && 'drop-shadow-lg',
              isHovered && 'stroke-4'
            )}
          />
        ) : layoutTable.shape === 'circle' ? (
          <circle
            cx={layoutTable.x + layoutTable.width / 2}
            cy={layoutTable.y + layoutTable.height / 2}
            r={layoutTable.width / 2}
            className={cn(
              'transition-all duration-200 stroke-2',
              getTableColor(table),
              isSelected && 'drop-shadow-lg',
              isHovered && 'stroke-4'
            )}
          />
        ) : (
          <rect
            x={layoutTable.x}
            y={layoutTable.y}
            width={layoutTable.width}
            height={layoutTable.height}
            rx="4"
            className={cn(
              'transition-all duration-200 stroke-2',
              getTableColor(table),
              isSelected && 'drop-shadow-lg',
              isHovered && 'stroke-4'
            )}
          />
        )}

        {/* Table number */}
        <text
          x={layoutTable.x + layoutTable.width / 2}
          y={layoutTable.y + layoutTable.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-sm font-bold pointer-events-none"
        >
          {table.number}
        </text>

        {/* Premium indicator */}
        {table.isPremium && (
          <circle
            cx={layoutTable.x + layoutTable.width - 8}
            cy={layoutTable.y + 8}
            r="6"
            className="fill-yellow-400 stroke-yellow-600"
            strokeWidth="1"
          />
        )}
      </motion.g>
    );
  };

  if (loading) {
    return (
      <div className={cn('bg-secondary rounded-xl p-6 border border-deco-gold/20', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deco-gold mx-auto mb-4"></div>
          <p className="text-content-secondary">Loading table availability...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('bg-secondary rounded-xl p-6 border border-danger/20', className)}>
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalCapacity = selectedTableObjects.reduce((sum, table) => sum + table.maxCapacity, 0);
  const totalAmount = calculateBookingAmount(selectedTableObjects);

  return (
    <div className={cn('bg-secondary rounded-xl p-6 border border-deco-gold/20', className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-headline text-deco-gold mb-2">Select Your Tables</h3>
        <p className="text-content-secondary">
          Choose from our {activeFloor} tables - {new Date(bookingDate).toLocaleDateString()}, {startTime}
        </p>
      </div>

      {/* Floor Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-speakeasy-smoke rounded-lg p-1">
          <button
            onClick={() => setActiveFloor('upstairs')}
            className={cn(
              'px-6 py-2 rounded-md transition-all duration-200 font-medium',
              activeFloor === 'upstairs'
                ? 'bg-deco-gold text-speakeasy-black'
                : 'text-content-secondary hover:text-content-primary'
            )}
          >
            Upstairs ({tables.filter(t => t.location === 'upstairs').length} tables)
          </button>
          <button
            onClick={() => setActiveFloor('downstairs')}
            className={cn(
              'px-6 py-2 rounded-md transition-all duration-200 font-medium',
              activeFloor === 'downstairs'
                ? 'bg-deco-gold text-speakeasy-black'
                : 'text-content-secondary hover:text-content-primary'
            )}
          >
            Downstairs ({tables.filter(t => t.location === 'downstairs').length} tables)
          </button>
        </div>
      </div>

      {/* Floor Plan SVG */}
      <div className="bg-gradient-to-br from-speakeasy-charcoal to-speakeasy-smoke rounded-xl p-4 mb-6 overflow-hidden">
        <svg
          viewBox={currentLayout.dimensions.viewBox}
          className="w-full h-96 max-w-4xl mx-auto"
          style={{ background: currentLayout.background?.color }}
        >
          {/* Render features first (dance floor, bar, etc.) */}
          {currentLayout.features.map((feature) => (
            <g key={feature.id}>
              <rect
                x={feature.position.x}
                y={feature.position.y}
                width={feature.position.width}
                height={feature.position.height}
                fill={feature.style?.fill || '#666'}
                stroke={feature.style?.stroke || '#999'}
                strokeWidth={feature.style?.strokeWidth || 1}
                rx="4"
              />
              <text
                x={feature.position.x + feature.position.width / 2}
                y={feature.position.y + feature.position.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-xs font-medium pointer-events-none"
              >
                {feature.label}
              </text>
            </g>
          ))}
          
          {/* Render tables */}
          {currentFloorTables.map(renderTable)}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-deco-gold rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500/20 border border-purple-400 rounded"></div>
          <span>Premium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500/20 border border-blue-400 rounded"></div>
          <span>Booth</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selected Tables Summary */}
      {selectedTables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deco-gold/10 rounded-lg p-4 border border-deco-gold/30 mb-6"
        >
          <h4 className="font-medium text-deco-gold mb-3">Selected Tables</h4>
          <div className="space-y-2 mb-4">
            {selectedTableObjects.map((table) => (
              <div key={table.id} className="flex justify-between items-center text-sm">
                <span className="text-content-secondary">
                  Table {table.number} - {table.displayName} (up to {table.maxCapacity} people)
                </span>
                <span className="text-content-primary font-medium">
                  {formatCurrency(table.minSpend)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-deco-gold/20 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-content-secondary">Total Capacity:</span>
              <span className="font-medium text-content-primary">{totalCapacity} people</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-secondary">Total Amount:</span>
              <span className="text-lg font-medium text-deco-gold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          
          {totalCapacity < partySize && (
            <div className="mt-3 p-3 bg-warning/10 rounded text-sm text-warning flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Selected capacity ({totalCapacity}) is less than your party size ({partySize}). 
                Consider selecting additional tables.
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Table Details Tooltip */}
      <AnimatePresence>
        {hoveredTable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-speakeasy-charcoal rounded-lg p-4 border border-deco-gold/20"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-deco-gold">
                Table {hoveredTable.number} - {hoveredTable.displayName}
              </h4>
              <div className="flex gap-2">
                {hoveredTable.isPremium && (
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">Premium</span>
                )}
                {hoveredTable.isBooth && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Booth</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-content-tertiary">Capacity: </span>
                <span className="text-content-primary">{hoveredTable.minCapacity}-{hoveredTable.maxCapacity} people</span>
              </div>
              <div>
                <span className="text-content-tertiary">Min Spend: </span>
                <span className="text-content-primary">{formatCurrency(hoveredTable.minSpend)}</span>
              </div>
            </div>

            {hoveredTable.description && (
              <p className="text-content-secondary text-sm mb-3">{hoveredTable.description}</p>
            )}

            {hoveredTable.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hoveredTable.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-deco-gold/10 text-deco-gold rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}
            
            {!hoveredTable.isAvailable && (
              <div className="mt-3 p-2 bg-danger/10 rounded text-sm text-danger">
                This table is currently unavailable for your selected time
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="min-w-32"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        )}
        
        <Button
          variant="primary"
          onClick={() => {
            if (selectedTables.length > 0) {
              // The continue action will be handled by parent component
              console.log('Continue to payment with tables:', selectedTables);
            }
          }}
          disabled={selectedTables.length === 0}
          className="min-w-32 ml-auto"
        >
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
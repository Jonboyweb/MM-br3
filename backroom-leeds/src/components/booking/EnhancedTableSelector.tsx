'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, MapPin, Zap, Crown, Sparkles, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Table {
  id: string;
  number: string;
  capacity: number;
  location: 'upstairs' | 'downstairs';
  type: 'booth' | 'high-table' | 'vip' | 'premium';
  isAvailable: boolean;
  isRecommended?: boolean;
  priceMultiplier: number;
  amenities: string[];
  position: { x: number; y: number };
}

interface EnhancedTableSelectorProps {
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

export function EnhancedTableSelector({ 
  venueId,
  bookingDate,
  startTime,
  endTime,
  partySize, 
  onTablesSelected, 
  onBack,
  selectedTables,
  className 
}: EnhancedTableSelectorProps) {
  const [activeFloor, setActiveFloor] = useState<'upstairs' | 'downstairs'>('upstairs');
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Demo tables data
  const tables: Table[] = [
    // Upstairs Tables
    {
      id: 'u1',
      number: '1',
      capacity: 6,
      location: 'upstairs',
      type: 'booth',
      isAvailable: true,
      isRecommended: partySize <= 6,
      priceMultiplier: 1.2,
      amenities: ['Booth Seating', 'Reserved Area', 'Table Service'],
      position: { x: 20, y: 30 }
    },
    {
      id: 'u2',
      number: '2',
      capacity: 8,
      location: 'upstairs',
      type: 'vip',
      isAvailable: true,
      isRecommended: partySize >= 6,
      priceMultiplier: 2.0,
      amenities: ['VIP Section', 'Premium Location', 'Bottle Service', 'Private Waiter'],
      position: { x: 60, y: 20 }
    },
    {
      id: 'u3',
      number: '3',
      capacity: 4,
      location: 'upstairs',
      type: 'high-table',
      isAvailable: false,
      priceMultiplier: 1.0,
      amenities: ['High Table', 'Dance Floor Access'],
      position: { x: 80, y: 50 }
    },
    // Downstairs Tables
    {
      id: 'd1',
      number: '6',
      capacity: 10,
      location: 'downstairs',
      type: 'premium',
      isAvailable: true,
      isRecommended: partySize >= 8,
      priceMultiplier: 1.5,
      amenities: ['Large Table', 'Main Floor', 'DJ View', 'Premium Sound'],
      position: { x: 40, y: 40 }
    },
    {
      id: 'd2',
      number: '7',
      capacity: 6,
      location: 'downstairs',
      type: 'booth',
      isAvailable: true,
      priceMultiplier: 1.3,
      amenities: ['Booth Seating', 'Bar Access', 'Sound System'],
      position: { x: 70, y: 60 }
    }
  ];

  const currentFloorTables = tables.filter(table => table.location === activeFloor);
  const recommendations = tables.filter(table => table.isRecommended && table.isAvailable);

  const getTableIcon = (type: Table['type']) => {
    switch (type) {
      case 'vip':
        return Crown;
      case 'premium':
        return Star;
      case 'booth':
        return MapPin;
      default:
        return Users;
    }
  };

  const getTableColor = (table: Table) => {
    if (!table.isAvailable) return 'bg-danger/20 border-danger';
    if (selectedTables.includes(table.id)) return 'bg-deco-gold border-deco-gold';
    if (table.isRecommended) return 'bg-success/20 border-success';
    
    switch (table.type) {
      case 'vip':
        return 'bg-prohibition-burgundy/20 border-prohibition-burgundy hover:bg-prohibition-burgundy/30';
      case 'premium':
        return 'bg-deco-gold/20 border-deco-gold/60 hover:bg-deco-gold/30';
      case 'booth':
        return 'bg-speakeasy-smoke border-speakeasy-ash hover:bg-speakeasy-ash';
      default:
        return 'bg-speakeasy-charcoal border-speakeasy-ash hover:bg-speakeasy-smoke';
    }
  };

  const handleTableClick = (table: Table) => {
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
    const totalAmount = selectedTableObjects.reduce((sum, t) => sum + (t.capacity * 1000 * t.priceMultiplier), 0); // £10 per person * capacity * multiplier
    
    onTablesSelected(newSelection, totalAmount);
  };

  const getSelectedTableObjects = () => tables.filter(t => selectedTables.includes(t.id));
  const getTotalCapacity = () => getSelectedTableObjects().reduce((sum, table) => sum + table.capacity, 0);
  const getTotalPrice = () => getSelectedTableObjects().reduce((sum, table) => sum + (50 * table.priceMultiplier), 0);

  return (
    <div className={cn('bg-secondary rounded-xl p-6 border border-deco-gold/20', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-headline text-deco-gold mb-2">Select Your Tables</h2>
        <p className="text-content-secondary">
          Choose from our premium seating options with real-time availability
        </p>
      </div>

      {/* Floor Selection */}
      <div className="flex space-x-4 mb-6">
        {['upstairs', 'downstairs'].map((floor) => (
          <Button
            key={floor}
            variant={activeFloor === floor ? 'gold' : 'outline'}
            size="md"
            onClick={() => setActiveFloor(floor as 'upstairs' | 'downstairs')}
            className="capitalize"
          >
            {floor}
          </Button>
        ))}
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-success/10 rounded-lg border border-success/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-success" />
              <h3 className="font-medium text-success">Recommended for Your Party</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecommendations(false)}
            >
              ×
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.slice(0, 2).map((table) => {
              const Icon = getTableIcon(table.type);
              return (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-success/30 cursor-pointer hover:bg-success/5"
                  onClick={() => handleTableClick(table)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-content-primary">Table {table.number}</p>
                      <p className="text-sm text-content-tertiary">
                        {table.capacity} people • {table.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-success font-medium">
                    £{(50 * table.priceMultiplier).toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Floor Plan */}
      <div className="relative bg-speakeasy-black rounded-lg p-6 mb-6 border border-speakeasy-ash min-h-[400px]">
        <div className="absolute top-4 left-4 text-content-tertiary text-sm">
          {activeFloor === 'upstairs' ? 'Upper Level - R&B Zone' : 'Main Floor - Dance Floor'}
        </div>
        
        {/* Tables */}
        <div className="relative w-full h-80">
          {currentFloorTables.map((table) => {
            const Icon = getTableIcon(table.type);
            const isSelected = selectedTables.includes(table.id);
            
            return (
              <motion.div
                key={table.id}
                className={cn(
                  'absolute w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center',
                  getTableColor(table),
                  !table.isAvailable && 'cursor-not-allowed opacity-50',
                  hoveredTable?.id === table.id && 'scale-110 z-10'
                )}
                style={{
                  left: `${table.position.x}%`,
                  top: `${table.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredTable(table)}
                onMouseLeave={() => setHoveredTable(null)}
                onClick={() => handleTableClick(table)}
                whileHover={{ scale: table.isAvailable ? 1.1 : 1 }}
                whileTap={{ scale: table.isAvailable ? 0.95 : 1 }}
              >
                <div className="text-center">
                  <Icon className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs font-medium">{table.number}</div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-deco-gold rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-speakeasy-black" />
                  </motion.div>
                )}
                
                {table.type === 'vip' && (
                  <div className="absolute -top-1 -left-1">
                    <Crown className="w-4 h-4 text-deco-gold" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-speakeasy-smoke/80 rounded-lg p-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success/20 border border-success rounded"></div>
              <span className="text-content-tertiary">Recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-deco-gold/20 border border-deco-gold rounded"></div>
              <span className="text-content-tertiary">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-prohibition-burgundy/20 border border-prohibition-burgundy rounded"></div>
              <span className="text-content-tertiary">VIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Tooltip */}
      <AnimatePresence>
        {hoveredTable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-speakeasy-smoke rounded-lg p-4 border border-deco-gold/20 mb-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-content-primary">
                  Table {hoveredTable.number}
                </h4>
                <p className="text-sm text-content-secondary capitalize">
                  {hoveredTable.type} • {hoveredTable.capacity} people
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium text-deco-gold">
                  £{(50 * hoveredTable.priceMultiplier).toFixed(0)}
                </div>
                <div className="text-xs text-content-tertiary">per table</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-content-secondary">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {hoveredTable.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 text-xs bg-deco-gold/10 text-deco-gold rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            
            {!hoveredTable.isAvailable && (
              <div className="mt-3 p-2 bg-danger/10 rounded text-sm text-danger">
                This table is currently unavailable
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Summary */}
      {selectedTables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deco-gold/10 rounded-lg p-4 border border-deco-gold/30"
        >
          <h4 className="font-medium text-deco-gold mb-3">Selected Tables</h4>
          <div className="space-y-2 mb-4">
            {getSelectedTableObjects().map((table) => (
              <div key={table.id} className="flex justify-between items-center text-sm">
                <span className="text-content-secondary">
                  Table {table.number} ({table.capacity} people)
                </span>
                <span className="text-content-primary font-medium">
                  £{(50 * table.priceMultiplier).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-deco-gold/20 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-content-secondary">Total Capacity:</span>
              <span className="font-medium text-content-primary">{getTotalCapacity()} people</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-secondary">Total Price:</span>
              <span className="text-lg font-medium text-deco-gold">£{getTotalPrice().toFixed(0)}</span>
            </div>
          </div>
          
          {getTotalCapacity() < partySize && (
            <div className="mt-3 p-3 bg-warning/10 rounded text-sm text-warning flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Selected capacity ({getTotalCapacity()}) is less than your party size ({partySize}). 
                Consider selecting additional tables.
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
'use client'

import { motion } from 'framer-motion'
import { TableWithAvailability } from '@/types/booking'
import { Users, PoundSterling, Star, MapPin, X, Trash2 } from 'lucide-react'

interface TableSelectionSummaryProps {
  selectedTables: TableWithAvailability[]
  summary: {
    totalCapacity: number
    totalMinSpend: number
    totalDeposit: number
    tableCount: number
    isPremiumSelection: boolean
  }
  partySize: number
  onClearSelection: () => void
  onRemoveTable: (tableId: string) => void
}

export function TableSelectionSummary({
  selectedTables,
  summary,
  partySize,
  onClearSelection,
  onRemoveTable
}: TableSelectionSummaryProps) {
  // Format currency
  const formatCurrency = (amount: number) => `£${amount.toFixed(0)}`

  // Check if selection is optimal
  const isOptimalSelection = summary.totalCapacity >= partySize && 
                            summary.totalCapacity <= partySize + 4 // Allow some buffer

  // Get capacity status
  const getCapacityStatus = () => {
    if (summary.totalCapacity < partySize) {
      return {
        status: 'insufficient',
        message: `Need ${partySize - summary.totalCapacity} more seats`,
        color: 'text-red-600'
      }
    } else if (summary.totalCapacity > partySize + 6) {
      return {
        status: 'excessive',
        message: `${summary.totalCapacity - partySize} extra seats`,
        color: 'text-amber-600'
      }
    } else {
      return {
        status: 'good',
        message: `Perfect fit with ${summary.totalCapacity - partySize} extra seats`,
        color: 'text-green-600'
      }
    }
  }

  const capacityStatus = getCapacityStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Selected Tables</h3>
              <p className="text-amber-100 text-sm">
                {summary.tableCount} table{summary.tableCount !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          
          <button
            onClick={onClearSelection}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            title="Clear all selections"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected tables list */}
      <div className="p-4">
        <div className="space-y-3 mb-4">
          {selectedTables.map((table) => (
            <motion.div
              key={table.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between bg-amber-50 rounded-lg p-3 border border-amber-100"
            >
              <div className="flex items-center gap-3">
                {/* Table number badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  table.is_premium ? 'bg-amber-600' : 'bg-amber-500'
                }`}>
                  {table.table_number}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-amber-900">
                      {table.display_name || `Table ${table.table_number}`}
                    </h4>
                    {table.is_premium && (
                      <Star className="w-4 h-4 text-amber-600 fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-amber-700 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {table.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {table.min_capacity}-{table.max_capacity} people
                    </span>
                    {table.min_spend > 0 && (
                      <span className="flex items-center gap-1">
                        <PoundSterling className="w-3 h-3" />
                        {formatCurrency(table.min_spend)} min
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-amber-900">
                    {formatCurrency(table.deposit_required)}
                  </div>
                  <div className="text-xs text-amber-600">deposit</div>
                </div>
              </div>
              
              <button
                onClick={() => onRemoveTable(table.id)}
                className="ml-3 p-1 text-amber-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Remove table"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary totals */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total capacity */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Capacity</span>
              </div>
              <div className="text-lg font-bold text-amber-900">
                {summary.totalCapacity}
              </div>
              <div className={`text-xs ${capacityStatus.color}`}>
                {capacityStatus.message}
              </div>
            </div>

            {/* Total minimum spend */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <PoundSterling className="w-4 h-4" />
                <span className="text-xs font-medium">Min Spend</span>
              </div>
              <div className="text-lg font-bold text-amber-900">
                {formatCurrency(summary.totalMinSpend)}
              </div>
              <div className="text-xs text-amber-600">per party</div>
            </div>

            {/* Total deposit */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <span className="text-xs font-medium">Deposit</span>
              </div>
              <div className="text-lg font-bold text-amber-900">
                {formatCurrency(summary.totalDeposit)}
              </div>
              <div className="text-xs text-amber-600">to secure</div>
            </div>

            {/* Selection quality */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <span className="text-xs font-medium">Match</span>
              </div>
              <div className={`text-lg font-bold ${
                isOptimalSelection ? 'text-green-600' : 
                capacityStatus.status === 'insufficient' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {isOptimalSelection ? 'Optimal' : 
                 capacityStatus.status === 'insufficient' ? 'Too Small' : 'Good'}
              </div>
              <div className="text-xs text-amber-600">
                for {partySize} people
              </div>
            </div>
          </div>

          {/* Additional info */}
          {summary.isPremiumSelection && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">VIP Experience Selected</span>
              </div>
              <p className="text-xs text-amber-600 text-center mt-1">
                Premium tables include enhanced service and prime location
              </p>
            </div>
          )}

          {/* Capacity warning */}
          {capacityStatus.status === 'insufficient' && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700 mb-1">
                  <span className="font-medium">⚠️ Insufficient Capacity</span>
                </div>
                <p className="text-xs text-red-600">
                  Your selected tables can only accommodate {summary.totalCapacity} people, 
                  but you have {partySize} in your party. Please select additional tables 
                  or consider table combinations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
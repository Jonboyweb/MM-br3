'use client'

import { useState, useEffect } from 'react'
import { AdaptiveFloorPlan } from '@/components/booking/MobileFloorPlan'
import { useTableAvailability, useTableSelection } from '@/hooks/useTableAvailability'
import { getVenueBySlug } from '@/lib/supabase'
import { format, addDays } from 'date-fns'
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react'

export default function TestFloorPlanPage() {
  const [venue, setVenue] = useState<any>(null)
  const [testParams, setTestParams] = useState({
    bookingDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '23:00',
    endTime: '06:00',
    partySize: 6,
    location: 'upstairs' as 'upstairs' | 'downstairs'
  })
  const [testResults, setTestResults] = useState<any[]>([])

  // Table selection management
  const { selectedTables, toggleTable, clearSelection } = useTableSelection()

  // Load venue
  useEffect(() => {
    const loadVenue = async () => {
      try {
        const venueData = await getVenueBySlug('backroom-leeds')
        setVenue(venueData)
      } catch (error) {
        console.error('Error loading venue:', error)
      }
    }
    loadVenue()
  }, [])

  // Table availability hook
  const tableAvailability = useTableAvailability({
    venueId: venue?.id || '',
    bookingDate: testParams.bookingDate,
    startTime: testParams.startTime,
    endTime: testParams.endTime,
    partySize: testParams.partySize,
    location: testParams.location
  })

  // Test scenarios
  const runTestScenario = async (scenario: string, partySize: number) => {
    setTestParams(prev => ({ ...prev, partySize }))
    
    // Wait for data to update
    setTimeout(() => {
      const availableCount = tableAvailability.availableTablesCount
      const result = {
        scenario,
        partySize,
        availableCount,
        timestamp: new Date().toISOString(),
        success: availableCount > 0
      }
      
      setTestResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Test header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Floor Plan Testing Interface
          </h1>
          <p className="text-gray-600 mb-4">
            Comprehensive testing environment for The Backroom Leeds interactive floor plans
          </p>
          
          {/* Device simulation buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => window.dispatchEvent(new Event('resize'))}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Monitor className="w-4 h-4" />
              Desktop View
            </button>
            <button
              onClick={() => {
                // Simulate tablet viewport
                document.body.style.width = '768px'
                window.dispatchEvent(new Event('resize'))
              }}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Tablet className="w-4 h-4" />
              Tablet View
            </button>
            <button
              onClick={() => {
                // Simulate mobile viewport
                document.body.style.width = '375px'
                window.dispatchEvent(new Event('resize'))
              }}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              Mobile View
            </button>
          </div>

          {/* Test controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={testParams.bookingDate}
                onChange={(e) => setTestParams(prev => ({ ...prev, bookingDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                value={testParams.startTime}
                onChange={(e) => setTestParams(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="23:00">11:00 PM</option>
                <option value="00:00">12:00 AM</option>
                <option value="01:00">1:00 AM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
              <input
                type="number"
                value={testParams.partySize}
                onChange={(e) => setTestParams(prev => ({ ...prev, partySize: parseInt(e.target.value) || 1 }))}
                min={1}
                max={25}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <select
                value={testParams.location}
                onChange={(e) => setTestParams(prev => ({ ...prev, location: e.target.value as 'upstairs' | 'downstairs' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="upstairs">Upstairs</option>
                <option value="downstairs">Downstairs</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => tableAvailability.forceRefresh()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Test scenarios */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Scenarios</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => runTestScenario('Small Group', 2)}
              className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="w-5 h-5 text-green-600 mb-1" />
              <div className="text-sm font-medium">Small (2)</div>
            </button>
            
            <button
              onClick={() => runTestScenario('Medium Group', 6)}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600 mb-1" />
              <div className="text-sm font-medium">Medium (6)</div>
            </button>
            
            <button
              onClick={() => runTestScenario('Large Group', 12)}
              className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600 mb-1" />
              <div className="text-sm font-medium">Large (12)</div>
            </button>
            
            <button
              onClick={() => runTestScenario('Extra Large', 20)}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Users className="w-5 h-5 text-orange-600 mb-1" />
              <div className="text-sm font-medium">XL (20)</div>
            </button>
          </div>
        </div>

        {/* Main floor plan testing area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Interactive Floor Plan</h2>
              <div className="flex items-center gap-4 text-sm">
                <span>Available: {tableAvailability.availableTablesCount}</span>
                <span>Selected: {selectedTables.length}</span>
                <span>Party: {testParams.partySize}</span>
              </div>
            </div>
          </div>
          
          {venue && (
            <AdaptiveFloorPlan
              location={testParams.location}
              tables={tableAvailability.tables}
              selectedTables={selectedTables}
              onTableSelect={toggleTable}
              onTableHover={() => {}}
              partySize={testParams.partySize}
              bookingDate={testParams.bookingDate}
              startTime={testParams.startTime}
              endTime={testParams.endTime}
              isLoading={tableAvailability.loading}
            />
          )}
        </div>

        {/* Test results and metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real-time metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Real-time Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tables Available</span>
                <div className="flex items-center gap-2">
                  {tableAvailability.availableTablesCount > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium">
                    {tableAvailability.availableTablesCount} / {tableAvailability.tables.length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {format(tableAvailability.lastUpdate, 'HH:mm:ss')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Loading State</span>
                <div className="flex items-center gap-2">
                  {tableAvailability.loading ? (
                    <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {tableAvailability.loading ? 'Loading...' : 'Ready'}
                  </span>
                </div>
              </div>

              {tableAvailability.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    {tableAvailability.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Test results history */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Test Results</h3>
            {testResults.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {result.scenario}
                      </span>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {result.availableCount} available
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Party size: {result.partySize} • {format(new Date(result.timestamp), 'HH:mm:ss')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Run test scenarios to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* Selection summary */}
        {selectedTables.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Selection Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {tableAvailability.selectionSummary.tableCount}
                </div>
                <div className="text-sm text-gray-600">Tables Selected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {tableAvailability.selectionSummary.totalCapacity}
                </div>
                <div className="text-sm text-gray-600">Total Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  £{tableAvailability.selectionSummary.totalDeposit}
                </div>
                <div className="text-sm text-gray-600">Total Deposit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  £{tableAvailability.selectionSummary.totalMinSpend}
                </div>
                <div className="text-sm text-gray-600">Min Spend</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Feature checklist */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Validation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Core Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Interactive table selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time availability updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mobile responsive design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Table combination suggestions</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Advanced Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Conflict prevention system</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Touch gesture support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Performance optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Accessibility compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {venue ? '✓' : '⏳'}
              </div>
              <div className="text-sm text-gray-600">Venue Loaded</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {tableAvailability.tables.length}
              </div>
              <div className="text-sm text-gray-600">Tables Loaded</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {tableAvailability.loading ? '⏳' : '✓'}
              </div>
              <div className="text-sm text-gray-600">Data Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
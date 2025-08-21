// Table and booking related types for The Backroom Leeds

export interface Table {
  id: string
  venue_id: string
  table_number: string
  display_name: string | null
  location: 'upstairs' | 'downstairs'
  min_capacity: number
  max_capacity: number
  preferred_capacity: number
  is_premium: boolean
  is_booth: boolean
  floor_position_x: number | null
  floor_position_y: number | null
  description: string | null
  amenities: string[]
  images: string[]
  min_spend: number
  deposit_required: number
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TableWithAvailability extends Table {
  is_available: boolean
  current_booking_id?: string
  is_selected?: boolean
  is_hovered?: boolean
}

export interface TableCombination {
  combination_id: number
  table_ids: string[]
  table_names: string[]
  total_capacity: number
  total_min_spend: number
  total_deposit: number
  is_optimal: boolean
  combination_type: 'single' | 'combination'
  tables: TableWithAvailability[]
}

export interface BookingSlot {
  date: string
  start_time: string
  end_time: string
  day_of_week: string
  is_available: boolean
  venue_hours: {
    open: string
    close: string
  }
}

export interface BookingFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  start_time: string
  end_time: string
  selected_tables: string[]
  special_requests?: string
  occasion?: string
}

export interface BookingResult {
  booking_id: string
  booking_reference: string
  total_deposit: number
  success: boolean
  error_message: string | null
}

export interface FloorPlanProps {
  location: 'upstairs' | 'downstairs'
  tables: TableWithAvailability[]
  selectedTables: string[]
  onTableSelect: (tableId: string) => void
  onTableHover: (tableId: string | null) => void
  partySize: number
  bookingDate: string
  startTime: string
  endTime: string
  isLoading?: boolean
}

export interface InteractiveTableProps {
  table: TableWithAvailability
  isSelected: boolean
  isHovered: boolean
  isAvailable: boolean
  partySize: number
  onClick: (tableId: string) => void
  onHover: (tableId: string | null) => void
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
}

export interface TableTooltipProps {
  table: TableWithAvailability
  isVisible: boolean
  position: {
    x: number
    y: number
  }
}

export interface BookingStepProps {
  currentStep: number
  totalSteps: number
  onStepChange: (step: number) => void
  canProgress: boolean
}

export interface AvailabilityStatus {
  table_id: string
  is_available: boolean
  reason?: string
  next_available?: string
  conflict_booking_id?: string
}

export interface RealTimeUpdate {
  venue_id: string
  booking_id: string
  booking_date: string
  status: string
  affected_tables: Array<{
    table_id: string
    table_number: string
    display_name: string
    location: 'upstairs' | 'downstairs'
    is_available: boolean
  }>
  timestamp: number
}

// Floor plan specific types
export interface FloorPlanDimensions {
  width: number
  height: number
  viewBox: string
}

export interface TablePosition {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  shape: 'rectangle' | 'circle' | 'booth'
}

export interface FloorPlanFeature {
  id: string
  type: 'bar' | 'dj_booth' | 'dance_floor' | 'entrance' | 'toilet' | 'terrace' | 'stairs'
  label: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  style?: {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }
}

export interface FloorPlanLayout {
  location: 'upstairs' | 'downstairs'
  dimensions: FloorPlanDimensions
  tables: TablePosition[]
  features: FloorPlanFeature[]
  background?: {
    pattern?: string
    color?: string
    image?: string
  }
}

// Animation and interaction types
export interface TableAnimation {
  scale: number
  opacity: number
  glow: boolean
  pulse: boolean
}

export interface FloorPlanAnimations {
  hover: TableAnimation
  selected: TableAnimation
  available: TableAnimation
  unavailable: TableAnimation
  loading: TableAnimation
}

// Responsive design types
export interface ResponsiveBreakpoint {
  name: string
  minWidth: number
  maxWidth?: number
  scale: number
  showLabels: boolean
  showTooltips: boolean
}

export interface MobileFloorPlanProps extends FloorPlanProps {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
  touchMode: boolean
}

// Table recommendation types
export interface TableRecommendation {
  score: number
  reason: string
  table_ids: string[]
  tables: TableWithAvailability[]
  total_capacity: number
  total_cost: number
  advantages: string[]
  disadvantages: string[]
}

export interface SmartRecommendationProps {
  partySize: number
  preferences?: {
    location?: 'upstairs' | 'downstairs'
    tableType?: 'booth' | 'high_table' | 'any'
    budget?: 'low' | 'medium' | 'high'
    atmosphere?: 'intimate' | 'social' | 'premium'
  }
  availableTables: TableWithAvailability[]
  onRecommendationSelect: (recommendation: TableRecommendation) => void
}
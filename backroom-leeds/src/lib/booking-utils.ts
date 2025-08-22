import { Table, TableWithAvailability } from '@/types/booking';

/**
 * Calculate the total amount for a booking based on selected tables
 * Returns amount in pence (British currency)
 */
export function calculateBookingAmount(tables: TableWithAvailability[]): number {
  if (!tables || tables.length === 0) {
    return 0;
  }

  // Calculate total minimum spend across all tables
  const totalMinSpend = tables.reduce((total, table) => {
    return total + (table.min_spend || 0);
  }, 0);

  // For now, use minimum spend as the booking amount
  // In a real system, this might be more complex with different pricing models
  return totalMinSpend;
}

/**
 * Calculate deposit amount (20% of total or £20 minimum)
 */
export function calculateDepositAmount(totalAmount: number): number {
  const depositPercentage = 0.2; // 20%
  const minimumDeposit = 2000; // £20 in pence
  
  return Math.max(totalAmount * depositPercentage, minimumDeposit);
}

/**
 * Format amount from pence to pounds for display
 */
export function formatCurrency(amountInPence: number): string {
  return `£${(amountInPence / 100).toFixed(2)}`;
}

/**
 * Validate booking data before processing
 */
export function validateBookingData(bookingData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!bookingData.email || !bookingData.email.includes('@')) {
    errors.push('Valid email address is required');
  }

  if (!bookingData.firstName || bookingData.firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  if (!bookingData.lastName || bookingData.lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  if (!bookingData.phone || bookingData.phone.length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!bookingData.bookingDate) {
    errors.push('Booking date is required');
  }

  if (!bookingData.startTime || !bookingData.endTime) {
    errors.push('Booking time is required');
  }

  if (!bookingData.partySize || bookingData.partySize < 1 || bookingData.partySize > 25) {
    errors.push('Party size must be between 1 and 25');
  }

  // Date validation - booking must be in the future
  if (bookingData.bookingDate) {
    const bookingDate = new Date(bookingData.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      errors.push('Booking date must be in the future');
    }

    // Check if booking is too far in advance (6 months)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    if (bookingDate > sixMonthsFromNow) {
      errors.push('Bookings can only be made up to 6 months in advance');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a booking reference string
 */
export function generateBookingReference(bookingData: any): string {
  const date = new Date(bookingData.bookingDate);
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD format
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `BR${dateStr}${randomStr}`;
}

/**
 * Check if a date is a weekend (Friday, Saturday, Sunday for nightclub purposes)
 */
export function isWeekendNight(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6 || day === 0; // Friday (5), Saturday (6), Sunday (0)
}

/**
 * Get event information for a specific date
 */
export function getEventForDate(date: Date): { name: string; description: string; type: 'regular' | 'special' | 'private' } {
  const day = date.getDay();
  
  switch (day) {
    case 5: // Friday
      return {
        name: 'La Fiesta',
        description: 'Latin music night with R&B upstairs and Reggaeton downstairs',
        type: 'regular'
      };
    case 6: // Saturday
      return {
        name: 'Shhh!',
        description: 'Leeds\' longest running weekly R&B party',
        type: 'regular'
      };
    case 0: // Sunday
      return {
        name: 'Nostalgia',
        description: '2000s/2010s throwback sessions until 5am',
        type: 'regular'
      };
    default:
      return {
        name: 'Private Hire Available',
        description: 'Perfect for private celebrations and corporate events',
        type: 'private'
      };
  }
}

/**
 * Get venue opening hours for a specific date
 */
export function getVenueHours(date: Date): { open: string; close: string; isLateNight: boolean } {
  const day = date.getDay();
  
  if (day === 5 || day === 6) { // Friday or Saturday
    return { open: '23:00', close: '06:00', isLateNight: true };
  } else if (day === 0) { // Sunday
    return { open: '23:00', close: '05:00', isLateNight: true };
  } else {
    return { open: '20:00', close: '02:00', isLateNight: false };
  }
}

/**
 * Check if tables are suitable for party size
 */
export function areTablesSuitableForParty(tables: TableWithAvailability[], partySize: number): boolean {
  if (!tables || tables.length === 0) return false;
  
  const totalMaxCapacity = tables.reduce((total, table) => total + table.max_capacity, 0);
  const totalMinCapacity = tables.reduce((total, table) => total + table.min_capacity, 0);
  
  return partySize >= totalMinCapacity && partySize <= totalMaxCapacity;
}

/**
 * Get table capacity info for display
 */
export function getTableCapacityInfo(tables: TableWithAvailability[]): {
  minCapacity: number;
  maxCapacity: number;
  preferredCapacity: number;
} {
  if (!tables || tables.length === 0) {
    return { minCapacity: 0, maxCapacity: 0, preferredCapacity: 0 };
  }

  return {
    minCapacity: tables.reduce((sum, table) => sum + table.min_capacity, 0),
    maxCapacity: tables.reduce((sum, table) => sum + table.max_capacity, 0),
    preferredCapacity: tables.reduce((sum, table) => sum + table.preferred_capacity, 0),
  };
}
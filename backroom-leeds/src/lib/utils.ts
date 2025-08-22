import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for The Backroom Leeds booking system

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateBookingDuration(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}`)
  let end = new Date(`2000-01-01T${endTime}`)
  
  // Handle overnight venues (end time is next day)
  if (end < start) {
    end = new Date(`2000-01-02T${endTime}`)
  }
  
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60) // Hours
}

export function isValidBookingDate(date: string): boolean {
  const bookingDate = new Date(date)
  const today = new Date()
  const maxAdvanceBooking = new Date()
  maxAdvanceBooking.setMonth(maxAdvanceBooking.getMonth() + 6)
  
  return bookingDate >= today && bookingDate <= maxAdvanceBooking
}

export function generateBookingReference(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '') // YYMMDD
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BR-${dateStr}-${randomStr}`
}

export function getTableDisplayName(tableNumber: string, displayName?: string): string {
  return displayName || `Table ${tableNumber}`
}

export function getTableTypeLabel(table: any): string {
  if (table.is_booth) return 'Booth Seating'
  if (['6', '7', '8'].includes(table.table_number)) return 'Barrel Table'
  return 'High Table'
}

export function calculateOptimalCapacity(partySize: number): { min: number; max: number } {
  return {
    min: partySize,
    max: partySize + Math.ceil(partySize * 0.2) // Allow 20% buffer for comfort
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  // UK phone number validation (basic)
  const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  // Format UK phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('44')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+44${cleaned.substring(1)}`
  }
  return phone
}

// Error handling helpers
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error_description) return error.error_description
  return 'An unexpected error occurred'
}

export function isNetworkError(error: any): boolean {
  return error?.name === 'NetworkError' || 
         error?.message?.includes('fetch') ||
         error?.message?.includes('network')
}

// Animation helpers
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

// Local storage helpers for booking persistence
export function saveBookingProgress(data: any): void {
  try {
    localStorage.setItem('backroom_booking_progress', JSON.stringify(data))
  } catch (error) {
    console.warn('Could not save booking progress:', error)
  }
}

export function loadBookingProgress(): any | null {
  try {
    const data = localStorage.getItem('backroom_booking_progress')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.warn('Could not load booking progress:', error)
    return null
  }
}

export function clearBookingProgress(): void {
  try {
    localStorage.removeItem('backroom_booking_progress')
  } catch (error) {
    console.warn('Could not clear booking progress:', error)
  }
}
'use client'

import { useState } from 'react'
import { Calendar, Users, Clock, MapPin, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { BookingForm } from '@/components/booking/BookingForm'
import { PaymentForm } from '@/components/booking/PaymentForm'
import { RealFloorPlanSelector } from '@/components/booking/RealFloorPlanSelector'
import { useVenue } from '@/hooks/useVenue'
import { cn } from '@/lib/utils'

type BookingStep = 'form' | 'tables' | 'payment' | 'confirmation';

interface BookingData {
  bookingDate: string;
  startTime: string;
  endTime: string;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  occasion?: string;
  dietaryRequirements?: string;
  selectedTables?: string[];
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('form')
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  
  const { venue, loading: venueLoading, error: venueError } = useVenue('backroom-leeds')

  const handleFormSubmit = (data: BookingData) => {
    setBookingData(data)
    setCurrentStep('tables')
  }

  const handleTablesSelected = (tableIds: string[], amount: number) => {
    setSelectedTables(tableIds)
    setTotalAmount(amount)
    setCurrentStep('payment')
  }

  const handlePaymentSuccess = async (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent)
    setCurrentStep('confirmation')
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // TODO: Show error message to user
    alert(`Payment failed: ${error}`)
  }

  const handleBackToTables = () => {
    setCurrentStep('tables')
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-prohibition-burgundy via-speakeasy-black to-deco-gold/20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-deco-pattern"></div>
        <div className="absolute inset-0 noise-overlay"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-headline text-shadow-gold mb-6">
              BOOK YOUR TABLE
            </h1>
            <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-deco-champagne mb-4">
              Reserve Your Spot in Leeds&apos; Hidden Speakeasy
            </p>
            <p className="text-lg text-content-secondary mb-8 max-w-2xl mx-auto">
              Experience our revolutionary booking system with interactive floor plans, 
              real-time availability, and instant confirmation.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-deco-gold" />
                <span>Real-time Availability</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-deco-gold" />
                <span>Premium Table Selection</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-deco-gold" />
                <span>Interactive Floor Plans</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-deco-gold to-transparent"></div>
      </section>

      {/* Main Booking Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-8">
                {[
                  { step: 'form', label: 'Details', icon: Calendar },
                  { step: 'tables', label: 'Tables', icon: MapPin },
                  { step: 'payment', label: 'Payment', icon: Clock },
                  { step: 'confirmation', label: 'Confirm', icon: Star },
                ].map(({ step, label, icon: Icon }, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300',
                        currentStep === step
                          ? 'bg-deco-gold text-speakeasy-black'
                          : ['form', 'tables', 'payment', 'confirmation'].indexOf(currentStep) > index
                          ? 'bg-deco-gold/20 text-deco-gold'
                          : 'bg-speakeasy-smoke text-content-tertiary'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </div>
                    {index < 3 && (
                      <div
                        className={cn(
                          'hidden md:block w-16 h-1 mx-4 transition-all duration-300',
                          ['form', 'tables', 'payment', 'confirmation'].indexOf(currentStep) > index
                            ? 'bg-deco-gold'
                            : 'bg-speakeasy-ash'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[600px]">
              {currentStep === 'form' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <BookingForm
                    onSubmit={handleFormSubmit}
                    loading={loading}
                    className="max-w-4xl mx-auto"
                  />
                </motion.div>
              )}

              {currentStep === 'tables' && bookingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-headline text-deco-gold mb-4">Select Your Tables</h2>
                      <p className="text-content-secondary">
                        Choose from our premium table locations with real-time availability
                      </p>
                    </div>
                    
                    {venue ? (
                      <RealFloorPlanSelector
                        venueId={venue.id}
                        bookingDate={bookingData.bookingDate}
                        startTime={bookingData.startTime}
                        endTime={bookingData.endTime}
                        partySize={bookingData.partySize}
                        onTablesSelected={handleTablesSelected}
                        onBack={handleBackToForm}
                        selectedTables={selectedTables}
                      />
                    ) : (
                      <div className="text-center text-content-secondary">
                        Loading venue information...
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && bookingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-headline text-deco-gold mb-4">Secure Payment</h2>
                      <p className="text-content-secondary">
                        Complete your booking with our secure payment system
                      </p>
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20 mb-8">
                      <h3 className="text-xl font-headline text-deco-gold mb-4">Booking Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-content-secondary">
                        <div>
                          <strong>Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Party Size:</strong> {bookingData.partySize} people
                        </div>
                        <div>
                          <strong>Time:</strong> {bookingData.startTime} - {bookingData.endTime}
                        </div>
                        <div>
                          <strong>Tables:</strong> {selectedTables.length} selected
                        </div>
                      </div>
                    </div>
                    
                    {venue ? (
                      <PaymentForm
                        amount={totalAmount}
                        bookingData={{
                          ...bookingData,
                          selectedTables,
                          venueId: venue.id
                        }}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        loading={loading}
                      />
                    ) : (
                      <div className="text-center text-content-secondary">
                        Loading venue information...
                      </div>
                    )}
                    
                    <div className="text-center mt-6">
                      <Button
                        variant="ghost"
                        onClick={handleBackToTables}
                      >
                        Back to Table Selection
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="bg-secondary rounded-xl p-8 border border-deco-gold/20 max-w-2xl mx-auto">
                    <div className="text-success text-6xl mb-6">🎉</div>
                    <h2 className="text-4xl font-headline text-deco-gold mb-4">Booking Confirmed!</h2>
                    <p className="text-content-secondary mb-6">
                      Your table reservation has been confirmed. You&apos;ll receive an email confirmation shortly.
                    </p>
                    
                    {bookingData && (
                      <div className="bg-deco-gold/10 rounded-lg p-6 mb-8 text-left">
                        <h3 className="text-lg font-headline text-deco-gold mb-4">Booking Details</h3>
                        <div className="space-y-2 text-content-secondary">
                          <div><strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}</div>
                          <div><strong>Email:</strong> {bookingData.email}</div>
                          <div><strong>Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}</div>
                          <div><strong>Time:</strong> {bookingData.startTime} - {bookingData.endTime}</div>
                          <div><strong>Party Size:</strong> {bookingData.partySize} people</div>
                          <div><strong>Tables:</strong> {selectedTables.length} reserved</div>
                          {bookingData.specialRequests && (
                            <div><strong>Special Requests:</strong> {bookingData.specialRequests}</div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <Link href="/">
                        <Button variant="gold" size="lg" className="w-full">
                          Return to Homepage
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        onClick={() => window.print()}
                      >
                        Print Booking Confirmation
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
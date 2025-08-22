'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { Calendar, Users, Clock, ArrowRight, MapPin, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookingForm } from '@/components/booking/BookingForm'
import { PaymentForm } from '@/components/booking/PaymentForm'
import { Button } from '@/components/ui/Button'

type BookingStep = 'form' | 'tables' | 'payment' | 'confirmation';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('form')
  const [bookingData, setBookingData] = useState<any>(null)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [paymentAmount, setPaymentAmount] = useState(0)

  const handleFormSubmit = (data: any) => {
    setBookingData(data)
    setCurrentStep('tables')
  }

  const handleTablesSelected = (tableIds: string[], amount: number) => {
    setSelectedTables(tableIds)
    setPaymentAmount(amount)
    setCurrentStep('payment')
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    setCurrentStep('confirmation')
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Handle payment error
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
                  <BookingForm onSubmit={handleFormSubmit} />
                </motion.div>
              )}

              {currentStep === 'tables' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="bg-secondary rounded-xl p-8 border border-deco-gold/20">
                    <h2 className="text-3xl font-headline text-deco-gold mb-6">Interactive Floor Plan</h2>
                    <p className="text-content-secondary mb-8">
                      Our interactive floor plan system is fully implemented and ready for integration.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Real-time availability</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Interactive SVG floor plans</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Mobile touch gestures</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Smart recommendations</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Conflict prevention</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-3 bg-success/10 rounded-lg">
                          <span className="text-success">✓</span>
                          <span className="text-content-secondary">Premium highlighting</span>
                        </div>
                      </div>
                    </div>

                    {bookingData && (
                      <div className="bg-deco-gold/10 rounded-lg p-6 mb-8 border border-deco-gold/30">
                        <h3 className="font-headline text-deco-gold mb-4">Your Booking Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4 text-deco-gold" />
                            <span>{format(new Date(bookingData.bookingDate), 'EEEE, MMM do')}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 text-deco-gold" />
                            <span>{format(new Date(`2000-01-01T${bookingData.startTime}`), 'h:mm a')}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 text-deco-gold" />
                            <span>{bookingData.partySize} people</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleTablesSelected(['demo-table-1'], 5000)}
                      >
                        Continue to Payment (Demo)
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep('form')}
                      >
                        Back to Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && bookingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PaymentForm
                    amount={paymentAmount}
                    bookingData={bookingData}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
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
                    <div className="text-success text-5xl mb-6">✓</div>
                    <h2 className="text-3xl font-headline text-deco-gold mb-4">Booking Confirmed!</h2>
                    <p className="text-content-secondary mb-8">
                      Your table reservation has been confirmed. You&apos;ll receive an email confirmation shortly.
                    </p>
                    
                    <div className="space-y-4">
                      <Button variant="gold" size="lg" asChild>
                        <Link href="/">Return to Homepage</Link>
                      </Button>
                      
                      <Button variant="outline" size="lg">
                        View Booking Details
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
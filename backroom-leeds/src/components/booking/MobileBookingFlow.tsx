'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Users, Clock, MapPin, CreditCard, CheckCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScarcityMessage, scarcityPresets } from '@/components/ui/ScarcityMessage';
import { cn } from '@/lib/utils';

interface MobileBookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    eventId?: string;
    date?: string;
    partySize?: number;
  };
  onBookingComplete?: (bookingData: any) => void;
  className?: string;
}

type MobileStep = 'quick-select' | 'details' | 'payment' | 'confirmation';

interface QuickSelectOption {
  id: string;
  label: string;
  popular?: boolean;
  partySize: number;
  event: string;
  price: number;
}

const quickSelectOptions: QuickSelectOption[] = [
  {
    id: 'friday-small',
    label: 'La Fiesta - Small Group',
    popular: true,
    partySize: 4,
    event: 'la-fiesta',
    price: 60
  },
  {
    id: 'saturday-medium', 
    label: 'Shhh! - Medium Group',
    popular: true,
    partySize: 6,
    event: 'shhh',
    price: 80
  },
  {
    id: 'sunday-relaxed',
    label: 'Nostalgia - Sunday Session',
    partySize: 4,
    event: 'nostalgia',
    price: 50
  },
  {
    id: 'vip-experience',
    label: 'VIP Experience - Any Night',
    partySize: 8,
    event: 'any',
    price: 150
  }
];

export function MobileBookingFlow({
  isOpen,
  onClose,
  prefilledData,
  onBookingComplete,
  className
}: MobileBookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<MobileStep>('quick-select');
  const [selectedOption, setSelectedOption] = useState<QuickSelectOption | null>(null);
  const [bookingData, setBookingData] = useState<any>({});
  const [tablesLeft] = useState(Math.floor(Math.random() * 5) + 3); // 3-8 tables remaining
  const [currentViewers] = useState(Math.floor(Math.random() * 15) + 20); // 20-35 viewers

  useEffect(() => {
    if (prefilledData?.eventId) {
      const matchingOption = quickSelectOptions.find(opt => 
        opt.event === prefilledData.eventId
      );
      if (matchingOption) {
        setSelectedOption(matchingOption);
        setCurrentStep('details');
      }
    }
  }, [prefilledData]);

  const handleQuickSelect = (option: QuickSelectOption) => {
    setSelectedOption(option);
    setBookingData({
      ...bookingData,
      partySize: option.partySize,
      event: option.event,
      estimatedPrice: option.price
    });
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (details: any) => {
    setBookingData({ ...bookingData, ...details });
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCurrentStep('confirmation');
    onBookingComplete?.(bookingData);
  };

  const stepTitles = {
    'quick-select': 'Quick Booking',
    'details': 'Your Details',
    'payment': 'Secure Payment',
    'confirmation': 'Confirmed!'
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-modal bg-speakeasy-black/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-secondary border-b border-deco-gold/20 p-4 flex items-center justify-between">
          <h1 className="text-xl font-headline text-deco-gold tracking-wide">
            {stepTitles[currentStep]}
          </h1>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-speakeasy-smoke hover:bg-deco-gold border border-speakeasy-ash hover:border-deco-gold rounded-full flex items-center justify-center transition-all duration-200"
          >
            <X className="w-5 h-5 text-content-secondary hover:text-speakeasy-black" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-speakeasy-charcoal px-4 py-2">
          <div className="flex justify-between text-xs text-content-tertiary mb-2">
            <span>Step {['quick-select', 'details', 'payment', 'confirmation'].indexOf(currentStep) + 1} of 4</span>
            <span>{Math.round(((['quick-select', 'details', 'payment', 'confirmation'].indexOf(currentStep) + 1) / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-speakeasy-ash rounded-full h-2">
            <motion.div
              className="bg-deco-gold h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${((['quick-select', 'details', 'payment', 'confirmation'].indexOf(currentStep) + 1) / 4) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Scarcity Message */}
        <div className="p-4">
          <ScarcityMessage
            {...scarcityPresets.limitedTables(tablesLeft)}
            animate={true}
            className="mb-4"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <AnimatePresence mode="wait">
              {/* Step 1: Quick Select */}
              {currentStep === 'quick-select' && (
                <motion.div
                  key="quick-select"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-headline text-deco-gold mb-2">
                      QUICK BOOKING
                    </h2>
                    <p className="text-content-secondary">
                      Choose your perfect night out in seconds
                    </p>
                  </div>

                  {quickSelectOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      className="relative bg-secondary rounded-xl p-4 border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-200 cursor-pointer"
                      onClick={() => handleQuickSelect(option)}
                    >
                      {option.popular && (
                        <div className="absolute -top-2 right-4 bg-deco-gold text-speakeasy-black px-3 py-1 rounded-full text-xs font-headline">
                          POPULAR
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-headline text-lg text-content-primary mb-1">
                            {option.label}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-content-secondary">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {option.partySize} people
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Premium table
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-headline text-deco-gold">
                            £{option.price}
                          </div>
                          <div className="text-xs text-content-tertiary">
                            per table
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-deco-gold/10">
                        <div className="flex items-center justify-between text-xs text-content-tertiary">
                          <span>Instant confirmation</span>
                          <span className="flex items-center gap-1">
                            Select <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 text-center">
                    <Button variant="ghost" onClick={onClose}>
                      Need custom booking? Use full form
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {currentStep === 'details' && selectedOption && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-deco-gold/10 rounded-lg p-4 border border-deco-gold/30">
                    <h3 className="font-headline text-deco-gold mb-2">
                      {selectedOption.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-deco-gold" />
                        <span>{selectedOption.partySize} people</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-deco-gold" />
                        <span>£{selectedOption.price}</span>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    handleDetailsSubmit({});
                  }}>
                    <Input
                      label="Your Name"
                      placeholder="Full name"
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="07XXX XXXXXX"
                      leftIcon={<Phone className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                    
                    <div className="pt-4">
                      <Button variant="primary" size="lg" fullWidth type="submit">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div>
                    <h2 className="text-2xl font-headline text-deco-gold mb-4">
                      SECURE PAYMENT
                    </h2>
                    <p className="text-content-secondary">
                      Your booking is almost complete
                    </p>
                  </div>

                  <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-content-secondary">Deposit (20%)</span>
                      <span className="text-xl font-headline text-deco-gold">
                        £{selectedOption ? Math.round(selectedOption.price * 0.2) : 20}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-content-tertiary">Remaining on arrival</span>
                      <span className="text-content-tertiary">
                        £{selectedOption ? Math.round(selectedOption.price * 0.8) : 40}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    onClick={handlePaymentSubmit}
                  >
                    Complete Booking
                  </Button>
                  
                  <p className="text-xs text-content-tertiary">
                    Secure payment powered by Stripe • Your card details are encrypted
                  </p>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-6"
                >
                  <div className="text-success text-6xl mb-4">✓</div>
                  <h2 className="text-3xl font-headline text-deco-gold">
                    BOOKING CONFIRMED!
                  </h2>
                  <p className="text-content-secondary">
                    Your table is reserved. Check your email for confirmation details.
                  </p>
                  
                  <div className="bg-deco-gold/10 rounded-lg p-4 border border-deco-gold/30">
                    <h4 className="font-headline text-deco-gold mb-2">
                      BOOKING REFERENCE
                    </h4>
                    <div className="font-mono text-lg text-content-primary">
                      BR-{new Date().getFullYear()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="gold" size="lg" fullWidth onClick={onClose}>
                      Back to Homepage
                    </Button>
                    <Button variant="outline" size="lg" fullWidth>
                      Add to Calendar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation */}
        {currentStep !== 'confirmation' && (
          <div className="bg-secondary border-t border-deco-gold/20 p-4">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentStep === 'quick-select') {
                    onClose();
                  } else if (currentStep === 'details') {
                    setCurrentStep('quick-select');
                  } else if (currentStep === 'payment') {
                    setCurrentStep('details');
                  }
                }}
                className="min-w-24"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 'quick-select' ? 'Close' : 'Back'}
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-content-tertiary">
                  Step {['quick-select', 'details', 'payment'].indexOf(currentStep) + 1} of 3
                </div>
              </div>
              
              <div className="w-24"> {/* Spacer for alignment */} </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
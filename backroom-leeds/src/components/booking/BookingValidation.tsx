'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Users, Calendar, Phone, Mail, CreditCard, Info, Warning } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { format, isBefore, isAfter, addHours, isSameDay } from 'date-fns';

interface ValidationRule {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  category: 'timing' | 'capacity' | 'contact' | 'payment' | 'policy';
  isBlocking: boolean;
}

interface BookingValidationProps {
  bookingData: any;
  selectedTables: any[];
  onValidationChange: (isValid: boolean, errors: ValidationRule[]) => void;
  className?: string;
}

export function BookingValidation({ 
  bookingData, 
  selectedTables, 
  onValidationChange,
  className 
}: BookingValidationProps) {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    validateBooking();
  }, [bookingData, selectedTables]);

  const validateBooking = async () => {
    setIsValidating(true);
    const rules: ValidationRule[] = [];

    // Timing validations
    if (bookingData?.bookingDate) {
      const bookingDate = new Date(bookingData.bookingDate);
      const now = new Date();
      
      // Check if booking is in the past
      if (isBefore(bookingDate, now)) {
        rules.push({
          id: 'past-date',
          type: 'error',
          title: 'Invalid Date',
          message: 'Booking date cannot be in the past',
          category: 'timing',
          isBlocking: true,
        });
      }
      
      // Check advance booking limit (6 months)
      const maxAdvanceDate = addHours(now, 24 * 180); // 6 months
      if (isAfter(bookingDate, maxAdvanceDate)) {
        rules.push({
          id: 'advance-limit',
          type: 'error',
          title: 'Booking Too Far Ahead',
          message: 'Bookings can only be made up to 6 months in advance',
          category: 'timing',
          isBlocking: true,
        });
      }
      
      // Check same-day booking cutoff (4 hours)
      if (isSameDay(bookingDate, now)) {
        const cutoffTime = addHours(now, 4);
        const bookingTime = new Date(`${bookingData.bookingDate}T${bookingData.startTime}`);
        
        if (isBefore(bookingTime, cutoffTime)) {
          rules.push({
            id: 'same-day-cutoff',
            type: 'warning',
            title: 'Short Notice Booking',
            message: 'Same-day bookings require at least 4 hours notice. Please call to confirm availability.',
            category: 'timing',
            isBlocking: false,
          });
        }
      }
      
      // Weekend booking advice
      const dayName = format(bookingDate, 'EEEE');
      if (['Friday', 'Saturday'].includes(dayName)) {
        rules.push({
          id: 'weekend-booking',
          type: 'info',
          title: 'Weekend Booking',
          message: `${dayName} nights are our busiest. We recommend arriving early to avoid queues.`,
          category: 'timing',
          isBlocking: false,
        });
      }
    }

    // Capacity validations
    if (selectedTables.length > 0 && bookingData?.partySize) {
      const totalCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0);
      
      if (totalCapacity < bookingData.partySize) {
        rules.push({
          id: 'insufficient-capacity',
          type: 'error',
          title: 'Insufficient Capacity',
          message: `Selected tables accommodate ${totalCapacity} people, but your party size is ${bookingData.partySize}`,
          category: 'capacity',
          isBlocking: true,
        });
      }
      
      if (totalCapacity > bookingData.partySize * 1.5) {
        rules.push({
          id: 'excess-capacity',
          type: 'warning',
          title: 'Large Table Selection',
          message: `Selected tables accommodate ${totalCapacity} people for a party of ${bookingData.partySize}. Consider smaller tables to reduce costs.`,
          category: 'capacity',
          isBlocking: false,
        });
      }
      
      // Large party validation
      if (bookingData.partySize > 15) {
        rules.push({
          id: 'large-party',
          type: 'info',
          title: 'Large Party',
          message: 'Large parties may require special arrangements. Our team will contact you to confirm details.',
          category: 'capacity',
          isBlocking: false,
        });
      }
    }

    // Contact validations
    if (bookingData?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.email)) {
        rules.push({
          id: 'invalid-email',
          type: 'error',
          title: 'Invalid Email',
          message: 'Please enter a valid email address',
          category: 'contact',
          isBlocking: true,
        });
      }
    }

    if (bookingData?.phone) {
      const phoneRegex = /^(\+44|0)[1-9]\d{8,10}$/;
      const cleanPhone = bookingData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        rules.push({
          id: 'invalid-phone',
          type: 'error',
          title: 'Invalid Phone Number',
          message: 'Please enter a valid UK phone number',
          category: 'contact',
          isBlocking: true,
        });
      }
    }

    // Age validation
    if (!bookingData?.ageConfirmation) {
      rules.push({
        id: 'age-confirmation',
        type: 'error',
        title: 'Age Confirmation Required',
        message: 'You must confirm that all party members are 18 or over',
        category: 'policy',
        isBlocking: true,
      });
    }

    // Terms validation
    if (!bookingData?.agreeToTerms) {
      rules.push({
        id: 'terms-agreement',
        type: 'error',
        title: 'Terms Agreement Required',
        message: 'You must agree to our terms and conditions',
        category: 'policy',
        isBlocking: true,
      });
    }

    // Payment validations
    const totalCost = selectedTables.reduce((sum, table) => sum + (50 * table.priceMultiplier), 0);
    if (totalCost > 500) {
      rules.push({
        id: 'high-value-booking',
        type: 'info',
        title: 'High Value Booking',
        message: 'Bookings over £500 may require additional verification. We may contact you to confirm details.',
        category: 'payment',
        isBlocking: false,
      });
    }

    // Special occasion handling
    if (bookingData?.occasion?.toLowerCase().includes('birthday')) {
      rules.push({
        id: 'birthday-celebration',
        type: 'info',
        title: 'Birthday Celebration',
        message: 'Let us help make it special! Our team can arrange birthday surprises. Mention this when you arrive.',
        category: 'policy',
        isBlocking: false,
      });
    }

    setValidationRules(rules);
    
    const blockingErrors = rules.filter(rule => rule.isBlocking);
    const isValid = blockingErrors.length === 0;
    
    onValidationChange(isValid, rules);
    setIsValidating(false);
  };

  const getCategoryIcon = (category: ValidationRule['category']) => {
    switch (category) {
      case 'timing':
        return Clock;
      case 'capacity':
        return Users;
      case 'contact':
        return Phone;
      case 'payment':
        return CreditCard;
      case 'policy':
        return Info;
      default:
        return AlertCircle;
    }
  };

  const getTypeIcon = (type: ValidationRule['type']) => {
    switch (type) {
      case 'error':
        return AlertCircle;
      case 'warning':
        return Warning;
      case 'info':
        return Info;
      default:
        return AlertCircle;
    }
  };

  const getTypeColor = (type: ValidationRule['type']) => {
    switch (type) {
      case 'error':
        return 'text-danger border-danger bg-danger/10';
      case 'warning':
        return 'text-warning border-warning bg-warning/10';
      case 'info':
        return 'text-info border-info bg-info/10';
      default:
        return 'text-content-tertiary border-speakeasy-ash bg-speakeasy-smoke';
    }
  };

  const groupedRules = validationRules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, ValidationRule[]>);

  const categoryLabels = {
    timing: 'Date & Time',
    capacity: 'Capacity',
    contact: 'Contact Details',
    payment: 'Payment',
    policy: 'Policies',
  };

  if (validationRules.length === 0 && !isValidating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('bg-success/10 rounded-lg p-4 border border-success/20', className)}
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
          <div>
            <h3 className="font-medium text-success mb-1">All Good!</h3>
            <p className="text-sm text-content-secondary">
              Your booking details have been validated and are ready for processing.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {isValidating && (
        <div className="flex items-center gap-3 p-4 bg-speakeasy-smoke rounded-lg border border-speakeasy-ash">
          <div className="animate-spin w-5 h-5 border-2 border-deco-gold border-t-transparent rounded-full"></div>
          <span className="text-content-secondary">Validating booking details...</span>
        </div>
      )}

      <AnimatePresence>
        {Object.entries(groupedRules).map(([category, rules]) => {
          const CategoryIcon = getCategoryIcon(category as ValidationRule['category']);
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-secondary rounded-lg border border-speakeasy-ash overflow-hidden"
            >
              <div className="p-4 border-b border-speakeasy-ash">
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-5 h-5 text-deco-gold" />
                  <h3 className="font-medium text-content-primary">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {rules.map((rule) => {
                  const TypeIcon = getTypeIcon(rule.type);
                  
                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'p-3 rounded-lg border transition-all duration-200',
                        getTypeColor(rule.type)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <TypeIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{rule.title}</h4>
                          <p className="text-sm opacity-90">{rule.message}</p>
                          {rule.isBlocking && (
                            <div className="mt-2 text-xs font-medium">
                              This must be resolved before booking
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, isWeekend, isFriday, isSaturday, isSunday } from 'date-fns';
import { Calendar, Clock, Users, Mail, Phone, User, MessageSquare, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

// Validation schema
const bookingFormSchema = z.object({
  // Step 1: Booking Details
  bookingDate: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select arrival time'),
  endTime: z.string().min(1, 'Please select end time'),
  partySize: z.number().min(1, 'Party size must be at least 1').max(25, 'Maximum party size is 25'),
  
  // Step 2: Customer Details
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Step 3: Special Requests
  specialRequests: z.string().optional(),
  occasion: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  ageConfirmation: z.boolean().refine(val => val === true, 'You must confirm you are 18 or over'),
  marketingConsent: z.boolean().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  initialData?: Partial<BookingFormData>;
  loading?: boolean;
  className?: string;
}

type FormStep = 1 | 2 | 3 | 4;

export function BookingForm({ onSubmit, initialData, loading = false, className }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      startTime: '23:00',
      endTime: '06:00',
      partySize: 4,
      marketingConsent: false,
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedDate = watch('bookingDate');
  const watchedPartySize = watch('partySize');

  // Get venue hours based on day
  const getVenueHours = (date: string) => {
    const bookingDate = new Date(date);
    if (isFriday(bookingDate) || isSaturday(bookingDate)) {
      return { open: '23:00', close: '06:00', event: isFriday(bookingDate) ? 'La Fiesta' : 'Shhh!' };
    } else if (isSunday(bookingDate)) {
      return { open: '23:00', close: '05:00', event: 'Nostalgia' };
    }
    return { open: '20:00', close: '02:00', event: 'Available for Private Hire' };
  };

  // Update end time when date changes
  useEffect(() => {
    if (watchedDate) {
      const hours = getVenueHours(watchedDate);
      setValue('endTime', hours.close);
    }
  }, [watchedDate, setValue]);

  // Time options based on selected date
  const getTimeOptions = () => {
    const hours = getVenueHours(watchedDate);
    const isEventNight = isFriday(new Date(watchedDate)) || isSaturday(new Date(watchedDate)) || isSunday(new Date(watchedDate));
    
    if (isEventNight) {
      return [
        { value: '23:00', label: '11:00 PM' },
        { value: '23:30', label: '11:30 PM' },
        { value: '00:00', label: '12:00 AM' },
        { value: '00:30', label: '12:30 AM' },
        { value: '01:00', label: '1:00 AM' },
      ];
    }
    
    return [
      { value: '20:00', label: '8:00 PM' },
      { value: '20:30', label: '8:30 PM' },
      { value: '21:00', label: '9:00 PM' },
      { value: '21:30', label: '9:30 PM' },
      { value: '22:00', label: '10:00 PM' },
    ];
  };

  const handleNext = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(4, prev + 1) as FormStep);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as FormStep);
  };

  const getStepFields = (step: FormStep): (keyof BookingFormData)[] => {
    switch (step) {
      case 1:
        return ['bookingDate', 'startTime', 'endTime', 'partySize'];
      case 2:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 3:
        return ['specialRequests', 'occasion', 'dietaryRequirements'];
      case 4:
        return ['agreeToTerms', 'ageConfirmation'];
      default:
        return [];
    }
  };

  const onFormSubmit = (data: BookingFormData) => {
    onSubmit({ ...data, selectedTables });
  };

  const stepTitles = {
    1: 'Booking Details',
    2: 'Your Information',
    3: 'Special Requests',
    4: 'Confirmation',
  };

  const stepDescriptions = {
    1: 'When would you like to join us?',
    2: 'Help us prepare for your visit',
    3: 'Any special requirements?',
    4: 'Review and confirm your booking',
  };

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  step <= currentStep
                    ? 'bg-deco-gold text-speakeasy-black'
                    : 'bg-speakeasy-ash text-content-tertiary'
                )}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={cn(
                    'h-1 w-16 mx-2 transition-all duration-300',
                    step < currentStep ? 'bg-deco-gold' : 'bg-speakeasy-ash'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-headline text-deco-gold mb-2">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-content-secondary">
            {stepDescriptions[currentStep]}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Booking Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Date"
                    type="date"
                    leftIcon={<Calendar className="w-5 h-5" />}
                    error={errors.bookingDate?.message}
                    {...register('bookingDate')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 180), 'yyyy-MM-dd')}
                  />
                  
                  <Input
                    label="Party Size"
                    type="number"
                    leftIcon={<Users className="w-5 h-5" />}
                    error={errors.partySize?.message}
                    {...register('partySize', { valueAsNumber: true })}
                    min={1}
                    max={25}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Arrival Time
                    </label>
                    <select
                      {...register('startTime')}
                      className="w-full px-4 py-3 bg-speakeasy-charcoal border border-speakeasy-ash rounded-lg text-content-primary focus:border-deco-gold focus:ring-2 focus:ring-deco-gold/50 transition-all"
                    >
                      {getTimeOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-danger">{errors.startTime.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-2">
                      End Time
                    </label>
                    <input
                      {...register('endTime')}
                      value={getVenueHours(watchedDate).close}
                      readOnly
                      className="w-full px-4 py-3 bg-speakeasy-smoke border border-speakeasy-ash rounded-lg text-content-tertiary cursor-not-allowed"
                    />
                  </div>
                </div>
                
                {/* Event information */}
                {watchedDate && (
                  <div className="mt-6 p-4 bg-deco-gold/10 rounded-lg border border-deco-gold/30">
                    <div className="flex items-center gap-2 text-deco-gold mb-2">
                      <Info className="w-5 h-5" />
                      <span className="font-medium">
                        {format(new Date(watchedDate), 'EEEE')} Night
                      </span>
                    </div>
                    <p className="text-content-secondary text-sm">
                      {getVenueHours(watchedDate).event}
                      {isFriday(new Date(watchedDate)) || isSaturday(new Date(watchedDate)) || isSunday(new Date(watchedDate)) 
                        ? ' - Special event night with live DJs' 
                        : ' - Perfect for private celebrations'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Customer Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                    required
                  />
                  
                  <Input
                    label="Last Name"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Input
                    label="Email Address"
                    type="email"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                    required
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    leftIcon={<Phone className="w-5 h-5" />}
                    error={errors.phone?.message}
                    {...register('phone')}
                    required
                    hint="UK mobile number preferred for booking confirmations"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Special Requests */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                <Input
                  label="Special Occasion (Optional)"
                  placeholder="Birthday, Anniversary, Corporate Event..."
                  error={errors.occasion?.message}
                  {...register('occasion')}
                  hint="Help us make your night extra special"
                />
                
                <div className="mt-6">
                  <Textarea
                    label="Special Requests (Optional)"
                    placeholder="Table preferences, accessibility requirements, bottle service requests..."
                    error={errors.specialRequests?.message}
                    {...register('specialRequests')}
                    rows={4}
                    hint="Any specific requirements to help us prepare for your visit"
                  />
                </div>
                
                <div className="mt-6">
                  <Input
                    label="Dietary Requirements (Optional)"
                    placeholder="Allergies, dietary restrictions..."
                    error={errors.dietaryRequirements?.message}
                    {...register('dietaryRequirements')}
                    hint="Help us accommodate any dietary needs"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Booking Summary */}
              <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                <h3 className="text-lg font-headline text-deco-gold mb-4">Booking Summary</h3>
                <div className="space-y-3 text-content-secondary">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {watchedDate && format(new Date(watchedDate), 'EEEE, MMMM do, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Party Size:</span>
                    <span className="font-medium">{watchedPartySize} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span className="font-medium">{getVenueHours(watchedDate).event}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('ageConfirmation')}
                      className="mt-1 w-4 h-4 text-deco-gold bg-speakeasy-charcoal border-speakeasy-ash rounded focus:ring-deco-gold"
                    />
                    <label className="text-sm text-content-secondary">
                      I confirm that I am 18 years or older and that all members of my party will be 18+ on the night
                    </label>
                  </div>
                  {errors.ageConfirmation && (
                    <p className="text-danger text-sm">{errors.ageConfirmation.message}</p>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('agreeToTerms')}
                      className="mt-1 w-4 h-4 text-deco-gold bg-speakeasy-charcoal border-speakeasy-ash rounded focus:ring-deco-gold"
                    />
                    <label className="text-sm text-content-secondary">
                      I agree to the{' '}
                      <a href="/terms" className="text-deco-gold hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-deco-gold hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-danger text-sm">{errors.agreeToTerms.message}</p>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('marketingConsent')}
                      className="mt-1 w-4 h-4 text-deco-gold bg-speakeasy-charcoal border-speakeasy-ash rounded focus:ring-deco-gold"
                    />
                    <label className="text-sm text-content-secondary">
                      I'd like to receive updates about events and special offers (optional)
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="min-w-32"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button
              type="button"
              variant="gold"
              onClick={handleNext}
              className="min-w-32"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!isValid}
              className="min-w-32"
            >
              Complete Booking
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  bookingData: any;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  loading?: boolean;
  className?: string;
}

interface PaymentFormInnerProps extends Omit<PaymentFormProps, 'loading'> {
  onProcessing: (isProcessing: boolean) => void;
}

// Inner payment form component
function PaymentFormInner({ 
  amount, 
  bookingData, 
  onPaymentSuccess, 
  onPaymentError, 
  onProcessing,
  className 
}: PaymentFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'deposit'>('deposit');

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: paymentMethod === 'deposit' ? Math.max(2000, amount * 0.2) : amount, // £20 minimum deposit or 20% of total
            currency: 'gbp',
            bookingData,
            paymentType: paymentMethod,
          }),
        });

        const { clientSecret: secret } = await response.json();
        setClientSecret(secret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        onPaymentError('Failed to initialize payment. Please try again.');
      }
    };

    if (stripe) {
      createPaymentIntent();
    }
  }, [stripe, amount, bookingData, paymentMethod, onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    onProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      onProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${bookingData.firstName} ${bookingData.lastName}`,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        },
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      onPaymentError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
      onProcessing(false);
    }
  };

  const depositAmount = Math.max(2000, amount * 0.2); // £20 minimum or 20% of total
  const remainingAmount = amount - depositAmount;

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#FFFFFF',
        backgroundColor: '#1C1B1A',
        '::placeholder': {
          color: '#A0A0A0',
        },
        iconColor: '#D4AF37',
      },
      invalid: {
        color: '#C62828',
        iconColor: '#C62828',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
          <h3 className="text-xl font-headline text-deco-gold mb-4">Payment Option</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deposit Option */}
            <div
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                paymentMethod === 'deposit'
                  ? 'border-deco-gold bg-deco-gold/10'
                  : 'border-speakeasy-ash hover:border-deco-gold/50'
              )}
              onClick={() => setPaymentMethod('deposit')}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="deposit"
                  checked={paymentMethod === 'deposit'}
                  onChange={() => setPaymentMethod('deposit')}
                  className="mr-3 text-deco-gold"
                />
                <h4 className="font-medium text-content-primary">Secure Deposit</h4>
              </div>
              <p className="text-sm text-content-secondary mb-2">
                Pay £{(depositAmount / 100).toFixed(2)} deposit now
              </p>
              <p className="text-xs text-content-tertiary">
                Remaining £{(remainingAmount / 100).toFixed(2)} due on arrival
              </p>
            </div>

            {/* Full Payment Option */}
            <div
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                paymentMethod === 'card'
                  ? 'border-deco-gold bg-deco-gold/10'
                  : 'border-speakeasy-ash hover:border-deco-gold/50'
              )}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-3 text-deco-gold"
                />
                <h4 className="font-medium text-content-primary">Pay in Full</h4>
              </div>
              <p className="text-sm text-content-secondary mb-2">
                Pay £{(amount / 100).toFixed(2)} total now
              </p>
              <p className="text-xs text-success">
                5% discount applied
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-secondary rounded-xl p-6 border border-deco-gold/20">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-deco-gold mr-2" />
            <h3 className="text-xl font-headline text-deco-gold">Payment Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Element */}
            <div className="p-4 bg-speakeasy-charcoal border border-speakeasy-ash rounded-lg">
              <CardElement options={cardElementOptions} />
            </div>

            {/* Payment Summary */}
            <div className="bg-speakeasy-smoke rounded-lg p-4 border border-speakeasy-ash">
              <div className="flex justify-between items-center mb-2">
                <span className="text-content-secondary">
                  {paymentMethod === 'deposit' ? 'Deposit Amount' : 'Total Amount'}
                </span>
                <span className="text-lg font-medium text-content-primary">
                  £{((paymentMethod === 'deposit' ? depositAmount : amount) / 100).toFixed(2)}
                </span>
              </div>
              
              {paymentMethod === 'deposit' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-content-tertiary">Remaining on arrival</span>
                  <span className="text-content-tertiary">
                    £{(remainingAmount / 100).toFixed(2)}
                  </span>
                </div>
              )}
              
              {paymentMethod === 'card' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-success">Early payment discount (5%)</span>
                  <span className="text-success">
                    -£{((amount * 0.05) / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="flex items-start space-x-3 p-4 bg-info/10 rounded-lg border border-info/20">
              <Shield className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-content-secondary mb-1">
                  <strong>Secure Payment</strong>
                </p>
                <p className="text-content-tertiary">
                  Your payment is processed securely by Stripe. We never store your card details.
                  All transactions are encrypted and PCI DSS compliant.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isProcessing}
              disabled={!stripe || !clientSecret || isProcessing}
              className="font-headline"
            >
              <Lock className="w-5 h-5 mr-2" />
              {isProcessing 
                ? 'Processing Payment...' 
                : `Secure Payment £${((paymentMethod === 'deposit' ? depositAmount : amount) / 100).toFixed(2)}`
              }
            </Button>

            {/* Terms Notice */}
            <p className="text-xs text-content-tertiary text-center">
              By completing this payment, you agree to our booking terms and cancellation policy.
              Deposits are non-refundable within 48 hours of your booking date.
            </p>
          </form>
        </div>

        {/* Additional Information */}
        <div className="bg-deco-gold/5 rounded-lg p-4 border border-deco-gold/20">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-deco-gold mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-medium text-deco-gold mb-1">Booking Confirmation</h4>
              <p className="text-content-secondary">
                Once payment is complete, you'll receive an immediate email confirmation with your 
                booking reference and table details. Our team will also send you a reminder 24 hours 
                before your visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main payment form component with Stripe Elements wrapper
export function PaymentForm({ loading = false, ...props }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner 
        {...props} 
        onProcessing={setIsProcessing}
      />
    </Elements>
  );
}
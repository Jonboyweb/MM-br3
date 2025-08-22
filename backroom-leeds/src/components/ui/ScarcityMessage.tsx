'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Users, Zap, Fire, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScarcityMessageProps {
  type: 'limited-tables' | 'high-demand' | 'time-sensitive' | 'social-proof' | 'price-increase';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metric?: string | number;
  countdown?: Date;
  showIcon?: boolean;
  animate?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

interface LiveMetrics {
  currentViewers: number;
  tablesBooked: number;
  totalTables: number;
  averageBookingTime: string;
}

export function ScarcityMessage({
  type,
  urgency,
  message,
  metric,
  countdown,
  showIcon = true,
  animate = true,
  dismissible = false,
  onDismiss,
  className
}: ScarcityMessageProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    currentViewers: Math.floor(Math.random() * 20) + 15, // 15-35 viewers
    tablesBooked: Math.floor(Math.random() * 8) + 8,     // 8-16 tables booked
    totalTables: 16,
    averageBookingTime: '2.3 minutes'
  });

  // Update live metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        currentViewers: Math.max(10, prev.currentViewers + Math.floor(Math.random() * 6) - 3),
        tablesBooked: Math.min(16, Math.max(6, prev.tablesBooked + Math.floor(Math.random() * 3) - 1)),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!countdown) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = countdown.getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const getIcon = () => {
    switch (type) {
      case 'limited-tables':
        return Users;
      case 'high-demand':
        return TrendingUp;
      case 'time-sensitive':
        return Clock;
      case 'social-proof':
        return Eye;
      case 'price-increase':
        return Fire;
      default:
        return AlertTriangle;
    }
  };

  const getUrgencyStyles = () => {
    switch (urgency) {
      case 'critical':
        return 'bg-danger text-white border-danger shadow-glow-burgundy';
      case 'high':
        return 'bg-warning text-white border-warning';
      case 'medium':
        return 'bg-info text-white border-info';
      case 'low':
        return 'bg-deco-gold text-speakeasy-black border-deco-gold';
      default:
        return 'bg-speakeasy-smoke text-content-primary border-speakeasy-ash';
    }
  };

  const getAnimationProps = () => {
    if (!animate) return {};
    
    switch (urgency) {
      case 'critical':
        return {
          animate: { scale: [1, 1.02, 1] },
          transition: { duration: 1, repeat: Infinity }
        };
      case 'high':
        return {
          animate: { opacity: [1, 0.8, 1] },
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {};
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const Icon = getIcon();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        {...getAnimationProps()}
        className={cn(
          'relative flex items-center gap-3 px-6 py-4 rounded-lg border transition-all duration-300',
          getUrgencyStyles(),
          className
        )}
      >
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium text-sm">
                {message}
                {metric && (
                  <span className="ml-2 font-headline tracking-wide">
                    {metric}
                  </span>
                )}
              </p>
              
              {/* Live metrics */}
              {type === 'social-proof' && (
                <div className="flex items-center gap-4 mt-1 text-xs opacity-90">
                  <span>👀 {liveMetrics.currentViewers} viewing</span>
                  <span>📅 {liveMetrics.tablesBooked}/{liveMetrics.totalTables} tables booked</span>
                  <span>⚡ Avg booking: {liveMetrics.averageBookingTime}</span>
                </div>
              )}
            </div>
            
            {/* Countdown */}
            {countdown && timeLeft && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs opacity-90 mb-1">Time remaining</div>
                <div className="font-mono font-bold text-lg">
                  {timeLeft}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <span className="text-xs">×</span>
          </button>
        )}

        {/* Urgency Indicator */}
        {urgency === 'critical' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-ping" />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Preset scarcity messages for common scenarios
export const scarcityPresets = {
  limitedTables: (tablesLeft: number) => ({
    type: 'limited-tables' as const,
    urgency: tablesLeft <= 3 ? 'critical' as const : tablesLeft <= 6 ? 'high' as const : 'medium' as const,
    message: `Only ${tablesLeft} tables remaining for tonight!`,
    metric: `${tablesLeft} tables left`,
  }),
  
  highDemand: (viewersCount: number) => ({
    type: 'high-demand' as const,
    urgency: 'medium' as const,
    message: `${viewersCount} people are currently viewing this page`,
    metric: `${viewersCount} viewers`,
  }),
  
  recentBooking: (minutesAgo: number) => ({
    type: 'social-proof' as const,
    urgency: 'low' as const,
    message: `Someone just booked a table ${minutesAgo} minutes ago`,
  }),
  
  priceIncrease: (hours: number) => ({
    type: 'price-increase' as const,
    urgency: 'high' as const,
    message: `Prices increase in ${hours} hours - book now to save!`,
    countdown: new Date(Date.now() + hours * 60 * 60 * 1000),
  }),
  
  weekendRush: () => ({
    type: 'time-sensitive' as const,
    urgency: 'medium' as const,
    message: 'Weekend bookings fill up fast - secure your table now',
  }),
};
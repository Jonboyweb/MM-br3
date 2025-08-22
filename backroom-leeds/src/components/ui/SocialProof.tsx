'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, TrendingUp, Clock, MapPin, Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  location?: string;
  platform: 'google' | 'facebook' | 'tripadvisor' | 'instagram';
}

interface SocialProofProps {
  variant: 'reviews' | 'live-activity' | 'statistics' | 'testimonials' | 'media-mentions';
  layout?: 'horizontal' | 'vertical' | 'grid' | 'carousel';
  showCount?: number;
  autoRotate?: boolean;
  interval?: number;
  className?: string;
}

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    comment: 'Best R&B night in Leeds! The interactive booking made it so easy to get our perfect table.',
    date: '2024-08-15',
    verified: true,
    location: 'Leeds',
    platform: 'google'
  },
  {
    id: '2', 
    name: 'James R.',
    rating: 5,
    comment: 'La Fiesta was incredible! Two floors of amazing music and the venue has such a unique vibe.',
    date: '2024-08-10',
    verified: true,
    location: 'Yorkshire',
    platform: 'facebook'
  },
  {
    id: '3',
    name: 'Emma L.',
    rating: 5,
    comment: 'Found our new favorite Sunday spot! Nostalgia nights are exactly what we needed.',
    date: '2024-08-08',
    verified: true,
    location: 'Manchester',
    platform: 'instagram'
  },
  {
    id: '4',
    name: 'Mike D.',
    rating: 5,
    comment: 'Hidden gem under the railway bridge. Professional service and amazing sound system.',
    date: '2024-08-05',
    verified: true,
    location: 'Leeds',
    platform: 'tripadvisor'
  }
];

// Live activity simulation
const liveActivities = [
  { id: '1', text: 'Tom from Leeds just booked a VIP table', time: '2 min ago', type: 'booking' },
  { id: '2', text: 'Lisa shared our La Fiesta event', time: '5 min ago', type: 'share' },
  { id: '3', text: 'Party of 8 reserved Table 2 for Saturday', time: '8 min ago', type: 'booking' },
  { id: '4', text: 'Alex left a 5-star review', time: '12 min ago', type: 'review' },
  { id: '5', text: 'Rachel purchased tickets for Nostalgia', time: '15 min ago', type: 'ticket' },
];

// Statistics data
const statistics = [
  { label: 'Happy Customers', value: '15,000+', icon: Heart },
  { label: 'Tables Booked This Month', value: '2,847', icon: MapPin },
  { label: 'Average Rating', value: '4.9/5', icon: Star },
  { label: 'Years in Business', value: '8+', icon: Clock },
];

// Media mentions
const mediaMentions = [
  { outlet: 'Leeds Live', quote: 'The most innovative booking system in Yorkshire nightlife' },
  { outlet: 'Yorkshire Evening Post', quote: 'A hidden speakeasy that rivals London venues' },
  { outlet: 'Leeds Student', quote: 'The interactive floor plan is a game-changer' },
  { outlet: 'What\'s On Leeds', quote: 'Three legendary nights under one prohibition-themed roof' },
];

export function SocialProof({
  variant,
  layout = 'horizontal',
  showCount = 4,
  autoRotate = true,
  interval = 5000,
  className
}: SocialProofProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotation for reviews and activities
  useEffect(() => {
    if (!autoRotate || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        switch (variant) {
          case 'reviews':
            return (prev + 1) % sampleReviews.length;
          case 'live-activity':
            return (prev + 1) % liveActivities.length;
          case 'testimonials':
            return (prev + 1) % sampleReviews.length;
          default:
            return prev;
        }
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, isHovered, interval, variant]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-deco-gold fill-current' : 'text-content-tertiary'
        )}
      />
    ));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return MapPin;
      case 'share':
        return Share2;
      case 'review':
        return Star;
      case 'ticket':
        return Clock;
      default:
        return Users;
    }
  };

  if (variant === 'reviews') {
    const displayReviews = sampleReviews.slice(0, showCount);
    
    if (layout === 'carousel') {
      return (
        <div 
          className={cn('relative', className)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-secondary rounded-xl p-6 border border-deco-gold/20"
            >
              {(() => {
                const review = sampleReviews[currentIndex];
                return (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <blockquote className="text-lg text-content-secondary mb-4 italic">
                      &ldquo;{review.comment}&rdquo;
                    </blockquote>
                    <div className="text-sm text-content-tertiary">
                      <span className="font-medium text-deco-gold">{review.name}</span>
                      {review.location && <span> • {review.location}</span>}
                      {review.verified && <span className="text-success"> • Verified</span>}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className={cn(
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
          : 'space-y-4',
        className
      )}>
        {displayReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary rounded-lg p-4 border border-deco-gold/20 hover:border-deco-gold/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-deco-gold rounded-full flex items-center justify-center text-speakeasy-black font-headline">
                  {review.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-content-primary">{review.name}</span>
                  {review.verified && (
                    <span className="text-success text-xs">✓ Verified</span>
                  )}
                </div>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-content-secondary text-sm leading-relaxed">
                  {review.comment}
                </p>
                <div className="mt-2 text-xs text-content-tertiary">
                  {review.location} • {review.platform}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'live-activity') {
    return (
      <div className={cn('', className)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-speakeasy-smoke rounded-lg p-4 border border-deco-gold/20"
          >
            {(() => {
              const activity = liveActivities[currentIndex];
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-deco-gold rounded-full flex items-center justify-center">
                    <ActivityIcon className="w-4 h-4 text-speakeasy-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-content-primary text-sm">
                      {activity.text}
                    </p>
                    <p className="text-content-tertiary text-xs">
                      {activity.time}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'statistics') {
    return (
      <div className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-6',
        className
      )}>
        {statistics.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center bg-secondary rounded-xl p-6 border border-deco-gold/20 hover:border-deco-gold/40 transition-colors group"
            >
              <div className="w-16 h-16 bg-deco-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-speakeasy-black" />
              </div>
              <div className="text-2xl font-headline text-deco-gold mb-2">
                {stat.value}
              </div>
              <div className="text-content-secondary text-sm">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (variant === 'media-mentions') {
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-6',
        className
      )}>
        {mediaMentions.map((mention, index) => (
          <motion.div
            key={mention.outlet}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary rounded-lg p-6 border border-deco-gold/20 hover:border-deco-gold/40 transition-colors"
          >
            <div className="text-center">
              <div className="text-deco-gold font-headline text-lg mb-3">
                {mention.outlet}
              </div>
              <blockquote className="text-content-secondary italic leading-relaxed">
                &ldquo;{mention.quote}&rdquo;
              </blockquote>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}
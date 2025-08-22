'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface VideoHeroProps {
  videoSrc: string;
  posterImage?: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  features?: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  scarcityMessage?: {
    text: string;
    urgency: 'low' | 'medium' | 'high';
  };
  socialProof?: {
    text: string;
    metric?: string;
  };
  overlay?: 'dark' | 'light' | 'gradient' | 'prohibition';
  className?: string;
}

export function VideoHero({
  videoSrc,
  posterImage,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  features = [],
  scarcityMessage,
  socialProof,
  overlay = 'prohibition',
  className
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto-play muted video on load
    video.muted = true;
    video.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.log('Video autoplay failed:', error);
    });

    const handleEnded = () => {
      setIsPlaying(false);
      // Loop the video
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const getOverlayClasses = () => {
    switch (overlay) {
      case 'dark':
        return 'bg-black/50';
      case 'light':
        return 'bg-white/20';
      case 'gradient':
        return 'bg-gradient-to-t from-black/80 via-black/40 to-black/20';
      case 'prohibition':
        return 'bg-gradient-to-br from-prohibition-burgundy/80 via-speakeasy-black/60 to-deco-gold/20';
      default:
        return 'bg-black/40';
    }
  };

  const getScarcityColor = () => {
    switch (scarcityMessage?.urgency) {
      case 'high':
        return 'bg-danger text-white animate-pulse';
      case 'medium':
        return 'bg-warning text-white';
      case 'low':
        return 'bg-info text-white';
      default:
        return 'bg-deco-gold text-speakeasy-black';
    }
  };

  return (
    <section className={cn('relative min-h-hero overflow-hidden', className)}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          poster={posterImage}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className={cn('absolute inset-0', getOverlayClasses())} />
        
        {/* Art Deco Pattern Overlay */}
        <div className="absolute inset-0 bg-deco-pattern opacity-10" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Video Controls */}
      <div 
        className="absolute top-6 right-6 z-20"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0.7 }}
          className="flex gap-2"
        >
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 bg-speakeasy-black/50 hover:bg-deco-gold border border-deco-gold/30 hover:border-deco-gold rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white group-hover:text-speakeasy-black" />
            ) : (
              <Play className="w-5 h-5 text-white group-hover:text-speakeasy-black" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="w-12 h-12 bg-speakeasy-black/50 hover:bg-deco-gold border border-deco-gold/30 hover:border-deco-gold rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white group-hover:text-speakeasy-black" />
            ) : (
              <Volume2 className="w-5 h-5 text-white group-hover:text-speakeasy-black" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-hero flex items-center">
        <div className="max-w-4xl mx-auto text-center text-white">
          
          {/* Scarcity Message */}
          {scarcityMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-headline tracking-wide',
                getScarcityColor()
              )}>
                <Star className="w-4 h-4" />
                {scarcityMessage.text}
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-headline text-shadow-gold mb-6 tracking-wider"
          >
            {title.toUpperCase()}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-32 h-1 bg-gradient-gold mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-deco-champagne font-display mb-6"
          >
            {subtitle}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-content-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Feature Highlights */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 mb-12 text-sm"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                  <div className="text-deco-gold">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
          >
            {primaryCTA.href ? (
              <a href={primaryCTA.href}>
                <Button variant="gold" size="xl" className="min-w-48 font-headline">
                  {primaryCTA.text}
                </Button>
              </a>
            ) : (
              <Button 
                variant="gold" 
                size="xl" 
                onClick={primaryCTA.onClick}
                className="min-w-48 font-headline"
              >
                {primaryCTA.text}
              </Button>
            )}
            
            {secondaryCTA && (
              secondaryCTA.href ? (
                <a href={secondaryCTA.href}>
                  <Button variant="outline" size="xl" className="min-w-48 font-headline border-white text-white hover:bg-white hover:text-prohibition-burgundy">
                    {secondaryCTA.text}
                  </Button>
                </a>
              ) : (
                <Button 
                  variant="outline" 
                  size="xl" 
                  onClick={secondaryCTA.onClick}
                  className="min-w-48 font-headline border-white text-white hover:bg-white hover:text-prohibition-burgundy"
                >
                  {secondaryCTA.text}
                </Button>
              )
            )}
          </motion.div>

          {/* Social Proof */}
          {socialProof && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-lg px-6 py-3 inline-block"
            >
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-deco-gold fill-current" />
                  ))}
                </div>
                <span className="text-sm text-content-secondary">
                  {socialProof.text}
                  {socialProof.metric && (
                    <span className="font-medium text-deco-gold ml-1">
                      {socialProof.metric}
                    </span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-deco-gold to-transparent" />
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-8 bg-gradient-to-b from-transparent via-deco-gold to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
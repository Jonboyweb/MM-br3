'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Facebook, Twitter, Instagram, Link2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
  imageUrl?: string;
  eventSlug?: string;
  variant?: 'button' | 'floating' | 'inline';
  className?: string;
}

export function SocialShare({
  title,
  description,
  url,
  hashtags = [],
  imageUrl,
  eventSlug,
  variant = 'button',
  className
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultHashtags = [
    'TheBackroomLeeds',
    'LeedsNightlife',
    'Speakeasy',
    'ProhibitionBar',
    ...hashtags
  ];

  const shareData = {
    title,
    text: description,
    url,
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${defaultHashtags.join(',')}`,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500',
      url: `https://www.instagram.com/thebackroomleeds/`,
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handlePlatformShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (variant === 'floating') {
    return (
      <div className={cn('fixed right-6 top-1/2 transform -translate-y-1/2 z-50', className)}>
        <div className="relative">
          <Button
            variant="gold"
            size="icon"
            onClick={handleNativeShare}
            className="shadow-elevated hover:shadow-glow-gold"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="absolute right-14 top-0 bg-secondary border border-deco-gold/20 rounded-xl p-4 shadow-elevated min-w-48"
              >
                <h4 className="font-headline text-deco-gold text-sm tracking-wide mb-3">
                  SHARE EVENT
                </h4>
                <div className="space-y-2">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.name}
                        onClick={() => handlePlatformShare(platform)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-speakeasy-smoke rounded-lg transition-colors"
                      >
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white', platform.bgColor)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-content-secondary">{platform.name}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 p-2 hover:bg-speakeasy-smoke rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-deco-gold rounded-full flex items-center justify-center">
                      {copied ? (
                        <Check className="w-4 h-4 text-speakeasy-black" />
                      ) : (
                        <Copy className="w-4 h-4 text-speakeasy-black" />
                      )}
                    </div>
                    <span className="text-content-secondary">
                      {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-content-tertiary">Share:</span>
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={() => handlePlatformShare(platform)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110',
                platform.bgColor,
                'text-white'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
        <button
          onClick={handleCopyLink}
          className="w-8 h-8 bg-deco-gold rounded-full flex items-center justify-center text-speakeasy-black transition-all duration-200 hover:scale-110"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  // Button variant (default)
  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNativeShare}
        className="font-headline"
      >
        <Share2 className="w-4 h-4 mr-2" />
        SHARE EVENT
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-secondary border border-deco-gold/20 rounded-xl p-4 shadow-elevated min-w-64 z-50"
          >
            <h4 className="font-headline text-deco-gold text-sm tracking-wide mb-3">
              SHARE THIS EVENT
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => handlePlatformShare(platform)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg text-white transition-all duration-200 hover:scale-105',
                      platform.bgColor
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-deco-gold/20 pt-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 p-2 bg-deco-gold text-speakeasy-black rounded-lg transition-all duration-200 hover:bg-deco-champagne"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Music, Volume2, Headphones, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Genre {
  name: string;
  emoji: string;
  color: string;
  backgroundColor: string;
  description: string;
  popularity: number; // 1-5 scale
}

interface MusicGenreIndicatorsProps {
  genres: string[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showDescriptions?: boolean;
  showPopularity?: boolean;
  variant?: 'default' | 'compact' | 'showcase';
  className?: string;
}

// Enhanced genre styling for prohibition theme
const genreStyles: Record<string, Genre> = {
  'R&B': {
    name: 'R&B',
    emoji: '🎵',
    color: '#7C3AED',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    description: 'Smooth rhythms and soulful vocals',
    popularity: 5
  },
  'Latin': {
    name: 'Latin',
    emoji: '🌶️',
    color: '#DC2626', 
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    description: 'Salsa, bachata, and Latin hits',
    popularity: 4
  },
  'Reggaeton': {
    name: 'Reggaeton',
    emoji: '🔥',
    color: '#EA580C',
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
    description: 'High-energy Latin urban beats',
    popularity: 5
  },
  'Commercial': {
    name: 'Commercial',
    emoji: '📻',
    color: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    description: 'Chart hits and crowd favorites',
    popularity: 5
  },
  'Hip Hop': {
    name: 'Hip Hop',
    emoji: '🎤',
    color: '#1F2937',
    backgroundColor: 'rgba(31, 41, 55, 0.1)',
    description: 'Classic and modern hip hop',
    popularity: 4
  },
  '2000s': {
    name: '2000s',
    emoji: '💿',
    color: '#7C2D12',
    backgroundColor: 'rgba(124, 45, 18, 0.1)',
    description: 'Millennial classics and hits',
    popularity: 4
  },
  '2010s': {
    name: '2010s',
    emoji: '📱',
    color: '#BE185D',
    backgroundColor: 'rgba(190, 24, 93, 0.1)',
    description: 'Decade defining anthems',
    popularity: 4
  },
  'Throwbacks': {
    name: 'Throwbacks',
    emoji: '📻',
    color: '#B45309',
    backgroundColor: 'rgba(180, 83, 9, 0.1)',
    description: 'Nostalgic favorites and classics',
    popularity: 3
  },
  'Afrobeat': {
    name: 'Afrobeat',
    emoji: '🥁',
    color: '#15803D',
    backgroundColor: 'rgba(21, 128, 61, 0.1)',
    description: 'African rhythms and modern beats',
    popularity: 3
  },
  'Pop Classics': {
    name: 'Pop Classics',
    emoji: '⭐',
    color: '#C026D3',
    backgroundColor: 'rgba(192, 38, 211, 0.1)',
    description: 'Timeless pop anthems',
    popularity: 4
  }
};

export function MusicGenreIndicators({
  genres,
  layout = 'horizontal',
  showDescriptions = false,
  showPopularity = false,
  variant = 'default',
  className
}: MusicGenreIndicatorsProps) {
  
  const getGenreData = (genreName: string): Genre => {
    return genreStyles[genreName] || {
      name: genreName,
      emoji: '🎵',
      color: '#6B7280',
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      description: 'Music genre',
      popularity: 3
    };
  };

  const renderPopularityStars = (popularity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={cn(
          'text-xs',
          i < popularity ? 'text-deco-gold' : 'text-content-tertiary'
        )}
      >
        ⭐
      </span>
    ));
  };

  if (variant === 'showcase') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-headline text-deco-gold tracking-wide mb-2">
            MUSIC EXPERIENCE
          </h3>
          <div className="w-16 h-1 bg-gradient-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {genres.map((genreName, index) => {
            const genre = getGenreData(genreName);
            return (
              <motion.div
                key={genreName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary rounded-xl p-6 border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: genre.backgroundColor, border: `2px solid ${genre.color}40` }}
                  >
                    {genre.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline text-lg text-content-primary tracking-wide">
                      {genre.name.toUpperCase()}
                    </h4>
                    {showPopularity && (
                      <div className="flex items-center gap-1 mt-1">
                        {renderPopularityStars(genre.popularity)}
                      </div>
                    )}
                  </div>
                </div>
                
                {showDescriptions && (
                  <p className="text-content-secondary text-sm leading-relaxed">
                    {genre.description}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-deco-gold/10">
                  <div className="flex items-center gap-2 text-xs text-content-tertiary">
                    <Volume2 className="w-3 h-3" />
                    <span>Premium sound system optimized for this genre</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {genres.map((genreName) => {
          const genre = getGenreData(genreName);
          return (
            <motion.span
              key={genreName}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border"
              style={{
                color: genre.color,
                backgroundColor: genre.backgroundColor,
                borderColor: genre.color + '40'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span>{genre.emoji}</span>
              <span>{genre.name}</span>
            </motion.span>
          );
        })}
      </div>
    );
  }

  // Default variant
  const containerClass = cn(
    layout === 'horizontal' && 'flex flex-wrap gap-3',
    layout === 'vertical' && 'space-y-3',
    layout === 'grid' && 'grid grid-cols-2 md:grid-cols-3 gap-3',
    className
  );

  return (
    <div className={containerClass}>
      {genres.map((genreName, index) => {
        const genre = getGenreData(genreName);
        
        return (
          <motion.div
            key={genreName}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-speakeasy-smoke border border-deco-gold/20 rounded-lg p-4 hover:border-deco-gold/50 transition-all duration-200 group cursor-default"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: genre.backgroundColor, border: `2px solid ${genre.color}40` }}
              >
                {genre.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-headline text-content-primary tracking-wide">
                  {genre.name.toUpperCase()}
                </h4>
                {showPopularity && (
                  <div className="flex items-center gap-1">
                    {renderPopularityStars(genre.popularity)}
                  </div>
                )}
              </div>
            </div>
            
            {showDescriptions && (
              <p className="text-content-tertiary text-xs leading-relaxed">
                {genre.description}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
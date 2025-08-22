'use client';

import { motion } from 'framer-motion';
import { Users, Instagram, ExternalLink, Music, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DJ {
  id: string;
  name: string;
  stageName: string;
  bio: string;
  specialties: string[];
  instagramHandle?: string;
  mixcloudUrl?: string;
  soundcloudUrl?: string;
  isResident: boolean;
  isHeadliner?: boolean;
  avatar?: string;
  yearsActive: number;
}

interface DJLineupProps {
  djs: DJ[];
  eventSlug: string;
  layout?: 'grid' | 'list' | 'showcase';
  showBios?: boolean;
  className?: string;
}

// Sample DJ data for The Backroom Leeds
const sampleDJs: DJ[] = [
  {
    id: 'dj-soul',
    name: 'Marcus Johnson',
    stageName: 'DJ Soul',
    bio: 'Leeds R&B legend with 15 years behind the decks. Known for seamless transitions and reading the crowd perfectly.',
    specialties: ['R&B', 'Neo-Soul', 'Commercial', 'Hip Hop'],
    instagramHandle: '@djsoulleeds',
    isResident: true,
    isHeadliner: true,
    yearsActive: 15
  },
  {
    id: 'dj-carlos',
    name: 'Carlos Rodriguez',
    stageName: 'DJ Carlos',
    bio: 'Latin music specialist bringing authentic reggaeton and Latin hits to Leeds nightlife.',
    specialties: ['Reggaeton', 'Latin', 'Salsa', 'Bachata'],
    instagramHandle: '@djcarloslatino',
    isResident: true,
    yearsActive: 8
  },
  {
    id: 'dj-retro',
    name: 'Sarah Mitchell',
    stageName: 'DJ Retro',
    bio: 'Nostalgia expert specializing in 2000s and 2010s throwbacks that transport you back in time.',
    specialties: ['2000s', '2010s', 'Pop Classics', 'Throwbacks'],
    instagramHandle: '@djretrovibes',
    isResident: true,
    yearsActive: 6
  },
  {
    id: 'mc-fuego',
    name: 'Antonio Mendez',
    stageName: 'MC Fuego',
    bio: 'High-energy MC bringing the heat to La Fiesta with bilingual hosting and crowd interaction.',
    specialties: ['MCing', 'Bilingual Hosting', 'Crowd Control'],
    instagramHandle: '@mcfuegouk',
    isResident: true,
    yearsActive: 5
  }
];

export function DJLineup({ 
  djs = sampleDJs, 
  eventSlug,
  layout = 'grid',
  showBios = true,
  className 
}: DJLineupProps) {

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (layout === 'showcase') {
    return (
      <div className={cn('space-y-8', className)}>
        {djs.filter(dj => dj.isHeadliner || dj.isResident).map((dj, index) => (
          <motion.div
            key={dj.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-secondary rounded-xl p-8 border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* DJ Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-deco-gold to-deco-copper rounded-xl flex items-center justify-center overflow-hidden">
                    {dj.avatar ? (
                      <img src={dj.avatar} alt={dj.stageName} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-16 h-16 text-speakeasy-black" />
                    )}
                  </div>
                  {dj.isHeadliner && (
                    <div className="absolute -top-2 -right-2 bg-prohibition-burgundy text-white p-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* DJ Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-headline text-deco-gold tracking-wide mb-1">
                    {dj.stageName.toUpperCase()}
                  </h3>
                  <p className="text-content-secondary font-medium">{dj.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-content-tertiary">
                    <span>{dj.yearsActive}+ years experience</span>
                    {dj.isResident && (
                      <span className="bg-deco-gold/10 text-deco-gold px-2 py-1 rounded-full text-xs">
                        Resident DJ
                      </span>
                    )}
                  </div>
                </div>
                
                {showBios && (
                  <p className="text-content-secondary leading-relaxed">
                    {dj.bio}
                  </p>
                )}
                
                <div>
                  <h4 className="text-sm font-headline text-content-primary mb-2 tracking-wide">
                    SPECIALTIES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dj.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 text-xs bg-speakeasy-smoke border border-speakeasy-ash text-content-secondary rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex-shrink-0 flex flex-col gap-3 md:w-40">
                {dj.instagramHandle && (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleSocialClick(`https://instagram.com/${dj.instagramHandle.replace('@', '')}`)}
                    className="text-xs"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                )}
                {dj.mixcloudUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => handleSocialClick(dj.mixcloudUrl!)}
                    className="text-xs"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Mixes
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
      className
    )}>
      {djs.map((dj, index) => (
        <motion.div
          key={dj.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-secondary rounded-xl p-6 border border-deco-gold/20 hover:border-deco-gold/50 transition-all duration-300 group text-center"
        >
          {/* DJ Avatar */}
          <div className="relative mx-auto mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-deco-gold to-deco-copper rounded-full flex items-center justify-center overflow-hidden mx-auto">
              {dj.avatar ? (
                <img src={dj.avatar} alt={dj.stageName} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-10 h-10 text-speakeasy-black" />
              )}
            </div>
            {dj.isHeadliner && (
              <div className="absolute -top-1 -right-1 bg-prohibition-burgundy text-white p-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
              </div>
            )}
          </div>
          
          {/* DJ Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-headline text-lg text-deco-gold tracking-wide">
                {dj.stageName.toUpperCase()}
              </h3>
              <p className="text-sm text-content-tertiary">{dj.name}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-1">
              {dj.specialties.slice(0, 2).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs bg-deco-gold/10 text-deco-gold rounded"
                >
                  {specialty}
                </span>
              ))}
            </div>
            
            {dj.instagramHandle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSocialClick(`https://instagram.com/${dj.instagramHandle!.replace('@', '')}`)}
                className="w-full text-xs"
              >
                <Instagram className="w-3 h-3 mr-2" />
                {dj.instagramHandle}
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
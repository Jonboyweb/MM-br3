// tailwind.config.ts
// The Backroom Leeds - Art Deco/Prohibition Theme Style Guide
// Optimized for conversion, mobile-first, accessibility, and dark/light modes

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode switching
  theme: {
    extend: {
      // Custom Color Palette - Prohibition Era with Modern Accents & Light/Dark Mode Support
      colors: {
        // Primary Brand Colors - Dark Mode (Default)
        'speakeasy': {
          'black': '#0A0908',      // Deep noir black
          'charcoal': '#1C1B1A',   // Softer black for backgrounds
          'smoke': '#2A2928',      // Elevated surfaces
          'ash': '#3A3938',        // Borders and dividers
        },
        // Light Mode Alternatives
        'daylight': {
          'cream': '#FAF8F5',      // Light background
          'pearl': '#F5F2ED',      // Softer light background
          'silk': '#EDE8E0',       // Elevated surfaces
          'sand': '#DDD5C7',       // Borders and dividers
          'parchment': '#FFF9F0',  // Paper white
        },
        'prohibition': {
          'burgundy': '#6B0F1A',   // Rich burgundy - primary accent
          'wine': '#8B1A1A',       // Lighter wine red
          'crimson': '#A91E2C',    // Bright crimson for CTAs
          'rose': '#C73E4A',       // Hover states
          // Light mode variants
          'burgundy-light': '#8B2030', // Slightly brighter for light backgrounds
          'wine-light': '#A32A2A',     // Better contrast on light
          'crimson-light': '#B92E3C',  // Maintains vibrancy
          'rose-light': '#D74E5A',     // Softer hover state
        },
        'deco': {
          'gold': '#D4AF37',       // Antique gold - premium elements
          'brass': '#B8860B',      // Darker gold for text
          'copper': '#B87333',     // Copper metallic accents
          'bronze': '#CD7F32',     // Alternative metallic
          'champagne': '#F7E7CE',  // Light accent
          // Light mode variants
          'gold-dark': '#9B7F28',  // Darker gold for light backgrounds
          'brass-dark': '#8B6914', // Enhanced contrast
          'copper-dark': '#925A29', // Deeper copper
          'bronze-dark': '#A06528', // Richer bronze
        },
        // Functional Colors with mode variants
        'midnight': {
          'blue': '#191970',       // Deep blue for links (dark mode)
          'navy': '#2C3E50',       // Alternative dark
          'sky': '#4169E1',        // Light mode blue
          'royal': '#1E3A8A',      // Light mode alternative
        },
        // Semantic colors with automatic contrast
        'success': {
          DEFAULT: '#2F7D32',      // Dark mode
          light: '#1B5E20',        // Light mode - darker for contrast
        },
        'warning': {
          DEFAULT: '#F57C00',      // Dark mode
          light: '#E65100',        // Light mode - darker for contrast
        },
        'danger': {
          DEFAULT: '#C62828',      // Dark mode
          light: '#B71C1C',        // Light mode - darker for contrast
        },
        'info': {
          DEFAULT: '#0288D1',      // Dark mode
          light: '#01579B',        // Light mode - darker for contrast
        },
        // Neutral colors for text with mode support
        'content': {
          // Dark mode text colors
          'primary': '#FFFFFF',    // Primary text
          'secondary': '#E5E5E5',  // Secondary text
          'tertiary': '#A0A0A0',   // Muted text
          'disabled': '#666666',   // Disabled state
          // Light mode text colors
          'primary-light': '#0A0908',    // Primary text
          'secondary-light': '#2A2928',  // Secondary text
          'tertiary-light': '#6B6B6B',   // Muted text
          'disabled-light': '#999999',   // Disabled state
        },
      },

      // Typography System
      fontFamily: {
        // Headlines - Art Deco inspired
        'headline': ['Bebas Neue', 'Impact', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'deco': ['Poiret One', 'Raleway', 'sans-serif'],
        
        // Body Text - Clean and readable
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        
        // Special Use
        'script': ['Great Vibes', 'cursive'],  // Decorative elements
        'mono': ['JetBrains Mono', 'monospace'], // Booking codes
      },

      // Font Sizes - Dramatic scale for "dopamine design"
      fontSize: {
        // Tiny text for subtle details
        'micro': ['0.625rem', { lineHeight: '0.75rem' }],  // 10px
        'mini': ['0.6875rem', { lineHeight: '0.875rem' }], // 11px
        
        // Standard sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],     // 20px
        
        // Display sizes - Oversized for impact
        '2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
        '3xl': ['2rem', { lineHeight: '2.5rem' }],         // 32px
        '4xl': ['2.5rem', { lineHeight: '3rem' }],         // 40px
        '5xl': ['3rem', { lineHeight: '3.5rem' }],         // 48px
        '6xl': ['4rem', { lineHeight: '4.5rem' }],         // 64px
        '7xl': ['5rem', { lineHeight: '5.5rem' }],         // 80px
        '8xl': ['6rem', { lineHeight: '6.5rem' }],         // 96px
        '9xl': ['8rem', { lineHeight: '8.5rem' }],         // 128px
        'mega': ['10rem', { lineHeight: '10rem' }],        // 160px
      },

      // Spacing System - 8px base unit
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
      },

      // Border Radius - Art Deco geometric with modern touches
      borderRadius: {
        'none': '0',
        'sharp': '0.125rem',  // 2px - subtle corners
        'sm': '0.25rem',      // 4px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',       // 8px
        'lg': '0.75rem',      // 12px
        'xl': '1rem',         // 16px
        '2xl': '1.5rem',      // 24px
        '3xl': '2rem',        // 32px
        'art-deco': '0',      // Sharp corners for Art Deco elements
      },

      // Box Shadows - Dramatic depth with light/dark variants
      boxShadow: {
        // Dark mode shadows
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.5)',
        'glow-burgundy': '0 0 20px rgba(107, 15, 26, 0.7)',
        'inner-gold': 'inset 0 2px 8px rgba(212, 175, 55, 0.3)',
        'dramatic': '0 20px 40px rgba(0, 0, 0, 0.8)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.6)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'speakeasy': '0 4px 20px rgba(0, 0, 0, 0.9)',
        // Light mode shadows
        'glow-gold-light': '0 0 15px rgba(155, 127, 40, 0.4)',
        'glow-burgundy-light': '0 0 15px rgba(139, 32, 48, 0.5)',
        'inner-gold-light': 'inset 0 2px 6px rgba(155, 127, 40, 0.2)',
        'dramatic-light': '0 15px 30px rgba(0, 0, 0, 0.15)',
        'elevated-light': '0 8px 20px rgba(0, 0, 0, 0.1)',
        'subtle-light': '0 2px 6px rgba(0, 0, 0, 0.08)',
        'daylight': '0 4px 15px rgba(0, 0, 0, 0.12)',
      },

      // Animations - Smooth interactions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'marquee': 'marquee 20s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },

      // Background Patterns for Art Deco aesthetics with mode variants
      backgroundImage: {
        'deco-pattern': "url('/patterns/art-deco.svg')",
        'deco-pattern-light': "url('/patterns/art-deco-light.svg')",
        'noise': "url('/textures/noise.png')",
        'noise-light': "url('/textures/noise-light.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Dark mode gradients
        'gradient-radial-dark': 'radial-gradient(circle at center, #0A0908 0%, #1C1B1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gradient-burgundy': 'linear-gradient(135deg, #6B0F1A 0%, #A91E2C 100%)',
        'shimmer-gradient': 'linear-gradient(105deg, transparent 40%, rgba(212, 175, 55, 0.3) 50%, transparent 60%)',
        // Light mode gradients
        'gradient-radial-light': 'radial-gradient(circle at center, #FAF8F5 0%, #F5F2ED 100%)',
        'gradient-gold-light': 'linear-gradient(135deg, #9B7F28 0%, #8B6914 100%)',
        'gradient-burgundy-light': 'linear-gradient(135deg, #8B2030 0%, #B92E3C 100%)',
        'shimmer-gradient-light': 'linear-gradient(105deg, transparent 40%, rgba(155, 127, 40, 0.2) 50%, transparent 60%)',
      },

      // Grid Template Columns for Layout
      gridTemplateColumns: {
        'booking': 'repeat(auto-fit, minmax(280px, 1fr))',
        'events': 'repeat(auto-fill, minmax(320px, 1fr))',
        'gallery': 'repeat(auto-fill, minmax(250px, 1fr))',
      },

      // Custom transitions
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      // Z-index scale for layering
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'notification': '1080',
      },

      // Minimum heights for mobile optimization
      minHeight: {
        'touch': '44px',  // Minimum touch target
        'button': '48px', // Standard button height
        'input': '52px',  // Form inputs
        'hero': '70vh',   // Hero sections
        'section': '50vh', // Content sections
      },

      // Maximum widths for content
      maxWidth: {
        'content': '1280px',
        'narrow': '768px',
        'wide': '1440px',
        'form': '480px',
        'modal': '640px',
      },
    },
  },
  plugins: [
    // Custom plugin for Art Deco borders with dark/light mode support
    function({ addUtilities }: any) {
      const newUtilities = {
        // Art Deco border styles - Dark mode
        '.border-deco': {
          borderStyle: 'solid',
          borderWidth: '3px',
          borderImage: 'linear-gradient(45deg, #D4AF37 0%, #B8860B 50%, #D4AF37 100%) 1',
        },
        '.border-deco-double': {
          borderStyle: 'double',
          borderWidth: '6px',
          borderColor: '#D4AF37',
        },
        // Light mode border styles
        '.light .border-deco': {
          borderImage: 'linear-gradient(45deg, #9B7F28 0%, #8B6914 50%, #9B7F28 100%) 1',
        },
        '.light .border-deco-double': {
          borderColor: '#9B7F28',
        },
        
        // Geometric frame decorations
        '.frame-deco': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            border: '1px solid #D4AF37',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            border: '1px solid #B8860B',
            pointerEvents: 'none',
          },
        },

        // Text effects
        '.text-shadow-gold': {
          textShadow: '0 2px 4px rgba(212, 175, 55, 0.5)',
        },
        '.text-shadow-dramatic': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '.text-outline-gold': {
          '-webkit-text-stroke': '1px #D4AF37',
        },
        
        // Gradient text
        '.text-gradient-gold': {
          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        
        // Glass morphism for modern touch - Dark mode
        '.glass': {
          background: 'rgba(10, 9, 8, 0.7)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        },
        // Light mode glass effect
        '.light .glass': {
          background: 'rgba(250, 248, 245, 0.85)',
          border: '1px solid rgba(155, 127, 40, 0.15)',
        },
        
        // Noise texture overlay
        '.noise-overlay': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            opacity: '0.03',
            backgroundImage: "url('/textures/noise.png')",
            pointerEvents: 'none',
          },
        },

        // Booking status indicators
        '.status-available': {
          backgroundColor: '#2F7D32',
          color: 'white',
        },
        '.status-limited': {
          backgroundColor: '#F57C00',
          color: 'white',
        },
        '.status-booked': {
          backgroundColor: '#C62828',
          color: 'white',
        },
        '.status-vip': {
          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
          color: '#0A0908',
        },

        // Mobile-optimized touch targets
        '.touch-target': {
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        // Conversion-focused CTA styles - Dark mode
        '.cta-primary': {
          backgroundColor: '#A91E2C',
          color: 'white',
          padding: '16px 32px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#C73E4A',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px rgba(169, 30, 44, 0.3)',
          },
        },
        '.cta-gold': {
          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
          color: '#0A0908',
          padding: '16px 32px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
          },
        },
        // Light mode CTA styles
        '.light .cta-primary': {
          backgroundColor: '#B92E3C',
          '&:hover': {
            backgroundColor: '#D74E5A',
            boxShadow: '0 8px 16px rgba(185, 46, 60, 0.25)',
          },
        },
        '.light .cta-gold': {
          backgroundImage: 'linear-gradient(135deg, #9B7F28 0%, #8B6914 100%)',
          color: '#FAF8F5',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(155, 127, 40, 0.3)',
          },
        },

        // Sticky booking bar for mobile
        '.booking-sticky': {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: '1020',
          backgroundColor: '#0A0908',
          borderTop: '2px solid #D4AF37',
          padding: '12px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.8)',
        },

        // WCAG AA compliant focus states
        '.focus-accessible': {
          '&:focus': {
            outline: '3px solid #D4AF37',
            outlineOffset: '2px',
          },
          '&:focus:not(:focus-visible)': {
            outline: 'none',
          },
        },
        '.light .focus-accessible': {
          '&:focus': {
            outline: '3px solid #9B7F28',
          },
        },

        // Theme-aware utility classes
        '.bg-primary': {
          backgroundColor: '#0A0908', // Dark mode primary bg
        },
        '.light .bg-primary': {
          backgroundColor: '#FAF8F5', // Light mode primary bg
        },
        '.bg-secondary': {
          backgroundColor: '#1C1B1A', // Dark mode secondary bg
        },
        '.light .bg-secondary': {
          backgroundColor: '#F5F2ED', // Light mode secondary bg
        },
        '.text-primary': {
          color: '#FFFFFF', // Dark mode primary text
        },
        '.light .text-primary': {
          color: '#0A0908', // Light mode primary text
        },
        '.text-secondary': {
          color: '#E5E5E5', // Dark mode secondary text
        },
        '.light .text-secondary': {
          color: '#2A2928', // Light mode secondary text
        },
        '.border-primary': {
          borderColor: '#3A3938', // Dark mode border
        },
        '.light .border-primary': {
          borderColor: '#DDD5C7', // Light mode border
        },

        // Theme switcher button styles
        '.theme-toggle': {
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: '1080',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1C1B1A',
          border: '2px solid #D4AF37',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
          },
        },
        '.light .theme-toggle': {
          backgroundColor: '#F5F2ED',
          border: '2px solid #9B7F28',
          '&:hover': {
            boxShadow: '0 0 15px rgba(155, 127, 40, 0.4)',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config
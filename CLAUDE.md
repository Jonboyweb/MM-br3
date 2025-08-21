# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project for The Backroom Leeds, a hidden speakeasy bar and event space. The repository contains both the website codebase and comprehensive venue assets for building a conversion-optimized nightclub website with integrated booking systems.

## Development Commands

### Core Commands
```bash
# Development
npm run dev          # Start development server with Turbopack at http://localhost:3000

# Production
npm run build        # Build for production with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint checks
```

### Supabase Local Development
```bash
supabase start       # Start local Supabase stack (PostgreSQL, Auth, Storage, Realtime)
supabase stop        # Stop all Supabase services
supabase status      # Check service status
supabase db reset    # Reset database to initial state
supabase migration new <name>  # Create new migration

# Local Database Access
# URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# Studio: http://127.0.0.1:54323
```

### Docker Commands
```bash
docker ps            # List running containers
docker exec supabase_db_MM-br3 psql -U postgres  # Access local database
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom prohibition/Art Deco theme
- **Database**: Supabase (PostgreSQL 17, Auth, Storage, Realtime)
- **Payments**: Stripe integration for bookings and deposits
- **Forms**: React Hook Form with Zod validation
- **UI**: Framer Motion animations, Lucide icons, Recharts for analytics
- **Themes**: Next-themes for dark/light mode support

### Project Structure
```
MM-br3/
├── backroom-leeds/          # Main Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages and API routes
│   │   │   ├── layout.tsx  # Root layout with metadata
│   │   │   └── page.tsx    # Homepage
│   │   └── lib/
│   │       └── auth.ts     # Authentication placeholder
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
├── venue-specific-information/  # Comprehensive venue assets
│   ├── images/             # High-res venue photography
│   ├── logos/              # Brand assets and Fino fonts
│   ├── styling/            # Two style guide versions
│   ├── table-plans/        # SVG venue layouts
│   └── videos/             # Promotional content
└── supabase/               # Database configuration
    └── config.toml         # Local development settings
```

### Key Integration Points

1. **Supabase Integration**
   - Authentication system ready for implementation
   - Real-time booking updates via Supabase Realtime
   - Storage buckets for images/videos
   - Database at port 54322, API at 54321

2. **Payment Processing**
   - Stripe packages installed (@stripe/stripe-js, @stripe/react-stripe-js)
   - Ready for payment intent creation and webhook handling
   - Booking deposits and bottle service payments

3. **Form Management**
   - React Hook Form with Zod schemas for validation
   - Type-safe form handling with TypeScript
   - Multi-step booking forms ready to implement

4. **Styling System**
   - Two style guide versions in venue-specific-information/styling/
   - Build both versions for A/B testing
   - Custom Fino font family available in logos/font-files/

## Implementation Roadmap

### Phase 1: Foundation (Current State)
- ✅ Next.js project initialized with TypeScript
- ✅ Core dependencies installed
- ✅ Supabase local development configured
- ✅ Basic project structure created

### Phase 2: Database Schema (Next Priority)
- Create comprehensive table structure for bookings
- Implement RLS policies for security
- Set up real-time triggers for availability
- Create functions for booking conflict prevention

### Phase 3: Core Features
- Table booking system with interactive floor plans
- Event pages for La Fiesta (Fridays), Shhh! (Saturdays), Nostalgia (Sundays)
- Private hire booking system
- Bottle service menu integration

### Phase 4: Integrations
- Stripe payment processing
- Email notifications via Resend/SendGrid
- Fatsoma API for ticketing (if available)
- Social media feed integration

## Important Venue Details

- **Location**: 50a Call Lane, Leeds LS1 6DT (hidden under railway bridge)
- **Capacity**: Full venue 500, Main bar 350, Private room 150
- **Age**: 18+ only venue
- **License**: Late license until 6am for club nights
- **Regular Events**: 
  - Fridays: La Fiesta (Latin music)
  - Saturdays: Shhh! (Commercial/R&B)
  - Sundays: Nostalgia (2000s/throwback)

## Style Guidelines

When implementing UI components:
1. Create two versions using the different style guides in venue-specific-information/styling/
2. Use Fino font family for brand consistency
3. Apply prohibition/Art Deco aesthetic elements
4. Ensure mobile-first responsive design (70% mobile traffic expected)
5. Implement conversion-optimized CTAs with scarcity messaging

## Environment Variables Required

Create `.env.local` with:
```
# Supabase (use local values from supabase status)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from supabase status]
SUPABASE_SERVICE_ROLE_KEY=[from supabase status]

# Stripe (test mode initially)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing Approach

- Unit tests: Jest with React Testing Library (packages installed)
- E2E tests: Cypress (to be configured)
- Performance: Lighthouse audits for Core Web Vitals
- Security: Regular npm audit and input validation

## Asset Usage Notes

- Optimize high-resolution images before production use
- Event artwork available for La Fiesta, Shhh!, and Nostalgia
- Table plans (SVG) show upstairs/downstairs layouts with 16 tables
- Videos available for table booking, private hire, and Christmas promotions
- Use appropriate venue photos: empty shots for private hire, busy shots for regular events
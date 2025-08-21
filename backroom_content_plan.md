# The Backroom Leeds - Complete Website Content Plan & Implementation Guide

## 📋 Content Architecture & Site Structure

### Primary Navigation
1. **Home** - Hero experience with booking CTAs
2. **Book a Table** - Real-time table booking system
3. **Events** - Regular nights & special events
4. **Private Hire** - Corporate & private events
5. **Bottle Service** - Premium table packages
6. **About** - Venue story & information
7. **Contact** - Location, hours, contact details

### Secondary Pages
- Christmas Parties (seasonal)
- DJ Mixes & Music
- Gallery
- Terms & Conditions
- Privacy Policy
- Admin Dashboard (protected)

## 🎯 Content Strategy by Page

### 1. Homepage
**Hero Section:**
- Dramatic video background or image carousel
- "THE BACKROOM" - oversized typography
- "Leeds' Premier Prohibition Experience"
- Primary CTA: "Book Your Table"
- Secondary CTA: "View Events"

**Key Sections:**
- **Tonight's Events** - Live feed of current/upcoming events
- **Table Booking Preview** - Quick booking widget
- **Experience Highlights** - Two floors, bottle service, late license
- **Social Proof** - Instagram feed, testimonials
- **Location Badge** - "Hidden beneath the railway bridge"

### 2. Book a Table
**Interactive Floor Plan:**
- Visual table layout (upstairs/downstairs)
- Real-time availability indicators
- Table capacity and features
- Premium booth highlighting

**Booking Flow:**
1. Date/time selection
2. Party size & table preference
3. Special requests
4. Contact details
5. Deposit payment (Stripe)
6. Confirmation & details

**Table Information:**
```
Upstairs (150 capacity):
- Table 1: 4-12 people (Dance floor premium booth)
- Table 2-5: 4-10 people (High tables, DJ proximity)
- Table 6-8: 2-4 people (Barrel bar area)
- Table 9: 4-10 people (Near bar/terrace/toilets)
- Table 10: 4-12 people (Premium Ciroc booth)

Downstairs (350 capacity):
- Tables 11-14: 2-8 people (Intimate booths)
- Tables 15-16: 2-6 people (Curved seating, combinable)
```

### 3. Events
**Regular Events:**
- **La Fiesta | Bella Gente** (Fridays 11pm-6am)
  - Two floors: RnB/Hip Hop upstairs, Reggaeton/Latin downstairs
  - DJs: @djdyl, @djdiogovaz, @djborris_paulo, @onlydjflex

- **Shhh!** (Saturdays 11pm-6am)
  - Leeds' longest running weekly RnB party
  - DJs: @djcp01, @danhillsonline, @djindyuk02, @vybzindahouse

- **Nostalgia** (Sundays 11pm-5am)
  - Throwbacks, Disco, RnB, Hip Hop classics
  - DJ: @djindyuk02 & guests

**Special Events:**
- Guest DJ nights
- Themed parties
- Holiday celebrations
- Private event showcases

### 4. Private Hire
**Room Options:**
- **Room One** (Downstairs, 150 capacity)
  - Own bar, booth seating, accessibility features
  - Thu-Sat: Until midnight | Sun-Wed: Until 4am
  - No room hire fee Thu-Sun

- **Room Two** (Main floor, 350 capacity)
  - Dance floor, extensive bar, outdoor access
  - Perfect for larger celebrations
  - Entertainment options available

- **Full Venue** (500 capacity)
  - Complete venue hire for major events
  - Both floors, all facilities

**Packages & Pricing:**
- Bronze: £30pp + VAT (Welcome drink, buffet, 1 voucher)
- Silver: £35pp + VAT (Welcome drink, buffet, 2 vouchers)
- Gold: £40pp + VAT (Welcome drink, buffet, 3 vouchers)
- Platinum: £45pp + VAT (Welcome drink, buffet, 4 vouchers)

**Add-ons:**
- Entertainment packages (£950-£1950 + VAT)
- Catering options (£12-£24pp + VAT)
- Decorations and theming
- Photography services

### 5. Bottle Service & Packages
**Spirit Categories:**
- Vodka (£120-£180)
- Rum (£140-£180)
- Gin (£130-£150)
- Cognac (£150-£500)
- Whiskey (£130-£550)
- Champagne (£85-£250)
- Tequila (£130-£600)
- Liqueurs (£130-£160)

**Signature Packages:**
- **Hush & Shush** - £170 (Smirnoff, Prosecco, shots)
- **Speak Whiskey to Me** - £280 (Jack Daniels, Bacardi Spiced)
- **After Hours** - £400 (Premium spirits, cocktails)
- **Midnight Madness** - £580 (Ultra premium selection)

**Cocktail Packages:**
- Cocktail Tree (12x Espresso Martinis) - £120
- House G&T (4x doubles) - £40
- Specialty Caribbean packages - £50

### 6. About Page
**Venue Story:**
- Established 2012
- Hidden speakeasy concept
- Split-level design
- Railway bridge location
- Independent bar heritage

**Facilities:**
- Two bars, multiple seating areas
- State-of-the-art lighting and sound
- Outdoor terrace
- Full accessibility
- Late license until 6am

**Awards & Recognition:**
- 15.7k+ social media followers
- Leeds' longest-running weekly RnB party
- Premium venue certifications

### 7. Contact & Location
**Address:** 50a Call Lane, Leeds LS1 6DT
**Phone:** 0113 243 8666
**Email:** info@backroomleeds.co.uk
**Age Restriction:** 18+

**Opening Hours:**
- Friday/Saturday: 11pm-6am
- Sunday: 11pm-5am
- Private hire: 7 days/week

**Getting Here:**
- Hidden under railway bridge
- Public transport links
- Nearby parking information

## 🛠 Technical Implementation Guide

### Phase 1: Project Setup & Infrastructure (Week 1)

#### Agent 1: DevOps & Infrastructure Specialist
```bash
# 1. Initialize Next.js project
npx create-next-app@latest backroom-leeds --typescript --tailwind --eslint --app

# 2. Install core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
npm install @types/node @types/react @types/react-dom
npm install framer-motion lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install date-fns recharts

# 3. Development dependencies
npm install -D @types/jest jest jest-environment-jsdom
npm install -D cypress @cypress/code-coverage
npm install -D prettier eslint-config-prettier

# 4. Environment setup
touch .env.local .env.example
```

#### Environment Variables Setup:
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
FATSOMA_API_KEY=your_fatsoma_api_key
```

### Phase 2: Database Design & Backend (Week 2)

#### Agent 2: Database Architect
**Supabase Schema Implementation:**

```sql
-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Venues table
create table public.venues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  capacity integer not null,
  amenities jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tables table
create table public.tables (
  id uuid default uuid_generate_v4() primary key,
  venue_id uuid references public.venues(id) on delete cascade,
  table_number integer not null,
  name text not null,
  min_capacity integer not null,
  max_capacity integer not null,
  location text not null, -- 'upstairs' or 'downstairs'
  features jsonb default '[]'::jsonb,
  is_premium boolean default false,
  deposit_amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(venue_id, table_number)
);

-- Time slots table
create table public.time_slots (
  id uuid default uuid_generate_v4() primary key,
  venue_id uuid references public.venues(id) on delete cascade,
  start_time time not null,
  end_time time not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade,
  table_id uuid references public.tables(id) on delete cascade,
  booking_date date not null,
  time_slot_id uuid references public.time_slots(id) on delete cascade,
  party_size integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  total_amount decimal(10,2) not null,
  deposit_paid decimal(10,2) not null,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  end_date timestamp with time zone,
  venue_id uuid references public.venues(id) on delete cascade,
  event_type text not null check (event_type in ('regular', 'special', 'private')),
  ticket_url text,
  image_url text,
  djs jsonb default '[]'::jsonb,
  music_genres jsonb default '[]'::jsonb,
  price_from decimal(10,2),
  is_featured boolean default false,
  fatsoma_event_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DJs table
create table public.djs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  bio text,
  instagram_handle text,
  image_url text,
  music_genres jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DJ mixes table
create table public.dj_mixes (
  id uuid default uuid_generate_v4() primary key,
  dj_id uuid references public.djs(id) on delete cascade,
  title text not null,
  description text,
  audio_url text not null,
  duration_seconds integer,
  play_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bottle service items
create table public.bottle_service_items (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  name text not null,
  price decimal(10,2) not null,
  description text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.user_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.dj_mixes enable row level security;

-- User can read/update their own profile
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);

-- Users can view their own bookings
create policy "Users can view own bookings" on public.bookings
  for select using (auth.uid() = user_id);

-- Public read access for events, tables, venues
create policy "Public read access" on public.events for select using (true);
create policy "Public read access" on public.tables for select using (true);
create policy "Public read access" on public.venues for select using (true);
create policy "Public read access" on public.djs for select using (true);
create policy "Public read access" on public.dj_mixes for select using (true);
```

### Phase 3: Core UI Components (Week 3)

#### Agent 3: UI/UX Developer
**Component Architecture:**

```typescript
// types/index.ts
export interface Table {
  id: string;
  table_number: number;
  name: string;
  min_capacity: number;
  max_capacity: number;
  location: 'upstairs' | 'downstairs';
  features: string[];
  is_premium: boolean;
  deposit_amount: number;
}

export interface Booking {
  id: string;
  table_id: string;
  booking_date: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  total_amount: number;
  deposit_paid: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_type: 'regular' | 'special' | 'private';
  ticket_url?: string;
  image_url?: string;
  djs: string[];
  music_genres: string[];
  price_from?: number;
}
```

**Core Components to Build:**

1. **Layout Components:**
```typescript
// components/layout/Header.tsx
// components/layout/Footer.tsx
// components/layout/Navigation.tsx
// components/layout/MobileMenu.tsx
```

2. **Booking Components:**
```typescript
// components/booking/TableSelector.tsx
// components/booking/DateTimePicker.tsx
// components/booking/BookingForm.tsx
// components/booking/PaymentForm.tsx
// components/booking/BookingConfirmation.tsx
```

3. **Event Components:**
```typescript
// components/events/EventCard.tsx
// components/events/EventsList.tsx
// components/events/EventDetail.tsx
// components/events/RegularEvents.tsx
```

4. **Bottle Service Components:**
```typescript
// components/bottle-service/CategoryGrid.tsx
// components/bottle-service/ItemCard.tsx
// components/bottle-service/PackageSelector.tsx
```

### Phase 4: Booking System Implementation (Week 4-5)

#### Agent 4: Full-Stack Developer
**Real-time Booking System:**

```typescript
// lib/supabase/bookings.ts
import { createClient } from '@supabase/supabase-js';

export async function checkTableAvailability(
  tableId: string,
  date: string,
  timeSlotId: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('table_id', tableId)
    .eq('booking_date', date)
    .eq('time_slot_id', timeSlotId)
    .neq('status', 'cancelled');

  return { isAvailable: !data?.length, error };
}

export async function createBooking(bookingData: BookingInput) {
  // Implementation with Stripe payment intent creation
  // Real-time conflict prevention using PostgreSQL advisory locks
}
```

**Payment Integration:**
```typescript
// lib/stripe/payments.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(
  amount: number,
  bookingId: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to pence
    currency: 'gbp',
    metadata: { bookingId },
    payment_method_types: ['card'],
  });

  return paymentIntent;
}
```

### Phase 5: Event Management & CMS (Week 6)

#### Agent 5: Content Management Developer
**Event Management System:**

```typescript
// app/admin/events/page.tsx - Admin interface for events
// components/admin/EventForm.tsx
// lib/fatsoma/integration.ts - External ticketing integration
```

**Fatsoma Integration:**
```typescript
// lib/fatsoma/api.ts
export async function syncFatsomaEvents() {
  // Fetch events from Fatsoma API
  // Update local database
  // Handle ticket sales redirection
}
```

### Phase 6: Performance & SEO Optimization (Week 7)

#### Agent 6: Performance & SEO Specialist
**Next.js Optimizations:**

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-storage.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

module.exports = nextConfig;
```

**SEO Implementation:**
```typescript
// app/layout.tsx - Schema.org structured data
// app/sitemap.ts - Dynamic sitemap generation
// app/robots.txt - Search engine directives
```

### Phase 7: Security & Testing (Week 8)

#### Agent 7: Security & QA Specialist
**Security Checklist:**
- [ ] Environment variables secured
- [ ] API rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Payment data PCI compliance

**Testing Strategy:**
```typescript
// __tests__/booking-flow.test.ts - E2E booking tests
// __tests__/payment.test.ts - Payment integration tests
// cypress/e2e/table-booking.cy.ts - Cypress E2E tests
```

### Phase 8: Deployment & Monitoring (Week 9)

#### Agent 8: DevOps & Deployment Specialist
**Production Deployment:**

```bash
# Vercel deployment configuration
# vercel.json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  },
  "functions": {
    "app/api/webhooks/stripe/route.ts": {
      "maxDuration": 30
    }
  }
}
```

**Monitoring Setup:**
- Sentry error tracking
- Vercel Analytics
- Supabase monitoring
- Stripe webhook monitoring
- Custom booking metrics dashboard

## 📱 Mobile Optimization Checklist

- [ ] Touch targets minimum 44px
- [ ] Sticky booking bar on mobile
- [ ] Swipe gestures for image galleries
- [ ] Mobile-optimized table selection
- [ ] One-handed operation support
- [ ] Fast loading on 3G networks
- [ ] Progressive Web App features

## 🎨 Design System Implementation

### Custom Tailwind Configuration
Apply the provided prohibition theme with:
- Art Deco geometric patterns
- Dramatic typography scales
- Gold/burgundy/black color palette
- Glass morphism effects
- Conversion-optimized CTAs

### Component Library
Build reusable components following the style guide:
- Button variants (primary, gold, outline)
- Form inputs with validation states
- Loading states and animations
- Modal dialogs
- Toast notifications

## 🔄 Content Management Workflow

### Regular Content Updates
1. **Events:** Weekly event creation/updates
2. **DJ Mixes:** Monthly mix uploads
3. **Bottle Service:** Quarterly menu updates
4. **Private Hire:** Seasonal package updates
5. **Gallery:** Weekly photo additions

### Admin Dashboard Features
- Real-time booking management
- Event creation and editing
- Table availability calendar
- Revenue analytics
- Customer communication tools

## 📊 Analytics & KPIs

### Booking Conversion Metrics
- Table booking completion rate
- Average booking value
- Mobile vs. desktop conversions
- Time to complete booking flow

### Business Intelligence
- Popular table preferences
- Peak booking times
- Revenue by event type
- Customer retention rates

## 🚀 Launch Strategy

### Pre-Launch (Week 10-11)
- [ ] Content population
- [ ] Staff training on admin system
- [ ] Payment testing with small amounts
- [ ] Mobile device testing
- [ ] Load testing with simulated traffic

### Soft Launch (Week 12)
- [ ] Limited table availability release
- [ ] Social media announcement
- [ ] Staff and friends beta testing
- [ ] Bug fixes and optimization

### Full Launch
- [ ] All features activated
- [ ] Marketing campaign launch
- [ ] SEO optimization complete
- [ ] Analytics monitoring active

## 🛡 Maintenance & Support

### Weekly Tasks
- Monitor booking system performance
- Review and respond to customer inquiries
- Update event listings
- Check payment reconciliation

### Monthly Tasks
- Security updates and patches
- Performance optimization review
- Content backup and archival
- Analytics reporting

### Quarterly Tasks
- Feature enhancement planning
- Security audit
- Performance benchmarking
- User experience improvements

This comprehensive plan provides a complete roadmap for building The Backroom Leeds website with modern technology, conversion-focused design, and robust booking functionality. Each phase includes specific deliverables and can be executed by specialized AI agents or development teams.
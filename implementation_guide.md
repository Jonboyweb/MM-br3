# The Backroom Leeds - AI Agent Implementation Guide

## 🤖 AI Agent Roles & Responsibilities

### Agent 1: Project Architect (Claude Code)
**Primary Role:** Project setup, configuration, and architecture decisions
**Tools:** Terminal, file management, dependency management
**Duration:** 1-2 days

### Agent 2: Database Engineer (Claude)
**Primary Role:** Supabase schema design and backend logic
**Tools:** SQL, Supabase dashboard, API design
**Duration:** 2-3 days

### Agent 3: Frontend Developer (Claude Code)
**Primary Role:** React components and UI implementation
**Tools:** Next.js, TypeScript, Tailwind CSS
**Duration:** 5-7 days

### Agent 4: Integration Specialist (Claude)
**Primary Role:** Payment systems, external APIs, real-time features
**Tools:** Stripe, Fatsoma API, Supabase realtime
**Duration:** 3-4 days

### Agent 5: Content Manager (Claude)
**Primary Role:** Content population, SEO optimization, asset integration
**Tools:** Next.js, image optimization, content management
**Duration:** 2-3 days

### Agent 6: QA Engineer (Claude Code)
**Primary Role:** Testing, security review, performance optimization
**Tools:** Jest, Cypress, Lighthouse, security auditing
**Duration:** 2-3 days

## 📋 Pre-Implementation Checklist

### Required Accounts & Services
- [ ] Supabase account and project created
- [ ] Stripe account (test mode initially)
- [ ] Vercel account for deployment
- [ ] Domain name purchased and configured
- [ ] Fatsoma API access (if available)
- [ ] Email service (Resend/SendGrid)
- [ ] Analytics service (Vercel Analytics/Google Analytics)

### Asset Preparation
- [ ] High-resolution venue images optimized for web
- [ ] Video assets (table booking, private hire, Christmas)
- [ ] DJ profile photos and social media handles
- [ ] Bottle service menu in digital format
- [ ] Event promotional materials
- [ ] Logo variations (light/dark, different sizes)

## 🚀 Phase 1: Project Setup (Agent 1 - Claude Code)

### Step 1.1: Initialize Project Structure
```bash
# Create Next.js project with optimal configuration
npx create-next-app@latest backroom-leeds \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd backroom-leeds
```

### Step 1.2: Install Core Dependencies
```bash
# Core functionality
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install react-hook-form @hookform/resolvers zod
npm install date-fns framer-motion lucide-react
npm install recharts next-themes

# Development tools
npm install -D @types/node @types/react @types/react-dom
npm install -D jest jest-environment-jsdom @testing-library/react
npm install -D cypress @cypress/code-coverage
npm install -D prettier eslint-config-prettier
```

### Step 1.3: Configure Environment
```bash
# Create environment files
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=

# External APIs
FATSOMA_API_KEY=
RESEND_API_KEY=
EOF

# Create example file
cp .env.local .env.example
# Remove actual values from .env.example
```

### Step 1.4: Apply Tailwind Configuration
```bash
# Replace tailwind.config.js with the provided prohibition theme
# (Use the Tailwind configuration from the style guide document)
```

### Step 1.5: Project Structure Setup
```bash
# Create directory structure
mkdir -p src/{components,lib,types,hooks,utils}
mkdir -p src/components/{ui,layout,booking,events,bottle-service,admin}
mkdir -p src/lib/{supabase,stripe,validations,utils}
mkdir -p src/app/{api,admin,booking,events,private-hire,bottle-service}
mkdir -p public/{images,videos,audio}

# Create initial files
touch src/types/index.ts
touch src/lib/supabase/client.ts
touch src/lib/stripe/client.ts
touch src/components/ui/button.tsx
```

## 🗄️ Phase 2: Database Setup (Agent 2 - Claude)

### Step 2.1: Supabase Project Configuration
1. Create new Supabase project
2. Configure authentication settings
3. Set up storage buckets for images/videos
4. Enable real-time for booking tables

### Step 2.2: Database Schema Implementation
Execute the comprehensive SQL schema provided in the content plan:

```sql
-- Run in Supabase SQL editor
-- 1. Enable extensions
-- 2. Create all tables
-- 3. Set up RLS policies
-- 4. Create functions for booking conflicts
-- 5. Set up triggers for real-time updates
```

### Step 2.3: Seed Data Population
```sql
-- Insert venue data
INSERT INTO venues (name, address, capacity, amenities) VALUES 
('The Backroom Leeds', '50a Call Lane, Leeds LS1 6DT', 500, '["Two floors", "Late license", "Outdoor terrace", "Professional sound system"]');

-- Insert table data (16 tables as specified)
-- Insert time slots
-- Insert initial events
-- Insert bottle service items
-- Insert DJ profiles
```

### Step 2.4: API Functions
Create Edge Functions for:
- Real-time booking conflict prevention
- Payment webhook handling
- Event synchronization
- Email notifications

## 🎨 Phase 3: Core UI Development (Agent 3 - Claude Code)

### Step 3.1: Base Layout Components
```typescript
// src/components/layout/Header.tsx
// Implementation with prohibition theme
// Mobile-first navigation
// Booking CTA prominence

// src/components/layout/Footer.tsx
// Contact information
// Social media links
// Legal pages

// src/components/ui/button.tsx
// Conversion-optimized button variants
// Accessibility features
// Loading states
```

### Step 3.2: Booking System Components
```typescript
// src/components/booking/TableSelector.tsx
// Interactive floor plan
// Real-time availability
// Premium table highlighting

// src/components/booking/BookingForm.tsx
// Multi-step form with validation
// Date/time selection
// Party size and special requests

// src/components/booking/PaymentForm.tsx
// Stripe integration
// Secure payment processing
// Confirmation flow
```

### Step 3.3: Event Components
```typescript
// src/components/events/EventCard.tsx
// Event information display
// Ticket purchasing integration
// Social sharing

// src/components/events/RegularEvents.tsx
// La Fiesta, Shhh!, Nostalgia displays
// DJ lineup information
// Music genre indicators
```

### Step 3.4: Page Implementations
Focus on conversion optimization:
- Hero sections with video backgrounds
- Mobile-optimized booking flows
- Scarcity messaging for limited tables
- Social proof integration

## 🔗 Phase 4: Integration Development (Agent 4 - Claude)

### Step 4.1: Stripe Payment Integration
```typescript
// src/lib/stripe/payments.ts
// Payment intent creation
// Webhook handling
// Subscription management for regular events

// src/app/api/webhooks/stripe/route.ts
// Secure webhook processing
// Booking status updates
// Email confirmations
```

### Step 4.2: Real-time Booking System
```typescript
// src/lib/supabase/bookings.ts
// Real-time availability checks
// Conflict prevention with advisory locks
// Optimistic UI updates with rollback

// src/hooks/useRealTimeBookings.ts
// Subscription to table availability changes
// Automatic UI updates
// Connection state management
```

### Step 4.3: External API Integrations
```typescript
// src/lib/fatsoma/api.ts
// Event synchronization
// Ticket sales integration
// Analytics tracking

// src/lib/email/notifications.ts
// Booking confirmations
// Reminder emails
// Marketing communications
```

### Step 4.4: Authentication & Authorization
```typescript
// src/lib/auth/supabase.ts
// User authentication
// Role-based access control
// Admin dashboard protection
```

## 📄 Phase 5: Content Integration (Agent 5 - Claude)

### Step 5.1: Asset Optimization
```bash
# Optimize images for web
# Convert videos to appropriate formats
# Create responsive image variants
# Set up CDN configuration
```

### Step 5.2: Content Population
```typescript
// Populate all venue information
// Add event descriptions and imagery
// Import bottle service menu
// Set up DJ profiles and mixes
// Create private hire packages
```

### Step 5.3: SEO Implementation
```typescript
// src/app/layout.tsx - Meta tags and structured data
// src/app/sitemap.ts - Dynamic sitemap generation
// src/app/robots.txt - Search engine directives
// JSON-LD schema for local business
```

### Step 5.4: Performance Optimization
```typescript
// Image optimization with Next.js Image
// Code splitting and lazy loading
// Bundle analysis and optimization
// CDN configuration for static assets
```

## 🧪 Phase 6: Testing & Quality Assurance (Agent 6 - Claude Code)

### Step 6.1: Unit Testing
```typescript
// __tests__/components/ - Component testing
// __tests__/lib/ - Utility function testing
// __tests__/api/ - API route testing
```

### Step 6.2: Integration Testing
```typescript
// __tests__/booking-flow.test.ts
// __tests__/payment-integration.test.ts
// __tests__/real-time-updates.test.ts
```

### Step 6.3: E2E Testing
```typescript
// cypress/e2e/table-booking.cy.ts
// cypress/e2e/event-browsing.cy.ts
// cypress/e2e/mobile-experience.cy.ts
```

### Step 6.4: Security Audit
```bash
# Run security scanners
npm audit
# Check for common vulnerabilities
# Validate input sanitization
# Test payment security
```

### Step 6.5: Performance Testing
```bash
# Lighthouse audits
# Core Web Vitals testing
# Mobile performance testing
# Load testing with simulated traffic
```

## 🚀 Deployment Strategy

### Pre-Production Checklist
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Payment testing in sandbox mode
- [ ] Security headers configured
- [ ] Analytics tracking implemented
- [ ] Error monitoring set up

### Production Deployment
1. **Vercel Deployment:**
   ```bash
   vercel --prod
   ```

2. **Domain Configuration:**
   - Configure custom domain
   - Set up SSL certificates
   - Configure redirects

3. **Database Migration:**
   - Run production database setup
   - Import initial data
   - Test all connections

4. **Payment System Activation:**
   - Switch to live Stripe keys
   - Test payment processing
   - Configure webhook endpoints

## 📊 Post-Launch Monitoring

### Week 1: Intensive Monitoring
- Real-time error tracking
- Performance monitoring
- User behavior analysis
- Booking completion rates
- Payment success rates

### Ongoing Maintenance
- Weekly security updates
- Monthly performance reviews
- Quarterly feature enhancements
- Annual security audits

## 🎯 Success Metrics

### Technical KPIs
- Page load time < 2 seconds
- Core Web Vitals > 90
- 99.9% uptime
- < 1% error rate

### Business KPIs
- Booking conversion rate > 15%
- Mobile conversion rate > 60%
- Average booking value increase
- Customer satisfaction scores

## 🔧 Troubleshooting Guide

### Common Issues & Solutions
1. **Booking Conflicts:** Check advisory locks implementation
2. **Payment Failures:** Verify webhook configuration
3. **Real-time Updates:** Test Supabase connection
4. **Mobile Performance:** Optimize images and code splitting
5. **SEO Issues:** Validate structured data and meta tags

## 📞 Support Contacts

### Technical Support
- Supabase: Community support + documentation
- Stripe: Developer support for payment issues
- Vercel: Deployment and performance support
- Next.js: Community and documentation

### Emergency Procedures
- Database backup and restore procedures
- Payment system failover options
- Emergency contact information
- Incident response workflow

This implementation guide provides a comprehensive roadmap for AI agents to build The Backroom Leeds website efficiently while maintaining high quality and security standards.
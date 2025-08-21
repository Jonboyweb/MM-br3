# The Backroom Leeds - Database Setup

## Overview

This directory contains the complete database schema and configuration for The Backroom Leeds nightclub booking system. The database is built on PostgreSQL with Supabase for real-time functionality, authentication, and storage.

## Database Architecture

### Core Tables

1. **venues** - Venue information and settings
2. **tables** - Physical tables/areas available for booking
3. **time_slots** - Available booking time slots by day of week
4. **bookings** - Main booking records
5. **booking_tables** - Many-to-many relationship between bookings and tables
6. **customers** - Customer profiles (extends Supabase auth.users)
7. **payments** - Payment transactions and Stripe integration
8. **events** - Regular and special events
9. **bottle_service_items** - Bottle service menu items
10. **bottle_service_orders** - Bottle service orders linked to bookings
11. **notifications** - Email/SMS notification queue
12. **audit_logs** - Security audit trail
13. **booking_analytics** - Daily analytics snapshots

### Key Features

- **Row Level Security (RLS)** - Comprehensive security policies for data protection
- **Real-time Updates** - Live table availability and booking status updates
- **Booking Conflict Prevention** - Advisory locks and atomic operations
- **Payment Integration** - Stripe payment intent tracking
- **Audit Logging** - Complete audit trail for security compliance
- **Performance Optimization** - Strategic indexes and query optimization

## Migration Files

### Phase 1: Core Schema
- `20250821215042_create_booking_schema.sql` - Complete database schema with all tables, indexes, and constraints
- `20250821215620_seed_tables_and_timeslots.sql` - Venue data, table layout, time slots, and regular events

### Phase 2: Security & Advanced Features
- `20250821220000_enhanced_rls_policies.sql` - Comprehensive RLS policies and security functions
- `20250821220500_advanced_booking_functions.sql` - Booking conflict prevention and business logic
- `20250821221000_realtime_triggers_and_bottle_service.sql` - Real-time triggers and bottle service menu
- `20250821221500_database_tests.sql` - Comprehensive test suite for validation

## Setup Instructions

### Local Development

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start Local Supabase**
   ```bash
   cd /path/to/MM-br3
   supabase start
   ```

3. **Apply Migrations**
   ```bash
   supabase db reset
   ```

4. **Access Local Database**
   - Database URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
   - Studio URL: `http://127.0.0.1:54323`
   - API URL: `http://127.0.0.1:54321`

### Production Deployment

1. **Create Supabase Project**
   ```bash
   supabase projects create "backroom-leeds"
   ```

2. **Link Local Project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Deploy Migrations**
   ```bash
   supabase db push
   ```

4. **Enable Real-time**
   ```sql
   -- In Supabase SQL Editor
   SELECT enable_scheduled_tasks();
   ```

## Security Configuration

### Row Level Security Policies

- **Public Access**: Venues, tables, events, bottle service items (read-only)
- **Customer Access**: Own bookings, payments, and bottle service orders
- **Staff Access**: View all bookings, manage orders, send notifications
- **Admin Access**: Full access to all data and configuration

### Authentication Roles

- **anon**: Anonymous users (public read access only)
- **authenticated**: Logged-in customers
- **staff**: Staff members (limited admin access)
- **admin**: Full administrative access

### Security Functions

- `auth.is_admin()` - Check if user has admin privileges
- `auth.is_staff()` - Check if user has staff or admin privileges
- `validate_customer_age()` - Ensure 18+ age requirement
- `validate_booking_time_constraints()` - Verify booking within venue hours

## Business Logic

### Table Booking System

1. **Availability Checking**
   - Real-time table availability using `check_table_availability()`
   - Advisory locks prevent booking conflicts
   - Table combinations for larger parties

2. **Booking Process**
   - Atomic booking creation with `create_booking_atomic()`
   - Automatic booking reference generation (BR-YYMMDD-XXXXXX)
   - Stripe payment intent integration

3. **Status Management**
   - pending → confirmed → completed
   - Automatic status updates based on dates
   - No-show tracking and customer statistics

### Pricing and Deposits

- Base deposits per table type
- Special date multipliers (holidays, events)
- Dynamic pricing based on demand
- Service charges and gratuity calculations

### Bottle Service

- Comprehensive menu with categories
- Package deals and cocktail options
- Automatic pricing calculations
- Integration with table bookings

## Real-time Features

### Supabase Realtime Subscriptions

- Table availability changes
- Booking status updates
- Payment confirmations
- Admin dashboard notifications

### Notification System

- Email confirmations and reminders
- SMS notifications (where configured)
- Real-time admin alerts
- Scheduled notification delivery

## Performance Optimization

### Database Indexes

- Composite indexes for complex queries
- Covering indexes for frequent operations
- Partial indexes for filtered queries
- GIN indexes for JSONB columns

### Query Optimization

- Materialized views for analytics
- Function-based indexes
- Connection pooling
- Query plan optimization

## Monitoring and Analytics

### Daily Analytics

- Booking conversion rates
- Revenue tracking
- Table utilization
- Peak time analysis

### Performance Metrics

- Database size and growth
- Query execution times
- Connection counts
- Error rates

### Health Checks

- `get_database_performance_metrics()` - Real-time performance data
- Automated alerts for critical thresholds
- Regular backup verification

## Maintenance Tasks

### Automated Tasks (via pg_cron)

- Daily analytics generation (6 AM)
- Booking status updates (hourly)
- Notification cleanup (weekly)
- Performance metric collection

### Manual Maintenance

- Weekly security updates
- Monthly performance reviews
- Quarterly data archival
- Annual security audits

## Environment Variables

### Required Configuration

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Application
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## API Integration

### Supabase Client Setup

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Real-time Subscriptions

```typescript
// Table availability updates
supabase
  .channel('table-availability')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    // Handle real-time updates
  })
  .subscribe()
```

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check PostgreSQL version compatibility
   - Verify extension availability (uuid-ossp, pg_cron)
   - Review migration order and dependencies

2. **RLS Policy Issues**
   - Verify user authentication
   - Check role assignments in auth.users metadata
   - Test policy conditions with sample data

3. **Performance Issues**
   - Analyze query execution plans
   - Check index usage
   - Monitor connection pool utilization

### Debug Commands

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM get_available_tables(...);

-- Monitor active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check real-time subscriptions
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## Support and Documentation

### Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Documentation](https://stripe.com/docs/api)

### Contact Information

For technical support or questions about the database implementation, refer to the main project documentation or contact the development team.

## Version History

- **v1.0** - Initial schema with basic booking functionality
- **v1.1** - Enhanced RLS policies and security features
- **v1.2** - Advanced booking functions and conflict prevention
- **v1.3** - Real-time features and bottle service integration
- **v1.4** - Comprehensive testing and validation suite

---

**Last Updated**: August 21, 2025
**Database Version**: PostgreSQL 17 with Supabase Extensions
**Schema Version**: 1.4
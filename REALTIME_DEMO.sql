-- =====================================================
-- REAL-TIME TRIGGERS DEMONSTRATION
-- Test script to show real-time functionality
-- =====================================================

-- This script demonstrates the real-time triggers we've implemented
-- Run this in your Supabase SQL editor to see real-time updates

-- =====================================================
-- SIMULATE A BOOKING CREATION (Triggers Real-time Updates)
-- =====================================================

-- Get venue and table IDs
SELECT 
    v.id as venue_id,
    v.name as venue_name,
    t.id as table_id,
    t.display_name as table_name
FROM venues v
CROSS JOIN tables t
WHERE v.slug = 'backroom-leeds' 
    AND t.table_number = '1'
LIMIT 1;

-- Create a test booking (this will trigger real-time updates)
INSERT INTO bookings (
    venue_id,
    customer_email,
    customer_phone,
    customer_name,
    booking_date,
    start_time,
    end_time,
    party_size,
    status
) 
SELECT 
    v.id,
    'realtime.test@example.com',
    '+44 123 456 7890',
    'Real-time Test User',
    CURRENT_DATE + INTERVAL '7 days', -- Next week
    '23:00'::TIME,
    '06:00'::TIME,
    6,
    'pending'
FROM venues v
WHERE v.slug = 'backroom-leeds';

-- Assign table to the booking (this will also trigger updates)
INSERT INTO booking_tables (booking_id, table_id, is_primary)
SELECT 
    b.id,
    t.id,
    true
FROM bookings b
CROSS JOIN tables t
JOIN venues v ON t.venue_id = v.id
WHERE b.customer_email = 'realtime.test@example.com'
    AND v.slug = 'backroom-leeds'
    AND t.table_number = '1'
    AND b.booking_date = CURRENT_DATE + INTERVAL '7 days';

-- =====================================================
-- UPDATE BOOKING STATUS (Triggers Status Change Updates)
-- =====================================================

-- Confirm the booking (this triggers payment and status notifications)
UPDATE bookings 
SET status = 'confirmed',
    confirmed_at = NOW()
WHERE customer_email = 'realtime.test@example.com'
    AND booking_date = CURRENT_DATE + INTERVAL '7 days';

-- =====================================================
-- SIMULATE PAYMENT UPDATE (Triggers Payment Notifications)
-- =====================================================

-- Create a payment record (triggers payment status updates)
INSERT INTO payments (
    booking_id,
    amount,
    currency,
    payment_method,
    status,
    stripe_payment_intent_id,
    deposit_amount
)
SELECT 
    b.id,
    100.00, -- £100 deposit
    'GBP',
    'stripe',
    'completed',
    'pi_test_' || generate_random_uuid(),
    100.00
FROM bookings b
WHERE b.customer_email = 'realtime.test@example.com'
    AND b.booking_date = CURRENT_DATE + INTERVAL '7 days';

-- =====================================================
-- VERIFY REAL-TIME TRIGGERS FIRED
-- =====================================================

-- Check audit logs to see trigger activity
SELECT 
    table_name,
    operation,
    changed_at,
    new_values->>'status' as new_status,
    old_values->>'status' as old_status
FROM audit_logs
WHERE table_name = 'bookings'
    AND changed_at > NOW() - INTERVAL '5 minutes'
ORDER BY changed_at DESC;

-- Check notification queue (created by triggers)
SELECT 
    notification_type,
    channel,
    subject,
    scheduled_for,
    sent_at
FROM notifications
WHERE booking_id IN (
    SELECT id FROM bookings 
    WHERE customer_email = 'realtime.test@example.com'
)
ORDER BY created_at DESC;

-- =====================================================
-- CHECK TABLE AVAILABILITY FUNCTION
-- =====================================================

-- Test real-time availability checking
SELECT 
    table_id,
    table_number,
    display_name,
    location,
    max_capacity,
    is_premium,
    min_spend
FROM get_available_tables(
    (SELECT id FROM venues WHERE slug = 'backroom-leeds'),
    CURRENT_DATE + INTERVAL '7 days',
    '23:00'::TIME,
    '06:00'::TIME,
    6
);

-- =====================================================
-- CLEANUP TEST DATA
-- =====================================================

-- Remove test booking and related data
DELETE FROM payments 
WHERE booking_id IN (
    SELECT id FROM bookings 
    WHERE customer_email = 'realtime.test@example.com'
);

DELETE FROM booking_tables 
WHERE booking_id IN (
    SELECT id FROM bookings 
    WHERE customer_email = 'realtime.test@example.com'
);

DELETE FROM notifications 
WHERE booking_id IN (
    SELECT id FROM bookings 
    WHERE customer_email = 'realtime.test@example.com'
);

DELETE FROM bookings 
WHERE customer_email = 'realtime.test@example.com';

-- Clean up audit logs
DELETE FROM audit_logs 
WHERE new_values->>'customer_email' = 'realtime.test@example.com'
    OR old_values->>'customer_email' = 'realtime.test@example.com';

-- =====================================================
-- REAL-TIME CHANNELS AVAILABLE FOR FRONTEND
-- =====================================================

/*
The following PostgreSQL NOTIFY channels are active:

1. 'table_availability_update' - Broadcasts when table availability changes
   Payload includes: venue_id, booking_id, booking_date, status, affected_tables, timestamp

2. 'admin_booking_update' - Broadcasts comprehensive booking changes for admin dashboard  
   Payload includes: operation, booking details, table assignments, timestamps

3. 'payment_status_update' - Broadcasts payment status changes
   Payload includes: payment_id, booking_info, amount, status, payment_method

To listen for these in your frontend application:

JavaScript/TypeScript Example:
```javascript
supabase
  .channel('table-availability')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'bookings'
  }, (payload) => {
    console.log('Table availability changed:', payload)
    // Update UI in real-time
  })
  .subscribe()
```

All triggers are production-ready and optimized for high-frequency updates.
*/

SELECT 'Real-time triggers demonstration completed successfully!' as status;
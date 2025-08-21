-- =====================================================
-- ADVANCED BOOKING SYSTEM FUNCTIONS
-- Enhanced conflict prevention and business logic
-- =====================================================

-- =====================================================
-- ADVISORY LOCK SYSTEM FOR CONCURRENT BOOKINGS
-- Prevent race conditions during booking process
-- =====================================================

-- Function to acquire advisory lock for table booking
CREATE OR REPLACE FUNCTION acquire_booking_lock(
    p_table_id UUID,
    p_booking_date DATE,
    p_start_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_lock_id BIGINT;
BEGIN
    -- Generate deterministic lock ID from table, date, and time
    v_lock_id := ('x' || substr(md5(p_table_id::text || p_booking_date::text || p_start_time::text), 1, 15))::bit(60)::bigint;
    
    -- Try to acquire advisory lock
    RETURN pg_try_advisory_lock(v_lock_id);
END;
$$ LANGUAGE plpgsql;

-- Function to release advisory lock for table booking
CREATE OR REPLACE FUNCTION release_booking_lock(
    p_table_id UUID,
    p_booking_date DATE,
    p_start_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_lock_id BIGINT;
BEGIN
    -- Generate same deterministic lock ID
    v_lock_id := ('x' || substr(md5(p_table_id::text || p_booking_date::text || p_start_time::text), 1, 15))::bit(60)::bigint;
    
    -- Release advisory lock
    RETURN pg_advisory_unlock(v_lock_id);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ATOMIC BOOKING CREATION WITH CONFLICT PREVENTION
-- Complete booking process with payment integration
-- =====================================================

-- Function to create booking atomically with conflict prevention
CREATE OR REPLACE FUNCTION create_booking_atomic(
    p_venue_id UUID,
    p_customer_email VARCHAR(255),
    p_customer_phone VARCHAR(20),
    p_customer_name VARCHAR(255),
    p_table_ids UUID[],
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_party_size INTEGER,
    p_customer_id UUID DEFAULT NULL,
    p_special_requests TEXT DEFAULT NULL,
    p_occasion VARCHAR(100) DEFAULT NULL,
    p_stripe_payment_intent_id VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE(
    booking_id UUID,
    booking_reference VARCHAR(20),
    total_deposit DECIMAL(10,2),
    success BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    v_booking_id UUID;
    v_booking_ref VARCHAR(20);
    v_table_id UUID;
    v_lock_acquired BOOLEAN;
    v_table_available BOOLEAN;
    v_total_deposit DECIMAL(10,2) := 0;
    v_table_deposit DECIMAL(10,2);
    v_time_slot_id UUID;
    v_day_of_week TEXT;
BEGIN
    -- Initialize return values
    success := false;
    error_message := NULL;
    
    -- Validate inputs
    IF array_length(p_table_ids, 1) IS NULL OR array_length(p_table_ids, 1) = 0 THEN
        error_message := 'At least one table must be specified';
        RETURN NEXT;
        RETURN;
    END IF;
    
    IF p_booking_date < CURRENT_DATE THEN
        error_message := 'Cannot book tables for past dates';
        RETURN NEXT;
        RETURN;
    END IF;
    
    IF p_party_size < 1 OR p_party_size > 50 THEN
        error_message := 'Party size must be between 1 and 50 people';
        RETURN NEXT;
        RETURN;
    END IF;
    
    -- Get day of week for time slot lookup
    v_day_of_week := LOWER(TO_CHAR(p_booking_date, 'Day'));
    v_day_of_week := TRIM(v_day_of_week);
    
    -- Find matching time slot
    SELECT id INTO v_time_slot_id
    FROM time_slots
    WHERE venue_id = p_venue_id
        AND day_of_week = v_day_of_week::day_of_week
        AND start_time <= p_start_time
        AND end_time >= p_end_time
        AND is_active = true
    LIMIT 1;
    
    IF v_time_slot_id IS NULL THEN
        error_message := 'No valid time slot found for the requested time';
        RETURN NEXT;
        RETURN;
    END IF;
    
    -- Try to acquire locks for all tables
    FOREACH v_table_id IN ARRAY p_table_ids
    LOOP
        v_lock_acquired := acquire_booking_lock(v_table_id, p_booking_date, p_start_time);
        
        IF NOT v_lock_acquired THEN
            error_message := 'Unable to acquire lock for table ' || v_table_id || '. Please try again.';
            RETURN NEXT;
            RETURN;
        END IF;
        
        -- Check table availability
        v_table_available := check_table_availability(
            v_table_id,
            p_booking_date,
            p_start_time,
            p_end_time
        );
        
        IF NOT v_table_available THEN
            error_message := 'Table ' || v_table_id || ' is no longer available';
            -- Release all acquired locks
            FOREACH v_table_id IN ARRAY p_table_ids
            LOOP
                PERFORM release_booking_lock(v_table_id, p_booking_date, p_start_time);
            END LOOP;
            RETURN NEXT;
            RETURN;
        END IF;
        
        -- Calculate deposit for this table
        SELECT deposit_required INTO v_table_deposit
        FROM tables
        WHERE id = v_table_id;
        
        v_total_deposit := v_total_deposit + COALESCE(v_table_deposit, 0);
    END LOOP;
    
    -- Apply special date multipliers
    SELECT v_total_deposit * COALESCE(deposit_multiplier, 1.0)
    INTO v_total_deposit
    FROM special_dates
    WHERE venue_id = p_venue_id AND date = p_booking_date;
    
    -- Create the booking
    INSERT INTO bookings (
        venue_id,
        customer_id,
        customer_email,
        customer_phone,
        customer_name,
        booking_date,
        start_time,
        end_time,
        party_size,
        special_requests,
        occasion,
        status
    ) VALUES (
        p_venue_id,
        p_customer_id,
        p_customer_email,
        p_customer_phone,
        p_customer_name,
        p_booking_date,
        p_start_time,
        p_end_time,
        p_party_size,
        p_special_requests,
        p_occasion,
        'pending'
    )
    RETURNING id, booking_reference INTO v_booking_id, v_booking_ref;
    
    -- Assign tables to booking
    FOREACH v_table_id IN ARRAY p_table_ids
    LOOP
        INSERT INTO booking_tables (booking_id, table_id, is_primary)
        VALUES (v_booking_id, v_table_id, v_table_id = p_table_ids[1]);
    END LOOP;
    
    -- Create payment record if payment intent provided
    IF p_stripe_payment_intent_id IS NOT NULL THEN
        INSERT INTO payments (
            booking_id,
            amount,
            currency,
            payment_method,
            status,
            stripe_payment_intent_id,
            deposit_amount
        ) VALUES (
            v_booking_id,
            v_total_deposit,
            'GBP',
            'stripe',
            'pending',
            p_stripe_payment_intent_id,
            v_total_deposit
        );
    END IF;
    
    -- Release all locks
    FOREACH v_table_id IN ARRAY p_table_ids
    LOOP
        PERFORM release_booking_lock(v_table_id, p_booking_date, p_start_time);
    END LOOP;
    
    -- Return success
    booking_id := v_booking_id;
    booking_reference := v_booking_ref;
    total_deposit := v_total_deposit;
    success := true;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TABLE COMBINATION MANAGEMENT
-- Smart table combination suggestions and validation
-- =====================================================

-- Function to get optimal table combinations for party size
CREATE OR REPLACE FUNCTION get_optimal_table_combinations(
    p_venue_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_party_size INTEGER,
    p_location table_location DEFAULT NULL
)
RETURNS TABLE(
    combination_id INTEGER,
    table_ids UUID[],
    table_names TEXT[],
    total_capacity INTEGER,
    total_min_spend DECIMAL(10,2),
    total_deposit DECIMAL(10,2),
    is_optimal BOOLEAN,
    combination_type TEXT
) AS $$
DECLARE
    v_available_tables RECORD;
    v_single_table RECORD;
    v_combination RECORD;
    v_combo_id INTEGER := 1;
BEGIN
    -- First, try single tables that can accommodate the party
    FOR v_single_table IN
        SELECT t.id, t.table_number, t.display_name, t.max_capacity, 
               t.min_spend, t.deposit_required, t.preferred_capacity
        FROM tables t
        WHERE t.venue_id = p_venue_id
            AND t.is_active = true
            AND (p_location IS NULL OR t.location = p_location)
            AND t.max_capacity >= p_party_size
            AND check_table_availability(t.id, p_booking_date, p_start_time, p_end_time)
        ORDER BY 
            CASE WHEN t.preferred_capacity = p_party_size THEN 0 ELSE 1 END,
            ABS(t.max_capacity - p_party_size),
            t.is_premium DESC,
            t.display_order
    LOOP
        combination_id := v_combo_id;
        table_ids := ARRAY[v_single_table.id];
        table_names := ARRAY[v_single_table.display_name];
        total_capacity := v_single_table.max_capacity;
        total_min_spend := v_single_table.min_spend;
        total_deposit := v_single_table.deposit_required;
        is_optimal := (v_single_table.preferred_capacity = p_party_size);
        combination_type := 'single';
        
        v_combo_id := v_combo_id + 1;
        RETURN NEXT;
    END LOOP;
    
    -- Then, try table combinations
    FOR v_combination IN
        SELECT 
            tc.primary_table_id,
            tc.secondary_table_id,
            tc.combined_capacity,
            t1.display_name as primary_name,
            t2.display_name as secondary_name,
            t1.min_spend + t2.min_spend as combined_min_spend,
            t1.deposit_required + t2.deposit_required as combined_deposit
        FROM table_combinations tc
        JOIN tables t1 ON tc.primary_table_id = t1.id
        JOIN tables t2 ON tc.secondary_table_id = t2.id
        WHERE tc.venue_id = p_venue_id
            AND tc.is_active = true
            AND tc.combined_capacity >= p_party_size
            AND (p_location IS NULL OR (t1.location = p_location AND t2.location = p_location))
            AND check_table_availability(tc.primary_table_id, p_booking_date, p_start_time, p_end_time)
            AND check_table_availability(tc.secondary_table_id, p_booking_date, p_start_time, p_end_time)
        ORDER BY 
            ABS(tc.combined_capacity - p_party_size),
            combined_min_spend
    LOOP
        combination_id := v_combo_id;
        table_ids := ARRAY[v_combination.primary_table_id, v_combination.secondary_table_id];
        table_names := ARRAY[v_combination.primary_name, v_combination.secondary_name];
        total_capacity := v_combination.combined_capacity;
        total_min_spend := v_combination.combined_min_spend;
        total_deposit := v_combination.combined_deposit;
        is_optimal := (v_combination.combined_capacity <= p_party_size + 2); -- Allow 2 person buffer
        combination_type := 'combination';
        
        v_combo_id := v_combo_id + 1;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BOTTLE SERVICE MANAGEMENT
-- Enhanced bottle service ordering and pricing
-- =====================================================

-- Function to calculate bottle service pricing with packages
CREATE OR REPLACE FUNCTION calculate_bottle_service_total(
    p_booking_id UUID,
    p_items JSONB -- Array of {item_id: UUID, quantity: INTEGER}
)
RETURNS TABLE(
    item_totals JSONB,
    subtotal DECIMAL(10,2),
    service_charge DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    recommended_gratuity DECIMAL(10,2)
) AS $$
DECLARE
    v_item JSONB;
    v_item_id UUID;
    v_quantity INTEGER;
    v_item_price DECIMAL(10,2);
    v_item_total DECIMAL(10,2);
    v_subtotal DECIMAL(10,2) := 0;
    v_service_rate DECIMAL(3,2) := 0.125; -- 12.5% service charge
    v_gratuity_rate DECIMAL(3,2) := 0.15; -- 15% recommended gratuity
    v_item_details JSONB := '[]'::jsonb;
BEGIN
    -- Process each item
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_id := (v_item->>'item_id')::UUID;
        v_quantity := (v_item->>'quantity')::INTEGER;
        
        -- Get item price
        SELECT COALESCE(discounted_price, price)
        INTO v_item_price
        FROM bottle_service_items
        WHERE id = v_item_id AND is_available = true;
        
        IF v_item_price IS NULL THEN
            RAISE EXCEPTION 'Bottle service item % not found or unavailable', v_item_id;
        END IF;
        
        v_item_total := v_item_price * v_quantity;
        v_subtotal := v_subtotal + v_item_total;
        
        -- Add to item details
        v_item_details := v_item_details || jsonb_build_object(
            'item_id', v_item_id,
            'quantity', v_quantity,
            'unit_price', v_item_price,
            'total_price', v_item_total
        );
    END LOOP;
    
    -- Calculate charges
    item_totals := v_item_details;
    subtotal := v_subtotal;
    service_charge := v_subtotal * v_service_rate;
    total_amount := v_subtotal + (v_subtotal * v_service_rate);
    recommended_gratuity := v_subtotal * v_gratuity_rate;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create bottle service order
CREATE OR REPLACE FUNCTION create_bottle_service_order(
    p_booking_id UUID,
    p_items JSONB,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    order_id UUID,
    total_amount DECIMAL(10,2),
    success BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    v_order_id UUID;
    v_pricing RECORD;
    v_item JSONB;
    v_booking_exists BOOLEAN;
BEGIN
    -- Initialize return values
    success := false;
    error_message := NULL;
    
    -- Verify booking exists and belongs to current user
    SELECT EXISTS(
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id 
            AND (customer_id = auth.uid() OR auth.is_staff())
            AND status IN ('pending', 'confirmed')
    ) INTO v_booking_exists;
    
    IF NOT v_booking_exists THEN
        error_message := 'Booking not found or not accessible';
        RETURN NEXT;
        RETURN;
    END IF;
    
    -- Calculate pricing
    SELECT * INTO v_pricing
    FROM calculate_bottle_service_total(p_booking_id, p_items);
    
    -- Create bottle service order
    INSERT INTO bottle_service_orders (
        booking_id,
        total_amount,
        notes
    ) VALUES (
        p_booking_id,
        v_pricing.total_amount,
        p_notes
    ) RETURNING id INTO v_order_id;
    
    -- Add order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_pricing.item_totals)
    LOOP
        INSERT INTO bottle_service_order_items (
            order_id,
            item_id,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            v_order_id,
            (v_item->>'item_id')::UUID,
            (v_item->>'quantity')::INTEGER,
            (v_item->>'unit_price')::DECIMAL(10,2),
            (v_item->>'total_price')::DECIMAL(10,2)
        );
    END LOOP;
    
    -- Return success
    order_id := v_order_id;
    total_amount := v_pricing.total_amount;
    success := true;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ANALYTICS AND REPORTING FUNCTIONS
-- Business intelligence and performance metrics
-- =====================================================

-- Function to generate daily booking analytics
CREATE OR REPLACE FUNCTION generate_daily_analytics(
    p_venue_id UUID,
    p_date DATE
)
RETURNS VOID AS $$
DECLARE
    v_total_bookings INTEGER;
    v_confirmed_bookings INTEGER;
    v_cancelled_bookings INTEGER;
    v_no_shows INTEGER;
    v_total_guests INTEGER;
    v_total_revenue DECIMAL(10,2);
    v_total_deposits DECIMAL(10,2);
    v_avg_party_size DECIMAL(4,2);
    v_table_count INTEGER;
    v_utilized_tables INTEGER;
    v_utilization_percent DECIMAL(5,2);
    v_peak_hour TIME;
BEGIN
    -- Calculate booking metrics
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'confirmed'),
        COUNT(*) FILTER (WHERE status = 'cancelled'),
        COUNT(*) FILTER (WHERE status = 'no_show'),
        COALESCE(SUM(party_size) FILTER (WHERE status IN ('confirmed', 'completed')), 0),
        COALESCE(AVG(party_size) FILTER (WHERE status IN ('confirmed', 'completed')), 0)
    INTO 
        v_total_bookings,
        v_confirmed_bookings,
        v_cancelled_bookings,
        v_no_shows,
        v_total_guests,
        v_avg_party_size
    FROM bookings
    WHERE venue_id = p_venue_id
        AND booking_date = p_date;
    
    -- Calculate revenue from payments
    SELECT COALESCE(SUM(p.amount), 0), COALESCE(SUM(p.deposit_amount), 0)
    INTO v_total_revenue, v_total_deposits
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.venue_id = p_venue_id
        AND b.booking_date = p_date
        AND p.status = 'completed';
    
    -- Calculate table utilization
    SELECT COUNT(*) INTO v_table_count
    FROM tables
    WHERE venue_id = p_venue_id AND is_active = true;
    
    SELECT COUNT(DISTINCT bt.table_id)
    INTO v_utilized_tables
    FROM booking_tables bt
    JOIN bookings b ON bt.booking_id = b.id
    WHERE b.venue_id = p_venue_id
        AND b.booking_date = p_date
        AND b.status IN ('confirmed', 'completed');
    
    v_utilization_percent := CASE 
        WHEN v_table_count > 0 THEN (v_utilized_tables::DECIMAL / v_table_count) * 100
        ELSE 0
    END;
    
    -- Find peak booking hour
    SELECT start_time
    INTO v_peak_hour
    FROM bookings
    WHERE venue_id = p_venue_id
        AND booking_date = p_date
        AND status IN ('confirmed', 'completed')
    GROUP BY start_time
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    -- Insert or update analytics record
    INSERT INTO booking_analytics (
        venue_id,
        date,
        total_bookings,
        confirmed_bookings,
        cancelled_bookings,
        no_shows,
        total_guests,
        total_revenue,
        total_deposits,
        average_party_size,
        table_utilization_percent,
        peak_hour
    ) VALUES (
        p_venue_id,
        p_date,
        v_total_bookings,
        v_confirmed_bookings,
        v_cancelled_bookings,
        v_no_shows,
        v_total_guests,
        v_total_revenue,
        v_total_deposits,
        v_avg_party_size,
        v_utilization_percent,
        v_peak_hour
    )
    ON CONFLICT (venue_id, date)
    DO UPDATE SET
        total_bookings = EXCLUDED.total_bookings,
        confirmed_bookings = EXCLUDED.confirmed_bookings,
        cancelled_bookings = EXCLUDED.cancelled_bookings,
        no_shows = EXCLUDED.no_shows,
        total_guests = EXCLUDED.total_guests,
        total_revenue = EXCLUDED.total_revenue,
        total_deposits = EXCLUDED.total_deposits,
        average_party_size = EXCLUDED.average_party_size,
        table_utilization_percent = EXCLUDED.table_utilization_percent,
        peak_hour = EXCLUDED.peak_hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUTOMATED MAINTENANCE TASKS
-- Scheduled functions for data maintenance
-- =====================================================

-- Function to automatically update booking statuses
CREATE OR REPLACE FUNCTION update_booking_statuses()
RETURNS VOID AS $$
BEGIN
    -- Mark past bookings as completed if they were confirmed
    UPDATE bookings
    SET status = 'completed',
        completed_at = NOW()
    WHERE status = 'confirmed'
        AND booking_date < CURRENT_DATE;
    
    -- Mark very old pending bookings as expired/cancelled
    UPDATE bookings
    SET status = 'cancelled',
        cancelled_at = NOW(),
        internal_notes = COALESCE(internal_notes || ' | ', '') || 'Auto-cancelled: booking expired'
    WHERE status = 'pending'
        AND created_at < NOW() - INTERVAL '24 hours'
        AND booking_date > CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS VOID AS $$
BEGIN
    -- Delete successfully sent notifications older than 30 days
    DELETE FROM notifications
    WHERE sent_at IS NOT NULL
        AND sent_at < NOW() - INTERVAL '30 days';
    
    -- Delete failed notifications older than 7 days
    DELETE FROM notifications
    WHERE failed_at IS NOT NULL
        AND failed_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

-- All functions have been created successfully
-- Documentation available in README.md
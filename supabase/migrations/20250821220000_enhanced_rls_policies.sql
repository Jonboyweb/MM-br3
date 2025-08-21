-- =====================================================
-- ENHANCED ROW LEVEL SECURITY (RLS) POLICIES (FIXED)
-- Comprehensive security implementation for The Backroom Leeds
-- Compatible with Supabase local development
-- =====================================================

-- =====================================================
-- ADMIN ROLE MANAGEMENT (PUBLIC SCHEMA)
-- Create custom admin role checking functions in public schema
-- =====================================================

-- Function to check if user has admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user has admin role in auth.users metadata
    RETURN COALESCE(
        (auth.jwt() ->> 'role') = 'admin',
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has staff privileges (admin or staff)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        public.is_admin(),
        (auth.jwt() ->> 'role') = 'staff',
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'staff',
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ADMIN POLICIES - Full access for admin users
-- =====================================================

-- Admin policies for venues
CREATE POLICY "Admins have full access to venues" ON venues
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for tables
CREATE POLICY "Admins have full access to tables" ON tables
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for bookings
CREATE POLICY "Admins have full access to bookings" ON bookings
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for customers
CREATE POLICY "Admins have full access to customers" ON customers
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for payments
CREATE POLICY "Admins have full access to payments" ON payments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for events
CREATE POLICY "Admins have full access to events" ON events
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for bottle service
CREATE POLICY "Admins have full access to bottle service items" ON bottle_service_items
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to bottle service orders" ON bottle_service_orders
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin policies for notifications
CREATE POLICY "Admins have full access to notifications" ON notifications
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =====================================================
-- STAFF POLICIES - Limited access for staff users
-- =====================================================

-- Staff can view and manage bookings
CREATE POLICY "Staff can view all bookings" ON bookings
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff can update booking status" ON bookings
    FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Staff can view customer information
CREATE POLICY "Staff can view all customers" ON customers
    FOR SELECT TO authenticated
    USING (public.is_staff());

-- Staff can view payments
CREATE POLICY "Staff can view all payments" ON payments
    FOR SELECT TO authenticated
    USING (public.is_staff());

-- Staff can manage bottle service orders
CREATE POLICY "Staff can view bottle service orders" ON bottle_service_orders
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff can manage bottle service orders" ON bottle_service_orders
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Staff can view and send notifications
CREATE POLICY "Staff can manage notifications" ON notifications
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- =====================================================
-- CUSTOMER POLICIES - Enhanced customer access control
-- =====================================================

-- Enhanced customer booking policies
CREATE POLICY "Customers can view their own booking history" ON bookings
    FOR SELECT TO authenticated
    USING (
        customer_id = auth.uid() OR 
        customer_email = auth.email()
    );

-- Customers can cancel their own pending bookings
CREATE POLICY "Customers can cancel own pending bookings" ON bookings
    FOR UPDATE TO authenticated
    USING (
        (customer_id = auth.uid() OR customer_email = auth.email()) AND
        status = 'pending' AND
        booking_date > CURRENT_DATE
    )
    WITH CHECK (
        status IN ('cancelled') AND
        (customer_id = auth.uid() OR customer_email = auth.email())
    );

-- Enhanced customer payment access
CREATE POLICY "Customers can view payments for their bookings" ON payments
    FOR SELECT TO authenticated
    USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE customer_id = auth.uid() OR customer_email = auth.email()
        )
    );

-- Customer bottle service order access
CREATE POLICY "Customers can view their bottle service orders" ON bottle_service_orders
    FOR SELECT TO authenticated
    USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE customer_id = auth.uid() OR customer_email = auth.email()
        )
    );

CREATE POLICY "Customers can create bottle service orders" ON bottle_service_orders
    FOR INSERT TO authenticated
    WITH CHECK (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE customer_id = auth.uid() OR customer_email = auth.email()
        )
    );

-- =====================================================
-- TABLE-SPECIFIC POLICIES
-- Enable RLS on remaining tables
-- =====================================================

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottle_service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access to operational data
CREATE POLICY "Public can view time slots" ON time_slots
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Public can view special dates" ON special_dates
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view table combinations" ON table_combinations
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

-- Booking table assignments
CREATE POLICY "Customers can view their booking table assignments" ON booking_tables
    FOR SELECT TO authenticated
    USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE customer_id = auth.uid() OR customer_email = auth.email()
        )
    );

CREATE POLICY "Staff can manage booking table assignments" ON booking_tables
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Bottle service order items
CREATE POLICY "Customers can view their bottle service order items" ON bottle_service_order_items
    FOR SELECT TO authenticated
    USING (
        order_id IN (
            SELECT bso.id FROM bottle_service_orders bso
            JOIN bookings b ON bso.booking_id = b.id
            WHERE b.customer_id = auth.uid() OR b.customer_email = auth.email()
        )
    );

-- Analytics - Admin/Staff only
CREATE POLICY "Admin and staff can view analytics" ON booking_analytics
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Admin can manage analytics" ON booking_analytics
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =====================================================
-- ENHANCED SECURITY FUNCTIONS
-- Additional security and validation functions
-- =====================================================

-- Function to validate booking time constraints
CREATE OR REPLACE FUNCTION validate_booking_time_constraints(
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_venue_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_venue_hours JSONB;
    v_day_name TEXT;
    v_opening_time TIME;
    v_closing_time TIME;
BEGIN
    -- Get venue opening hours
    SELECT opening_hours INTO v_venue_hours
    FROM venues
    WHERE id = p_venue_id;
    
    -- Get day of week
    v_day_name := LOWER(TO_CHAR(p_booking_date, 'Day'));
    v_day_name := TRIM(v_day_name);
    
    -- Extract opening and closing times for the day
    v_opening_time := (v_venue_hours -> v_day_name ->> 'open')::TIME;
    v_closing_time := (v_venue_hours -> v_day_name ->> 'close')::TIME;
    
    -- Validate booking is within venue hours
    -- Handle overnight venues (closing time < opening time means next day)
    IF v_closing_time < v_opening_time THEN
        -- Overnight venue
        RETURN (p_start_time >= v_opening_time OR p_start_time <= v_closing_time) AND
               (p_end_time >= v_opening_time OR p_end_time <= v_closing_time);
    ELSE
        -- Same day venue
        RETURN p_start_time >= v_opening_time AND p_end_time <= v_closing_time;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate total booking cost including deposits and special date multipliers
CREATE OR REPLACE FUNCTION calculate_booking_cost(
    p_table_id UUID,
    p_booking_date DATE,
    p_party_size INTEGER,
    p_time_slot_id UUID
)
RETURNS TABLE(
    base_deposit DECIMAL(10,2),
    final_deposit DECIMAL(10,2),
    min_spend DECIMAL(10,2),
    special_multiplier DECIMAL(3,2)
) AS $$
DECLARE
    v_table_deposit DECIMAL(10,2);
    v_table_min_spend DECIMAL(10,2);
    v_slot_deposit DECIMAL(10,2);
    v_multiplier DECIMAL(3,2) := 1.0;
    v_venue_id UUID;
BEGIN
    -- Get table information
    SELECT deposit_required, min_spend, venue_id
    INTO v_table_deposit, v_table_min_spend, v_venue_id
    FROM tables
    WHERE id = p_table_id;
    
    -- Get time slot deposit
    SELECT deposit_amount
    INTO v_slot_deposit
    FROM time_slots
    WHERE id = p_time_slot_id;
    
    -- Check for special date multipliers
    SELECT COALESCE(deposit_multiplier, 1.0), COALESCE(min_spend_multiplier, 1.0)
    INTO v_multiplier, v_multiplier
    FROM special_dates
    WHERE venue_id = v_venue_id AND date = p_booking_date;
    
    -- Return calculated costs
    base_deposit := GREATEST(COALESCE(v_table_deposit, 0), COALESCE(v_slot_deposit, 0));
    final_deposit := base_deposit * v_multiplier;
    min_spend := v_table_min_spend * v_multiplier;
    special_multiplier := v_multiplier;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check minimum age requirement (18+)
CREATE OR REPLACE FUNCTION validate_customer_age(
    p_date_of_birth DATE
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_date_of_birth IS NULL OR 
           (CURRENT_DATE - p_date_of_birth) >= INTERVAL '18 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BOOKING VALIDATION TRIGGERS
-- Enhanced validation and security triggers
-- =====================================================

-- Trigger function to validate booking constraints
CREATE OR REPLACE FUNCTION validate_booking_constraints()
RETURNS TRIGGER AS $$
DECLARE
    v_venue_id UUID;
    v_is_available BOOLEAN;
    v_valid_time BOOLEAN;
    v_customer_age_valid BOOLEAN := true;
BEGIN
    -- Get venue ID from table relationship if table_id is provided
    IF NEW.venue_id IS NULL AND TG_TABLE_NAME = 'bookings' THEN
        -- For direct booking table inserts, get venue_id from booking record
        v_venue_id := NEW.venue_id;
    ELSE
        v_venue_id := NEW.venue_id;
    END IF;
    
    -- Validate booking date is not in the past
    IF NEW.booking_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Cannot book tables for past dates';
    END IF;
    
    -- Validate booking date is not too far in the future (e.g., 6 months)
    IF NEW.booking_date > CURRENT_DATE + INTERVAL '6 months' THEN
        RAISE EXCEPTION 'Cannot book tables more than 6 months in advance';
    END IF;
    
    -- Validate party size
    IF NEW.party_size < 1 OR NEW.party_size > 50 THEN
        RAISE EXCEPTION 'Party size must be between 1 and 50 people';
    END IF;
    
    -- Validate time constraints
    v_valid_time := validate_booking_time_constraints(
        NEW.booking_date,
        NEW.start_time,
        NEW.end_time,
        v_venue_id
    );
    
    IF NOT v_valid_time THEN
        RAISE EXCEPTION 'Booking time is outside venue operating hours';
    END IF;
    
    -- Validate customer age if customer_id is provided
    IF NEW.customer_id IS NOT NULL THEN
        SELECT validate_customer_age(date_of_birth)
        INTO v_customer_age_valid
        FROM customers
        WHERE id = NEW.customer_id;
        
        IF NOT v_customer_age_valid THEN
            RAISE EXCEPTION 'Customer must be 18 or older to book tables';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply booking validation trigger
DROP TRIGGER IF EXISTS trigger_validate_booking_constraints ON bookings;
CREATE TRIGGER trigger_validate_booking_constraints
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION validate_booking_constraints();

-- =====================================================
-- AUDIT LOGGING
-- Track important changes for security and compliance
-- =====================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        operation,
        old_values,
        new_values,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to critical tables
CREATE TRIGGER audit_bookings AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_customers AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- Additional indexes for enhanced performance
-- =====================================================

-- Indexes for security and audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit_logs(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_bookings_customer_status_date ON bookings(customer_id, status, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_date_status ON bookings(venue_id, booking_date, status);
CREATE INDEX IF NOT EXISTS idx_tables_venue_location_active ON tables(venue_id, location, is_active);
CREATE INDEX IF NOT EXISTS idx_time_slots_venue_day_active ON time_slots(venue_id, day_of_week, is_active);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION public.is_admin() IS 'Checks if the current user has admin privileges';
COMMENT ON FUNCTION public.is_staff() IS 'Checks if the current user has staff or admin privileges';
COMMENT ON FUNCTION validate_booking_time_constraints IS 'Validates that booking times are within venue operating hours';
COMMENT ON FUNCTION calculate_booking_cost IS 'Calculates total booking cost including special date multipliers';
COMMENT ON FUNCTION validate_customer_age IS 'Validates that customer meets minimum age requirement (18+)';
COMMENT ON TABLE audit_logs IS 'Audit trail for tracking changes to critical data';
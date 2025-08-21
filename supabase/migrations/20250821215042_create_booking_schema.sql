-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions;

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partial_refund');
CREATE TYPE payment_method AS ENUM ('stripe', 'cash', 'card_at_venue');
CREATE TYPE table_location AS ENUM ('upstairs', 'downstairs');
CREATE TYPE event_type AS ENUM ('regular', 'private', 'special');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- =====================================================
-- CORE VENUE TABLES
-- =====================================================

-- Venues table (for potential multi-venue expansion)
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Leeds',
    postcode VARCHAR(10) NOT NULL DEFAULT 'LS1 6DT',
    phone VARCHAR(20),
    email VARCHAR(255),
    capacity_total INTEGER NOT NULL DEFAULT 500,
    capacity_main_bar INTEGER DEFAULT 350,
    capacity_private_room INTEGER DEFAULT 150,
    amenities JSONB DEFAULT '[]'::jsonb,
    opening_hours JSONB DEFAULT '{}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE CONFIGURATION
-- =====================================================

-- Tables/Areas that can be booked
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    table_number VARCHAR(10) NOT NULL,
    display_name VARCHAR(100),
    location table_location NOT NULL,
    min_capacity INTEGER NOT NULL DEFAULT 2,
    max_capacity INTEGER NOT NULL DEFAULT 8,
    preferred_capacity INTEGER NOT NULL DEFAULT 6,
    is_premium BOOLEAN DEFAULT false,
    is_booth BOOLEAN DEFAULT false,
    floor_position_x INTEGER, -- For visual floor plan
    floor_position_y INTEGER, -- For visual floor plan
    description TEXT,
    amenities JSONB DEFAULT '[]'::jsonb, -- ["VIP service", "Private area", etc]
    images JSONB DEFAULT '[]'::jsonb,
    min_spend DECIMAL(10,2) DEFAULT 0,
    deposit_required DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(venue_id, table_number)
);

-- Table combination rules (for joining tables)
CREATE TABLE IF NOT EXISTS table_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    primary_table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    secondary_table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    combined_capacity INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(primary_table_id, secondary_table_id)
);

-- =====================================================
-- TIME MANAGEMENT
-- =====================================================

-- Time slots for bookings
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER DEFAULT 120, -- 2 hour slots
    is_peak BOOLEAN DEFAULT false,
    min_party_size INTEGER DEFAULT 2,
    max_party_size INTEGER DEFAULT 20,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(venue_id, day_of_week, start_time)
);

-- Special dates (holidays, special events, closures)
CREATE TABLE IF NOT EXISTS special_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    custom_hours JSONB, -- Override normal hours
    min_spend_multiplier DECIMAL(3,2) DEFAULT 1.0, -- 1.5 = 50% increase
    deposit_multiplier DECIMAL(3,2) DEFAULT 1.0,
    reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(venue_id, date)
);

-- =====================================================
-- EVENTS MANAGEMENT
-- =====================================================

-- Events (regular nights and special events)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    event_type event_type NOT NULL DEFAULT 'regular',
    day_of_week day_of_week, -- For regular events
    event_date DATE, -- For special events
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    music_genres JSONB DEFAULT '[]'::jsonb,
    featured_djs JSONB DEFAULT '[]'::jsonb,
    ticket_price DECIMAL(10,2),
    advance_ticket_price DECIMAL(10,2),
    table_booking_available BOOLEAN DEFAULT true,
    capacity_override INTEGER,
    images JSONB DEFAULT '[]'::jsonb,
    is_ticketed BOOLEAN DEFAULT false,
    external_ticket_url VARCHAR(500), -- Fatsoma link
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CUSTOMER MANAGEMENT
-- =====================================================

-- Customers (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    marketing_consent BOOLEAN DEFAULT false,
    sms_consent BOOLEAN DEFAULT false,
    vip_status BOOLEAN DEFAULT false,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BOOKING SYSTEM
-- =====================================================

-- Main bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    -- Contact details (can book without account)
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    
    -- Booking details
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Special requests and notes
    special_requests TEXT,
    dietary_requirements JSONB DEFAULT '[]'::jsonb,
    occasion VARCHAR(100), -- Birthday, Hen party, etc
    internal_notes TEXT, -- Staff only
    
    -- Timestamps
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_party_size CHECK (party_size > 0 AND party_size <= 50),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Table assignments for bookings
CREATE TABLE IF NOT EXISTS booking_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false, -- Main table for the booking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, table_id)
);

-- =====================================================
-- PAYMENT SYSTEM
-- =====================================================

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- Stripe specific fields
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_refund_id VARCHAR(255),
    
    -- Payment details
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    service_charge DECIMAL(10,2) DEFAULT 0,
    processing_fee DECIMAL(10,2) DEFAULT 0,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Metadata
    payment_date TIMESTAMPTZ,
    refund_date TIMESTAMPTZ,
    refund_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BOTTLE SERVICE
-- =====================================================

-- Bottle service menu items
CREATE TABLE IF NOT EXISTS bottle_service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- Champagne, Spirits, Packages
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    volume_ml INTEGER,
    alcohol_percentage DECIMAL(3,1),
    includes_mixers BOOLEAN DEFAULT true,
    max_guests INTEGER,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bottle service orders linked to bookings
CREATE TABLE IF NOT EXISTS bottle_service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual items in bottle service orders
CREATE TABLE IF NOT EXISTS bottle_service_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES bottle_service_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES bottle_service_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WAITLIST & NOTIFICATIONS
-- =====================================================

-- Waitlist for fully booked dates
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    requested_date DATE NOT NULL,
    requested_time TIME,
    party_size INTEGER NOT NULL,
    flexible_date BOOLEAN DEFAULT false,
    date_range_start DATE,
    date_range_end DATE,
    notified BOOLEAN DEFAULT false,
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email/SMS notification queue
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    notification_type VARCHAR(50) NOT NULL, -- confirmation, reminder, cancellation
    channel VARCHAR(20) NOT NULL, -- email, sms
    subject VARCHAR(255),
    content TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Booking analytics snapshot (for reporting)
CREATE TABLE IF NOT EXISTS booking_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    confirmed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    total_guests INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_deposits DECIMAL(10,2) DEFAULT 0,
    average_party_size DECIMAL(4,2),
    table_utilization_percent DECIMAL(5,2),
    peak_hour TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(venue_id, date)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Booking indexes
CREATE INDEX idx_bookings_venue_date ON bookings(venue_id, booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Table indexes
CREATE INDEX idx_tables_venue ON tables(venue_id);
CREATE INDEX idx_tables_location ON tables(location);
CREATE INDEX idx_tables_active ON tables(is_active);

-- Payment indexes
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Event indexes
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_day ON events(day_of_week);

-- Notification indexes
CREATE INDEX idx_notifications_booking ON notifications(booking_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'BR-';
    i INTEGER;
BEGIN
    -- Add date component (YYMMDD)
    result := result || TO_CHAR(NOW(), 'YYMMDD') || '-';
    
    -- Add random 6 character string
    FOR i IN 1..6 LOOP
        result := result || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference := generate_booking_reference();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_reference
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_reference();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp trigger to all relevant tables
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to check table availability
CREATE OR REPLACE FUNCTION check_table_availability(
    p_table_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM bookings b
    JOIN booking_tables bt ON b.id = bt.booking_id
    WHERE bt.table_id = p_table_id
        AND b.booking_date = p_booking_date
        AND b.status NOT IN ('cancelled', 'no_show')
        AND (p_exclude_booking_id IS NULL OR b.id != p_exclude_booking_id)
        AND (
            (b.start_time <= p_start_time AND b.end_time > p_start_time) OR
            (b.start_time < p_end_time AND b.end_time >= p_end_time) OR
            (b.start_time >= p_start_time AND b.end_time <= p_end_time)
        );
    
    RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to get available tables for a time slot
CREATE OR REPLACE FUNCTION get_available_tables(
    p_venue_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_party_size INTEGER
)
RETURNS TABLE(
    table_id UUID,
    table_number VARCHAR,
    display_name VARCHAR,
    location table_location,
    max_capacity INTEGER,
    is_premium BOOLEAN,
    min_spend DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.table_number,
        t.display_name,
        t.location,
        t.max_capacity,
        t.is_premium,
        t.min_spend
    FROM tables t
    WHERE t.venue_id = p_venue_id
        AND t.is_active = true
        AND t.max_capacity >= p_party_size
        AND check_table_availability(t.id, p_booking_date, p_start_time, p_end_time)
    ORDER BY 
        CASE WHEN t.preferred_capacity = p_party_size THEN 0 ELSE 1 END,
        t.max_capacity ASC,
        t.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer stats after booking
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Update stats when booking is confirmed
        IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
            UPDATE customers
            SET total_bookings = total_bookings + 1
            WHERE id = NEW.customer_id;
        END IF;
        
        -- Update no-show count
        IF NEW.status = 'no_show' AND OLD.status != 'no_show' THEN
            UPDATE customers
            SET no_show_count = no_show_count + 1
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_stats
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottle_service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottle_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access to venues, tables, events, and bottle service items
CREATE POLICY "Public can view venues" ON venues FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public can view tables" ON tables FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public can view events" ON events FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public can view bottle service items" ON bottle_service_items FOR SELECT TO anon, authenticated USING (is_available = true);

-- Customers can view and manage their own bookings
CREATE POLICY "Customers can view own bookings" ON bookings 
    FOR SELECT TO authenticated 
    USING (customer_id = auth.uid());

CREATE POLICY "Customers can create bookings" ON bookings 
    FOR INSERT TO authenticated 
    WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

CREATE POLICY "Customers can update own pending bookings" ON bookings 
    FOR UPDATE TO authenticated 
    USING (customer_id = auth.uid() AND status = 'pending');

-- Customers can view their own payments
CREATE POLICY "Customers can view own payments" ON payments 
    FOR SELECT TO authenticated 
    USING (
        booking_id IN (
            SELECT id FROM bookings WHERE customer_id = auth.uid()
        )
    );

-- Customers can view and update their own profile
CREATE POLICY "Customers can view own profile" ON customers 
    FOR SELECT TO authenticated 
    USING (id = auth.uid());

CREATE POLICY "Customers can update own profile" ON customers 
    FOR UPDATE TO authenticated 
    USING (id = auth.uid());

-- Anonymous users can join waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist 
    FOR INSERT TO anon, authenticated 
    WITH CHECK (true);

-- =====================================================
-- SEED INITIAL DATA
-- =====================================================

-- Insert The Backroom Leeds venue
INSERT INTO venues (
    name, 
    slug,
    address, 
    city, 
    postcode, 
    phone,
    email,
    capacity_total,
    capacity_main_bar,
    capacity_private_room,
    amenities,
    opening_hours
) VALUES (
    'The Backroom Leeds',
    'backroom-leeds',
    '50a Call Lane',
    'Leeds',
    'LS1 6DT',
    '+44 113 123 4567',
    'bookings@thebackroomleeds.com',
    500,
    350,
    150,
    '["Two floors", "Late license until 6am", "Professional sound system", "DJ booth", "VIP areas", "Cocktail bar", "Bottle service", "Cloakroom", "Security", "Wheelchair accessible"]'::jsonb,
    '{
        "monday": {"open": "17:00", "close": "02:00"},
        "tuesday": {"open": "17:00", "close": "02:00"},
        "wednesday": {"open": "17:00", "close": "02:00"},
        "thursday": {"open": "17:00", "close": "03:00"},
        "friday": {"open": "17:00", "close": "06:00"},
        "saturday": {"open": "17:00", "close": "06:00"},
        "sunday": {"open": "17:00", "close": "02:00"}
    }'::jsonb
);

-- Comments for documentation
COMMENT ON TABLE bookings IS 'Main table for all venue bookings';
COMMENT ON TABLE tables IS 'Physical tables/areas that can be booked in the venue';
COMMENT ON TABLE customers IS 'Customer profiles extending Supabase auth.users';
COMMENT ON TABLE payments IS 'Payment transactions for bookings';
COMMENT ON TABLE events IS 'Regular and special events at the venue';
COMMENT ON TABLE bottle_service_items IS 'Menu items available for bottle service';
COMMENT ON FUNCTION check_table_availability IS 'Checks if a specific table is available for a given time slot';
COMMENT ON FUNCTION get_available_tables IS 'Returns all available tables for a specific time slot and party size';
-- =====================================================
-- REAL-TIME TRIGGERS AND BOTTLE SERVICE MENU
-- Set up real-time subscriptions and populate bottle service data
-- =====================================================

-- =====================================================
-- REAL-TIME PUBLICATIONS FOR SUPABASE REALTIME
-- Enable real-time subscriptions for key tables
-- =====================================================

-- Enable real-time on tables for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE bottle_service_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =====================================================
-- ENHANCED REAL-TIME TRIGGER FUNCTIONS
-- Detailed real-time notifications for UI updates
-- =====================================================

-- Function to broadcast table availability changes with detailed information
CREATE OR REPLACE FUNCTION broadcast_table_availability()
RETURNS TRIGGER AS $$
DECLARE
    v_venue_id UUID;
    v_affected_tables UUID[];
    v_table_info JSONB;
BEGIN
    -- Get venue ID
    IF TG_TABLE_NAME = 'bookings' THEN
        v_venue_id := NEW.venue_id;
        
        -- Get all tables affected by this booking
        SELECT array_agg(table_id)
        INTO v_affected_tables
        FROM booking_tables
        WHERE booking_id = NEW.id;
    END IF;
    
    -- Create detailed table information
    SELECT jsonb_agg(
        jsonb_build_object(
            'table_id', t.id,
            'table_number', t.table_number,
            'display_name', t.display_name,
            'location', t.location,
            'is_available', NOT EXISTS(
                SELECT 1 FROM bookings b
                JOIN booking_tables bt ON b.id = bt.booking_id
                WHERE bt.table_id = t.id
                    AND b.booking_date = CURRENT_DATE
                    AND b.status NOT IN ('cancelled', 'no_show')
            )
        )
    )
    INTO v_table_info
    FROM tables t
    WHERE t.id = ANY(v_affected_tables);
    
    -- Broadcast the change
    PERFORM pg_notify(
        'table_availability_update',
        jsonb_build_object(
            'venue_id', v_venue_id,
            'booking_id', NEW.id,
            'booking_date', NEW.booking_date,
            'status', NEW.status,
            'affected_tables', v_table_info,
            'timestamp', extract(epoch from now())
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply enhanced real-time trigger
DROP TRIGGER IF EXISTS trigger_broadcast_table_availability ON bookings;
CREATE TRIGGER trigger_broadcast_table_availability
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION broadcast_table_availability();

-- Function to broadcast booking updates to admin dashboard
CREATE OR REPLACE FUNCTION broadcast_booking_update()
RETURNS TRIGGER AS $$
DECLARE
    v_operation TEXT;
    v_booking_data JSONB;
BEGIN
    -- Determine operation type
    v_operation := TG_OP;
    
    -- Build comprehensive booking data
    v_booking_data := jsonb_build_object(
        'operation', v_operation,
        'booking_id', COALESCE(NEW.id, OLD.id),
        'booking_reference', COALESCE(NEW.booking_reference, OLD.booking_reference),
        'customer_name', COALESCE(NEW.customer_name, OLD.customer_name),
        'customer_email', COALESCE(NEW.customer_email, OLD.customer_email),
        'party_size', COALESCE(NEW.party_size, OLD.party_size),
        'booking_date', COALESCE(NEW.booking_date, OLD.booking_date),
        'start_time', COALESCE(NEW.start_time, OLD.start_time),
        'status', COALESCE(NEW.status, OLD.status),
        'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
        'created_at', COALESCE(NEW.created_at, OLD.created_at),
        'updated_at', COALESCE(NEW.updated_at, OLD.updated_at),
        'timestamp', extract(epoch from now())
    );
    
    -- Add table information for new/updated bookings
    IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.id IS NOT NULL THEN
        v_booking_data := v_booking_data || jsonb_build_object(
            'tables', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'table_id', t.id,
                        'table_number', t.table_number,
                        'display_name', t.display_name,
                        'location', t.location
                    )
                )
                FROM booking_tables bt
                JOIN tables t ON bt.table_id = t.id
                WHERE bt.booking_id = NEW.id
            )
        );
    END IF;
    
    -- Broadcast to admin dashboard
    PERFORM pg_notify('admin_booking_update', v_booking_data::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply admin dashboard trigger
CREATE TRIGGER trigger_broadcast_booking_update
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION broadcast_booking_update();

-- Function to broadcast payment status updates
CREATE OR REPLACE FUNCTION broadcast_payment_update()
RETURNS TRIGGER AS $$
DECLARE
    v_payment_data JSONB;
    v_booking_data JSONB;
BEGIN
    -- Get booking information
    SELECT jsonb_build_object(
        'booking_id', b.id,
        'booking_reference', b.booking_reference,
        'customer_name', b.customer_name,
        'customer_email', b.customer_email
    )
    INTO v_booking_data
    FROM bookings b
    WHERE b.id = NEW.booking_id;
    
    -- Build payment update data
    v_payment_data := jsonb_build_object(
        'payment_id', NEW.id,
        'booking_info', v_booking_data,
        'amount', NEW.amount,
        'status', NEW.status,
        'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
        'payment_method', NEW.payment_method,
        'stripe_payment_intent_id', NEW.stripe_payment_intent_id,
        'timestamp', extract(epoch from now())
    );
    
    -- Broadcast payment update
    PERFORM pg_notify('payment_status_update', v_payment_data::text);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply payment update trigger
CREATE TRIGGER trigger_broadcast_payment_update
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION broadcast_payment_update();

-- =====================================================
-- BOTTLE SERVICE MENU POPULATION
-- Complete bottle service menu based on venue requirements
-- =====================================================

-- Get venue ID for The Backroom Leeds
DO $$
DECLARE
    v_venue_id UUID;
BEGIN
    SELECT id INTO v_venue_id FROM venues WHERE slug = 'backroom-leeds';
    
    -- =====================================================
    -- CHAMPAGNE & PROSECCO
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, is_featured, display_order) VALUES
    (v_venue_id, 'Champagne', 'Prosecco', 'Italian sparkling wine', 85.00, 750, false, 1),
    (v_venue_id, 'Champagne', 'Moët & Chandon Brut Imperial', 'Classic French champagne', 160.00, 750, true, 2),
    (v_venue_id, 'Champagne', 'Veuve Clicquot Brut', 'Premium French champagne', 180.00, 750, true, 3),
    (v_venue_id, 'Champagne', 'Dom Pérignon Vintage', 'Luxury champagne experience', 250.00, 750, true, 4);
    
    -- =====================================================
    -- VODKA
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, includes_mixers, display_order) VALUES
    (v_venue_id, 'Vodka', 'Smirnoff Red Label', 'Classic vodka with mixers', 120.00, 700, 37.5, true, 10),
    (v_venue_id, 'Vodka', 'Grey Goose', 'Premium French vodka', 160.00, 700, 40.0, true, 11),
    (v_venue_id, 'Vodka', 'Beluga Noble', 'Russian luxury vodka', 180.00, 700, 40.0, true, 12);
    
    -- =====================================================
    -- RUM
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, includes_mixers, display_order) VALUES
    (v_venue_id, 'Rum', 'Bacardi Carta Blanca', 'White rum with mixers', 140.00, 700, 37.5, true, 20),
    (v_venue_id, 'Rum', 'Bacardi Spiced', 'Spiced rum with mixers', 150.00, 700, 35.0, true, 21),
    (v_venue_id, 'Rum', 'Captain Morgan Spiced', 'Popular spiced rum', 145.00, 700, 35.0, true, 22),
    (v_venue_id, 'Rum', 'Kraken Black Spiced', 'Dark spiced rum', 160.00, 700, 40.0, true, 23),
    (v_venue_id, 'Rum', 'Havana Club 7 Year', 'Aged Cuban-style rum', 180.00, 700, 40.0, true, 24);
    
    -- =====================================================
    -- GIN
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, includes_mixers, display_order) VALUES
    (v_venue_id, 'Gin', 'Bombay Sapphire', 'Premium London Dry Gin', 130.00, 700, 40.0, true, 30),
    (v_venue_id, 'Gin', 'Hendricks', 'Scottish gin with cucumber & rose', 150.00, 700, 41.4, true, 31);
    
    -- =====================================================
    -- COGNAC
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, display_order) VALUES
    (v_venue_id, 'Cognac', 'Hennessy VS', 'Classic French cognac', 150.00, 700, 40.0, 40),
    (v_venue_id, 'Cognac', 'Rémy Martin VSOP', 'Premium cognac', 200.00, 700, 40.0, 41),
    (v_venue_id, 'Cognac', 'Hennessy XO', 'Luxury cognac experience', 500.00, 700, 40.0, 42);
    
    -- =====================================================
    -- WHISKEY
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, includes_mixers, display_order) VALUES
    (v_venue_id, 'Whiskey', 'Jack Daniels', 'Tennessee whiskey', 130.00, 700, 40.0, true, 50),
    (v_venue_id, 'Whiskey', 'Jameson', 'Irish whiskey', 140.00, 700, 40.0, true, 51),
    (v_venue_id, 'Whiskey', 'Macallan 12 Year', 'Single malt Scotch whisky', 250.00, 700, 40.0, false, 52),
    (v_venue_id, 'Whiskey', 'Macallan 18 Year', 'Premium aged Scotch whisky', 550.00, 700, 43.0, false, 53);
    
    -- =====================================================
    -- TEQUILA
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, includes_mixers, display_order) VALUES
    (v_venue_id, 'Tequila', 'Jose Cuervo Gold', 'Classic gold tequila', 130.00, 700, 38.0, true, 60),
    (v_venue_id, 'Tequila', 'Patrón Silver', 'Premium silver tequila', 200.00, 700, 40.0, true, 61),
    (v_venue_id, 'Tequila', 'Don Julio 1942', 'Ultra-premium añejo tequila', 600.00, 700, 38.0, false, 62);
    
    -- =====================================================
    -- LIQUEURS
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, volume_ml, alcohol_percentage, display_order) VALUES
    (v_venue_id, 'Liqueurs', 'Disaronno', 'Italian amaretto liqueur', 130.00, 700, 28.0, 70),
    (v_venue_id, 'Liqueurs', 'Baileys Irish Cream', 'Cream liqueur', 160.00, 700, 17.0, 71);
    
    -- =====================================================
    -- SIGNATURE PACKAGES
    -- Pre-curated bottle service packages
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, max_guests, is_featured, display_order) VALUES
    (v_venue_id, 'Packages', 'Hush & Shush', 'Smirnoff Red Label + Prosecco + 6x shots of choice', 170.00, 8, true, 100),
    (v_venue_id, 'Packages', 'Speak Whiskey to Me', 'Jack Daniels + Bacardi Spiced + mixers', 280.00, 10, true, 101),
    (v_venue_id, 'Packages', 'After Hours', 'Grey Goose + Hennessy VS + premium mixers', 400.00, 12, true, 102),
    (v_venue_id, 'Packages', 'Midnight Madness', 'Dom Pérignon + Macallan 12 + Patrón Silver', 580.00, 15, true, 103);
    
    -- =====================================================
    -- COCKTAIL PACKAGES
    -- Pre-made cocktail options
    -- =====================================================
    
    INSERT INTO bottle_service_items (venue_id, category, name, description, price, max_guests, display_order) VALUES
    (v_venue_id, 'Cocktails', 'Cocktail Tree (Espresso Martinis)', '12x Espresso Martinis on decorative tree', 120.00, 12, 110),
    (v_venue_id, 'Cocktails', 'House G&T', '4x double gin & tonics', 40.00, 4, 111),
    (v_venue_id, 'Cocktails', 'Caribbean Vibes', 'Rum-based cocktail selection', 50.00, 6, 112);
    
END $$;

-- =====================================================
-- SCHEDULED TASKS SETUP
-- Configure automatic maintenance tasks
-- =====================================================

-- Note: pg_cron extension needs to be enabled for scheduled tasks
-- These would typically be set up by admin after deployment

-- Daily analytics generation (run at 6 AM daily)
-- SELECT cron.schedule('generate-daily-analytics', '0 6 * * *', 'SELECT generate_daily_analytics(venue_id, CURRENT_DATE - INTERVAL ''1 day'') FROM venues;');

-- Booking status updates (run every hour)
-- SELECT cron.schedule('update-booking-statuses', '0 * * * *', 'SELECT update_booking_statuses();');

-- Cleanup old notifications (run weekly on Sunday at 2 AM)
-- SELECT cron.schedule('cleanup-notifications', '0 2 * * 0', 'SELECT cleanup_old_notifications();');

-- =====================================================
-- FUNCTION TO ENABLE SCHEDULED TASKS
-- Call this function after deployment to enable cron jobs
-- =====================================================

CREATE OR REPLACE FUNCTION enable_scheduled_tasks()
RETURNS TEXT AS $$
BEGIN
    -- Only enable if pg_cron extension is available
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Daily analytics
        PERFORM cron.schedule(
            'generate-daily-analytics', 
            '0 6 * * *', 
            'SELECT generate_daily_analytics(venue_id, CURRENT_DATE - INTERVAL ''1 day'') FROM venues;'
        );
        
        -- Booking status updates
        PERFORM cron.schedule(
            'update-booking-statuses', 
            '0 * * * *', 
            'SELECT update_booking_statuses();'
        );
        
        -- Cleanup notifications
        PERFORM cron.schedule(
            'cleanup-notifications', 
            '0 2 * * 0', 
            'SELECT cleanup_old_notifications();'
        );
        
        RETURN 'Scheduled tasks enabled successfully';
    ELSE
        RETURN 'pg_cron extension not available - scheduled tasks not enabled';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PERFORMANCE MONITORING FUNCTIONS
-- Database performance and health monitoring
-- =====================================================

-- Function to check database performance metrics
CREATE OR REPLACE FUNCTION get_database_performance_metrics()
RETURNS TABLE(
    metric_name TEXT,
    metric_value NUMERIC,
    metric_unit TEXT,
    status TEXT
) AS $$
BEGIN
    -- Active connections
    metric_name := 'active_connections';
    SELECT count(*) INTO metric_value FROM pg_stat_activity WHERE state = 'active';
    metric_unit := 'connections';
    status := CASE WHEN metric_value < 50 THEN 'good' WHEN metric_value < 100 THEN 'warning' ELSE 'critical' END;
    RETURN NEXT;
    
    -- Database size
    metric_name := 'database_size';
    SELECT pg_database_size(current_database()) / 1024 / 1024 INTO metric_value;
    metric_unit := 'MB';
    status := CASE WHEN metric_value < 1000 THEN 'good' WHEN metric_value < 5000 THEN 'warning' ELSE 'critical' END;
    RETURN NEXT;
    
    -- Average booking creation time (last 24 hours)
    metric_name := 'avg_booking_creation_time';
    SELECT EXTRACT(EPOCH FROM AVG(updated_at - created_at))
    INTO metric_value
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '24 hours';
    metric_unit := 'seconds';
    status := CASE WHEN metric_value < 1 THEN 'good' WHEN metric_value < 5 THEN 'warning' ELSE 'critical' END;
    RETURN NEXT;
    
    -- Booking success rate (last 24 hours)
    metric_name := 'booking_success_rate';
    SELECT 
        (COUNT(*) FILTER (WHERE status IN ('confirmed', 'completed'))::NUMERIC / 
         NULLIF(COUNT(*), 0)) * 100
    INTO metric_value
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '24 hours';
    metric_unit := 'percent';
    status := CASE WHEN metric_value > 80 THEN 'good' WHEN metric_value > 60 THEN 'warning' ELSE 'critical' END;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION broadcast_table_availability IS 'Broadcasts real-time table availability updates to connected clients';
COMMENT ON FUNCTION broadcast_booking_update IS 'Broadcasts booking changes to admin dashboard in real-time';
COMMENT ON FUNCTION broadcast_payment_update IS 'Broadcasts payment status changes for real-time UI updates';
COMMENT ON FUNCTION enable_scheduled_tasks IS 'Enables automated maintenance tasks using pg_cron';
COMMENT ON FUNCTION get_database_performance_metrics IS 'Returns key database performance metrics for monitoring';

-- Final migration success message
SELECT 'Real-time triggers and bottle service menu setup completed successfully' as status;
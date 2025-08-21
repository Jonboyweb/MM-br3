-- =====================================================
-- SEED TABLES DATA
-- Based on actual venue table layout
-- =====================================================

-- Get the venue ID for The Backroom Leeds
DO $$
DECLARE
    v_venue_id UUID;
BEGIN
    SELECT id INTO v_venue_id FROM venues WHERE slug = 'backroom-leeds';
    
    -- Update venue opening hours (11pm-6am standard)
    UPDATE venues 
    SET opening_hours = '{
        "monday": {"open": "23:00", "close": "04:00"},
        "tuesday": {"open": "23:00", "close": "04:00"},
        "wednesday": {"open": "23:00", "close": "05:00"},
        "thursday": {"open": "23:00", "close": "05:00"},
        "friday": {"open": "23:00", "close": "06:00"},
        "saturday": {"open": "23:00", "close": "06:00"},
        "sunday": {"open": "23:00", "close": "06:00"}
    }'::jsonb
    WHERE id = v_venue_id;
    
    -- =====================================================
    -- INSERT UPSTAIRS TABLES (10 tables)
    -- =====================================================
    
    -- Table 1: Premium dance floor booth (100 GBP deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity, 
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '1', 'Premium Dance Floor Booth', 'upstairs', 4, 12, 8, 
            true, true, 'Premium booth with prime dance floor view', 600.00, 100.00, 1,
            '["Premium location", "Dance floor view", "VIP service"]'::jsonb);
    
    -- Table 2: Dance floor side high table (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '2', 'Dance Floor Side Table', 'upstairs', 4, 8, 6,
            false, false, 'High table on dance floor side - can combine with Table 3', 400.00, 50.00, 2,
            '["Dance floor side", "High table", "Combinable with Table 3"]'::jsonb);
    
    -- Table 3: Dance floor side high table next to DJ (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '3', 'DJ Side Table', 'upstairs', 4, 8, 6,
            false, false, 'High table next to DJ - can combine with Table 2', 400.00, 50.00, 3,
            '["Next to DJ", "High table", "Combinable with Table 2"]'::jsonb);
    
    -- Table 4: Dance floor front high table next to DJ (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '4', 'Front Dance Floor Table', 'upstairs', 4, 8, 6,
            false, false, 'High table at front of dance floor - can combine with Table 5', 400.00, 50.00, 4,
            '["Dance floor front", "Next to DJ", "Combinable with Table 5"]'::jsonb);
    
    -- Table 5: Large dance floor front table (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '5', 'Large Front Table', 'upstairs', 4, 10, 8,
            false, false, 'Large high table at dance floor front - can combine with Table 4', 500.00, 50.00, 5,
            '["Dance floor front", "Large table", "Combinable with Table 4"]'::jsonb);
    
    -- Table 6: Barrel bar area (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '6', 'Barrel Bar Table 1', 'upstairs', 2, 4, 3,
            false, false, 'Barrel bar area - can combine with Tables 7 & 8', 200.00, 50.00, 6,
            '["Barrel bar area", "Combinable with Tables 7 & 8"]'::jsonb);
    
    -- Table 7: Barrel bar area (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '7', 'Barrel Bar Table 2', 'upstairs', 2, 4, 3,
            false, false, 'Barrel bar area - can combine with Tables 6 & 8', 200.00, 50.00, 7,
            '["Barrel bar area", "Combinable with Tables 6 & 8"]'::jsonb);
    
    -- Table 8: Barrel bar area (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '8', 'Barrel Bar Table 3', 'upstairs', 2, 4, 3,
            false, false, 'Barrel bar area - can combine with Tables 6 & 7', 200.00, 50.00, 8,
            '["Barrel bar area", "Combinable with Tables 6 & 7"]'::jsonb);
    
    -- Table 9: Large booth near bar and terrace (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '9', 'Terrace Booth', 'upstairs', 4, 10, 8,
            false, true, 'Large booth near bar, outside terrace & ladies toilet', 450.00, 50.00, 9,
            '["Near bar", "Close to terrace", "Booth seating"]'::jsonb);
    
    -- Table 10: Premium Ciroc booth (100 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '10', 'Ciroc VIP Booth', 'upstairs', 4, 12, 8,
            true, true, 'Premium Ciroc booth in bar area', 700.00, 100.00, 10,
            '["VIP booth", "Ciroc branded", "Bar area", "Premium service"]'::jsonb);
    
    -- =====================================================
    -- INSERT DOWNSTAIRS TABLES (6 tables)
    -- =====================================================
    
    -- Table 11: Intimate booth opposite bar (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '11', 'Intimate Booth 1', 'downstairs', 2, 8, 6,
            false, true, 'Intimate booth opposite bar', 350.00, 50.00, 11,
            '["Intimate setting", "Opposite bar", "Booth seating"]'::jsonb);
    
    -- Table 12: Intimate booth opposite bar (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '12', 'Intimate Booth 2', 'downstairs', 2, 8, 6,
            false, true, 'Intimate booth opposite bar', 350.00, 50.00, 12,
            '["Intimate setting", "Opposite bar", "Booth seating"]'::jsonb);
    
    -- Table 13: Dance floor booth next to DJ (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '13', 'DJ Booth', 'downstairs', 2, 8, 6,
            false, true, 'Dance floor booth next to DJ', 400.00, 50.00, 13,
            '["Next to DJ", "Dance floor view", "Booth seating"]'::jsonb);
    
    -- Table 14: Dance floor booth near facilities (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '14', 'Dance Floor Booth', 'downstairs', 2, 8, 6,
            false, true, 'Dance floor booth near gents & disabled toilet', 350.00, 50.00, 14,
            '["Dance floor view", "Near facilities", "Booth seating"]'::jsonb);
    
    -- Table 15: Curved seating next to bar (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '15', 'Curved Bar Seating 1', 'downstairs', 2, 6, 4,
            false, false, 'Curved seating area next to bar - can combine with Table 16', 250.00, 50.00, 15,
            '["Next to bar", "Curved seating", "Combinable with Table 16"]'::jsonb);
    
    -- Table 16: Curved seating next to bar (50 deposit)
    INSERT INTO tables (venue_id, table_number, display_name, location, min_capacity, max_capacity, preferred_capacity,
                       is_premium, is_booth, description, min_spend, deposit_required, display_order, amenities)
    VALUES (v_venue_id, '16', 'Curved Bar Seating 2', 'downstairs', 2, 6, 4,
            false, false, 'Curved seating area next to bar - can combine with Table 15', 250.00, 50.00, 16,
            '["Next to bar", "Curved seating", "Combinable with Table 15"]'::jsonb);
    
    -- =====================================================
    -- INSERT TABLE COMBINATIONS
    -- Based on actual venue combination rules
    -- =====================================================
    
    -- Upstairs: Tables 2 & 3 can combine (9-16 people)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        16 -- Max combined capacity
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '2'
        AND t2.table_number = '3';
    
    -- Upstairs: Tables 4 & 5 can combine (9-18 people, up to 25 with disclaimer)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        18 -- Max seated capacity (can accommodate up to 25 with standing)
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '4'
        AND t2.table_number = '5';
    
    -- Upstairs: Tables 6 & 7 can combine (5-8 people)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        8
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '6'
        AND t2.table_number = '7';
    
    -- Upstairs: Tables 6 & 8 can combine (5-8 people)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        8
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '6'
        AND t2.table_number = '8';
    
    -- Upstairs: Tables 7 & 8 can combine (5-8 people)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        8
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '7'
        AND t2.table_number = '8';
    
    -- Note: Triple combination of tables 6, 7 & 8 (9-12 people) will be handled in application logic
    
    -- Downstairs: Tables 15 & 16 can combine (7-12 people)
    INSERT INTO table_combinations (venue_id, primary_table_id, secondary_table_id, combined_capacity)
    SELECT 
        v_venue_id,
        t1.id,
        t2.id,
        12
    FROM tables t1
    CROSS JOIN tables t2
    WHERE t1.venue_id = v_venue_id
        AND t2.venue_id = v_venue_id
        AND t1.table_number = '15'
        AND t2.table_number = '16';
    
    -- =====================================================
    -- INSERT TIME SLOTS FOR TABLE BOOKINGS
    -- Tables are booked for the whole evening
    -- Arrival times can be between 11pm-1am
    -- The whole evening duration is represented as a single slot
    -- =====================================================
    
    -- Monday to Tuesday (11pm-4am closing) - Quieter nights - May have lower or no deposit
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    -- Whole evening booking slot (arrival 11pm-1am, table for whole night)
    (v_venue_id, 'monday', '23:00', '04:00', 300, false, 0); -- No deposit on quiet nights
    
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'tuesday', '23:00', '04:00', 300, false, 0); -- No deposit on quiet nights
    
    -- Wednesday to Thursday (11pm-5am closing) - Midweek - May have lower deposits
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'wednesday', '23:00', '05:00', 360, false, 25); -- Lower deposit midweek
    
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'thursday', '23:00', '05:00', 360, true, 50); -- Standard deposit
    
    -- Friday (11pm-6am) - La Fiesta - Peak night - Standard deposits
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'friday', '23:00', '06:00', 420, true, 50); -- Standard deposit (premium tables have their own)
    
    -- Saturday (11pm-6am) - Shhh! - Peak night - Standard deposits
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'saturday', '23:00', '06:00', 420, true, 50); -- Standard deposit (premium tables have their own)
    
    -- Sunday (11pm-6am) - Nostalgia - Popular night - May have lower deposits
    INSERT INTO time_slots (venue_id, day_of_week, start_time, end_time, slot_duration_minutes, is_peak, deposit_amount)
    VALUES 
    (v_venue_id, 'sunday', '23:00', '06:00', 420, true, 25); -- Lower deposit on Sundays
    
    -- =====================================================
    -- INSERT REGULAR EVENTS
    -- Club nights run throughout the evening with table service
    -- =====================================================
    
    -- La Fiesta - Friday nights
    INSERT INTO events (venue_id, name, slug, event_type, day_of_week, start_time, end_time,
                       description, music_genres, table_booking_available, is_active)
    VALUES (v_venue_id, 'La Fiesta', 'la-fiesta', 'regular', 'friday', '23:00', '06:00',
            'Leeds hottest Latin party! Reggaeton, Latin trap, and commercial hits all night long.',
            '["Reggaeton", "Latin", "Commercial", "Hip-Hop"]'::jsonb,
            true, true); -- Tables available during club night
    
    -- Shhh! - Saturday nights
    INSERT INTO events (venue_id, name, slug, event_type, day_of_week, start_time, end_time,
                       description, music_genres, table_booking_available, is_active)
    VALUES (v_venue_id, 'Shhh!', 'shhh', 'regular', 'saturday', '23:00', '06:00',
            'The ultimate Saturday night experience. Commercial, R&B, and party anthems.',
            '["Commercial", "R&B", "Hip-Hop", "House"]'::jsonb,
            true, true); -- Tables available during club night
    
    -- Nostalgia - Sunday nights
    INSERT INTO events (venue_id, name, slug, event_type, day_of_week, start_time, end_time,
                       description, music_genres, table_booking_available, is_active)
    VALUES (v_venue_id, 'Nostalgia', 'nostalgia', 'regular', 'sunday', '23:00', '06:00',
            'Throwback Sunday! All your favorite 2000s and 2010s hits.',
            '["2000s", "2010s", "Throwback", "Pop", "R&B"]'::jsonb,
            true, true); -- Tables available during club night
    
    -- =====================================================
    -- INSERT SPECIAL DATES (Example holidays/events)
    -- Special events may have higher deposits
    -- =====================================================
    
    -- New Year's Eve - Earlier opening (9pm) with higher deposits and minimum spend
    INSERT INTO special_dates (venue_id, date, custom_hours, min_spend_multiplier, deposit_multiplier, reason)
    VALUES (v_venue_id, '2024-12-31', '{"open": "21:00", "close": "06:00"}'::jsonb, 2.0, 2.0, 'New Years Eve - Early opening at 9pm, higher deposits');
    
    -- Christmas Eve - Closed
    INSERT INTO special_dates (venue_id, date, is_closed, reason)
    VALUES (v_venue_id, '2024-12-24', true, 'Christmas Eve - Closed');
    
    -- Christmas Day - Closed
    INSERT INTO special_dates (venue_id, date, is_closed, reason)
    VALUES (v_venue_id, '2024-12-25', true, 'Christmas Day - Closed');
    
    -- Boxing Day - Special hours with higher deposits
    INSERT INTO special_dates (venue_id, date, custom_hours, min_spend_multiplier, deposit_multiplier, reason)
    VALUES (v_venue_id, '2024-12-26', '{"open": "23:00", "close": "06:00"}'::jsonb, 1.5, 1.5, 'Boxing Day - Special event, higher deposits');
    
    -- Halloween - Higher deposits for special event
    INSERT INTO special_dates (venue_id, date, min_spend_multiplier, deposit_multiplier, reason)
    VALUES (v_venue_id, '2024-10-31', 1.5, 1.5, 'Halloween - Special event, higher deposits');
    
END $$;
# Real-time Integration Guide - The Backroom Leeds

## 🔄 Real-time Features Implementation

Our database has comprehensive real-time triggers already set up and working. Here's how to integrate them into the frontend.

## 📡 **Available Real-time Channels**

### 1. Table Availability Updates
**Channel**: `table_availability_update`
**Triggers**: When bookings are created, updated, or cancelled
**Use Case**: Live table availability on booking interface

```typescript
// Frontend integration example
supabase
  .channel('table-availability')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    // Update table availability UI in real-time
    refreshTableAvailability(payload.new);
  })
  .subscribe()
```

**Data Structure**:
```json
{
  "venue_id": "uuid",
  "booking_id": "uuid", 
  "booking_date": "2024-12-25",
  "status": "confirmed",
  "affected_tables": [
    {
      "table_id": "uuid",
      "table_number": "1",
      "display_name": "Premium Dance Floor Booth",
      "location": "upstairs",
      "is_available": false
    }
  ],
  "timestamp": 1703462400
}
```

### 2. Admin Dashboard Updates
**Channel**: `admin_booking_update`
**Triggers**: All booking operations (create, update, delete)
**Use Case**: Real-time admin dashboard updates

```typescript
// Admin dashboard real-time updates
supabase
  .channel('admin-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'bookings'
  }, (payload) => {
    // Update admin dashboard in real-time
    updateAdminDashboard(payload);
  })
  .subscribe()
```

**Data Structure**:
```json
{
  "operation": "INSERT",
  "booking_id": "uuid",
  "booking_reference": "BR-241225-ABC123",
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "party_size": 8,
  "booking_date": "2024-12-25",
  "start_time": "23:00:00",
  "status": "pending",
  "tables": [
    {
      "table_id": "uuid",
      "table_number": "1",
      "display_name": "Premium Dance Floor Booth",
      "location": "upstairs"
    }
  ],
  "timestamp": 1703462400
}
```

### 3. Payment Status Updates
**Channel**: `payment_status_update`
**Triggers**: Payment status changes
**Use Case**: Real-time payment confirmation

```typescript
// Payment status updates
supabase
  .channel('payment-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'payments'
  }, (payload) => {
    // Handle payment status changes
    handlePaymentUpdate(payload.new);
  })
  .subscribe()
```

## 🎯 **Frontend Implementation Examples**

### Real-time Table Selector Component

```typescript
// components/booking/RealTimeTableSelector.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Table {
  id: string
  table_number: string
  display_name: string
  location: 'upstairs' | 'downstairs'
  is_available: boolean
  max_capacity: number
  deposit_required: number
}

export function RealTimeTableSelector({ bookingDate, partySize }) {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    loadAvailableTables()

    // Set up real-time subscription
    const channel = supabase
      .channel('table-availability')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `booking_date=eq.${bookingDate}`
      }, (payload) => {
        // Refresh table availability when bookings change
        loadAvailableTables()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingDate])

  const loadAvailableTables = async () => {
    const { data } = await supabase.rpc('get_available_tables', {
      p_venue_id: 'venue-uuid',
      p_booking_date: bookingDate,
      p_start_time: '23:00',
      p_end_time: '06:00',
      p_party_size: partySize
    })
    
    setTables(data || [])
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard 
          key={table.id}
          table={table}
          isAvailable={table.is_available}
          onSelect={handleTableSelect}
        />
      ))}
    </div>
  )
}
```

### Real-time Admin Dashboard

```typescript
// components/admin/RealTimeBookingDashboard.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function RealTimeBookingDashboard() {
  const [bookings, setBookings] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Load initial data
    loadBookings()

    // Real-time subscription for all booking changes
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        handleBookingUpdate(payload)
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public', 
        table: 'payments'
      }, (payload) => {
        handlePaymentUpdate(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleBookingUpdate = (payload) => {
    const { eventType, new: newData, old: oldData } = payload
    
    // Add to recent activity feed
    setRecentActivity(prev => [{
      id: Date.now(),
      type: 'booking',
      action: eventType,
      data: newData || oldData,
      timestamp: new Date()
    }, ...prev.slice(0, 49)]) // Keep last 50 activities

    // Update bookings list
    if (eventType === 'INSERT') {
      setBookings(prev => [newData, ...prev])
    } else if (eventType === 'UPDATE') {
      setBookings(prev => prev.map(booking => 
        booking.id === newData.id ? newData : booking
      ))
    } else if (eventType === 'DELETE') {
      setBookings(prev => prev.filter(booking => booking.id !== oldData.id))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <BookingsList bookings={bookings} />
      </div>
      <div>
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  )
}
```

## 🚀 **Performance Optimizations**

### Connection Management
```typescript
// lib/realtime.ts
class RealtimeManager {
  private channels = new Map<string, RealtimeChannel>()
  
  subscribe(channelName: string, config: ChannelConfig) {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)
    }
    
    const channel = supabase.channel(channelName)
    this.channels.set(channelName, channel)
    
    return channel.on('postgres_changes', config, config.callback).subscribe()
  }
  
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }
  
  cleanup() {
    this.channels.forEach(channel => supabase.removeChannel(channel))
    this.channels.clear()
  }
}

export const realtimeManager = new RealtimeManager()
```

### Debounced Updates
```typescript
// hooks/useRealtimeTableAvailability.ts
import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'

export function useRealtimeTableAvailability(bookingDate: string) {
  const [tables, setTables] = useState([])
  
  const debouncedRefresh = useCallback(
    debounce(() => {
      refreshTableAvailability()
    }, 500),
    [bookingDate]
  )
  
  useEffect(() => {
    const channel = supabase
      .channel(`tables-${bookingDate}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, debouncedRefresh)
      .subscribe()
      
    return () => supabase.removeChannel(channel)
  }, [bookingDate, debouncedRefresh])
  
  return { tables, loading }
}
```

## 🔧 **Testing Real-time Features**

### Development Testing
```typescript
// Test real-time triggers in development
const testRealtimeUpdates = async () => {
  // Subscribe to updates
  const channel = supabase
    .channel('test-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookings'
    }, (payload) => {
      console.log('Real-time update received:', payload)
    })
    .subscribe()

  // Create a test booking to trigger real-time update
  const { data } = await supabase.from('bookings').insert({
    venue_id: 'venue-uuid',
    customer_email: 'test@example.com',
    customer_phone: '1234567890', 
    customer_name: 'Test User',
    booking_date: '2024-12-25',
    start_time: '23:00',
    end_time: '06:00',
    party_size: 4
  })

  // Should see real-time update in console
}
```

## 📊 **Monitoring Real-time Performance**

### Connection Metrics
```typescript
// Monitor real-time connection health
const monitorRealtimeHealth = () => {
  supabase.realtime.onOpen(() => {
    console.log('Real-time connection opened')
  })
  
  supabase.realtime.onClose(() => {
    console.log('Real-time connection closed')
  })
  
  supabase.realtime.onError((error) => {
    console.error('Real-time connection error:', error)
  })
}
```

## ✅ **Real-time Features Summary**

Our real-time triggers are fully implemented and provide:

- **Live Table Availability** - Updates in real-time as bookings are made/cancelled
- **Admin Dashboard Updates** - Comprehensive booking management with live data
- **Payment Status Tracking** - Real-time payment confirmation and updates
- **Notification Broadcasting** - Live alerts for important events
- **Performance Optimized** - Debounced updates and connection management
- **Scalable Architecture** - Built for high-concurrency nightclub operations

The real-time system is production-ready and will provide an excellent user experience with instant updates across all connected clients. 🎉
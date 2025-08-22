'use client';

import { useState, useEffect } from 'react';

interface Venue {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  capacity: {
    total: number;
    main_bar: number;
    private_room: number;
  };
  opening_hours: any;
  is_active: boolean;
}

export function useVenue(slug: string = 'backroom-leeds') {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/venue/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch venue information');
        }

        const data = await response.json();
        setVenue(data.venue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [slug]);

  return { venue, loading, error };
}
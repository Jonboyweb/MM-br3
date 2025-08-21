import { FloorPlanLayout, FloorPlanFeature, TablePosition } from '@/types/booking'

// The Backroom Leeds floor plan layouts
// Based on the venue's actual table arrangements

export const UPSTAIRS_LAYOUT: FloorPlanLayout = {
  location: 'upstairs',
  dimensions: {
    width: 1200,
    height: 800,
    viewBox: '0 0 1200 800'
  },
  background: {
    color: '#1A0F08',
    pattern: 'wood'
  },
  tables: [
    // Table 1: Premium Dance Floor Booth
    {
      id: '1',
      x: 200,
      y: 400,
      width: 120,
      height: 80,
      shape: 'booth'
    },
    // Table 2: Dance floor side high table
    {
      id: '2', 
      x: 350,
      y: 350,
      width: 80,
      height: 60,
      shape: 'rectangle'
    },
    // Table 3: Dance floor side high table next to DJ
    {
      id: '3',
      x: 450,
      y: 350,
      width: 80,
      height: 60,
      shape: 'rectangle'
    },
    // Table 4: Dance floor front high table next to DJ
    {
      id: '4',
      x: 350,
      y: 280,
      width: 80,
      height: 60,
      shape: 'rectangle'
    },
    // Table 5: Large dance floor front table
    {
      id: '5',
      x: 450,
      y: 280,
      width: 100,
      height: 70,
      shape: 'rectangle'
    },
    // Table 6: Barrel bar area
    {
      id: '6',
      x: 800,
      y: 200,
      width: 60,
      height: 60,
      shape: 'circle'
    },
    // Table 7: Barrel bar area
    {
      id: '7',
      x: 880,
      y: 200,
      width: 60,
      height: 60,
      shape: 'circle'
    },
    // Table 8: Barrel bar area
    {
      id: '8',
      x: 840,
      y: 140,
      width: 60,
      height: 60,
      shape: 'circle'
    },
    // Table 9: Large booth near bar and terrace
    {
      id: '9',
      x: 950,
      y: 300,
      width: 140,
      height: 90,
      shape: 'booth'
    },
    // Table 10: Premium Ciroc booth
    {
      id: '10',
      x: 950,
      y: 450,
      width: 140,
      height: 90,
      shape: 'booth'
    }
  ],
  features: [
    // Dance Floor
    {
      id: 'dance_floor',
      type: 'dance_floor',
      label: 'Dance Floor',
      position: {
        x: 300,
        y: 450,
        width: 300,
        height: 200
      },
      style: {
        fill: '#2C1810',
        stroke: '#D4AF37',
        strokeWidth: 2
      }
    },
    // DJ Booth
    {
      id: 'dj_booth',
      type: 'dj_booth',
      label: 'DJ',
      position: {
        x: 550,
        y: 280,
        width: 80,
        height: 50
      },
      style: {
        fill: '#B8860B',
        stroke: '#D4AF37'
      }
    },
    // Main Bar
    {
      id: 'main_bar',
      type: 'bar',
      label: 'Bar',
      position: {
        x: 750,
        y: 350,
        width: 150,
        height: 300
      },
      style: {
        fill: '#3E2723',
        stroke: '#D4AF37'
      }
    },
    // Barrel Bar
    {
      id: 'barrel_bar',
      type: 'bar',
      label: 'Barrel Bar',
      position: {
        x: 780,
        y: 120,
        width: 200,
        height: 150
      },
      style: {
        fill: '#5D4037',
        stroke: '#B8860B'
      }
    },
    // Terrace Access
    {
      id: 'terrace',
      type: 'terrace',
      label: 'Terrace',
      position: {
        x: 1100,
        y: 200,
        width: 80,
        height: 120
      },
      style: {
        fill: '#4CAF50',
        stroke: '#2E7D32'
      }
    },
    // Ladies Toilet
    {
      id: 'ladies_toilet',
      type: 'toilet',
      label: 'Ladies',
      position: {
        x: 1050,
        y: 150,
        width: 60,
        height: 40
      }
    },
    // Stairs to Downstairs
    {
      id: 'stairs',
      type: 'stairs',
      label: 'Stairs',
      position: {
        x: 100,
        y: 600,
        width: 80,
        height: 100
      }
    }
  ]
}

export const DOWNSTAIRS_LAYOUT: FloorPlanLayout = {
  location: 'downstairs',
  dimensions: {
    width: 1200,
    height: 800,
    viewBox: '0 0 1200 800'
  },
  background: {
    color: '#1A0F08',
    pattern: 'wood'
  },
  tables: [
    // Table 11: Intimate booth opposite bar
    {
      id: '11',
      x: 200,
      y: 300,
      width: 120,
      height: 80,
      shape: 'booth'
    },
    // Table 12: Intimate booth opposite bar
    {
      id: '12',
      x: 200,
      y: 400,
      width: 120,
      height: 80,
      shape: 'booth'
    },
    // Table 13: Dance floor booth next to DJ
    {
      id: '13',
      x: 450,
      y: 250,
      width: 120,
      height: 80,
      shape: 'booth'
    },
    // Table 14: Dance floor booth near facilities
    {
      id: '14',
      x: 450,
      y: 400,
      width: 120,
      height: 80,
      shape: 'booth'
    },
    // Table 15: Curved seating next to bar
    {
      id: '15',
      x: 800,
      y: 350,
      width: 100,
      height: 70,
      shape: 'rectangle'
    },
    // Table 16: Curved seating next to bar
    {
      id: '16',
      x: 920,
      y: 350,
      width: 100,
      height: 70,
      shape: 'rectangle'
    }
  ],
  features: [
    // Dance Floor
    {
      id: 'dance_floor_down',
      type: 'dance_floor',
      label: 'Dance Floor',
      position: {
        x: 400,
        y: 500,
        width: 250,
        height: 180
      },
      style: {
        fill: '#2C1810',
        stroke: '#D4AF37',
        strokeWidth: 2
      }
    },
    // DJ Booth
    {
      id: 'dj_booth_down',
      type: 'dj_booth',
      label: 'DJ',
      position: {
        x: 350,
        y: 550,
        width: 70,
        height: 50
      },
      style: {
        fill: '#B8860B',
        stroke: '#D4AF37'
      }
    },
    // Main Bar
    {
      id: 'main_bar_down',
      type: 'bar',
      label: 'Bar',
      position: {
        x: 750,
        y: 200,
        width: 300,
        height: 120
      },
      style: {
        fill: '#3E2723',
        stroke: '#D4AF37'
      }
    },
    // Gents Toilet
    {
      id: 'gents_toilet',
      type: 'toilet',
      label: 'Gents',
      position: {
        x: 700,
        y: 500,
        width: 60,
        height: 40
      }
    },
    // Disabled Toilet
    {
      id: 'disabled_toilet',
      type: 'toilet',
      label: 'Disabled',
      position: {
        x: 700,
        y: 550,
        width: 60,
        height: 40
      }
    },
    // Stairs to Upstairs
    {
      id: 'stairs_down',
      type: 'stairs',
      label: 'Stairs',
      position: {
        x: 100,
        y: 200,
        width: 80,
        height: 100
      }
    },
    // Entrance
    {
      id: 'entrance',
      type: 'entrance',
      label: 'Entrance',
      position: {
        x: 50,
        y: 350,
        width: 100,
        height: 60
      },
      style: {
        fill: '#4CAF50',
        stroke: '#2E7D32'
      }
    }
  ]
}

// Table combination rules based on venue requirements
export const TABLE_COMBINATIONS = [
  // Upstairs combinations
  {
    location: 'upstairs' as const,
    primary_table: '2',
    secondary_table: '3',
    combined_capacity: 16,
    description: 'Dance floor side tables - perfect for groups wanting to be near the action'
  },
  {
    location: 'upstairs' as const,
    primary_table: '4',
    secondary_table: '5', 
    combined_capacity: 18,
    description: 'Front dance floor tables - premium position next to DJ'
  },
  {
    location: 'upstairs' as const,
    primary_table: '6',
    secondary_table: '7',
    combined_capacity: 8,
    description: 'Barrel bar area - cozy spot for smaller groups'
  },
  {
    location: 'upstairs' as const,
    primary_table: '6',
    secondary_table: '8',
    combined_capacity: 8,
    description: 'Barrel bar area - alternative combination'
  },
  {
    location: 'upstairs' as const,
    primary_table: '7',
    secondary_table: '8',
    combined_capacity: 8,
    description: 'Barrel bar area - another combination option'
  },
  // Downstairs combinations
  {
    location: 'downstairs' as const,
    primary_table: '15',
    secondary_table: '16',
    combined_capacity: 12,
    description: 'Curved bar seating - social atmosphere by the bar'
  }
]

// Default table positions for mobile responsive design
export const MOBILE_TABLE_POSITIONS = {
  upstairs: {
    scale: 0.7,
    offsetX: 50,
    offsetY: 50
  },
  downstairs: {
    scale: 0.7,
    offsetX: 50,
    offsetY: 50
  }
}

// Color scheme for Art Deco prohibition theme
export const FLOOR_PLAN_COLORS = {
  primary: '#D4AF37', // Gold
  secondary: '#B8860B', // Dark gold
  background: '#1A0F08', // Dark brown
  surface: '#2C1810', // Medium brown
  accent: '#3E2723', // Wood brown
  available: '#4CAF50', // Green
  unavailable: '#F44336', // Red
  selected: '#FFD700', // Bright gold
  hover: '#FFF8DC' // Cornsilk
} as const

// Animation configurations
export const FLOOR_PLAN_ANIMATIONS = {
  hover: {
    scale: 1.1,
    opacity: 0.9,
    glow: true,
    pulse: false
  },
  selected: {
    scale: 1.15,
    opacity: 1.0,
    glow: true,
    pulse: true
  },
  available: {
    scale: 1.0,
    opacity: 0.8,
    glow: false,
    pulse: false
  },
  unavailable: {
    scale: 1.0,
    opacity: 0.4,
    glow: false,
    pulse: false
  },
  loading: {
    scale: 1.0,
    opacity: 0.6,
    glow: false,
    pulse: true
  }
} as const

// Responsive breakpoints for floor plan display
export const FLOOR_PLAN_BREAKPOINTS = [
  {
    name: 'mobile',
    minWidth: 0,
    maxWidth: 768,
    scale: 0.6,
    showLabels: false,
    showTooltips: true
  },
  {
    name: 'tablet',
    minWidth: 769,
    maxWidth: 1024,
    scale: 0.8,
    showLabels: true,
    showTooltips: true
  },
  {
    name: 'desktop',
    minWidth: 1025,
    scale: 1.0,
    showLabels: true,
    showTooltips: true
  }
] as const
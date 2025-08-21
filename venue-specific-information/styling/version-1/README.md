# Prohibition Era Art Deco Style Pack for Tailwind CSS v4.1

A comprehensive styling system inspired by 1920s prohibition era and Art Deco design, specifically created for The Backroom Leeds - a hidden speakeasy venue. This style pack leverages the latest Tailwind CSS v4.1 features including text shadows, masks, and container queries.

## 🎨 Design Philosophy

This style pack captures the essence of the prohibition era with:
- **Dark, mysterious backgrounds** evoking speakeasy atmosphere
- **Copper as the primary color** with complementary Art Deco metals (gold, brass)
- **Geometric patterns and clean lines** characteristic of Art Deco movement
- **Elegant typography** using the venue's Fino font family
- **Luxurious textures** with gradients, shadows, and metallic effects

## 📁 File Structure

```
styling/
├── prohibition-color-palette.css     # Core color definitions and gradients
├── tailwind-prohibition-theme.css    # Main theme with components
├── prohibition-utility-classes.css   # Additional utility classes
├── art-deco-components.html          # Live component examples
└── README.md                         # This documentation
```

## 🎯 Key Features

### Tailwind CSS v4.1 Features Utilized

- **Text Shadows**: Copper glow, gold glow, and dramatic depth effects
- **Container Queries**: Responsive design based on container size
- **Mask Utilities**: Art Deco patterns and geometric masks
- **Enhanced Animations**: Smooth transitions and sophisticated effects

### Color Palette

#### Primary Colors
- **Copper Scale**: From light (#fdf8f6) to deep (#361f15)
- **Art Deco Gold**: Warm, luxurious gold tones
- **Brass Accents**: Complementary metallic highlights

#### Background Colors
- **Speakeasy Black**: Deep, rich black (#0a0a0a)
- **Midnight Black**: Slightly lighter for depth (#1a1a1a)
- **Charcoal & Smoke**: Mid-tones for layering

#### Accent Colors
- **Deco Emerald**: Rich green for highlights
- **Deco Ruby**: Bold red for calls-to-action
- **Deco Sapphire**: Deep blue for trust elements

### Typography System

- **Hero Titles**: Large, dramatic headings with text shadows and glow effects
- **Display Text**: Medium-sized headings for sections and cards
- **Body Text**: Readable content with subtle copper tinting
- **Accent Text**: Bold, uppercase text for emphasis

### Component Library

#### Buttons
- **Primary**: Gradient copper-to-gold with hover animations
- **Secondary**: Outlined style with glow effects on hover
- **Accent**: Small ruby-colored buttons for secondary actions

#### Cards
- **Standard Cards**: Dark backgrounds with copper borders
- **Luxury Cards**: Premium cards with gold accents and enhanced shadows
- **Event Cards**: Specialized cards for venue events

#### Interactive Elements
- **Hover States**: Smooth transitions with glow effects
- **Focus States**: Art Deco-inspired focus rings
- **Loading States**: Elegant shimmer animations

## 🚀 Usage Guide

### Installation

1. **Copy the CSS files** to your project's styling directory
2. **Import the theme** in your main CSS file:
   ```css
   @import url('./styling/tailwind-prohibition-theme.css');
   ```
3. **Configure Tailwind** to recognize the custom theme variables

### Basic Implementation

```html
<body class="prohibition-theme">
  <header class="prohibition-container">
    <h1 class="title-deco-hero">The Backroom</h1>
    <p class="text-deco-body">Hidden speakeasy experience</p>
  </header>
  
  <main>
    <div class="card-deco">
      <h2 class="title-deco-large">Book Your Table</h2>
      <p class="text-deco-body">Reserve your spot in Leeds' most exclusive venue</p>
      <button class="btn-deco-primary">Reserve Now</button>
    </div>
  </main>
</body>
```

### Button Examples

```html
<!-- Primary action button -->
<button class="btn-deco-primary">Book Your Table</button>

<!-- Secondary action button -->
<button class="btn-deco-secondary">Learn More</button>

<!-- Small accent button -->
<button class="btn-deco-accent">Join Waitlist</button>
```

### Typography Examples

```html
<!-- Hero title with glow effect -->
<h1 class="title-deco-hero deco-glow-pulse">The Backroom</h1>

<!-- Section heading -->
<h2 class="title-deco-large">Private Hire</h2>

<!-- Accent text -->
<p class="text-deco-accent">VIP Experience</p>

<!-- Body text -->
<p class="text-deco-body">Your paragraph content here</p>
```

### Card Components

```html
<!-- Standard card -->
<div class="card-deco">
  <h3 class="title-deco-medium">Event Title</h3>
  <p class="text-deco-body">Event description</p>
  <button class="btn-deco-primary">Learn More</button>
</div>

<!-- Luxury card -->
<div class="card-deco-luxury">
  <h3 class="title-deco-medium text-deco-gold-400">VIP Package</h3>
  <p class="text-deco-body">Premium experience description</p>
  <button class="btn-deco-primary">Book VIP</button>
</div>
```

## 🎨 Customization

### Color Modifications

To modify colors, update the CSS custom properties in `prohibition-color-palette.css`:

```css
@theme {
  --color-copper-500: #your-new-color;
  --color-deco-gold-500: #your-gold-color;
}
```

### Typography Adjustments

Modify font sizes and styles in `tailwind-prohibition-theme.css`:

```css
.title-deco-hero {
  font-size: 4rem; /* Adjust size */
  letter-spacing: 0.2em; /* Adjust spacing */
}
```

### Animation Customization

Adjust animation timing and effects:

```css
.deco-glow-pulse {
  animation-duration: 3s; /* Slower pulse */
  animation-timing-function: ease-in-out;
}
```

## 📱 Responsive Design

The theme includes container queries for responsive behavior:

```html
<div class="@container">
  <h1 class="container-lg:title-responsive">Responsive Title</h1>
</div>
```

## ♿ Accessibility Features

- **High contrast mode** support
- **Reduced motion** preferences respected
- **Focus indicators** for keyboard navigation
- **Print styles** for documents
- **Screen reader** friendly markup

## 🎭 Art Deco Elements

### Geometric Shapes

```html
<div class="shape-diamond">Diamond shape</div>
<div class="shape-hexagon">Hexagon shape</div>
<div class="shape-chevron">Chevron shape</div>
```

### Decorative Elements

```html
<!-- Art Deco divider -->
<div class="deco-divider"></div>

<!-- Shimmer effect -->
<div class="deco-shimmer">Animated shimmer</div>

<!-- Art Deco border -->
<div class="border-art-deco">Bordered content</div>
```

### Text Effects

```html
<!-- Glowing text -->
<h1 class="text-prohibition-neon">Neon Effect</h1>

<!-- Embossed text -->
<h2 class="text-embossed">Embossed Text</h2>

<!-- Outlined text -->
<h3 class="text-art-deco-outline">Outlined Text</h3>
```

## 🏗️ Advanced Features

### Backdrop Effects

```html
<div class="backdrop-speakeasy">Speakeasy backdrop</div>
<div class="backdrop-copper-glow">Copper glow backdrop</div>
```

### Gradient Backgrounds

```html
<div class="gradient-copper-gold">Copper to gold gradient</div>
<div class="gradient-art-deco-sunset">Art Deco sunset</div>
<div class="gradient-speakeasy-glow">Speakeasy glow</div>
```

### Animation Classes

```html
<div class="animate-art-deco-entrance">Entrance animation</div>
<div class="animate-copper-pulse">Copper pulse effect</div>
<div class="animate-gold-shimmer">Gold shimmer effect</div>
```

## 🎪 Live Examples

Open `art-deco-components.html` in a browser to see live examples of all components and styling options. This file demonstrates:

- Button variations and hover effects
- Typography hierarchy and text shadows
- Card components and layouts
- Decorative elements and patterns
- Navigation examples
- Responsive behavior

## 🎨 Design Inspiration

This style pack draws inspiration from:

- **1920s Art Deco movement**: Geometric patterns, luxury materials, bold typography
- **Prohibition era speakeasies**: Dark, mysterious atmosphere with metallic accents
- **The Backroom Leeds**: Hidden venue concept with premium, exclusive feel
- **Jazz Age aesthetics**: Elegant, sophisticated design with golden age glamour

## 🔧 Browser Support

- **Modern browsers**: Full support for all features
- **Older browsers**: Graceful degradation with fallbacks
- **Safari 15+**: Text shadows and modern CSS features
- **Firefox 90+**: Container queries and mask utilities
- **Chrome 90+**: Full feature support

## 📝 Credits

- **Fonts**: Fino font family (included with The Backroom Leeds branding)
- **Colors**: Inspired by Art Deco color palettes and copper metalwork
- **Patterns**: Based on 1920s geometric design principles
- **Framework**: Built for Tailwind CSS v4.1 with latest features

---

*This style pack was created specifically for The Backroom Leeds venue website, capturing the essence of prohibition-era speakeasies with modern web design techniques.*
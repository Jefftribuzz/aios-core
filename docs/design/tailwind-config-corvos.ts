# 🎨 Tailwind CSS Configuration — Corvos BJJ

**Version:** 1.0  
**Date:** 3 de Março, 2026  
**Status:** ✅ Production-ready  
**Format:** TypeScript (tailwind.config.ts)

---

## 📄 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===== COLORS: Design System Compliant =====
      colors: {
        // Primary: Blue (3b82f6)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',    // Main primary
          600: '#2563eb',    // Hover state
          700: '#1d4ed8',    // Active state
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Success: Green (22c55e)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',    // Main success
          600: '#16a34a',    // Darker
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        // Warning: Amber (f59e0b)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',    // Main warning
          600: '#d97706',    // Darker
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Error: Red (ef4444)
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',    // Main error
          600: '#dc2626',    // Darker
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Info: Light Blue (0ea5e9)
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',    // Main info
          600: '#0284c7',    // Darker
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Neutral: Grays
        neutral: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',    // Standard text
          600: '#4b5563',    // Darker text
          700: '#374151',    // Heading text
          800: '#1f2937',
          900: '#111827',    // Near black
        },
      },

      // ===== TYPOGRAPHY =====
      fontFamily: {
        // Inter from Google Fonts
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        // Fira Code for monospace
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        // Heading sizes
        'h1': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-sm': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2-sm': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3-sm': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        // Body sizes
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'tiny': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
        // Defaults (using Tailwind standard)
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',      // Custom: labels, helper text
        semibold: '600',    // Custom: subheadings
        bold: '700',        // Custom: headings
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0em',
        'wide': '0.01em',
      },

      // ===== SPACING: 8px base unit =====
      spacing: {
        '2xs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
        // Standard Tailwind spacing (complementary)
        '0': '0',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },

      // ===== BORDER RADIUS =====
      borderRadius: {
        'sm': '4px',
        'base': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '9999px',
      },

      // ===== SHADOWS: Custom =====
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // Focus ring: primary blue
        'focus-primary': '0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 0 2px rgba(59, 130, 246, 1)',
        'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.1), 0 0 0 2px rgba(239, 68, 68, 1)',
      },

      // ===== TRANSITIONS =====
      transitionDuration: {
        'fast': '100ms',
        'base': '150ms',
        'default': '150ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ===== ANIMATION =====
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },

      // ===== CONTAINER QUERIES (if supported) =====
      container: {
        center: true,
        padding: {
          'DEFAULT': '1rem',
          'xs': '0.5rem',
          'sm': '1rem',
          'md': '1.5rem',
          'lg': '2rem',
          'xl': '2.5rem',
          '2xl': '3rem',
        },
      },

      // ===== Z-INDEX =====
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'modal': '40',
        'dropdown': '30',
        'sticky': '20',
        'fixed': '10',
      },

      // ===== WIDTH / HEIGHT: Common patterns =====
      width: {
        'screen': '100vw',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
      },
      height: {
        'screen': '100vh',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
      },
    },
  },

  plugins: [
    // Form plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Container queries plugin
    require('@tailwindcss/container-queries'),
  ],

  safelist: [
    // Safelist dynamically generated classes
    // Colors by status
    { pattern: /^(bg|text)-(success|error|warning|info)-(50|100|500|600)$/ },
    // Button sizes
    { pattern: /^(w|h)-(md|lg|sm|xs)$/ },
  ],
}

export default config
```

---

## 📦 Installation Instructions

### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Install Plugins

```bash
npm install -D @tailwindcss/forms @tailwindcss/container-queries
```

### 3. Install Fonts

Add to your HTML head or import in CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Optional: For monospace (code) -->
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

Or in your main CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');
```

### 4. Create tailwind.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes if needed */
@layer components {
  .btn-primary {
    @apply px-4 py-2.5 bg-primary-500 text-white font-medium rounded-md transition-colors duration-150 hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply px-4 py-2.5 bg-neutral-100 text-neutral-700 font-medium border border-neutral-300 rounded-md transition-colors duration-150 hover:bg-neutral-200 hover:text-primary-600 active:bg-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-300;
  }

  .input-base {
    @apply w-full px-3 py-2 border border-neutral-300 rounded-md font-body text-base transition-all duration-150 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400;
  }

  .card {
    @apply p-4 bg-white border border-neutral-200 rounded-lg shadow-sm transition-all duration-150 hover:shadow-md hover:border-neutral-300;
  }

  .badge-success {
    @apply inline-block px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded;
  }

  .badge-error {
    @apply inline-block px-2 py-1 bg-error-100 text-error-700 text-xs font-medium rounded;
  }

  .badge-warning {
    @apply inline-block px-2 py-1 bg-warning-100 text-warning-700 text-xs font-medium rounded;
  }
}
```

---

## 📱 Responsive Utilities Usage

### Mobile-First Breakpoints

```html
<!-- Base = Mobile, then enhance with md:, lg:, xl: -->

<!-- Padding example -->
<div class="p-xs md:p-sm lg:p-md">
  Padding: 8px on mobile, 12px on tablet, 16px on desktop
</div>

<!-- Grid example -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>

<!-- Font size example -->
<h1 class="text-h1-sm md:text-h1">
  Responsive heading
</h1>
```

### Breakpoint Reference

```
xs: < 640px (mobile)   - No prefix needed
md: 640px+             - Prefix: md:
lg: 1024px+            - Prefix: lg:
xl: 1280px+            - Prefix: xl:
2xl: 1536px+           - Prefix: 2xl:
```

---

## 🎨 Component Class Repository

### Button Classes

```html
<!-- Primary -->
<button class="btn-primary">Click me</button>

<!-- Secondary -->
<button class="btn-secondary">Back</button>

<!-- Full width -->
<button class="w-full px-4 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600">
  Full Width Button
</button>

<!-- With icon -->
<button class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-md">
  <svg class="w-5 h-5"><!-- icon --></svg>
  With Icon
</button>

<!-- Disabled -->
<button class="px-4 py-2.5 bg-primary-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
  May be disabled
</button>
```

### Input Classes

```html
<!-- Text input -->
<input class="input-base" type="text" placeholder="Enter text">

<!-- With error -->
<input class="input-base border-error-500" type="email">
<p class="text-error-600 text-small">Invalid email format</p>

<!-- With label -->
<label class="block text-small font-medium text-neutral-700 mb-xs">
  Email
  <span class="text-error-500">*</span>
</label>
<input class="input-base" type="email">
```

### Card Classes

```html
<div class="card">
  <h3 class="text-h4 text-neutral-800 mb-md">Card Title</h3>
  <p class="text-body text-neutral-700">Card content goes here</p>
</div>

<!-- Highlighted card -->
<div class="card border-primary-300 bg-primary-50">
  <p>Highlighted content</p>
</div>
```

### Badge Classes

```html
<span class="badge-success">✓ Paid</span>
<span class="badge-warning">⏳ Pending</span>
<span class="badge-error">✗ Overdue</span>
```

### Alert Classes

```html
<!-- Success -->
<div class="p-md bg-success-50 border border-success-200 rounded-lg">
  <p class="text-success-700 font-medium">Payment confirmed!</p>
</div>

<!-- Error -->
<div class="p-md bg-error-50 border border-error-200 rounded-lg">
  <p class="text-error-700 font-medium">Something went wrong</p>
</div>
```

---

## 🔐 Accessibility Classes

### Focus Styles

```html
<!-- Default blue focus ring -->
<button class="px-4 py-2 border-2 border-neutral-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
  Focus me
</button>

<!-- Custom focus -->
<input class="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
```

### Screen Reader Only

```html
<span class="sr-only">Loading...</span>

<!-- Utility in Tailwind: -->
<p class="text-neutral-700">
  Status: <span class="sr-only">Payment successful</span>
  <span class="text-success-600">✓</span>
</p>
```

### Skip Link

```html
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-primary-500 focus:text-white">
  Skip to main content
</a>
```

---

## 🚀 Production Optimizations

### 1. PurgeCSS (Automatic)

The `content` option ensures only used styles are included:

```ts
content: [
  './src/pages/**/*.{js,ts,jsx,tsx}',
  './src/components/**/*.{js,ts,jsx,tsx}',
  './src/app/**/*.{js,ts,jsx,tsx}',
]
```

### 2. CSS Size Management

Expected output sizes:
- Development: ~3-4 MB (before minification)
- Production: ~30-50 KB (minified + gzipped)

### 3. Build Optimization

```bash
# Build for production with minification
NODE_ENV=production npm run build

# With Next.js:
next build    # Automatically optimized
next start    # Serves optimized CSS
```

---

## 📚 Common Patterns

### Responsive Grid

```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexbox Navigation

```html
<nav class="flex items-center justify-between p-md bg-white border-b border-neutral-200">
  <div class="font-bold text-lg">Logo</div>
  <div class="flex gap-md">
    <a href="/" class="text-neutral-700 hover:text-primary-600">Home</a>
    <a href="/about" class="text-neutral-700 hover:text-primary-600">About</a>
  </div>
</nav>
```

### Modal Overlay

```html
<div class="fixed inset-0 bg-black bg-opacity-40 z-modal flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg p-lg max-w-md w-full">
    <h2 class="text-h3 mb-md">Modal Title</h2>
    <p class="text-body text-neutral-700 mb-lg">Modal content</p>
    <div class="flex gap-md">
      <button class="btn-secondary flex-1">Cancel</button>
      <button class="btn-primary flex-1">Confirm</button>
    </div>
  </div>
</div>
```

### Responsive Table

```html
<div class="overflow-x-auto">
  <table class="w-full">
    <thead class="bg-neutral-100">
      <tr>
        <th class="px-md py-sm text-left text-neutral-800 font-semibold">Name</th>
        <th class="px-md py-sm text-left text-neutral-800 font-semibold">Email</th>
        <th class="px-md py-sm text-left text-neutral-800 font-semibold">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-neutral-100 hover:bg-neutral-50">
        <td class="px-md py-sm text-neutral-700">João Silva</td>
        <td class="px-md py-sm text-neutral-700">joao@example.com</td>
        <td class="px-md py-sm"><span class="badge-success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## ✅ Configuration Checklist

- [x] Colors (primary, semantic, neutral)
- [x] Typography (fonts, sizes, weights)
- [x] Spacing (8px base unit)
- [x] Border radius
- [x] Shadows (including focus rings)
- [x] Transitions & animations
- [x] Responsive breakpoints
- [x] Z-index layers
- [x] Component utility classes
- [x] Accessibility utilities
- [x] Plugin configuration
- [x] SafeList for dynamic classes

---

**Tailwind Config v1.0 — Production Ready**  
**Created: 3 de Março, 2026 | @architect (Aria)**

**Integration: Copy tailwind.config.ts + @tailwind CSS + install fonts**  
**Ready for: CBTO-2 Frontend Implementation**

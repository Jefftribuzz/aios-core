# 🎨 Design System — Corvos BJJ

**Version:** 1.0  
**Date:** 3 de Março, 2026  
**Status:** ✅ Finalized for MVP  
**Platform:** Web (Desktop + Mobile Responsive)

---

## 📐 Foundation Principles

1. **Mobile-First:** Design para mobile, enhance para desktop
2. **Simplicity:** Zero unnecessary complexity (for BJJ academy)
3. **Clarity:** Funções críticas (payment, student mgmt) immediately visible
4. **Consistency:** Pattern repetition across all pages
5. **Accessibility:** WCAG AA compliance (readable, keyboard navigable)

---

## 🎨 Color Palette

### Primary Colors
```
Primary 50:     #f0f9ff (very light blue, backgrounds)
Primary 100:    #e0f2fe (light backgrounds)
Primary 200:    #bae6fd (light interactive)
Primary 400:    #60a5fa (medium interactive)
Primary 500:    #3b82f6 (MAIN BLUE - primary actions)
Primary 600:    #2563eb (darker primary - hover)
Primary 700:    #1d4ed8 (darkest primary - active)
Primary 900:    #1e3a8a (very dark, text on light)
```

**Usage:**
- Buttons (Primary action): Primary 500
- Links: Primary 600
- Hover: Primary 600
- Active: Primary 700
- Backgrounds: Primary 50/100

### Semantic Colors

**Success (Green)**
```
Success 50:     #f0fdf4
Success 100:    #dcfce7
Success 400:    #4ade80
Success 500:    #22c55e (MAIN - success states)
Success 600:    #16a34a (darker - hover)
Success 700:    #15803d (darkest)
```

**Warning (Amber)**
```
Warning 50:     #fffbeb
Warning 100:    #fef3c7
Warning 400:    #facc15
Warning 500:    #f59e0b (MAIN - warning states)
Warning 600:    #d97706 (darker - hover)
Warning 700:    #b45309 (darkest)
```

**Error (Red)**
```
Error 50:       #fef2f2
Error 100:      #fee2e2
Error 400:      #f87171
Error 500:      #ef4444 (MAIN - error states)
Error 600:      #dc2626 (darker - hover)
Error 700:      #b91c1c (darkest)
```

**Info (Light Blue)**
```
Info 50:        #f0f9ff
Info 100:       #e0f2fe
Info 400:       #38bdf8
Info 500:       #0ea5e9 (MAIN - info states)
Info 600:       #0284c7 (darker)
Info 700:       #0369a1 (darkest)
```

### Neutral Colors

```
Neutral 0:      #ffffff (pure white, backgrounds)
Neutral 50:     #f9fafb (almost white, subtle bg)
Neutral 100:    #f3f4f6 (light gray bg)
Neutral 200:    #e5e7eb (light borders)
Neutral 300:    #d1d5db (medium borders)
Neutral 400:    #9ca3af (medium text)
Neutral 500:    #6b7280 (standard text)
Neutral 600:    #4b5563 (darker text)
Neutral 700:    #374151 (heading text)
Neutral 800:    #1f2937 (very dark text)
Neutral 900:    #111827 (near black, text on white)
```

### Status Tokens (Usage)

| State | Color | Use Case |
|-------|-------|----------|
| **Active** | Green 500 | ✓ Paid, Active student, Success |
| **Pending** | Amber 500 | ⏳ Overdue in 3-7 days, In progress |
| **Overdue** | Red 500 | ❌ Payment > 7 days late, Error |
| **Paused** | Gray 400 | ⏸ Student on break, Inactive |
| **New** | Blue 500 | 🆕 New student, New feature |

---

## 🔤 Typography

### Font Families
```
Headings:  Inter (sans-serif), system fallback: -apple-system, BlinkMacSystemFont
Body:      Inter (sans-serif), system fallback: -apple-system, BlinkMacSystemFont
Monospace: Fira Code (code snippets, IDs)
```

**Why Inter?**
- Clean, modern, highly legible
- Excellent on screens
- Free from Google Fonts
- CSS Variable friendly
- Used by major platforms (GitHub, Stripe, Figma)

### Type Scale

#### Headings

```
H1 (Page Title)
  └─ Size: 32px / 40px (desktop / mobile)
  └─ Weight: 700 (bold)
  └─ Line-height: 1.2
  └─ Letter-spacing: -0.02em
  └─ Color: Neutral 900
  └─ Margin-bottom: 24px

H2 (Section Title)
  └─ Size: 24px / 20px (desktop / mobile)
  └─ Weight: 700
  └─ Line-height: 1.3
  └─ Color: Neutral 800
  └─ Margin-bottom: 16px

H3 (Subsection)
  └─ Size: 20px / 18px
  └─ Weight: 600 (semibold)
  └─ Line-height: 1.4
  └─ Color: Neutral 800
  └─ Margin-bottom: 12px

H4 (Card Title)
  └─ Size: 16px
  └─ Weight: 600
  └─ Line-height: 1.5
  └─ Color: Neutral 800
```

#### Body Text

```
Body (Standard)
  └─ Size: 16px
  └─ Weight: 400 (regular)
  └─ Line-height: 1.6 (more readable)
  └─ Color: Neutral 700
  └─ Letter-spacing: normal

Small (Helper text, labels)
  └─ Size: 14px
  └─ Weight: 500 (slightly bold for clarity)
  └─ Line-height: 1.5
  └─ Color: Neutral 600

Tiny (Captions, meta info)
  └─ Size: 12px
  └─ Weight: 400
  └─ Line-height: 1.4
  └─ Color: Neutral 500

Caption (Timestamps, IDs)
  └─ Size: 11px
  └─ Weight: 400
  └─ Line-height: 1.4
  └─ Color: Neutral 500
  └─ Letter-spacing: +0.01em
```

#### Font Weights

```
Thin:       100 (not used)
Regular:    400 (body text)
Medium:     500 (labels, helper text)
Semibold:   600 (subheadings, emphasis)
Bold:       700 (headings, strong emphasis)
Extrabold:  800 (not needed usually)
```

---

## 📏 Spacing System

**Base Unit:** 8px (Fibonacci-inspired scales)

```
2xs:    4px   (tight spacing, small gaps)
xs:     8px   (narrow spacing, normal labels)
sm:     12px  (small spacing, form gaps)
md:     16px  (medium spacing, standard component padding)
lg:     24px  (large spacing, section separation)
xl:     32px  (extra large, major sections)
2xl:    48px  (double extra large, page breaks)
3xl:    64px  (3x, hero sections)
4xl:    96px  (4x, major layout breaks)
5xl:    128px (5x, max width containers)
```

**Implementation:**
```
Padding (inside):     p-xs, p-sm, p-md, p-lg, p-xl
Margin (outside):     m-xs, m-sm, m-md, m-lg, m-xl
Gap (flex/grid):      gap-xs, gap-sm, gap-md, gap-lg
```

### Spacing Rules

| Use Case | Spacing |
|----------|---------|
| Component padding | md (16px) |
| Between form fields | lg (24px) |
| Between sections | xl (32px) |
| Between major sections | 2xl (48px) |
| Card padding | md + sm (20px total) |
| Button padding | 10px vertical, md horizontal |
| Input padding | 10px/12px |

---

## 🔘 Component Library

### Button

#### Variants

**Primary Button** (Main actions)
```
Size: md (44px height, includes padding)
Background: Primary 500
Text: White, 16px semibold
Border: None
Border-radius: 8px
Padding: 10px 20px (vertical/horizontal)
Cursor: pointer
Transition: 150ms ease-out

States:
├─ Default: Primary 500, shadow-sm
├─ Hover: Primary 600, shadow-md (scale +2%)
├─ Active: Primary 700, no shadow (pressed)
├─ Disabled: Neutral 300, cursor-not-allowed, opacity 0.5
└─ Loading: spinning icon, text hidden
```

**Secondary Button** (Less important)
```
Background: Neutral 100
Text: Neutral 700, 16px semibold
Border: 1px Neutral 300
States:
├─ Default: Neutral 100
├─ Hover: Neutral 200, Primary 500 text
├─ Active: Neutral 300
└─ Disabled: Neutral 200, opacity 0.5
```

**Danger Button** (Delete/Remove)
```
Background: Error 500
Text: White, 16px semibold
States:
├─ Default: Error 500
├─ Hover: Error 600
├─ Active: Error 700
└─ Disabled: Error 300
```

**Ghost Button** (Minimal style)
```
Background: transparent
Text: Primary 600, 16px semibold
Border: 1px Primary 300
States:
├─ Default: transparent, Primary 600 text
├─ Hover: Primary 50, Primary 700 text
├─ Active: Primary 100, Primary 800 text
└─ Disabled: Neutral 300 text, opacity 0.5
```

### Form Inputs

#### Text Input

```
Width: 100% (fill container)
Height: 40px (md) | 36px (sm) | 48px (lg)
Padding: 8px 12px (internal spacing)
Border: 1px Neutral 300
Border-radius: 8px
Font: Body 16px
Background: White
Transition: 150ms

States:
├─ Default: Border Neutral 300, shadow-sm
├─ Hover: Border Neutral 400
├─ Focus: Border Primary 500, shadow Primary (2px blue glow)
├─ Error: Border Error 500, shadow Error 300
├─ Disabled: Background Neutral 100, Border Neutral 200, text Neutral 400
└─ Placeholder: text Neutral 400, italic
```

#### Label (above input)

```
Font: Small semibold (14px, 500 weight)
Color: Neutral 700
Margin-bottom: 6px
Margin-top: 12px (if >1 field)

For required fields:
  └─ Add red asterisk (*) after text
```

#### Help Text (below input)

```
Font: Small (14px, 400 weight)
Color: Neutral 500
Margin-top: 4px

For errors:
  └─ Color: Error 600
  └─ Icon: X circle (error icon visible)
```

### Select Dropdown

```
Styling: Same as input
Width: 100%
Height: 40px
Border: 1px Neutral 300
Padding: 8px 12px (text), 8px (right arrow)

Arrow icon: Chevron-down
Arrow color: Neutral 500
Arrow position: 12px from right

Open state:
├─ Border: Primary 500
├─ Background: White
└─ Options: Neutral 50 background on hover
```

### Checkbox

```
Size: 18x18px
Border: 2px Neutral 300
Border-radius: 4px
Background: White
Checked: Background Primary 500, white checkmark

States:
├─ Default: Border Neutral 300, white background
├─ Hover: Border Neutral 400
├─ Checked: Background Primary 500, white checkmark
├─ Disabled: Background Neutral 100, Border Neutral 200
└─ Indeterminate: Background Primary 500, white dash
```

### Radio Button

```
Size: 20x20px
Border: 2px Neutral 300
Border-radius: 50%
Background: White
Selected: Border Primary 500, 6px inner circle Primary 500

States:
├─ Default: Border Neutral 300
├─ Hover: Border Neutral 400, shadow-sm
├─ Selected: Border Primary 500
└─ Disabled: Border Neutral 200, opacity 0.5
```

### Card

```
Background: White
Border: 1px Neutral 200
Border-radius: 12px
Padding: 16px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
Transition: 150ms ease-out

States:
├─ Default: shadow-sm, border Neutral 200
├─ Hover: shadow-md (elevated), border Neutral 300
└─ Active: border Primary 300, shadow Primary 100

Variations:
├─ Compact: 12px padding
├─ Spacious: 24px padding
└─ Highlighted: border Primary 500, background Primary 50
```

### Badge / Tag

```
Inline semantic indicator
Padding: 4px 8px (tight)
Border-radius: 4px
Font: Small (12px, 500 weight)
Display: inline-block

Variants:
├─ Success (Green): Background Success 100, text Success 700
├─ Warning (Amber): Background Warning 100, text Warning 700
├─ Error (Red): Background Error 100, text Error 700
├─ Info (Blue): Background Info 100, text Info 700
└─ Neutral (Gray): Background Neutral 100, text Neutral 700

With icon (optional):
  └─ Icon 14px, margin-right: 4px
```

### Modal / Dialog

```
Background: White
Border-radius: 12px
Max-width: 500px (md) | 420px (sm)
Padding: 24px
Box-shadow: 0 20px 25px rgba(0,0,0,0.15)

Layout:
├─ Header: H3 title, close button (X) top-right
├─ Body: form/content
└─ Footer: action buttons (usually 2)

Overlay:
├─ Background: rgba(0,0,0,0.4) (40% opacity)
├─ Animation: fade-in 150ms
└─ Click outside to close: yes
```

### Notification / Alert

```
Background: semantic color (success/error/warning/info)
Color: white text
Padding: 12px 16px
Border-radius: 8px
Icon: left-aligned (16px)
Close button: right-aligned (X)

Variants:
├─ Success (Green 500 bg): "✓ Payment confirmed"
├─ Error (Red 500 bg): "✗ Student not found"
├─ Warning (Amber 500 bg): "⚠ Payment overdue"
└─ Info (Blue 500 bg): "ℹ New feature available"

Animation:
├─ Slide in from top: 200ms ease-out
└─ Auto dismiss: 5s (unless error)
```

### Table / Data Grid

```
Header row:
├─ Background: Neutral 100
├─ Text: Bold, Neutral 800
└─ Border-bottom: 1px Neutral 200

Data rows:
├─ Background: White
├─ Text: Neutral 700
├─ Border-bottom: 1px Neutral 100
├─ Hover: Background Neutral 50
└─ Selected: Background Primary 50

Padding: 12px (cells)
Font: Body 14px

Sorting:
├─ Sortable columns: cursor pointer
├─ Sort indicator: ↑↓ next to header
└─ Ascending: Primary 600
```

---

## 📱 Responsive Design

### Breakpoints

```
Mobile (xs):    < 640px   (default, mobile-first)
Tablet (md):    640-1024px
Desktop (lg):   1024-1280px
Wide (xl):      > 1280px
```

### Responsive Scaling

| Element | XS (Mobile) | MD (Tablet) | LG (Desktop) |
|---------|-----------|-----------|------------|
| H1 | 24px | 28px | 32px |
| H2 | 20px | 22px | 24px |
| Body | 14px | 15px | 16px |
| Padding (section) | 16px | 20px | 24px |
| Max-width (container) | 100% | 100% | 1200px |
| Column layout | 1 col | 2 cols | 3 cols |

### Mobile-First Strategy

1. **Design for mobile FIRST**
   - Vertical stack (1 column)
   - Larger touch targets (44px min)
   - Simplified components

2. **Enhance for tablet**
   - 2-column layouts where sensible
   - Wider padding
   - More complex forms

3. **Optimize for desktop**
   - 3+ columns
   - Side-by-side panels
   - Advanced interactions

### Touch Targets

- Minimum size: 44x44px (Apple HIG)
- Minimum padding: 8px between targets
- Tap areas: clearly visually separated

---

## ✨ Micro-interactions

### Button Click
```
Duration: 100ms
Effect: 
├─ Scale: 98% (slight press)
├─ Shadow: reduced
└─ After click: feedback (color change)
```

### Hover (Desktop only)
```
Duration: 150ms
Effect:
├─ Color shift (primary → darker)
├─ Shadow increase
└─ Transition: ease-out
```

### Form Field Focus
```
Duration: 150ms
Effect:
├─ Border color: Neutral 300 → Primary 500
├─ Shadow: add blue glow
└─ Label color: slightly darker
```

### Loading States
```
Duration: continuous
Effect:
├─ Spinner: 1s rotation
├─ Pulsing text: opacity fade
└─ Disabled interaction
```

### Transitions
```
Default duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1) (ease-out)

For slower transitions (page changes):
├─ Duration: 300ms
└─ Easing: same (ease-out)
```

---

## 🌙 Dark Mode (Future)

**NOT MVP** — reserved for v1.1

When implemented:
- Colors will invert with semantic meaning preserved
- Contrast ratios: minimum AA (4.5:1)
- Blue primary → lighter blue in dark mode
- Gray neutral → light gray text
- White backgrounds → dark backgrounds

---

## ♿ Accessibility (WCAG AA)

### Color Contrast
```
Large text (18px+):    3:1 minimum
Normal text:           4.5:1 minimum
UI components:         3:1 minimum
```

### Keyboard Navigation
- All interactive elements tab-navigable
- Tab order: logical (left-to-right, top-to-bottom)
- Focus indicators: clear blue border (Primary 500)
- Escape key closes modals
- Enter submits forms

### Screen Reader
- Form labels: always associated with inputs
- Images: descriptive alt text or role="presentation"
- Headings: proper hierarchy (h1 > h2 > h3)
- Status: aria-live for alerts
- Disabled: aria-disabled for non-interactive elements

### Semantic HTML
- Use `<button>` not `<div>` for buttons
- Use `<label>` for form labels
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use proper heading hierarchy

---

## 🎯 Implementation Checklist

- [x] Color palette defined (primary, semantic, neutral)
- [x] Typography system (fonts, sizes, weights)
- [x] Spacing system (8px base unit)
- [x] Component specs (button, input, select, card, badge, etc)
- [x] Responsive breakpoints
- [x] Micro-interactions
- [x] Accessibility standards
- [x] Tailwind config ready (next file)

**Status:** ✅ Ready for Wireframes  
**Next:** Wireframes (6+ screens) with this design system applied

---

*Design System v1.0 — MVP Ready*  
*Created: 3 de Março, 2026 | @architect (Aria)*

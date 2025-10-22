# TeachCert Pro Design System

## Overview
This design system is inspired by modern educational platforms like Coursera and Udemy, prioritizing clarity, accessibility, and a professional aesthetic that builds trust with educators.

## Color Palette

### Primary Colors (Trust & Professionalism)
- **Blue Scale**: Used for primary actions, navigation, and interactive elements
  - `primary-50` to `primary-950`: Full blue spectrum
  - Primary action color: `primary-600` (#2563eb)
  - Hover state: `primary-700` (#1d4ed8)

### Accent Colors (Energy & Engagement)
- **Purple/Pink Scale**: Used for highlights, featured content, and secondary actions
  - `accent-50` to `accent-900`: Purple-pink gradient spectrum

### Success Colors (Progress & Achievement)
- **Green Scale**: Used for completed modules, success messages, progress indicators
  - `success-50` to `success-900`: Green spectrum

### Neutral Colors
- Gray scale for backgrounds, borders, and text
- White (`#ffffff`) for card backgrounds
- `gray-50` (`#f9fafb`) for page backgrounds

## Typography

### Font Families
- **Primary**: Inter (clean, modern, highly readable)
  - Body text: Regular (400)
  - Emphasis: Semi-bold (600)
  - Headings: Bold (700)

### Type Scale
- **h1**: 2.5rem - 3.75rem (responsive)
- **h2**: 1.875rem - 3rem (responsive)
- **h3**: 1.5rem - 1.875rem (responsive)
- **h4**: 1.25rem - 1.5rem (responsive)
- **Body**: 1rem (16px base)
- **Small**: 0.875rem (14px)
- **Tiny**: 0.75rem (12px)

### Line Heights
- Headings: 1.2
- Body text: 1.6
- Small text: 1.5

## Spacing System

Based on 4px grid:
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)
- `4xl`: 6rem (96px)

## Components

### Buttons
- **Primary**: Blue background, white text, used for main actions
- **Secondary**: Gray background, used for less important actions
- **Outline**: Border only, used for tertiary actions
- Sizes: sm, md, lg
- States: default, hover, active, disabled

### Cards
- Background: White
- Border: 1px solid gray-200
- Border radius: 0.75rem (12px)
- Shadow: Soft shadow on default, elevated on hover
- Hover effect: Slight lift (-4px translateY)

### Input Fields
- Border: 1px solid gray-300
- Border radius: 0.5rem (8px)
- Focus state: Blue border + ring
- Padding: 0.625rem horizontal

### Badges
- Small pills for status indicators
- Border radius: 9999px (fully rounded)
- Variants: success, info, warning, error

### Progress Bars
- Height: 0.5rem (8px)
- Background: gray-200
- Fill: Gradient from primary to accent
- Smooth transition animations

## Layout

### Container
- Max width: 1280px (7xl)
- Responsive padding:
  - Mobile: 1rem
  - Tablet: 1.5rem
  - Desktop: 2rem

### Grid System
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 3-4 columns
- Gap: 1.5rem - 2rem

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Shadows

### Card Shadow (default)
```
shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
```

### Card Shadow (hover)
```
shadow-card-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

### Soft Shadow
```
shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)
```

## Animations

### Fade In
- Duration: 0.5s
- Easing: ease-in-out
- From: opacity 0 → 1

### Slide Up
- Duration: 0.4s
- Easing: ease-out
- From: translateY(20px) + opacity 0

### Slide In Right
- Duration: 0.4s
- Easing: ease-out
- From: translateX(20px) + opacity 0

### Shimmer (Loading)
- Duration: 2s
- Infinite loop
- Gradient sweep animation

## Accessibility

### Focus States
- All interactive elements must have visible focus states
- Focus ring: 2px blue-200 ring

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 minimum)
- Large text: 3:1 minimum

### Touch Targets
- Minimum size: 44px x 44px
- Adequate spacing between interactive elements

## Icon System
- Library: Lucide React
- Size: 20px (default), 24px (large), 16px (small)
- Stroke width: 2
- Color: Inherit from parent

## Best Practices

1. **Consistency**: Use design tokens consistently throughout the app
2. **Responsiveness**: Always design mobile-first, enhance for larger screens
3. **Performance**: Optimize images, use lazy loading
4. **Accessibility**: Always include alt text, aria labels, keyboard navigation
5. **Visual Hierarchy**: Use size, weight, and color to create clear hierarchy
6. **White Space**: Don't be afraid of white space - it improves readability
7. **Progressive Disclosure**: Show relevant information at the right time
8. **Feedback**: Provide immediate visual feedback for user actions

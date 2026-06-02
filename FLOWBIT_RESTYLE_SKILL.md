---
name: flowbit-restyle
description: "Trigger: restyle, restyling, flowbit, redesign, visual refresh, premium redesign, cambio visual, cambio estético. Transform the visual design of UshuaiaGlow e-commerce to a Flowbit-inspired premium aesthetic while preserving all existing functionality."
license: MIT
metadata:
  author: UshuaiaGlow
  version: "1.0"
---

# FLOWBIT_RESTYLE_SKILL — UshuaiaGlow Premium Visual Redesign

## Activation Contract

Invoke this skill when the task is a **purely visual redesign** of the UshuaiaGlow e-commerce. The goal is to elevate the UI to a premium, Flowbit-inspired aesthetic without touching business logic, data models, APIs, authentication, cart, checkout, or backend.

### Trigger Signals

- User says: "restyle", "redesign", "make it premium", "Flowbit", "visual refresh", "cambio visual", "darle un look más premium"
- Task involves: component appearance, spacing, typography, colors, animations, hover states, layout polish
- Context: the task targets `components/`, `app/globals.css`, `tailwind.config.js`, or page-level layout wrappers

### Do NOT Activate When

- The task touches: API routes, middleware, database, authentication, checkout logic, cart logic, admin panel logic, data fetching, product management, stock management
- The task adds new dependencies beyond what is already in `package.json`
- The task modifies backend files in `src/`, `lib/api.ts`, `services/`, `scripts/`, `context/` (except for visual-only changes to CartContext visual state)

---

## Project Context

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (app router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 12 (already installed) |
| Icons | lucide-react 1.14 |
| Language | TypeScript 5.7 |

### Architecture

- **`components/`**: UI components — Navbar, Hero, ProductCard, ProductDetail, FeaturedProducts, Categories, Footer, ComboDetail, ProductImageGallery, Pagination, GoogleAnalytics
- **`app/`**: Next.js App Router pages — home, products, combos, categories, cart, checkout, admin, static pages
- **`context/`**: CartContext (client-side cart via localStorage)
- **`types/`**: TypeScript interfaces for Product, Cart, User, etc.
- **`lib/`**: API client, analytics (GA4, Meta Pixel), email, helpers
- **`tailwind.config.js`**: Custom design tokens (colors, fonts, spacing, shadows)

### Current Design System

```yaml
colors:
  primary: "#53D1F9"        # Cyan — main CTA, accent on dark
  accent: "#eb7690"         # Rose — discount badges, secondary emphasis
  dark: "#1a1a1a"           # Text on light
  surface-light: "#f5f5f7"  # Light sections (FeaturedProducts, Categories)
  surface-dark: "#272729"   # Secondary dark surface
  surface-darker: "#1d1d1f" # Primary dark surface (cards, footer)
  black: "#000000"          # Main background
  green-offer: "#35de80"    # Discount/urgency badges

typography:
  font-family: "SF Pro Display, SF Pro Text, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif"
  heading-letter-spacing: "-0.02em"
  body-letter-spacing: "-0.01em"

radius:
  default: "rounded-2xl" (16px)
  badge: "rounded-full"
  pill: "980px" (in tailwind config)

shadows:
  apple: "3px 5px 30px 0px rgba(0, 0, 0, 0.22)" (in tailwind config)
```

### Visual Patterns in Use

- **Dark theme**: Black backgrounds with surface-darker cards
- **Glassmorphism**: `bg-black/80 backdrop-blur-md` on navbar when scrolled
- **Border system**: `border-white/5` to `border-white/10` for subtle separation
- **Hover effects**: Scale on CTA buttons (1.02), image zoom (1.05), primary border glow
- **Badge system**: `rounded-full` badges for discounts, stock, COMBO labels
- **Mobile**: Sticky bottom CTAs with backdrop blur, bottom sheet filters, horizontal scroll for related products

---

## Hard Rules

### Preserve — Do NOT Touch

| Area | Files / Paths |
|------|---------------|
| API routes | `app/api/*` |
| Backend logic | `src/`, `lib/api.ts`, `services/` |
| Database | `lib/mongodb*`, any DB connection |
| Auth | `middleware.ts`, `app/api/auth/*`, admin login/register |
| Cart logic | `context/CartContext.tsx`, `types/cart.ts` |
| Checkout | `app/api/checkout/*`, `app/checkout/*` |
| Analytics | `lib/ga4-ecommerce.ts`, `lib/meta-pixel.ts`, `components/GoogleAnalytics.tsx` |
| Data models | `types/product.ts`, `types/user.ts`, `types/sale.ts` |
| Scripts | `scripts/*` |
| Tests | `tests/*` |
| Navigation structure | Page routes, nav links in `components/Navbar.tsx` |
| Config | `next.config.js`, `tsconfig.json`, `postcss.config.js` |

### Never

- Remove functionality
- Rewrite entire components unnecessarily
- Change component props or interfaces
- Alter data flow or state management
- Change API contracts
- Reorganize file structure
- Add new npm packages
- Remove existing npm packages
- Change routing or URL structure

---

## Decision Gates

| Situation | Action |
|-----------|--------|
| Visual change only (spacing, color, typography, layout) | ✅ Safe — proceed |
| Adding Framer Motion animation | ✅ Safe — Framer Motion 12 is already a dependency |
| Changing component structure (adding wrapper divs for animation) | ⚠️ Permitted if no functional impact |
| Adding Tailwind classes for visual polish | ✅ Safe |
| Changing HTML semantic elements | ❌ STOP — risk of breaking accessibility or SEO |
| Modifying event handlers (onClick, onSubmit) | ❌ STOP — functional code |
| Changing text content readable by users | ⚠️ Only if it's purely visual copy (labels, headings) |
| Adding CSS variables to `globals.css` | ✅ Safe |
| Changing `tailwind.config.js` theme | ⚠️ Only additive changes (new colors, no deletions) |
| Modifying responsive breakpoints | ❌ STOP — risk of layout breakage |
| Adding interactive JS logic | ❌ STOP — keep it visual-only |

---

## Design Philosophy

### Inspiration

- Flowbit design system
- Premium fashion brands
- Modern minimalist e-commerce
- Editorial design
- Luxury streetwear
- Shopify premium themes (Dawn, Sense, Empire)

### Visual Principles

- **Whitespace**: Generous spacing, airy layouts, 24px+ gaps
- **Clean design**: Remove visual noise, minimal borders, subtle separators
- **Strong hierarchy**: Size, weight, and color to guide attention
- **Typography-led**: Let type do the heavy lifting for visual impact
- **Smooth animations**: Micro-interactions that feel natural, not gimmicky
- **Premium feel**: Subtle shadows, glass effects, refined hover states
- **Conversion-focused**: Every visual decision supports the purchase journey

---

## Work Strategy — Levels

Execute changes in order. Never skip to Level 3 before completing Levels 1 and 2.

### Level 1: Pure Visual Polish

Files: `components/*.tsx`, `app/globals.css`, `tailwind.config.js`

**Spacing**
- Increase padding/margins in section containers (`py-16` → `py-20` or `py-24`)
- Add generous gaps between elements (`gap-4` → `gap-6` or `gap-8`)
- Ensure consistent section padding across all pages

**Layout**
- Refine grid gaps for product grids (`gap-6`)
- Improve card internal padding (`p-4` → `p-5` or `p-6`)
- Align content widths consistently (`max-w-7xl`)

**Typography**
- Tighten leading on headings (`leading-[1.05]` or `leading-tight`)
- Refine font weights (medium for body, semibold for headings)
- Add letter-spacing where appropriate for premium feel
- Ensure hierarchy: page title → section title → card title → body

**Borders & Surfaces**
- Reduce border opacity for subtlety (`border-white/5` for cards, `border-white/[0.04]` for ultra-subtle)
- Use `bg-white/[0.02]` for hover states on dark surfaces
- Add subtle inset shadows for depth without border

**Hover States**
- Smooth transitions (`duration-300` minimum)
- Subtle lifts (`hover:-translate-y-0.5`) on cards
- Border glow effects on interactive elements
- Scale transitions on images

**Grid Systems**
- Ensure consistent product card sizing
- Improve masonry/alignment for category sections
- Better responsive breakpoint handling

### Level 2: Micro-animations

Files: `components/*.tsx`

Use **Framer Motion** (already in `package.json` at v12.38.0). Do NOT use CSS animations for new effects — use Framer Motion components.

**Import Pattern:**
```tsx
import { motion } from 'framer-motion';
```

**Allowed Animation Types:**

| Type | Implementation | Where |
|------|---------------|-------|
| Fade In | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` | Section reveals |
| Fade Up | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` | Cards, content blocks |
| Scale on Hover | `whileHover={{ scale: 1.02 }}` | Product cards, CTAs |
| Stagger Children | `variants: parent { staggerChildren: 0.1 }` | Grid reveals |
| Viewport Reveal | `initial="hidden" whileInView="visible" viewport={{ once: true }}` | Scroll-triggered entries |

**Standard Framer Motion Variants (use these consistently):**

```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } }
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }
};
```

**Performance Rules for Animations:**
- Use `viewport={{ once: true }}` for scroll reveals — never re-trigger
- Keep animated elements under 150 per page
- Prefer `transform` and `opacity` (GPU-composited) over `width`, `height`, `top`, `left`
- Use `will-change: transform` sparingly — only on elements that animate frequently
- Never animate more than 20 elements simultaneously on mobile
- Avoid layout thrashing: measure once, animate once

**Animation Placement:**
- Section headings: fade up on scroll
- Product cards: stagger in on page load
- Page transitions: simple fade on route change (use `AnimatePresence`)
- Hover: scale + slight shadow lift on cards
- Badge reveals: subtle scale entrance

**Do NOT use:**
- Rotations, skew, 3D transforms (unnecessary visual noise)
- Aggressive parallax
- Scroll hijacking or custom scrollbars
- Spring animations with high tension (`type: "spring", stiffness: 300+`)
- Animations that delay content usability (critical text/CTAs must render instantly)

### Level 3: Advanced Visual Enhancements

Only after Level 1 and Level 2 are complete.

**Hero Sections**
- Refine gradient overlays for depth
- Improve typography composition (hierarchical text sizing)
- Add subtle motion to background elements
- Enhance CTA styling with micro-interactions

**Featured Collections / Editorial Sections**
- Improve section header styling with refined typography
- Add visual dividers or accent lines
- Better composition for collection cards

**Product Showcase**
- Improve image presentation (aspect ratios, padding)
- Enhanced price display with better hierarchy
- Refined benefit list presentation

**Storytelling Sections**
- Better use of white space
- Split layouts (image + text)
- Accent typography for pull quotes or highlights

---

## Components: Scope of Visual Changes

| Component | Safe to Modify | Do NOT Change |
|-----------|---------------|---------------|
| `Navbar.tsx` | Background, blur, border, link hover, mobile menu animation, cart badge style | Nav links array, scroll handler logic, `useCart` calls, menu open/close logic |
| `Hero.tsx` | Spacing, typography, gradient overlays, button styling, trust badges layout | Image src, link hrefs, CTA text, analytics |
| `ProductCard.tsx` | Card padding, border radius, image hover scale, badge styling, button styling, typography | `handleAddToCart`, `handleProductClick`, analytics tracking, state management, `addItem` call |
| `ProductDetail.tsx` | Section spacing, typography scales, benefit card styling, review card styling, image gallery layout, trust badges | Quantity logic, `handleAddToCart`, state management, data fetching, price calculation |
| `ComboDetail.tsx` | Same as ProductDetail | Same restrictions |
| `FeaturedProducts.tsx` | Section padding, header typography, grid gap, link styling | Data fetching, error handling, ProductCard rendering logic |
| `Categories.tsx` | Card styling, hover effects, typography, spacing | Category data array, link hrefs |
| `Footer.tsx` | Spacing, link styling, social icon styling, border styling | Link hrefs, footerLinks data, social links |
| `app/page.tsx` | Section padding, typography, button styling, badge styling | Section structure, link hrefs, component ordering |
| `app/productos/page.tsx` | Header styling, search bar styling, filter styling, grid layout | Filter logic, search logic, data fetching, ProductCard rendering |
| `app/combos/page.tsx` | Hero section styling, card styling, badges, CTA buttons | Data fetching, filter logic, add-to-cart logic |
| `app/cart/page.tsx` | Card styling, form input styling, button styling, summary styling | Checkout logic, form state, `handleCheckout`, data fetching |
| `app/categorias/[category]/page.tsx` | Header styling, grid layout | Data fetching, routing logic |
| `app/globals.css` | CSS variables, scrollbar styling, base typography, selection color | Font stack, core layout properties |
| `tailwind.config.js` | ADDITIVE only: new color shades, extended spacing, animation keyframes | Existing color values, font family, spacing |

---

## Performance Requirements

Every change must preserve:

- **SEO**: No changes to semantic HTML structure, meta tags, heading hierarchy
- **Accessibility**: No removal of `aria-` attributes, `sr-only` text, focus styles, keyboard navigation
- **Responsive Design**: Mobile-first approach, test breakpoints, no horizontal overflow
- **Core Web Vitals**:
  - No lazy loading content above the fold
  - No added CLS (use fixed dimensions for images)
  - No render-blocking resources
  - Framer Motion must NOT block paint (use `initial` states that match the final layout)
- **Performance**: No heavy dependencies, no unnecessary re-renders, no layout thrashing

### Animation Budget
- Max 5 animated elements per viewport on mobile
- Max 12 animated elements per viewport on desktop
- First paint must be complete within 100ms of interaction
- Use `will-change: transform` only on actively animating elements

---

## Methodology

### Before Each Change

1. **Announce**: "Modifying `{filename}` — {what changes} — {expected visual impact}"
2. **Read** the file thoroughly before editing
3. **Verify no functional code** exists in the editable region
4. **Check for dependencies** — does this component share state with others?

### After Each Change

1. **Confirm** no functional code was altered (check event handlers, state, API calls)
2. **Verify** the component still renders without errors
3. **Check** responsive behavior at mobile, tablet, and desktop
4. **Ensure** no imports were removed or broken

### Change Safety Checklist

- [ ] Only visual classes changed (Tailwind: text, bg, border, shadow, spacing, rounded)
- [ ] No event handlers modified
- [ ] No state variables added/removed
- [ ] No props interface changed
- [ ] No API calls touched
- [ ] No new dependencies introduced
- [ ] No files created outside `components/` or `app/` (except `globals.css`, `tailwind.config.js`)
- [ ] Animation only via Framer Motion (already installed)
- [ ] Responsive: no horizontal scroll, no content cutoff

---

## Design Tokens Reference

### Current Tailwind Config — ADDITIVE ONLY

```js
// tailwind.config.js — existing extend block. Only ADD to it:
theme: {
  extend: {
    colors: {
      // EXISTING — do not modify
      primary: { DEFAULT: '#53D1F9', ... },
      accent: { ... },
      surface: { light, dark, darker },
      dark: '#1a1a1a',
      // SAFE TO ADD: new semantic color tokens for premium feel
      // e.g., 'premium-gold': '#C9A96E'
    },
    fontFamily: {
      // EXISTING — do not modify
      sans: ['SF Pro Display', ...],
    },
    // SAFE TO ADD:
    // animation: { ... } — for Tailwind animations
    // keyframes: { ... } — matching animation definitions
    // transitionTimingFunction: { 'premium': 'cubic-bezier(0.16, 1, 0.3, 1)' }
  }
}
```

### CSS Custom Properties (`globals.css`)

Current variables — do not remove. Only ADD new ones with `--` prefix.

```css
:root {
  /* EXISTING — do not modify */
  --primary: #53D1F9;
  --accent: #eb7690;
  --surface-light: #f5f5f7;
  --surface-dark: #272729;
  --surface-darker: #1d1d1f;
  /* SAFE TO ADD */
  /* --ease-premium: cubic-bezier(0.16, 1, 0.3, 1); */
}
```

---

## References

- `tailwind.config.js` — existing design tokens
- `app/globals.css` — base styles and CSS variables
- `app/layout.tsx` — root layout structure (navbar, footer, providers)
- `app/page.tsx` — home page sections
- `components/*.tsx` — all UI components (see scope table above)
- `package.json` — confirmed dependencies (framer-motion@12.38.0, lucide-react@1.14.0)

---

## Cardinal Rule

> Preserve behavior. Improve perception.

Every line of code changed must answer: "Does this make it look more premium without breaking anything?" If the answer is no — do not change it.

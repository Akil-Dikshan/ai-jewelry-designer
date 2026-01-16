# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 7: UI/UX Design Specifications

## PROMPT 7: UI/UX DESIGN SPECIFICATIONS

### DESIGN SYSTEM & UI/UX SPECIFICATIONS

## 1. COLOR PALETTE

### PRIMARY COLORS:
- **Deep Navy:** `#0A1128` (headers, primary text)
- **Luxe Gold:** `#D4AF37` (accents, CTAs, highlights)
- **Soft Cream:** `#F5F5F0` (backgrounds)
- **Pure White:** `#FFFFFF` (cards, surfaces)

### SECONDARY COLORS:
- **Slate Gray:** `#4A5568` (secondary text)
- **Light Gray:** `#E2E8F0` (borders, dividers)
- **Success Green:** `#10B981` (confirmations)
- **Error Red:** `#EF4444` (errors)
- **Warning Orange:** `#F59E0B` (warnings)

### GEMSTONE ACCENT COLORS (for visual elements):
- **Diamond White:** `#E8F4F8` (pale blue-white)
- **Sapphire Blue:** `#0F52BA` (deep blue)
- **Ruby Red:** `#E0115F` (rich red)
- **Emerald Green:** `#046307` (deep green)

## 2. TYPOGRAPHY

### FONT FAMILIES:
- **Headings:** "Playfair Display" or "Cormorant Garamond" (elegant serif)
- **Body:** "Inter" or "Montserrat" (clean sans-serif)
- **UI Elements:** "Inter" (consistency)

### FONT SIZES:
- **Hero/H1:** 2.5rem / 40px, font-weight: 700
- **H2:** 2rem / 32px, font-weight: 600
- **H3:** 1.5rem / 24px, font-weight: 600
- **Body:** 1rem / 16px, font-weight: 400
- **Small:** 0.875rem / 14px, font-weight: 400
- **Tiny:** 0.75rem / 12px, font-weight: 400

### LINE HEIGHT:
- **Headings:** 1.2
- **Body:** 1.6
- **UI Elements:** 1.4

## 3. SPACING SYSTEM

Use 8px base unit:
- **xs:** 4px (0.25rem)
- **sm:** 8px (0.5rem)
- **md:** 16px (1rem)
- **lg:** 24px (1.5rem)
- **xl:** 32px (2rem)
- **2xl:** 48px (3rem)
- **3xl:** 64px (4rem)

### COMPONENT SPACING:
- **Section gaps:** 2xl (48px)
- **Card padding:** lg (24px)
- **Input padding:** sm (8px)
- **Button padding vertical:** lg-xl (24-32px)
- **Page margins:** xl-2xl (32-48px)

## 4. COMPONENT STYLES

### BUTTONS:

**Primary Button:**
- Background: Luxe Gold (#D4AF37)
- Text: Deep Navy (#0A1128)
- Font-weight: 600
- Padding: 12px 32px
- Border-radius: 6px
- Hover: Darken background by 10%
- Active: Scale 0.98
- Disabled: Opacity 0.5, cursor not-allowed
- Shadow: 0 2px 8px rgba(212, 175, 55, 0.3)

**Secondary Button:**
- Background: Transparent
- Border: 2px solid Deep Navy
- Text: Deep Navy
- Padding: 10px 30px (adjust for border)
- Border-radius: 6px
- Hover: Background Deep Navy, Text White
- Transition: All 0.3s ease

**Text Button:**
- No background, no border
- Text: Slate Gray
- Font-weight: 500
- Underline on hover
- Padding: 8px 16px

### INPUTS:

**Text Input / Textarea:**
- Border: 1px solid Light Gray (#E2E8F0)
- Border-radius: 6px
- Padding: 12px 16px
- Background: White
- Focus: Border color Luxe Gold, Box-shadow glow
- Error state: Border color Error Red
- Disabled: Background #F9FAFB, cursor not-allowed

**Dropdown/Select:**
- Same as text input
- Chevron icon on right
- Options: Hover background Soft Cream

### CARDS:

**Standard Card:**
- Background: White
- Border: 1px solid Light Gray
- Border-radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover (if clickable): Shadow: 0 4px 12px rgba(0,0,0,0.15)

**Image Card (for design results):**
- Background: White
- Border: None or very subtle
- Border-radius: 8px
- Image: Border-radius: 6px
- Padding: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Hover: Lift effect (translateY -4px), stronger shadow

## 5. ICONS & IMAGERY

### ICON STYLE:
• Use outline icons (not filled)
• Size: 20px-24px for UI elements
• Color: Match text color or Slate Gray
• On hover: Color shifts to Luxe Gold

### ICON LIBRARY:
• Use Heroicons, Feather Icons, or Lucide
• Consistent stroke width (2px)

### GEM/JEWELRY ILLUSTRATIONS:
• Minimal, line-art style
• Gold accent color for highlights
• Use for empty states, loading states

### LOADING ANIMATIONS:
• Elegant spinner or pulsing gem animation
• Color: Luxe Gold
• Size: 40px-60px
• Smooth animation (1-2s duration)

## 6. LAYOUT STRUCTURE

### DESKTOP (1200px+):
• Max content width: 1200px
• Centered with auto margins
• Two-column layouts where appropriate

### TABLET (768px - 1199px):
• Max content width: 960px
• Single column or 2-column grids

### MOBILE (< 768px):
• Full width with 16px side padding
• Single column stacking
• Larger touch targets (min 44px)

### HEADER:
• Height: 64px
• Background: Deep Navy
• Logo: Left-aligned
• Navigation: Right-aligned (desktop) / Hamburger (mobile)
• Sticky on scroll (optional)

### FOOTER:
• Background: Deep Navy
• Text: Light Gray
• Links: Hover to Luxe Gold
• Padding: 48px vertical
• Contains: Links, copyright, social icons

## 7. ANIMATIONS & TRANSITIONS

### STANDARD TRANSITIONS:
• Duration: 0.3s
• Easing: ease-in-out
• Properties: background, color, transform, opacity, box-shadow

### PAGE TRANSITIONS:
• Fade in on load (0.5s)
• Smooth scroll behavior

### HOVER EFFECTS:
• Buttons: Background change, slight scale (1.02)
• Cards: Lift (translateY -4px), shadow increase
• Links: Color change, underline
• Images: Subtle zoom (scale 1.05)

### LOADING STATES:
• Skeleton loaders: Shimmer animation
• Progress bars: Smooth width animation
• Spinners: Rotate animation (infinite)

### SUCCESS/ERROR MESSAGES:
• Slide in from top or fade in
• Auto-dismiss after 5 seconds
• Manual dismiss with X button

## 8. RESPONSIVE BREAKPOINTS

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+

### MOBILE-FIRST APPROACH:
• Base styles for mobile
• Media queries to enhance for larger screens

### TOUCH-FRIENDLY:
• Minimum tap target: 44x44px
• Increase spacing between interactive elements
• Larger form inputs on mobile (16px font prevents zoom)

## 9. ACCESSIBILITY

### REQUIREMENTS:
• Semantic HTML (proper heading hierarchy)
• ARIA labels where needed
• Keyboard navigation support (tab order)
• Focus indicators (visible outline)
• Color contrast ratios:
  – Normal text: 4.5:1
  – Large text: 3:1
  – Interactive elements: 4.5:1
• Alt text for all images
• Form labels properly associated
• Error messages clearly communicated
• Screen reader friendly

### FOCUS STYLES:
• Outline: 2px solid Luxe Gold
• Offset: 2px
• Visible on all interactive elements

## 10. MICRO-INTERACTIONS

### FORM INTERACTIONS:
• Real-time validation feedback
• Input fields glow on focus
• Checkmark animation on successful submit
• Error shake animation on validation failure

### DESIGN GENERATION:
• Progress indicator with steps
• Confetti/sparkle animation on completion
• Smooth image fade-in as they load

### REFINEMENT:
• Subtle pulse on "Generate" button
• Before/after slider smooth dragging
• Version history thumbnails scale on hover

### IMAGE GALLERY:
• Staggered fade-in for multiple images
• Lightbox smooth zoom in/out
• Swipe gestures on mobile

## 11. DESIGN PATTERNS

### PROGRESSIVE DISCLOSURE:
• Show essential fields first
• Expandable sections for advanced options
• "Show more" / "Show less" toggles
• Tooltips for explanations

### EMPTY STATES:
• Friendly illustrations
• Clear call-to-action
• Helpful suggestions

### ERROR STATES:
• Non-threatening language
• Specific, actionable guidance
• Retry options
• Support contact if needed

### SUCCESS STATES:
• Positive reinforcement
• Clear next steps
• Visual confirmation (checkmark, etc.)

### LOADING STATES:
• Skeleton screens for content
• Spinners for actions
• Progress bars for long processes
• Estimated time remaining

## 12. IMAGERY GUIDELINES

### DESIGN RESULT IMAGES:
• Aspect ratio: 1:1 (square) for consistency
• Minimum resolution: 1024x1024px
• Display size: 400-600px on desktop
• Thumbnail size: 200-300px
• Lazy loading for performance

### GEM UPLOAD IMAGES:
• Accepted formats: JPG, PNG, WebP
• Max file size: 5MB
• Display preview: 150x150px
• Maintain aspect ratio

### BACKGROUND IMAGES:
• Subtle, luxury textures (optional)
• Don't overpower content
• Low opacity if used behind text

## 13. DARK MODE (Optional Future)

If implementing dark mode:

### DARK PALETTE:
• **Background:** `#111827`
• **Surface:** `#1F2937`
• **Primary Text:** `#F9FAFB`
• **Secondary Text:** `#D1D5DB`
• **Accent:** Keep Luxe Gold
• **Borders:** `#374151`

• Toggle switch in settings or header
• Persist preference in localStorage
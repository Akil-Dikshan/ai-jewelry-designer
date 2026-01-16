# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 2: Phase 1 - Gem Input Form & Design Generation

## PROMPT 2: PHASE 1 - GEM INPUT FORM & DESIGN GENERATION

### BUILD PHASE 1: Initial Design Generation Interface

### CREATE A MULTI-STEP FORM WITH THESE SECTIONS:

## 1. GEM INFORMATION FORM

### A. Gem Type (Required)
• Dropdown select with options:
  – Diamond
  – Sapphire
  – Ruby
  – Emerald
  – Topaz
  – Amethyst
  – Aquamarine
  – Opal
  – Garnet
  – Peridot
  – Tanzanite
  – Tourmaline
  – Other (shows text input if selected)
• Label: "What type of gem do you have?"
• Helper text: "Select the primary gemstone for your design"

### B. Gem Shape/Cut (Required)
• Visual selector with clickable cards showing icons/illustrations
• Options (show as visual grid):
  – Round Brilliant
  – Oval
  – Cushion
  – Pear
  – Emerald Cut
  – Marquise
  – Asscher
  – Princess
  – Radiant
  – Heart
• Each option shows an icon/diagram of the cut
• Label: "What is the shape/cut of your gem?"
• Active selection highlighted with border/color

### C. Gem Size (Required)
Two options presented:

**OPTION 1 (Simple - Default shown):**
Radio buttons:
• Small (under 5mm) - "Perfect for delicate designs"
• Medium (5-8mm) - "Most popular size"
• Large (over 8mm) - "Statement piece"

**OPTION 2 (Advanced - Expandable section):**
• Link: "I know exact dimensions"
• When clicked, shows:
  – Length (mm): [number input]
  – Width (mm): [number input]
  – Height (mm): [number input]
  – OR Carat Weight: [number input] (optional)

### D. Gem Color (Required)
• Color picker OR
• Dropdown with common colors:
  – Colorless/White
  – Blue (Light/Medium/Dark)
  – Red (Light/Medium/Dark)
  – Green (Light/Medium/Dark)
  – Yellow/Golden
  – Pink/Rose
  – Purple/Violet
  – Orange
  – Black
  – Multi-color
  – Custom (shows color picker)
• Label: "What color is your gem?"

### E. Transparency (Required)
Visual selector with icons and descriptions:
• Transparent (Clear, see-through) - [icon of clear gem]
• Semi-transparent (Slightly cloudy) - [icon of translucent gem]
• Opaque (Solid, no transparency) - [icon of opaque gem]
• Label: "How see-through is your gem?"
• Helper text: "This helps us render light and reflections accurately"

## 2. GEM IMAGE UPLOAD (Optional but Recommended)
• Large drag-and-drop upload area
• Text: "Upload a photo of your gem (optional but recommended)"
• Subtext: "This helps our AI create more accurate designs"
• Accept: .jpg, .jpeg, .png, .webp
• Max file size: 5MB
• Show image preview after upload with:
  – Thumbnail preview
  – File name
  – Remove/Replace button
• If no image uploaded, show placeholder icon
• Validation: Check file type and size before accepting

## 3. JEWELRY DESIGN PROMPT (Required)
• Large text area (5-6 rows)
• Label: "Describe your dream jewelry design"
• Placeholder text with examples:
  ```
  Examples:
  – Art deco engagement ring with halo setting in platinum
  – Vintage-style pendant necklace with filigree details
  – Modern minimalist solitaire ring with thin band
  – Three-stone ring with side diamonds in yellow gold
  ```
• Character counter: Shows "0/1000" updating as user types
• Max length: 1000 characters
• Below text area, add expandable "Design Tips" section:
  – Be specific about style (vintage, modern, minimalist, ornate)
  – Mention metal preference (gold, platinum, silver)
  – Describe setting type (prong, bezel, pave, halo)
  – Include any special features (engraving, side stones, texture)

## 4. MATERIAL PREFERENCES (Optional - Expandable)
Collapsible section: "Metal & Materials (optional)"

When expanded shows:

**A. Metal Type:**
Checkboxes (can select multiple for comparison):
• Yellow Gold (10K/14K/18K)
• White Gold
• Rose Gold
• Platinum
• Silver (Sterling/Fine)
• Mixed metals

**B. Finish:**
Radio buttons:
• Polished (shiny)
• Matte (brushed)
• Hammered
• Mixed finish

## 5. GENERATION BUTTON & SETTINGS
• Large, prominent "Generate My Design" button
• Below button, show:
  – Estimated time: "This will take 10-15 seconds"
  – Number of variations: Dropdown (2, 3, 4) - Default: 3
• Disclaimer (small text):
  > "Warning: These are concept renderings, not final production designs. Actual jewelry may vary."

## FORM BEHAVIOR
• Progressive disclosure: Show sections one at a time OR all at once with clear visual separation
• Real-time validation: Mark required fields
• Error messages: Show clearly next to invalid fields
• Save progress: If user navigates away, save form data in browser
• Disabled state: Disable generate button until required fields complete

## LOADING STATE (When generating)
• Overlay entire form with semi-transparent backdrop
• Center loading animation (elegant spinner or jewelry-themed animation)
• Progress text:
  – "Analyzing your gem..." (0-3 seconds)
  – "Creating design concepts..." (3-8 seconds)
  – "Adding final touches..." (8-12 seconds)
• Disable all form inputs during generation
• Show cancel button to abort

## ERROR HANDLING
• If API fails: Show friendly error message with retry button
• If image upload fails: Show specific error (too large, wrong format, etc.)
• If no internet: "Please check your connection and try again"
• If rate limit exceeded: "We're at capacity. Please try again in a few minutes."

## STYLING REQUIREMENTS
• Luxury jewelry brand aesthetic
• Color scheme: Deep navy, gold accents, white/cream backgrounds
• Typography: Elegant serif for headings, clean sans-serif for body
• Generous white space
• Subtle shadows and borders
• Icons should be minimal and refined
• Mobile-first responsive design
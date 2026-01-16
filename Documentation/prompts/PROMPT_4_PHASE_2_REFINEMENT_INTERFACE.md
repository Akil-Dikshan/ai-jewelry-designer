# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 4: Phase 2 - Refinement Interface

## PROMPT 4: PHASE 2 - REFINEMENT INTERFACE

### BUILD THE DESIGN REFINEMENT PAGE

This page loads when user clicks "Select & Refine" on a design.

## 1. PAGE HEADER
• Back button: "← Back to all designs"
• Page title: "Refine Your Design"
• Save status indicator: "All changes saved" or "Saving..."

## 2. SELECTED DESIGN DISPLAY

### LEFT PANEL (60% width on desktop):

**CURRENT DESIGN:**
• Large image display of selected design
• Zoom controls (+ - buttons or slider)
• Full screen button
• Image quality: High resolution
• Label: "Current Version"

**VERSION HISTORY (Collapsible section below):**
• Thumbnails of all previous versions
• Click thumbnail to view/compare
• Label showing: "Original" → "Refinement 1" → "Refinement 2" etc.
• Revert button: "Use this version" on hover

### RIGHT PANEL (40% width on desktop):

## 3. REFINEMENT INPUT

### A. ORIGINAL DESIGN INFO (Collapsed by default):
• Show original gem specs
• Original prompt
• "View details" to expand

### B. CONVERSATIONAL REFINEMENT:
• Heading: "How would you like to modify this design?"
• Text input area (3-4 rows)
• Placeholder: "Describe the changes you'd like to make..."
• Character limit: 300 characters
• Counter: Shows remaining characters

### C. QUICK REFINEMENT SUGGESTIONS:
• Label: "Common modifications:"
• Clickable chips/buttons that auto-fill the input:
  – "Make band thicker"
  – "Add side stones"
  – "Change to rose gold"
  – "Lower profile setting"
  – "Add engraving detail"
  – "Make more minimalist"
  – "Add vintage details"
  – "Increase gem size"
• Clicking a chip adds text to input (user can edit)

### D. ADVANCED OPTIONS (Expandable):
• **Refinement strength slider:**
  – Subtle changes ↔ Major redesign
  – Default: Middle
• **Preserve elements:**
  – Checkboxes: Keep gem size, Keep overall shape, Keep metal type
• **Style guidance:**
  – Dropdown: Make more [vintage/modern/minimal/ornate]

## 4. ACTION BUTTONS
• **PRIMARY:** "Generate Refinement" (large, prominent)
  – Shows loading state when processing
  – Disabled if input is empty
• **SECONDARY:** "Start over with this design" (outline button)
  – Clears all refinements, keeps original
• **TERTIARY:** "Abandon and go back" (text link)

## 5. REFINEMENT LIMITS & CREDITS
• Show remaining refinements: "4 refinements remaining"
• If limit reached:
  – Message: "You've used all free refinements for this design"
  – Options: "Start new design" or "Upgrade to premium" (future feature)

## 6. COMPARISON VIEW (Toggle)
• Toggle switch: "Compare with previous version"
• When enabled:
  – Side-by-side view (desktop) OR
  – Slider overlay (mobile)
  – Labels: "Before" and "After"

## 7. GENERATION IN PROGRESS
When user clicks "Generate Refinement":
• Disable input area
• Show progress indicator on image
• Status messages:
  – "Understanding your changes..." (0-2s)
  – "Applying modifications..." (2-6s)
  – "Rendering updated design..." (6-10s)
• Animated placeholder where new image will appear

## 8. RESULT DISPLAY
When refinement completes:
• Smooth transition to show new image
• Highlight what changed (optional: subtle glow or annotation)
• Auto-save to version history
• Success message: "Refinement applied! ✨"

**ACTION OPTIONS after refinement:**
• "Accept this version" → Adds to saved designs
• "Refine further" → Keep iterating
• "Revert to previous" → Undo this refinement
• "Download this version" → Save image

## 9. REFINEMENT HISTORY LOG (Optional)
• Collapsible section: "Refinement History"
• Shows list of all refinement prompts used:
  – Refinement 1: "Make band thicker"
  – Refinement 2: "Add side diamonds"
  – etc.
• Each with timestamp
• Click to view that version

## 10. MOBILE LAYOUT
• Stack panels vertically
• Image viewer full width at top
• Refinement controls below
• Sticky "Generate Refinement" button at bottom
• Version history as horizontal scrollable carousel

## 11. SAVE & FINISH SECTION
When user is happy with design:
• "Save to My Designs" button (if logged in)
• "Download High-Res Image" button
• "Share this design" button
• "Create new variation" → Goes back to form with same gem data pre-filled

## ERROR HANDLING
• If refinement fails: Keep previous version, show error, allow retry
• If unclear prompt: Show suggestion to be more specific
• If conflicting instructions: "This might conflict with previous changes. Continue anyway?"

## STYLING
• Clean, focused interface
• Minimal distractions
• Focus on the design image
• Smooth animations for version transitions
• Keyboard shortcuts (optional):
  – Enter to generate
  – Esc to close comparisons
  – Arrow keys to navigate versions
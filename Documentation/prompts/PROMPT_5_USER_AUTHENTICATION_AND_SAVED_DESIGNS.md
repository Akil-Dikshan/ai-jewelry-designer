# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 5: User Authentication & Saved Designs

## PROMPT 5: USER AUTHENTICATION & SAVED DESIGNS

### BUILD USER ACCOUNT SYSTEM

## 1. AUTHENTICATION PAGES

### A. SIGN UP PAGE:
• Email input
• Password input (with strength indicator)
• Confirm password
• Optional: Name input
• Checkbox: "I agree to Terms & Privacy Policy"
• "Create Account" button
• Link: "Already have account? Sign in"
• Social login options (optional):
  – "Continue with Google"
  – "Continue with Facebook"

### B. SIGN IN PAGE:
• Email input
• Password input
• "Remember me" checkbox
• "Forgot password?" link
• "Sign In" button
• Link: "Don't have account? Sign up"
• Social login options (same as signup)

### C. FORGOT PASSWORD PAGE:
• Email input
• "Send reset link" button
• Confirmation message after submission
• Link: "Back to sign in"

### D. PASSWORD RESET PAGE:
• New password input
• Confirm new password input
• "Reset Password" button
• Success message

## 2. USER DASHBOARD

### HEADER:
• Welcome message: "Welcome back, [User Name]!"
• Navigation menu:
  – My Designs
  – Create New Design
  – Account Settings
  – Sign Out

### MAIN CONTENT - MY DESIGNS:

### A. DESIGNS GRID:
• Display all saved designs as cards
• Each card shows:
  – Thumbnail of final design
  – Gem type and cut (subtitle)
  – Date created
  – Number of refinements made
  – Actions menu (3 dots):
    • View & Edit
    • Download
    • Duplicate (create new design with same gem)
    • Delete
    • Share

### B. FILTERS & SORTING:

**Filter by:**
• Gem type (dropdown)
• Date range
• Refinement status (Original only, Refined, All)

**Sort by:**
• Newest first
• Oldest first
• Most refined
• Gem type (A-Z)

### C. SEARCH:
• Search bar: "Search your designs..."
• Searches in gem type, prompt text, design notes

### D. EMPTY STATE:
If no designs saved:
• Illustration of gems/jewelry
• Message: "You haven't created any designs yet"
• "Create Your First Design" large button

### E. DESIGN DETAIL VIEW:
When clicking a design card:
• Full-screen modal OR separate page
• Shows:
  – All versions of the design
  – Original prompt and refinement history
  – Gem specifications
  – Download options (individual images or all as ZIP)
  – Edit/Continue refining button
  – Share options
  – Delete design button

## 3. ACCOUNT SETTINGS PAGE

### A. PROFILE SECTION:
• Name
• Email (not editable, or with verification)
• Profile photo upload (optional)
• "Save Changes" button

### B. PASSWORD SECTION:
• Current password
• New password
• Confirm new password
• "Update Password" button

### C. PREFERENCES:

**Email notifications:**
• New features announcements
• Design tips and inspiration
• Account activity

**Default number of design variations:** 2, 3, or 4

**Default refinement strength:** Subtle, Moderate, Major

**Theme:** Light/Dark mode (optional)

### D. USAGE & LIMITS:
Display:
• Total designs created: [number]
• Refinements used this month: [X] / [limit]
• Storage used: [X MB] / [limit]
• Link to upgrade plan (future premium feature)

### E. DANGER ZONE:
• "Delete Account" button
• Confirmation modal before deletion
• Warning about data loss

## 4. ACCOUNT-BASED FEATURES

### A. AUTO-SAVE:
When signed in, automatically save:
• Form inputs as drafts
• Generated designs
• Refinement history
• Show "Saved" indicator

### B. DESIGN SHARING:
• Generate shareable link for any design
• Options:
  – Public link (anyone with link can view)
  – Password-protected
  – Expiration date
• Show number of views (optional)
• Revoke access button

### C. DESIGN COLLECTIONS:
Allow users to organize designs into folders:
• "Engagement Rings"
• "Pendants"
• "Client Projects"
• etc.
• Drag-and-drop to organize

### D. EXPORT OPTIONS:
• Download single design
• Download all designs in a collection
• Export design data as JSON (for developers)
• Generate PDF report with specs

## 5. GUEST USER EXPERIENCE
For users NOT signed in:
• Can still use design generator
• Designs stored in browser (localStorage)
• Warning: "Sign in to save permanently"
• After generating designs:
  – Persistent banner: "Create account to save this design"
  – Time-limited: "This design will be deleted in 24 hours"
• Easy upgrade path:
  – "Save this design" button → Sign up modal
  – After signup, migrate localStorage designs to account

## 6. ONBOARDING FLOW
For new users after signup:
• Welcome screen with brief tutorial
• Show 3-4 key features:
  – Upload gems and describe your vision
  – AI generates multiple concepts
  – Refine with natural language
  – Save and share your designs
• "Start Creating" button
• Skip option: "I'll explore on my own"

## 7. DATA STRUCTURE

### User Object:
```json
{
  user_id: string,
  email: string,
  name: string,
  created_at: timestamp,
  profile_photo_url: string | null,
  preferences: {
    notifications: object,
    default_variations: number,
    theme: string
  },
  subscription_tier: "free" | "premium"
}
```

### Design Object:
```json
{
  design_id: string,
  user_id: string,
  gem_data: {
    type: string,
    cut: string,
    size: object,
    color: string,
    transparency: string,
    image_url: string | null
  },
  original_prompt: string,
  material_preferences: object,
  generated_images: array[string],
  selected_image_url: string,
  refinement_history: array[{
    prompt: string,
    image_url: string,
    timestamp: timestamp
  }],
  folder_id: string | null,
  is_favorite: boolean,
  share_settings: object,
  created_at: timestamp,
  updated_at: timestamp
}
```

## SECURITY
• Password hashing (bcrypt or similar)
• Email verification required
• Rate limiting on login attempts
• Secure session management
• HTTPS only
• CSRF protection
• Input sanitization
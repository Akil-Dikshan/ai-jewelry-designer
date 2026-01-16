# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 8: Database Schema & Data Models

## PROMPT 8: DATABASE SCHEMA & DATA MODELS

### DATABASE SCHEMA DESIGN

Use Firebase Firestore, Supabase (PostgreSQL), or MongoDB

## USERS COLLECTION/TABLE

```javascript
users {
  id: string (UUID, primary key)
  email: string (unique, indexed)
  password_hash: string (if using email/password auth)
  full_name: string | null
  profile_photo_url: string | null
  auth_provider: string ("email" | "google" | "facebook")
  email_verified: boolean (default false)
  
  preferences: {
    email_notifications: {
      new_features: boolean (default true)
      design_tips: boolean (default true)
      account_activity: boolean (default true)
    },
    default_num_variations: number (default 3)
    default_refinement_strength: number (default 0.5)
    theme: string ("light" | "dark", default "light")
  }
  
  subscription: {
    tier: string ("free" | "premium", default "free")
    started_at: timestamp | null
    expires_at: timestamp | null
  }
  
  usage_stats: {
    total_designs_created: number (default 0)
    total_refinements_used: number (default 0)
    designs_this_month: number (default 0, reset monthly)
    refinements_this_month: number (default 0, reset monthly)
    last_design_created_at: timestamp | null
  }
  
  created_at: timestamp (auto-generated)
  updated_at: timestamp (auto-updated)
  last_login_at: timestamp | null
}
```

**INDEXES:**
• email (unique)
• created_at (for analytics)

## DESIGNS COLLECTION/TABLE

```javascript
designs {
  id: string (UUID, primary key)
  user_id: string (foreign key to users.id, indexed, nullable for guest users)
  
  gem_data: {
    type: string ("Diamond" | "Sapphire" | "Ruby" | etc.)
    cut: string ("Round" | "Oval" | "Cushion" | etc.)
    size: {
      simple: string | null ("Small" | "Medium" | "Large")
      dimensions: {
        length_mm: number | null
        width_mm: number | null
        height_mm: number | null
      } | null
      carat_weight: number | null
    }
    color: string
    transparency: string ("Transparent" | "Semi-transparent" | "Opaque")
    uploaded_image_url: string | null
  }
  
  original_prompt: string (max 1000 chars)
  
  material_preferences: {
    metals: array[string] (["Yellow Gold", "Platinum", etc.])
    finish: string | null ("Polished" | "Matte" | "Hammered")
  }
  
  num_variations_requested: number (2-4)
  
  generated_images: array[{
    image_id: string
    image_url: string (full resolution)
    thumbnail_url: string (300px)
    generation_parameters: object (for debugging)
    generated_at: timestamp
  }]
  
  selected_image_id: string | null (references image_id from generated_images)
  
  refinements: array[{
    refinement_id: string
    prompt: string
    base_image_id: string (which version this refines)
    refined_image_url: string
    refined_thumbnail_url: string
    refinement_strength: number (0.0-1.0)
    preserve_elements: array[string]
    refined_at: timestamp
  }]
  
  current_version: {
    type: string ("original" | "refinement")
    image_id: string (references either generated_images or refinements)
  }
  
  folder_id: string | null (for organization, future feature)
  is_favorite: boolean (default false)
  is_deleted: boolean (default false, soft delete)
  
  share_settings: {
    is_shared: boolean (default false)
    share_token: string | null (unique, for public links)
    password_protected: boolean (default false)
    password_hash: string | null
    expires_at: timestamp | null
    view_count: number (default 0)
  }
  
  metadata: {
    total_generation_cost: number (USD, for analytics)
    total_generation_time: number (seconds)
    device_info: string | null (browser, mobile, etc.)
    ip_address: string | null (for anti-abuse)
  }
  
  created_at: timestamp (auto-generated)
  updated_at: timestamp (auto-updated)
}
```

**INDEXES:**
• user_id (for querying user's designs)
• created_at (for sorting)
• is_favorite (for filtering)
• share_token (unique, for public access)
• folder_id (for organization)

**COMPOUND INDEXES:**
• (user_id, created_at) (for user timeline)
• (user_id, is_favorite) (for favorites filtering)

## FOLDERS COLLECTION/TABLE (Optional)

```javascript
folders {
  id: string (UUID, primary key)
  user_id: string (foreign key to users.id, indexed)
  name: string (max 100 chars)
  description: string | null (max 500 chars)
  color: string | null (hex code for UI)
  icon: string | null (emoji or icon name)
  sort_order: number (for custom ordering)
  created_at: timestamp
  updated_at: timestamp
}
```

**INDEXES:**
• user_id
• (user_id, sort_order)

## API_USAGE_LOG TABLE (For cost tracking)

```javascript
api_usage_log {
  id: string (UUID, primary key)
  user_id: string | null (indexed)
  design_id: string | null (indexed)
  api_type: string ("generation" | "refinement")
  model_used: string ("gemini-2.5-flash-image")
  
  request: {
    prompt: string
    num_images: number
    parameters: object
  }
  
  response: {
    success: boolean
    num_images_returned: number
    error_message: string | null
  }
  
  cost_usd: number (calculated)
  generation_time_seconds: number
  ip_address: string (for rate limiting)
  created_at: timestamp (indexed for time-based queries)
}
```

**INDEXES:**
• user_id
• created_at (for analytics)
• (user_id, created_at) (for user usage reports)

## GUEST_SESSIONS TABLE (For non-logged-in users)

```javascript
guest_sessions {
  session_id: string (UUID, primary key)
  ip_address: string (indexed, for rate limiting)
  designs: array[string] (design_ids, stored temporarily)
  usage_count: number (designs generated today)
  last_design_at: timestamp
  expires_at: timestamp (auto-delete after 24-48 hours)
  created_at: timestamp
}
```

**INDEXES:**
• ip_address
• expires_at (for cleanup jobs)

## SHARED_DESIGNS_ACCESS LOG (Optional, for analytics)

```javascript
shared_designs_access {
  id: string (UUID, primary key)
  design_id: string (indexed)
  share_token: string (indexed)
  viewer_ip: string
  viewer_country: string | null (from IP)
  viewer_device: string | null (User-Agent parsing)
  viewed_at: timestamp (indexed)
}
```

**INDEXES:**
• design_id
• share_token
• viewed_at (for time-based analytics)

## DATA RELATIONSHIPS

### USER → DESIGNS: One-to-many
• One user can have many designs
• Cascade delete: If user deleted, delete their designs (or archive)

### USER → FOLDERS: One-to-many
• One user can have many folders
• Cascade delete

### FOLDER → DESIGNS: One-to-many
• One folder can contain many designs
• On folder delete: Set design.folder_id to null (don't delete designs)

### DESIGN → API_USAGE_LOG: One-to-many
• One design can have multiple API calls (initial + refinements)
• Keep logs even if design deleted (for billing)

## DATA RETENTION POLICY

### GUEST USERS:
• Designs stored for 24 hours
• After 24 hours: Auto-delete or prompt to sign up

### REGISTERED USERS (FREE TIER):
• Designs stored indefinitely
• Option to delete manually
• If inactive for 1 year: Email warning before deletion (optional)

### DELETED DESIGNS:
• Soft delete initially (is_deleted = true)
• Hard delete after 30 days
• Images also deleted from storage

### API LOGS:
• Keep for 90 days minimum (for billing disputes)
• Aggregate older data for long-term analytics

## BACKUP & RECOVERY

• Daily automated backups
• Point-in-time recovery capability
• Test restoration quarterly
• Store backups in different region/provider

## SECURITY

• Encrypt sensitive fields (password_hash, share passwords)
• Use row-level security (RLS) if using Supabase
• Never expose user emails publicly
• Sanitize user-generated content (prompts)
• Rate limiting based on user_id and ip_address
• Audit logs for critical operations (account deletion, etc.)
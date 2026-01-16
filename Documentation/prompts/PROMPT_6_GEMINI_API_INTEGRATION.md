# Complete Antigravity Prompt Package
## AI Jewelry Designer Documentation
### Part 6: Gemini API Integration

## PROMPT 6: GEMINI API INTEGRATION

### INTEGRATE GOOGLE GEMINI 2.5 FLASH IMAGE API

### CRITICAL REQUIREMENTS:
• API key must NEVER be exposed in frontend code
• All API calls must go through secure backend endpoint
• Implement proper error handling and retries
• Track API usage for cost management

## 1. BACKEND API ENDPOINTS

### A. ENDPOINT: /api/generate-design
**Method:** POST  
**Purpose:** Initial design generation

**REQUEST BODY:**
```json
{
  gem_data: {
    type: string,
    cut: string,
    size: string | object,
    color: string,
    transparency: string,
    image_base64: string | null
  },
  user_prompt: string,
  materials: {
    metals: array[string],
    finish: string
  },
  num_variations: number (2-4)
}
```

**BACKEND PROCESSING:**

1. Validate inputs
2. Construct enhanced prompt:
```javascript
const enhancedPrompt = `
Professional jewelry photography of ${user_prompt}.

Gemstone details:
- Type: ${gem_data.type}
- Cut: ${gem_data.cut} cut
- Size: ${gem_data.size}
- Color: ${gem_data.color}
- Transparency: ${gem_data.transparency}

Materials: ${materials.metals.join(', ')}
Finish: ${materials.finish}

Style: Photorealistic, high-end jewelry render, 
studio lighting, white background, 
professional product photography quality, 
sharp focus on gemstone, 
accurate light refraction and reflections.
`;
```

3. Call Gemini API:
```javascript
const geminiRequest = {
  model: "gemini-2.5-flash-image",
  prompt: enhancedPrompt,
  image: gem_data.image_base64 || null,
  num_images: num_variations,
  aspect_ratio: "1:1",
  safety_settings: {
    // Configure as needed
  }
};
```

4. Receive generated images from Gemini
5. Upload images to cloud storage (S3, Cloudinary, etc.)
6. Generate URLs for images
7. Save to database if user is authenticated

**RESPONSE:**
```json
{
  success: boolean,
  design_id: string,
  images: array[{
    image_url: string,
    image_id: string
  }],
  metadata: {
    generation_time: number,
    cost: number
  }
}
```

**ERROR RESPONSES:**
• 400: Invalid input
• 429: Rate limit exceeded
• 500: API error
• 503: Gemini API unavailable

### B. ENDPOINT: /api/refine-design
**Method:** POST  
**Purpose:** Refinement with image-to-image editing

**REQUEST BODY:**
```json
{
  design_id: string,
  selected_image_url: string,
  refinement_prompt: string,
  refinement_strength: number (0.0-1.0),
  preserve_elements: array[string]
}
```

**BACKEND PROCESSING:**

1. Fetch original design data
2. Download selected image
3. Construct refinement prompt:
```javascript
const refinementPrompt = `
Based on this jewelry design, make the following 
modification: ${refinement_prompt}

Maintain the overall style and quality. Keep the 
${gem_data.type} ${gem_data.cut} gemstone 
in the same position and proportion.

${preserve_elements.length > 0 ?
  `Preserve these elements: 
  ${preserve_elements.join(', ')}` : ''}

Style: Continue with photorealistic jewelry render, 
studio lighting, white background.
`;
```

4. Call Gemini API with image-to-image mode:
```javascript
const geminiRequest = {
  model: "gemini-2.5-flash-image",
  mode: "edit",
  base_image: selected_image_base64,
  prompt: refinementPrompt,
  strength: refinement_strength,
  num_images: 1
};
```

5. Save refined image
6. Update design history

**RESPONSE:**
```json
{
  success: boolean,
  refined_image_url: string,
  version_number: number
}
```

## 2. PROMPT ENGINEERING BEST PRACTICES

### QUALITY KEYWORDS to include:
• "Professional jewelry photography"
• "Studio lighting"
• "High-end render"
• "Photorealistic"
• "Sharp focus"
• "Accurate light refraction"
• "Product photography quality"
• "White background" or "Neutral background"

### TECHNICAL DETAILS to include:
• Specific gem cut terminology
• Metal types and finishes
• Setting styles (prong, bezel, pave, etc.)
• Scale references if important

### STYLE MODIFIERS based on user prompt:
• If "vintage": Add "Art deco details", "Filigree work", "Antique styling"
• If "modern": Add "Clean lines", "Minimalist", "Contemporary"
• If "ornate": Add "Intricate details", "Embellishments", "Decorative elements"

### NEGATIVE PROMPTS (what to avoid):
• "cartoon", "illustration", "sketch"
• "blurry", "low quality", "amateur"
• "unrealistic", "fantasy", "impossible geometry"

## 3. IMAGE PROCESSING

### UPLOADED GEM IMAGES:
• Resize to max 2048px on longest side
• Compress to reasonable file size (500KB-1MB)
• Convert to supported format (JPEG, PNG)
• Basic validation: Check if image contains recognizable object

### GENERATED IMAGES:
• Request high resolution from Gemini
• Store both thumbnail (300px) and full size
• Optimize for web delivery
• Generate alt text for accessibility

## 4. RATE LIMITING & COST MANAGEMENT

### IMPLEMENT:

**Rate limiting per user:**
• Free tier: 5 generations per day
• After signup: 20 generations per day
• Premium: Unlimited (future)

**Rate limiting per IP (for guest users):**
• 3 generations per hour

**Caching:**
• Cache identical prompts + gem data combinations
• Check cache before calling API
• Save API costs on duplicate requests

**Cost tracking:**
• Log every API call with cost
• Daily/monthly budget alerts
• Dashboard for monitoring spend

## 5. ERROR HANDLING

### HANDLE THESE SCENARIOS:
• API timeout: Retry up to 3 times with exponential backoff
• Rate limit: Show user-friendly message, offer to try again later
• Invalid content: Rare, but handle safety filter rejections
• Network errors: Retry logic
• Malformed responses: Log for debugging, show generic error to user

### USER-FACING ERROR MESSAGES:
• Generic: "We couldn't generate your design. Please try again."
• Rate limit: "You've reached your daily limit. Sign up for more designs!"
• Timeout: "This is taking longer than usual. Please try again."
• Invalid input: "Please check your inputs and try again."

## 6. SECURITY CONSIDERATIONS

### CRITICAL:
• Store API key in environment variables
• Never send API key to frontend
• Validate all user inputs server-side
• Sanitize user prompts (remove injection attempts)
• Implement CORS properly
• Use HTTPS for all API calls
• Rate limit by user ID AND IP address
• Log suspicious activity

## 7. TESTING

### TEST CASES:
• Generate design with all fields filled
• Generate design with minimal fields
• Generate with uploaded image
• Generate without uploaded image
• Refinement with subtle changes
• Refinement with major changes
• Multiple refinements in sequence
• Edge cases: Very long prompts, special characters
• Error scenarios: Invalid API key, network failure
• Concurrent requests from same user

### MONITOR:
• API response times
• Success/failure rates
• Average generation time
• Cost per generation
• User satisfaction (implicit: refinement rate)
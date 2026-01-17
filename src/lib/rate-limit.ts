/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting (upgrade to Redis for production)
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limits
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

// Rate limit configurations
const RATE_LIMITS = {
    // By IP for guests
    guest: {
        maxRequests: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    // By user ID for authenticated users
    user: {
        maxRequests: parseInt(process.env.RATE_LIMIT_PER_DAY || '20', 10),
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
    },
    // For refinements
    refinement: {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
};

type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Generate a rate limit key
 */
function generateKey(type: RateLimitType, identifier: string): string {
    return `${type}:${identifier}`;
}

/**
 * Clean up expired entries (call periodically)
 */
function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Check if a request is allowed under rate limits
 */
export function checkRateLimit(
    type: RateLimitType,
    identifier: string
): { allowed: boolean; remaining: number; resetTime: number } {
    const key = generateKey(type, identifier);
    const config = RATE_LIMITS[type];
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // If no entry or expired, create new one
    if (!entry || now > entry.resetTime) {
        entry = {
            count: 0,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);
    }

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const allowed = entry.count < config.maxRequests;

    return {
        allowed,
        remaining: allowed ? remaining - 1 : 0,
        resetTime: entry.resetTime,
    };
}

/**
 * Increment the rate limit counter
 */
export function incrementRateLimit(
    type: RateLimitType,
    identifier: string
): void {
    const key = generateKey(type, identifier);
    const entry = rateLimitStore.get(key);

    if (entry) {
        entry.count += 1;
        rateLimitStore.set(key, entry);
    }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(
    type: RateLimitType,
    identifier: string
): Record<string, string> {
    const result = checkRateLimit(type, identifier);
    const config = RATE_LIMITS[type];

    return {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    };
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
    // Try common headers for real IP (behind proxy/CDN)
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback
    return 'unknown';
}

export { RATE_LIMITS };

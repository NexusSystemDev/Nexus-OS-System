// Simple In-Memory Rate Limiter for Next.js API Routes
const cache = new Map();

/**
 * @param {string} ip - Unique identifier for the client (IP address)
 * @param {number} limit - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, remaining: number}>}
 */
export async function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userData = cache.get(ip) || { count: 0, resetTime: now + windowMs };

  // Reset if time window passed
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + windowMs;
  }

  userData.count += 1;
  cache.set(ip, userData);

  return {
    success: userData.count <= limit,
    remaining: Math.max(0, limit - userData.count),
    reset: userData.resetTime
  };
}

// Cleanup old cache entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of cache.entries()) {
      if (now > data.resetTime) cache.delete(ip);
    }
  }, 600000);
}

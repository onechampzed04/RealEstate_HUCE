import NodeCache from "node-cache";

/**
 * Advanced in-memory cache for API responses
 */
const cache = new NodeCache({
  stdTTL: 300, // Default 5 minutes
  checkperiod: 60,
  useClones: false,
});

/**
 * Default structured key generator
 */
const defaultKeyGenerator = (req) => {
  const base = `${req.baseUrl}${req.path}`;

  // Sort query params to avoid duplicate keys
  const queryKeys = Object.keys(req.query).sort();

  const normalizedQuery = queryKeys.map((key) => {
    const value = req.query[key];

    // Nếu là object (ví dụ sort) thì serialize theo cách sắp xếp key bên trong để tránh trùng lặp cache
    if (typeof value === "object" && value !== null) {
      const sortedObjectKeys = Object.keys(value).sort();
      const normalizedObject = sortedObjectKeys
        .map((k) => `${k}:${value[k]}`)
        .join(",");

      return `${key}:{${normalizedObject}}`;
    }

    return `${key}:${value}`;
  });

  return normalizedQuery.length
    ? `${base}?${normalizedQuery.join("&")}`
    : base;
};

/**
 * Cache middleware factory
 * @param {Object} options
 * @param {number} options.ttl - Time to live (seconds)
 * @param {Function} options.keyGenerator - Custom key generator
 * @param {boolean} options.debug - Log cache hit/miss
 */
export const cacheMiddleware = ({
  ttl = 300,
  keyGenerator = defaultKeyGenerator,
  debug = false,
} = {}) => {
  return (req, res, next) => {
    console.log("🔵 cacheMiddleware hit:", req.method, req.originalUrl);
    if (req.method !== "GET") {
      return next();
    }

    const key = keyGenerator(req);
    console.log("🔑 Cache key:", key); // ← thêm dòng này

    const cachedResponse = cache.get(key);
    console.log("📦 Cache value:", cachedResponse ? "HIT" : "MISS");

    if (cachedResponse) {
      if (debug) console.log(`[CACHE HIT] ${key}`);
      return res.json(cachedResponse);
    }

    if (debug) console.log(`[CACHE MISS] ${key}`);

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      console.log("💾 Saving to cache key:", key);
      cache.set(key, body, ttl);
      return originalJson(body);
    };

    next();
  };
};

/**
 * Clear cache by prefix (safer than includes)
 * @param {string} prefix
 */
export const clearCacheByPrefix = (prefix) => {
  const keys = cache.keys().filter((key) => key.startsWith(prefix));
  cache.del(keys);
  return keys.length;
};

/**
 * Clear specific key
 */
export const clearCacheKey = (key) => {
  cache.del(key);
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll();
};

export default cache;

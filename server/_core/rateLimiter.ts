/**
 * Rate Limiting & Anti-Spam Protection
 * Prevents abuse of contact forms, search, and API endpoints
 */

import express from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000); // Clean every minute

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(
  options: {
    windowMs?: number; // Time window in milliseconds (default: 15 minutes)
    maxRequests?: number; // Max requests per window (default: 100)
    keyGenerator?: (req: express.Request) => string; // Custom key generator
    message?: string; // Custom error message
  } = {}
) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const maxRequests = options.maxRequests || 100;
  const keyGenerator = options.keyGenerator || ((req) => req.ip || "unknown");
  const message = options.message || "Too many requests, please try again later.";

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    if (store[key].resetTime < now) {
      // Reset window
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      res.status(429).json({ error: message });
      return;
    }

    // Add rate limit info to response headers
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", (maxRequests - store[key].count).toString());
    res.setHeader("X-RateLimit-Reset", store[key].resetTime.toString());

    next();
  };
}

/**
 * Specific rate limiter for contact forms
 * Stricter limits to prevent spam
 */
export function contactFormRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  return createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // Max 5 contact form submissions per hour
    keyGenerator: (req) => req.ip || "unknown",
    message: "Too many contact form submissions. Please try again later.",
  })(req, res, next);
}

/**
 * Specific rate limiter for search queries
 */
export function searchRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  return createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // Max 30 searches per minute
    keyGenerator: (req) => req.ip || "unknown",
    message: "Too many search requests. Please slow down.",
  })(req, res, next);
}

/**
 * Anti-spam validation for contact form
 */
export function validateContactForm(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!data.email || typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.message || typeof data.message !== "string" || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  // Check for spam patterns
  const message = data.message?.toLowerCase() || "";
  const spamKeywords = ["viagra", "casino", "lottery", "click here", "buy now", "limited offer"];

  for (const keyword of spamKeywords) {
    if (message.includes(keyword)) {
      errors.push("Message contains suspicious content");
      break;
    }
  }

  // Check for excessive URLs
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    errors.push("Message contains too many URLs");
  }

  // Check for excessive special characters
  const specialCharCount = (message.match(/[!@#$%^&*()_+=[\]{};':"\\|,.<>?/]/g) || []).length;
  if (specialCharCount > message.length * 0.3) {
    errors.push("Message contains too many special characters");
  }

  // Check message length
  if (data.message && data.message.length > 5000) {
    errors.push("Message is too long (max 5000 characters)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Honeypot field validation (anti-bot)
 */
export function validateHoneypot(honeypot: any): boolean {
  // If honeypot field is filled, it's likely a bot
  return !honeypot || honeypot.trim().length === 0;
}

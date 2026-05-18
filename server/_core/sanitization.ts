/**
 * Input Sanitization & XSS Protection
 * Prevents injection attacks and script execution
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

/**
 * Sanitize HTML content while preserving safe formatting
 */
export function sanitizeHTML(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  let sanitized = sanitizeString(input);

  // Remove script tags and dangerous attributes
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/vbscript:/gi, "");

  return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: unknown): string {
  const sanitized = sanitizeString(input);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return "";
  }

  return sanitized.toLowerCase();
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(input: unknown): string {
  const sanitized = sanitizeString(input);
  // Allow only digits, +, -, (), and spaces
  return sanitized.replace(/[^0-9+\-() ]/g, "");
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeURL(input: unknown): string {
  const sanitized = sanitizeString(input);

  // Reject dangerous protocols
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];
  const lowerSanitized = sanitized.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerSanitized.startsWith(protocol)) {
      return "";
    }
  }

  // Validate URL format
  try {
    new URL(sanitized, "https://example.com");
    return sanitized;
  } catch {
    return "";
  }
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(input: unknown): string {
  let sanitized = sanitizeString(input);

  // Remove special regex characters to prevent ReDoS
  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Limit to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  return sanitized;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(input: unknown): string {
  let sanitized = sanitizeString(input);

  // Remove path separators and null bytes
  sanitized = sanitized.replace(/[\/\\:*?"<>|]/g, "");

  // Remove leading/trailing dots
  sanitized = sanitized.replace(/^\.+|\.+$/g, "");

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized || "file";
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key);

    if (typeof value === "string") {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized;
}

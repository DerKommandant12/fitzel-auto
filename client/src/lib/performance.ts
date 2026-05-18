/**
 * Performance Optimization Utilities
 * Lazy loading, image optimization, and SEO enhancements
 */

/**
 * Lazy load images using Intersection Observer
 */
export function setupLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      htmlImg.src = htmlImg.dataset.src || "";
      htmlImg.removeAttribute("data-src");
    });
  }
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(imageUrl: string): string {
  if (!imageUrl) return "";

  // For Manus storage URLs, we can't modify them
  // For external URLs, we could add width parameters
  return imageUrl;
}

/**
 * Optimize image loading with blur-up effect
 */
export function getBlurredPlaceholder(width: number = 10, height: number = 10): string {
  // Create a simple SVG placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}'/%3E%3C/svg%3E`;
}

/**
 * Preload critical images
 */
export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch DNS for external domains
 */
export function prefetchDNS(domains: string[]) {
  domains.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

/**
 * Update meta tags for SEO
 */
export function updateMetaTags(metadata: {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}) {
  // Update title
  if (metadata.title) {
    document.title = metadata.title;
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) {
      ogTitle.setAttribute("content", metadata.title);
    }
  }

  // Update description
  if (metadata.description) {
    let descMeta = document.querySelector("meta[name='description']");
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", metadata.description);

    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc) {
      ogDesc.setAttribute("content", metadata.description);
    }
  }

  // Update keywords
  if (metadata.keywords) {
    let keywordsMeta = document.querySelector("meta[name='keywords']");
    if (!keywordsMeta) {
      keywordsMeta = document.createElement("meta");
      keywordsMeta.setAttribute("name", "keywords");
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute("content", metadata.keywords);
  }

  // Update OG image
  if (metadata.ogImage) {
    let ogImage = document.querySelector("meta[property='og:image']");
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", metadata.ogImage);
  }

  // Update OG URL
  if (metadata.ogUrl) {
    let ogUrl = document.querySelector("meta[property='og:url']");
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", metadata.ogUrl);
  }

  // Update canonical
  if (metadata.canonical) {
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", metadata.canonical);
  }
}

/**
 * Debounce function for performance-sensitive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure Core Web Vitals
 */
export function measureWebVitals() {
  // Largest Contentful Paint (LCP)
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.log("LCP measurement not supported");
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            console.log("CLS:", clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.log("CLS measurement not supported");
    }
  }
}

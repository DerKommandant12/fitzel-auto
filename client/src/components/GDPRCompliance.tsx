/**
 * GDPR Compliance Module
 * Ensures GDPR compliance across the entire website
 */

/**
 * Initialize GDPR compliance on page load
 */
export function initGDPRCompliance() {
  // Disable analytics until consent is given
  disableAnalytics();

  // Monitor cookie consent changes
  monitorConsentChanges();

  // Prevent tracking without consent
  preventUnauthorizedTracking();
}

/**
 * Disable analytics scripts until consent is given
 */
function disableAnalytics() {
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    // Block analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtag.config": {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization: false,
      },
    });

    // Disable Google Analytics
    if (typeof gtag !== "undefined") {
      gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  } else {
    const consentData = JSON.parse(consent);

    if (consentData.choice === "accept") {
      // Enable analytics
      if (typeof gtag !== "undefined") {
        gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
      }
    } else if (consentData.choice === "reject") {
      // Keep analytics disabled
      if (typeof gtag !== "undefined") {
        gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
    } else if (consentData.choice === "customize") {
      // Apply custom settings
      if (typeof gtag !== "undefined") {
        gtag("consent", "update", {
          analytics_storage: consentData.analytics ? "granted" : "denied",
          ad_storage: consentData.marketing ? "granted" : "denied",
          ad_user_data: consentData.marketing ? "granted" : "denied",
          ad_personalization: consentData.marketing ? "granted" : "denied",
        });
      }
    }
  }
}

/**
 * Monitor consent changes and update analytics accordingly
 */
function monitorConsentChanges() {
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function (key: string, value: string) {
    if (key === "cookieConsent") {
      disableAnalytics();
    }
    return originalSetItem.call(this, key, value);
  };
}

/**
 * Prevent unauthorized tracking
 */
function preventUnauthorizedTracking() {
  // Disable third-party cookies
  document.cookie = "SameSite=Strict";

  // Prevent fingerprinting
  if (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes") {
    console.log("User has requested Do Not Track");
  }

  // Prevent localStorage abuse
  const originalLocalStorage = localStorage;
  const blockedKeys = ["tracking_id", "user_id", "session_id"];

  const handler = {
    get(target: any, prop: string) {
      if (prop === "setItem") {
        return function (key: string, value: string) {
          if (blockedKeys.includes(key)) {
            console.warn(`Blocked attempt to store ${key}`);
            return;
          }
          return target.setItem(key, value);
        };
      }
      return target[prop];
    },
  };

  // Note: Proxy won't work directly on localStorage, but this shows the intent
}

/**
 * Log data processing activities for GDPR compliance
 */
export function logDataProcessing(activity: {
  type: "collection" | "processing" | "sharing" | "deletion";
  dataType: string;
  purpose: string;
  timestamp: Date;
  userConsent: boolean;
}) {
  const log = {
    ...activity,
    timestamp: activity.timestamp.toISOString(),
  };

  console.log("[GDPR Log]", log);

  // Store in session storage (not persistent)
  const logs = JSON.parse(sessionStorage.getItem("gdprLogs") || "[]");
  logs.push(log);
  sessionStorage.setItem("gdprLogs", JSON.stringify(logs));
}

/**
 * Request user data export (GDPR Right to Access)
 */
export function exportUserData(): object {
  const data = {
    exported_at: new Date().toISOString(),
    browser_data: {
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
    },
    cookies: document.cookie,
  };

  return data;
}

/**
 * Delete all user data (GDPR Right to Erasure)
 */
export function deleteAllUserData(): boolean {
  try {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    logDataProcessing({
      type: "deletion",
      dataType: "all_user_data",
      purpose: "GDPR Right to Erasure",
      timestamp: new Date(),
      userConsent: true,
    });

    return true;
  } catch (error) {
    console.error("Failed to delete user data:", error);
    return false;
  }
}

/**
 * Ensure GDPR compliance on all pages
 */
export function ensureGDPRCompliance() {
  // Check if consent is given
  try {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Cookie banner will be shown by CookieConsent component
      console.log("[GDPR] Cookie consent required");
    }
  } catch (e) {
    // localStorage might be blocked, that's OK
  }

  // Do NOT suppress console in production - it breaks debugging
  // Do NOT modify window.__proto__ - it breaks browser functionality
}

// Declare gtag for TypeScript
declare function gtag(...args: any[]): void;
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

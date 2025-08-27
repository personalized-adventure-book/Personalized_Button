// @ts-nocheck
// ─── CONFIG ──────────────────────────────────────────────────────────────
const TRACK_URL =
  "https://script.google.com/macros/s/AKfycbyMjjjEJPOVMg6Isus6Wn07OIFqS_-X66mwZWMEiN0ygV9XUKkOluAaHvYgNl_0g3NC/exec";
const SESSION_KEY = "adv_sessionId";

// Generate (once) a sessionId and stick it in localStorage
function getSessionId() {
  // Only run on client side
  if (typeof window === "undefined") {
    return "ssr-session";
  }

  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      new Date().toISOString().replace(/[:.TZ]/g, "-") +
      "-" +
      Math.floor(Math.random() * 900 + 100);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// One helper for ALL events
function sendTrackingEvent(eventName: string, extra: Record<string, any> = {}) {
  // Only send if on client side
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    session: getSessionId(),
    page: window.location.pathname,
    time: new Date().toISOString(),
    ...extra,
  };
  // only send relevant keys (language, field, element, text, value, position, direction)
  try {
    navigator.sendBeacon?.(
      TRACK_URL,
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    ) ||
      fetch(TRACK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(error => {
        console.warn("Tracking service unavailable:", error.message);
      });
  } catch (error) {
    console.warn("Failed to send tracking event:", error.message);
  }
}

// Client-side only tracking
let humanDetected = false;

// Only run on client side
if (typeof window !== "undefined") {
  // ─── HUMAN PROOF (once, on user action) ────────────────────────────────────
  function proveHuman() {
    if (!humanDetected) {
      humanDetected = true;
      sendTrackingEvent("language", {
        language: document.documentElement.lang || "en",
      });
    }
  }
  ["click", "focus", "input", "scroll"].forEach((evt) =>
    document.addEventListener(evt, proveHuman, { once: true, capture: true }),
  );

  // ─── LISTENERS ────────────────────────────────────────────────────────────
  // 1) Page load (only after first user action)
  window.addEventListener("load", () => {
    /* nothing here—will only send on first proveHuman() */
  });

  // 2) Clicks
  document.addEventListener(
    "click",
    (e) => {
      if (!humanDetected) return;
      const t = e.target;
      sendTrackingEvent("click", {
        element: t.tagName.toLowerCase(),
        text: (t.textContent || "").trim().slice(0, 50),
      });
    },
    true,
  );

  // 3) Focus on inputs
  document.addEventListener(
    "focus",
    (e) => {
      if (!humanDetected) return;
      const t = e.target;
      if (t.matches("input,textarea,select")) {
        sendTrackingEvent("focus", {
          field: t.name || t.id || "unnamed",
        });
      }
    },
    true,
  );

  // 4) "Stopped typing" input (2s debounce)
  let inputTimer;
  document.addEventListener(
    "input",
    (e) => {
      if (!humanDetected) return;
      const t = e.target;
      if (!t.matches("input:not([type=file]),textarea")) return;
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        sendTrackingEvent("input", {
          field: t.name || t.id || "unnamed",
          value: t.value.trim().slice(0, 100),
        });
      }, 2000);
    },
    true,
  );

  // 5) Significant scroll (>=200px)
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    if (!humanDetected) return;
    const y = window.scrollY;
    if (Math.abs(y - lastScroll) < 200) return;
    sendTrackingEvent("scroll", {
      position: y,
      direction: y > lastScroll ? "down" : "up",
    });
    lastScroll = y;
  });
}

// Export for compatibility
export const websiteTracker = {
  trackCustomEvent: (eventType, details = {}) => {
    if (humanDetected) {
      sendTrackingEvent(eventType, details);
    }
  },
  getSessionId: () => getSessionId(),
  getUserId: () => getSessionId(),
  getEventCount: () => 0,
  getQueueLength: () => 0,
  flushEvents: () => {},
  trackButtonClick: (name, meta) => {
    if (humanDetected) sendTrackingEvent("button_click", { name, ...meta });
  },
  trackFeatureUsage: (name, meta) => {
    if (humanDetected) sendTrackingEvent("feature_usage", { name, ...meta });
  },
  trackError: (error, meta) => {
    if (humanDetected) sendTrackingEvent("error", { error, ...meta });
  },
};

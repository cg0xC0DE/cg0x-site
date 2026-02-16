const ENDPOINTS = [
  "https://overbrutal-semiexclusively-wilhemina.ngrok-free.dev",
  "https://illaudable-roseanna-unsobering.ngrok-free.dev",
  "https://dentiled-gennie-stichometrical.ngrok-free.dev",
];

// Polyfill for AbortSignal.timeout (iOS Safari < 16.4, Chrome < 103)
function abortTimeout(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && (AbortSignal as any).timeout) {
    return (AbortSignal as any).timeout(ms);
  }
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

export interface ProbeResult {
  endpoint: string;
  healthy: boolean;
  latency: number; // ms, Infinity if unhealthy
}

/**
 * Probe a single endpoint with two strategies:
 * 1. CORS mode — full signal: status code + body check for ngrok errors
 * 2. no-cors fallback — opaque response, but proves server is reachable
 */
async function probeEndpoint(endpoint: string): Promise<ProbeResult> {
  const start = performance.now();

  // --- Strategy 1: CORS with ngrok-skip-browser-warning ---
  // Best signal when backend is running (FastAPI CORS middleware handles OPTIONS preflight)
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      signal: abortTimeout(15000),
      headers: { "ngrok-skip-browser-warning": "1" },
    });

    const latency = performance.now() - start;
    if (!res.ok) return { endpoint, healthy: false, latency: Infinity };

    const text = await res.text();
    const isNgrokError =
      text.includes("ngrok") &&
      (text.includes("ERR_NGROK") || text.includes("Tunnel not found"));

    return { endpoint, healthy: !isNgrokError, latency: isNgrokError ? Infinity : latency };
  } catch {
    // CORS preflight failed or network error
  }

  // --- Strategy 2: CORS without custom header (no preflight) ---
  // Simple request — no OPTIONS preflight needed.
  // Works if ngrok forwards fetch requests directly to backend.
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      signal: abortTimeout(15000),
    });

    const latency = performance.now() - start;
    if (!res.ok) return { endpoint, healthy: false, latency: Infinity };

    const text = await res.text();
    const isNgrokError =
      text.includes("ngrok") &&
      (text.includes("ERR_NGROK") || text.includes("Tunnel not found"));

    return { endpoint, healthy: !isNgrokError, latency: isNgrokError ? Infinity : latency };
  } catch {
    // CORS failed (ngrok interstitial or dead tunnel)
  }

  // --- Strategy 3: no-cors fallback (opaque but proves reachable) ---
  try {
    const res = await fetch(endpoint, {
      method: "HEAD",
      mode: "no-cors",
      signal: abortTimeout(15000),
    });

    const latency = performance.now() - start;

    // opaque response means server responded — mark reachable
    if (res.type === "opaque" || res.ok) {
      return { endpoint, healthy: true, latency };
    }

    return { endpoint, healthy: false, latency: Infinity };
  } catch {
    return { endpoint, healthy: false, latency: Infinity };
  }
}

/**
 * Probe all endpoints concurrently. Returns sorted by latency (fastest first).
 */
export async function probeAll(): Promise<ProbeResult[]> {
  const results = await Promise.allSettled(
    ENDPOINTS.map((ep) => probeEndpoint(ep))
  );

  return results
    .map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { endpoint: "", healthy: false, latency: Infinity }
    )
    .sort((a, b) => a.latency - b.latency);
}

/**
 * Pick the best (fastest healthy) endpoint, or null if all are down.
 */
export async function pickBestEndpoint(): Promise<string | null> {
  const results = await probeAll();
  const best = results.find((r) => r.healthy);
  return best ? best.endpoint : null;
}

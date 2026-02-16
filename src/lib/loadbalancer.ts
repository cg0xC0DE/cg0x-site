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
  console.log("[LB] Probing:", endpoint);
  const start = performance.now();

  // --- Strategy 1: cors mode (best signal) ---
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      signal: abortTimeout(15000),
      headers: { "ngrok-skip-browser-warning": "1" },
    });

    const latency = performance.now() - start;

    if (!res.ok) {
      console.log("[LB] CORS !ok:", endpoint, res.status);
      return { endpoint, healthy: false, latency: Infinity };
    }

    const text = await res.text();
    const isNgrokError =
      text.includes("ngrok") &&
      (text.includes("ERR_NGROK") || text.includes("Tunnel not found"));

    console.log("[LB] CORS ok:", endpoint, "healthy:", !isNgrokError);
    return { endpoint, healthy: !isNgrokError, latency: isNgrokError ? Infinity : latency };
  } catch (e) {
    console.log("[LB] CORS error:", endpoint, e);
    // CORS blocked or network error — try no-cors fallback
  }

  // --- Strategy 2: no-cors fallback (opaque response) ---
  try {
    const ctrl2 = new AbortController();
    const timer2 = setTimeout(() => ctrl2.abort(), 15000);

    await fetch(endpoint, {
      method: "HEAD",
      mode: "no-cors",
      signal: ctrl2.signal,
    });
    clearTimeout(timer2);

    console.log("[LB] no-cors fallback:", endpoint);
    // Server responded but we can't verify it's not an error page
    // (opaque responses hide status code). Mark as unhealthy to avoid
    // false positives when backend is dead but ngrok returns 502.
    return { endpoint, healthy: false, latency: Infinity };
  } catch (e) {
    console.log("[LB] no-cors error:", endpoint, e);
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

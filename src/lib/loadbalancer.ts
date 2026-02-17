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
 * Probe a single endpoint.
 *
 * Requires ngrok to be started with:
 *   --response-header-add "Access-Control-Allow-Origin: *"
 *   --response-header-add "Access-Control-Allow-Methods: *"
 *   --response-header-add "Access-Control-Allow-Headers: *"
 *
 * With those flags ngrok injects CORS headers into every response
 * (including error pages), so a plain CORS GET (no custom headers,
 * no OPTIONS preflight) is enough to read the status and body.
 */
async function probeEndpoint(endpoint: string): Promise<ProbeResult> {
  const start = performance.now();

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      signal: abortTimeout(15000),
    });

    const latency = performance.now() - start;

    if (!res.ok) {
      return { endpoint, healthy: false, latency: Infinity };
    }

    const text = await res.text();
    const isNgrokError =
      text.includes("ngrok") &&
      (text.includes("ERR_NGROK") || text.includes("Tunnel not found"));

    return {
      endpoint,
      healthy: !isNgrokError,
      latency: isNgrokError ? Infinity : latency,
    };
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

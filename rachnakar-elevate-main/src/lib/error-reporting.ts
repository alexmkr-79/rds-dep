// Lightweight client-side error reporting hook. Logs to the console by
// default; wire up a real monitoring provider here if/when one is added.
export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error(error, {
    route: window.location.pathname,
    ...context,
  });
}

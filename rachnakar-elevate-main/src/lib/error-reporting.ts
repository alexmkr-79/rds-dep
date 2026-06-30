// Lightweight client-side error reporting hook. Wired for future monitoring
// integrations without emitting console noise during production builds.
export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  void error;
  void context;
  void window.location.pathname;
}

/**
 * Logs the real server error behind production RSC digests (…@E352).
 * Search hosting logs for: [NEXT_SERVER_ERROR]
 * Never throws — logging must not create secondary failures.
 */
export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      console.info("[instrumentation] registered (nodejs)");
    }
  } catch {
    // ignore
  }
}

export async function onRequestError(
  error: unknown,
  request: {
    path: string;
    method: string;
    headers: { get(name: string): string | null | undefined };
  },
  context: {
    routerKind?: string;
    routePath?: string;
    routeType?: string;
    renderSource?: string;
  },
) {
  try {
    const err = error as {
      name?: string;
      message?: string;
      stack?: string;
      digest?: string;
    };
    console.error("[NEXT_SERVER_ERROR]", {
      message: err?.message ?? String(error),
      name: err?.name ?? "UnknownError",
      stack: typeof err?.stack === "string" ? err.stack.slice(0, 2000) : undefined,
      digest: err?.digest != null ? String(err.digest) : undefined,
      requestPath: request?.path,
      requestMethod: request?.method,
      routePath: context?.routePath,
      routeType: context?.routeType,
      renderSource: context?.renderSource,
      routerKind: context?.routerKind,
    });
  } catch {
    // never throw from error logger
  }
}

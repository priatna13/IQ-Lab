import type { Instrumentation } from "next";

/**
 * Logs the real server error behind production RSC digests (e.g. 1464971058@E352).
 * Search deploy logs for: [NEXT_SERVER_ERROR]
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: unknown }).digest)
      : undefined;

  console.error("[NEXT_SERVER_ERROR]", {
    message: error instanceof Error ? error.message : String(error),
    name: error instanceof Error ? error.name : "UnknownError",
    stack: error instanceof Error ? error.stack : undefined,
    digest,
    requestPath: request.path,
    requestMethod: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    routerKind: context.routerKind,
  });
};

export async function register() {
  // Reserved for future OTEL / boot hooks.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.info("[instrumentation] registered (nodejs)");
  }
}

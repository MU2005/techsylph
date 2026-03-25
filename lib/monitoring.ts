import * as Sentry from "@sentry/nextjs";

type ErrorContext = Record<string, string | number | boolean | null | undefined>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "unknown_error";
}

export function reportApiError(error: unknown, route: string, context?: ErrorContext) {
  Sentry.captureException(error, {
    tags: { route, surface: "api" },
    extra: context,
  });
  console.error(`[${route}]`, {
    message: getErrorMessage(error),
    ...context,
  });
}

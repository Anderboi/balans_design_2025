import { toast } from "sonner";

/**
 * Custom application error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AppError";

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error codes for different types of errors
 */
export const ERROR_CODES = {
  // Database errors
  DB_QUERY_FAILED: "DB_QUERY_FAILED",
  DB_INSERT_FAILED: "DB_INSERT_FAILED",
  DB_UPDATE_FAILED: "DB_UPDATE_FAILED",
  DB_DELETE_FAILED: "DB_DELETE_FAILED",

  // Authentication errors
  AUTH_FAILED: "AUTH_FAILED",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Validation errors
  VALIDATION_FAILED: "VALIDATION_FAILED",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",

  // Storage errors
  STORAGE_UPLOAD_FAILED: "STORAGE_UPLOAD_FAILED",
  STORAGE_DELETE_FAILED: "STORAGE_DELETE_FAILED",

  // Unknown errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

/**
 * Handles service errors with consistent logging and user feedback
 *
 * @param error - The error that occurred
 * @param context - Context string for debugging (e.g., "tasksService.getTasks")
 * @param userMessage - Optional user-friendly message to display
 * @param code - Error code for categorization
 * @throws AppError - Always throws an AppError
 */
export const handleServiceError = (
  error: unknown,
  context: string,
  userMessage?: string,
  code: string = ERROR_CODES.UNKNOWN_ERROR
): never => {
  // Log for debugging (only in development)
  if (process.env.NODE_ENV === "development" || typeof window === "undefined") {
    console.error(`[${context}]`, error);
  }

  // Show user-friendly message only on client
  if (userMessage && typeof window !== 'undefined') {
    toast.error(userMessage);
  }

  // Create and throw AppError
  const appError =
    error instanceof AppError
      ? error
      : new AppError(userMessage || "An error occurred", code, context, error);

  throw appError;
};

/**
 * Handles component errors with user feedback
 * Used in try-catch blocks in React components
 *
 * @param error - The error that occurred
 * @param context - Context string for debugging
 * @param userMessage - User-friendly message to display
 */
export const handleComponentError = (
  error: unknown,
  context: string,
  userMessage: string
): void => {
  // Log for debugging
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
  }

  // Always show user feedback in components
  toast.error(userMessage);
};

/**
 * Wraps async service calls with error handling
 *
 * @param fn - Async function to execute
 * @param context - Context string for debugging
 * @param userMessage - User-friendly error message
 * @param code - Error code
 * @returns Promise with the result or throws AppError
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  userMessage: string,
  code: string = ERROR_CODES.UNKNOWN_ERROR
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // handleServiceError always throws, but TypeScript needs explicit control flow
    return handleServiceError(error, context, userMessage, code);
  }
}

/**
 * Checks if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Extracts error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
};

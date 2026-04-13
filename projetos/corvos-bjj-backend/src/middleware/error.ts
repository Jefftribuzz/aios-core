import { Request, Response, NextFunction } from 'express';

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Custom error class for API errors
 */
export class HttpError extends Error implements ApiError {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  void _next;
  console.error('❌ Error:', error);

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Um erro interno ocorreu',
  });
}

/**
 * 404 Not Found middleware
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Recurso não encontrado',
  });
}

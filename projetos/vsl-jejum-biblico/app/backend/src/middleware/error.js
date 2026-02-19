import pino from 'pino';
import { AppError } from './auth.js';

const logger = pino();

export function errorMiddleware(err, req, res, next) {
  logger.error('Error', {
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    statusCode: err.statusCode || 500,
    stack: err.stack
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

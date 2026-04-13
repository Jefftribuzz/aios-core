import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-only-for-dev';
const JWT_EXPIRY: string | number = process.env.JWT_EXPIRY || process.env.JWT_EXPIRES_IN || '900s';
const REFRESH_TOKEN_EXPIRY: string | number =
  process.env.REFRESH_TOKEN_EXPIRY || process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRY: string | number = process.env.RESET_TOKEN_EXPIRY || '30m';

const signWithExpiry = (payload: object, expiresIn: string | number): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);

/**
 * Generate access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return signWithExpiry(payload, JWT_EXPIRY);
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return signWithExpiry(payload, REFRESH_TOKEN_EXPIRY);
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(payload: Pick<TokenPayload, 'userId' | 'email'>): string {
  return signWithExpiry(payload, RESET_TOKEN_EXPIRY);
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string): Pick<TokenPayload, 'userId' | 'email'> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Pick<TokenPayload, 'userId' | 'email'>;
  } catch {
    return null;
  }
}

/**
 * Decode JWT without verification (for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload | null;
  } catch {
    return null;
  }
}

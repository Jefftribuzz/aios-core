import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb } from '../config/database.js';
import { generateToken, ValidationError, ConflictError } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const sql = getDb();

  // Validate input
  let validatedData;
  try {
    validatedData = registerSchema.parse(req.body);
  } catch (error) {
    throw new ValidationError('Invalid input', {
      issues: error.issues
    });
  }

  // Check if user already exists
  const existing = await sql`
    SELECT id FROM users WHERE email = ${validatedData.email}
  `;

  if (existing.length > 0) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Create user
  const result = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${validatedData.email}, ${hashedPassword})
    RETURNING id, email, created_at
  `;

  const user = result[0];
  const token = generateToken(user.id);

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    },
    token
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const sql = getDb();

  // Validate input
  let validatedData;
  try {
    validatedData = loginSchema.parse(req.body);
  } catch (error) {
    throw new ValidationError('Invalid input', {
      issues: error.issues
    });
  }

  // Find user
  const result = await sql`
    SELECT id, email, password_hash FROM users WHERE email = ${validatedData.email}
  `;

  if (result.length === 0) {
    throw new ValidationError('Invalid email or password');
  }

  const user = result[0];

  // Verify password
  const passwordMatch = await bcrypt.compare(validatedData.password, user.password_hash);

  if (!passwordMatch) {
    throw new ValidationError('Invalid email or password');
  }

  const token = generateToken(user.id);

  res.json({
    user: {
      id: user.id,
      email: user.email
    },
    token
  });
}));

export default router;

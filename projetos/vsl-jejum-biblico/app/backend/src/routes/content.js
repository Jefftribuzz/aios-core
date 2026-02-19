import express from 'express';
import { getDb } from '../config/database.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

const CACHE_TTL = 3600; // 1 hour

// GET /api/content/prayers - List prayers
router.get('/prayers', asyncHandler(async (req, res) => {
  const type = req.query.type; // Optional filter by type
  const cacheKey = `prayers:${type || 'all'}`;

  // Try cache
  let prayers = await cacheGet(cacheKey);

  if (!prayers) {
    const sql = getDb();

    // Query database
    if (type && ['cura', 'sabedoria', 'libertacao', 'dedicacao'].includes(type)) {
      prayers = await sql`
        SELECT id, title, text, type, duration_minutes 
        FROM prayers 
        WHERE type = ${type}
        ORDER BY created_at DESC
      `;
    } else {
      prayers = await sql`
        SELECT id, title, text, type, duration_minutes 
        FROM prayers 
        ORDER BY created_at DESC
      `;
    }

    // Cache result
    await cacheSet(cacheKey, prayers, CACHE_TTL);
  }

  res.json({
    prayers,
    pagination: {
      total: prayers.length,
      limit: prayers.length
    }
  });
}));

// GET /api/content/meditations - List meditations
router.get('/meditations', asyncHandler(async (req, res) => {
  const duration = req.query.duration; // Optional filter by duration
  const cacheKey = `meditations:${duration || 'all'}`;

  // Try cache
  let meditations = await cacheGet(cacheKey);

  if (!meditations) {
    const sql = getDb();

    // Query database
    if (duration) {
      const durationInt = parseInt(duration);
      meditations = await sql`
        SELECT id, title, description, audio_url, duration_minutes, type
        FROM meditations 
        WHERE duration_minutes <= ${durationInt}
        ORDER BY duration_minutes ASC
      `;
    } else {
      meditations = await sql`
        SELECT id, title, description, audio_url, duration_minutes, type
        FROM meditations 
        ORDER BY created_at DESC
      `;
    }

    // Cache result
    await cacheSet(cacheKey, meditations, CACHE_TTL);
  }

  res.json({
    meditations,
    pagination: {
      total: meditations.length,
      limit: meditations.length
    }
  });
}));

// GET /api/content/meals - List meals
router.get('/meals', asyncHandler(async (req, res) => {
  const restrictions = req.query.restrictions; // Optional filter by restrictions
  const cacheKey = `meals:${restrictions || 'all'}`;

  // Try cache
  let meals = await cacheGet(cacheKey);

  if (!meals) {
    const sql = getDb();

    // Query database
    if (restrictions) {
      meals = await sql`
        SELECT id, title, ingredients, prep_time_minutes, calories, restrictions
        FROM meals 
        WHERE restrictions LIKE ${'%' + restrictions + '%'} OR restrictions = ''
        ORDER BY created_at DESC
      `;
    } else {
      meals = await sql`
        SELECT id, title, ingredients, prep_time_minutes, calories, restrictions
        FROM meals 
        ORDER BY created_at DESC
      `;
    }

    // Cache result
    await cacheSet(cacheKey, meals, CACHE_TTL);
  }

  res.json({
    meals,
    pagination: {
      total: meals.length,
      limit: meals.length
    }
  });
}));

export default router;

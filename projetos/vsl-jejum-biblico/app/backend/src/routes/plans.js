import express from 'express';
import { z } from 'zod';
import { authMiddleware, ValidationError, NotFoundError } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { generatePlan, savePlan, getPlan } from '../services/plan-generator.js';

const router = express.Router();

// Validation schemas
const createPlanSchema = z.object({
  objective: z.enum(['cura', 'sabedoria', 'libertacao', 'dedicacao']),
  duration: z.enum(['3', '7', '21', '40']).transform(Number),
  restrictions: z.array(z.string()).optional().default([]),
  start_date: z.string().date()
});

// POST /api/plans - Create new plan
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  // Validate input
  let validatedData;
  try {
    validatedData = createPlanSchema.parse(req.body);
  } catch (error) {
    throw new ValidationError('Invalid plan data', {
      issues: error.issues
    });
  }

  // Generate plan
  const dailyTasks = await generatePlan(
    validatedData.objective,
    validatedData.duration,
    validatedData.restrictions,
    validatedData.start_date
  );

  // Save to database
  const plan = await savePlan(
    req.userId,
    validatedData.objective,
    validatedData.duration,
    validatedData.start_date,
    dailyTasks
  );

  res.status(201).json({
    plan: {
      id: plan.id,
      objective: plan.objective,
      duration: plan.duration,
      start_date: plan.start_date,
      status: plan.status,
      created_at: plan.created_at,
      daily_tasks_count: plan.daily_tasks.length
    },
    daily_tasks: plan.daily_tasks
  });
}));

// GET /api/plans/:id - Get plan with full details
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const planId = req.params.id;

  const plan = await getPlan(planId, req.userId);

  if (!plan) {
    throw new NotFoundError('Plan not found');
  }

  res.json({
    plan: {
      id: plan.id,
      user_id: plan.user_id,
      objective: plan.objective,
      duration: plan.duration,
      start_date: plan.start_date,
      status: plan.status,
      created_at: plan.created_at,
      updated_at: plan.updated_at
    },
    daily_tasks: plan.daily_tasks.map(task => ({
      id: task.id,
      day_number: task.day_number,
      notes: task.notes,
      completed_at: task.completed_at,
      prayer: {
        id: task.prayer_id,
        title: task.prayer_title,
        text: task.prayer_text,
        type: task.prayer_type,
        duration_minutes: task.prayer_duration
      },
      meditation: {
        id: task.meditation_id,
        title: task.meditation_title,
        audio_url: task.meditation_audio_url,
        duration_minutes: task.meditation_duration
      },
      meal: {
        id: task.meal_id,
        title: task.meal_title,
        calories: task.meal_calories,
        prep_time_minutes: task.meal_prep_time
      }
    }))
  });
}));

// GET /api/plans - List user's plans
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { getDb } = await import('../config/database.js');
  const sql = getDb();

  // Get pagination params
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const offset = parseInt(req.query.offset) || 0;

  // Get plans
  const plans = await sql`
    SELECT 
      id, objective, duration, start_date, status, created_at,
      (SELECT COUNT(*) FROM daily_tasks WHERE plan_id = plans.id) as daily_tasks_count
    FROM plans 
    WHERE user_id = ${req.userId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  res.json({
    plans,
    pagination: {
      limit,
      offset,
      total: plans.length
    }
  });
}));

// PATCH /api/plans/:id - Update plan status
router.patch('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { getDb } = await import('../config/database.js');
  const sql = getDb();

  const planId = req.params.id;
  const { status } = req.body;

  if (!['active', 'completed', 'abandoned'].includes(status)) {
    throw new ValidationError('Invalid status');
  }

  // Update plan
  const result = await sql`
    UPDATE plans 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${planId} AND user_id = ${req.userId}
    RETURNING *
  `;

  if (result.length === 0) {
    throw new NotFoundError('Plan not found');
  }

  res.json({
    plan: result[0]
  });
}));

export default router;

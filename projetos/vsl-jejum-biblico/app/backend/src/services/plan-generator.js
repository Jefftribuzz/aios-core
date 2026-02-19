import { getDb } from '../config/database.js';
import pino from 'pino';

const logger = pino();

/**
 * Plan Generation Algorithm
 * 
 * Generates a personalized fasting plan based on:
 * - Objective (cura, sabedoria, libertacao, dedicacao)
 * - Duration (3, 7, 21, 40 days)
 * - Restrictions (dietary)
 * - Start date
 */
export async function generatePlan(objective, duration, restrictions = [], startDate) {
  const sql = getDb();

  logger.info('Generating plan', { objective, duration, restrictions });

  // Get content for objective
  const [prayers, meditations, meals] = await Promise.all([
    sql`
      SELECT id, title, type, duration_minutes 
      FROM prayers 
      WHERE type = ${objective}
      ORDER BY random()
    `,
    sql`
      SELECT id, title, duration_minutes, type
      FROM meditations
      ORDER BY random()
    `,
    sql`
      SELECT id, title, prep_time_minutes, calories
      FROM meals
      WHERE restrictions = '' OR restrictions IS NULL
      ORDER BY random()
    `
  ]);

  if (prayers.length === 0) {
    throw new Error('No prayers found for objective: ' + objective);
  }

  if (meditations.length === 0) {
    throw new Error('No meditations found');
  }

  if (meals.length === 0) {
    throw new Error('No meals found');
  }

  const dailyTasks = [];

  for (let day = 1; day <= duration; day++) {
    // Calculate progression factor (0.4 = easy, 0.9 = intense)
    const progressionFactor = 0.4 + (day / duration) * 0.5;

    // Select prayer (round-robin from objective-matched list)
    const prayerIndex = (day - 1) % prayers.length;
    const prayer = prayers[prayerIndex];

    // Select meditation based on difficulty
    let meditation;
    if (progressionFactor < 0.5) {
      // Easy meditation (short)
      meditation = meditations.find(m => m.duration_minutes <= 10) || meditations[0];
    } else if (progressionFactor < 0.7) {
      // Medium meditation
      meditation = meditations.find(m => m.duration_minutes > 10 && m.duration_minutes <= 20) || meditations[0];
    } else {
      // Deep meditation (longer)
      meditation = meditations.find(m => m.duration_minutes > 20) || meditations[meditations.length - 1];
    }

    // Select meal (light meals for fasting hours)
    const meal = meals[(day - 1) % meals.length];

    // Create daily task entry
    dailyTasks.push({
      day_number: day,
      prayer_id: prayer.id,
      meditation_id: meditation.id,
      meal_id: meal.id,
      notes: generateNotes(day, duration, objective)
    });
  }

  logger.info('✅ Plan generated successfully', { duration, days: dailyTasks.length });

  return dailyTasks;
}

/**
 * Generate personalized notes for each day
 */
function generateNotes(day, duration, objective) {
  const progressPercent = Math.round((day / duration) * 100);
  const isFirstDay = day === 1;
  const isLastDay = day === duration;
  const isMidpoint = Math.abs(day - duration / 2) < 1;

  if (isFirstDay) {
    return `🌅 Day 1 - Begin your ${duration}-day journey of ${objective}. Focus on your intentions.`;
  }

  if (isLastDay) {
    return `🏆 Final day - Celebrate ${progressPercent}% completion! Honor your commitment.`;
  }

  if (isMidpoint) {
    return `💪 Midpoint - ${progressPercent}% complete! You're strong. Keep going.`;
  }

  if (day % 7 === 0 && duration >= 21) {
    return `📖 Week ${Math.floor(day / 7)} - One week milestone achieved!`;
  }

  return `Day ${day} of ${duration} (${progressPercent}%)`;
}

/**
 * Save generated plan to database
 */
export async function savePlan(userId, objective, duration, startDate, dailyTasks) {
  const sql = getDb();

  // Create plan
  const planResult = await sql`
    INSERT INTO plans (user_id, objective, duration, start_date, status)
    VALUES (${userId}, ${objective}, ${duration}, ${startDate}, 'active')
    RETURNING id, user_id, objective, duration, start_date, status, created_at
  `;

  const plan = planResult[0];

  // Create daily tasks
  for (const task of dailyTasks) {
    await sql`
      INSERT INTO daily_tasks (plan_id, day_number, prayer_id, meditation_id, meal_id, notes)
      VALUES (${plan.id}, ${task.day_number}, ${task.prayer_id}, ${task.meditation_id}, ${task.meal_id}, ${task.notes})
    `;
  }

  logger.info('✅ Plan saved', { planId: plan.id, userId });

  return {
    ...plan,
    daily_tasks: dailyTasks
  };
}

/**
 * Get full plan with populated content
 */
export async function getPlan(planId, userId) {
  const sql = getDb();

  // Get plan
  const planResult = await sql`
    SELECT * FROM plans WHERE id = ${planId} AND user_id = ${userId}
  `;

  if (planResult.length === 0) {
    return null;
  }

  const plan = planResult[0];

  // Get daily tasks with populated content
  const dailyTasks = await sql`
    SELECT 
      dt.id,
      dt.day_number,
      dt.notes,
      dt.completed_at,
      p.id as prayer_id,
      p.title as prayer_title,
      p.text as prayer_text,
      p.type as prayer_type,
      p.duration_minutes as prayer_duration,
      m.id as meditation_id,
      m.title as meditation_title,
      m.audio_url as meditation_audio_url,
      m.duration_minutes as meditation_duration,
      ml.id as meal_id,
      ml.title as meal_title,
      ml.calories as meal_calories,
      ml.prep_time_minutes as meal_prep_time
    FROM daily_tasks dt
    LEFT JOIN prayers p ON dt.prayer_id = p.id
    LEFT JOIN meditations m ON dt.meditation_id = m.id
    LEFT JOIN meals ml ON dt.meal_id = ml.id
    WHERE dt.plan_id = ${planId}
    ORDER BY dt.day_number ASC
  `;

  return {
    ...plan,
    daily_tasks: dailyTasks
  };
}

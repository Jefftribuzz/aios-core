import postgres from 'postgres';
import pino from 'pino';

const logger = pino();
let sql;

export async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  sql = postgres(connectionString, {
    max: 10, // connection pool size
    idle_timeout: 30, // idle connection timeout in seconds
    connect_timeout: 30 // connection timeout in seconds
  });

  // Test connection
  const result = await sql`SELECT 1 as test`;
  if (!result || !result[0]) {
    throw new Error('Database connection failed');
  }

  await runMigrations();
}

export function getDb() {
  if (!sql) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return sql;
}

async function runMigrations() {
  logger.info('Running database migrations...');

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create prayers table
  await sql`
    CREATE TABLE IF NOT EXISTS prayers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      duration_minutes INTEGER DEFAULT 5,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT valid_type CHECK (type IN ('cura', 'sabedoria', 'libertacao', 'dedicacao'))
    )
  `;

  // Create meditations table
  await sql`
    CREATE TABLE IF NOT EXISTS meditations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      audio_url VARCHAR(500),
      duration_minutes INTEGER DEFAULT 10,
      type VARCHAR(50) DEFAULT 'guided',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create meals table
  await sql`
    CREATE TABLE IF NOT EXISTS meals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      ingredients TEXT,
      prep_time_minutes INTEGER DEFAULT 15,
      calories INTEGER,
      restrictions TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create plans table
  await sql`
    CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      objective VARCHAR(50) NOT NULL,
      duration INTEGER NOT NULL,
      start_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT valid_objective CHECK (objective IN ('cura', 'sabedoria', 'libertacao', 'dedicacao')),
      CONSTRAINT valid_duration CHECK (duration IN (3, 7, 21, 40)),
      CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'abandoned'))
    )
  `;

  // Create daily_tasks table
  await sql`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      meal_id UUID REFERENCES meals(id),
      prayer_id UUID REFERENCES prayers(id),
      meditation_id UUID REFERENCES meditations(id),
      notes TEXT,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(plan_id, day_number)
    )
  `;

  // Create indexes for better query performance
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_daily_tasks_plan_id ON daily_tasks(plan_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_prayers_type ON prayers(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_meditations_duration ON meditations(duration_minutes)`;

  logger.info('✅ Migrations completed successfully');
}

export async function closeDatabase() {
  if (sql) {
    await sql.end();
  }
}

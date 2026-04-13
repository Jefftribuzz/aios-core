-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective VARCHAR(50) NOT NULL, -- 'cura', 'sabedoria', 'libertacao', 'dedicacao'
  duration INTEGER NOT NULL, -- 3, 7, 21, 40
  start_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create prayers table
CREATE TABLE IF NOT EXISTS prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'cura', 'sabedoria', 'libertacao', 'dedicacao'
  duration_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create meditations table
CREATE TABLE IF NOT EXISTS meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audio_url VARCHAR(500),
  duration_minutes INTEGER DEFAULT 10,
  type VARCHAR(50), -- 'guided', 'music', 'silence'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  ingredients TEXT,
  prep_time_minutes INTEGER DEFAULT 15,
  calories INTEGER DEFAULT 150,
  restrictions TEXT[], -- ARRAY OF strings: 'vegetarian', 'gluten_free', 'dairy_free', etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create daily_tasks table
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
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plan_id, day_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_plan_id ON daily_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_prayers_type ON prayers(type);
CREATE INDEX IF NOT EXISTS idx_meditations_type ON meditations(type);

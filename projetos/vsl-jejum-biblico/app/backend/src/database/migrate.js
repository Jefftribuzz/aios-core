import 'dotenv/config.js';
import { getDb, initDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  try {
    // Initialize database connection first
    await initDatabase();
    const sql = getDb();
    const migrationsDir = path.join(__dirname, 'migrations');

    // Get all migration files
    const files = fs.readdirSync(migrationsDir).sort();
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(migrationsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`Running migration: ${file}`);
        // Execute the SQL
        await sql.unsafe(content);
        console.log(`✓ Migration completed: ${file}`);
      }
    }
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

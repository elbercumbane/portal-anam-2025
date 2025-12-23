import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL
    await pool.query(sql);
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();


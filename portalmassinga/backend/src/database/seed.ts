import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const memberPassword = await bcrypt.hash('membro123', 10);
    
    await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, active)
      VALUES 
        ('admin', $1, 'Admin', 'admin', true),
        ('admin@anam.org', $1, 'Administrador', 'admin', true),
        ('guilherme@gmail.com', $2, 'Guilherme Silva', 'membro', true),
        ('maria@gmail.com', $2, 'Maria Santos', 'membro', true)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        active = EXCLUDED.active
    `, [adminPassword, memberPassword]);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📝 Default users created/updated:');
    console.log('   - admin / admin123 (admin) ⭐');
    console.log('   - admin@anam.org / admin123 (admin)');
    console.log('   - guilherme@gmail.com / membro123 (membro)');
    console.log('   - maria@gmail.com / membro123 (membro)');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
}

seed();


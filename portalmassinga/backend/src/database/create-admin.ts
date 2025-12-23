import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Hash da senha admin123
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Inserir ou atualizar usuário admin
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        active = EXCLUDED.active
      RETURNING id, email, full_name, role
    `, ['admin', adminPassword, 'Admin', 'admin', true]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ Admin user created/updated successfully!');
      console.log('📝 Credentials:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: admin123`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
    } else {
      console.log('⚠️  User already exists but update failed');
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    await pool.end();
    process.exit(1);
  }
}

createAdmin();


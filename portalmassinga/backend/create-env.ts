import * as fs from 'fs';
import * as path from 'path';

const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=elber123

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
`;

const envPath = path.join(__dirname, '.env');

try {
  // Verificar se já existe
  if (fs.existsSync(envPath)) {
    const existingContent = fs.readFileSync(envPath, 'utf8');
    // Verificar se a senha está correta
    if (existingContent.includes('DB_PASSWORD=elber123')) {
      console.log('✅ Arquivo .env já existe com a senha correta.');
    } else {
      console.log('⚠️  Arquivo .env existe mas a senha pode estar incorreta.');
      console.log('   Atualizando arquivo .env...');
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Arquivo .env atualizado!');
    }
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado com sucesso!');
    console.log('📋 Configuração:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_PORT=5432');
    console.log('   DB_NAME=anam_portal');
    console.log('   DB_USER=postgres');
    console.log('   DB_PASSWORD=elber123');
  }
} catch (error) {
  console.error('❌ Erro ao criar arquivo .env:', error);
  process.exit(1);
}


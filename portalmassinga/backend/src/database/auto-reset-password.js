// Script Node.js para reset automático de senha
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Reset Automático de Senha PostgreSQL ===\n');

const pgHbaPath = 'C:\\Program Files\\PostgreSQL\\18\\data\\pg_hba.conf';
const pgService = 'postgresql-x64-18';
const psqlPath = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe';
const backupPath = pgHbaPath + '.backup';

function runCommand(cmd, options = {}) {
  try {
    return execSync(cmd, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
  } catch (error) {
    if (!options.silent) {
      console.error(`Erro: ${error.message}`);
    }
    return null;
  }
}

async function resetPassword() {
  // Tentar conectar com senhas comuns primeiro
  console.log('Tentando senhas comuns...');
  const commonPasswords = ['postgres', '', 'admin', 'root', '123456'];
  
  for (const pwd of commonPasswords) {
    try {
      process.env.PGPASSWORD = pwd;
      const result = runCommand(
        `"${psqlPath}" -U postgres -h localhost -d postgres -c "SELECT 1;"`,
        { silent: true }
      );
      
      if (result !== null) {
        console.log(`✅ Conectado com senha: ${pwd || '(vazia)'}`);
        console.log('\n✅ Senha já está funcionando!');
        updateEnvFile(pwd || 'postgres');
        return true;
      }
    } catch (e) {
      continue;
    }
  }

  // Se não conectou, tentar resetar
  console.log('\nNenhuma senha funcionou. Tentando resetar...\n');

  // Verificar se arquivo existe
  if (!fs.existsSync(pgHbaPath)) {
    console.error(`❌ Arquivo não encontrado: ${pgHbaPath}`);
    return false;
  }

  // Fazer backup
  try {
    fs.copyFileSync(pgHbaPath, backupPath);
    console.log('✅ Backup criado');
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error.message);
    return false;
  }

  // Ler arquivo
  let content = fs.readFileSync(pgHbaPath, 'utf8');
  const originalContent = content;

  // Modificar para trust
  content = content.replace(
    /host\s+all\s+all\s+127\.0\.0\.1\/32\s+md5/g,
    'host    all             all             127.0.0.1/32            trust'
  );
  content = content.replace(
    /host\s+all\s+all\s+::1\/128\s+md5/g,
    'host    all             all             ::1/128                 trust'
  );

  if (content === originalContent) {
    // Adicionar linha trust no início se não encontrou
    const trustLine = 'host    all             all             127.0.0.1/32            trust\n';
    content = trustLine + content;
  }

  // Tentar escrever arquivo
  try {
    fs.writeFileSync(pgHbaPath, content, 'utf8');
    console.log('✅ Arquivo modificado');
  } catch (error) {
    console.error('❌ Erro ao modificar arquivo (precisa de admin):', error.message);
    console.log('\n💡 Execute o PowerShell como Administrador e execute:');
    console.log('   .\\reset-postgres-password.ps1');
    return false;
  }

  // Reiniciar serviço
  console.log('Reiniciando serviço PostgreSQL...');
  try {
    runCommand(`Stop-Service ${pgService} -Force`, { shell: 'powershell.exe' });
    setTimeout(() => {
      runCommand(`Start-Service ${pgService}`, { shell: 'powershell.exe' });
      setTimeout(() => {
        // Redefinir senha
        console.log('Redefinindo senha...');
        process.env.PGPASSWORD = '';
        const result = runCommand(
          `"${psqlPath}" -U postgres -h localhost -d postgres -c "ALTER USER postgres PASSWORD 'postgres';"`,
          { silent: true }
        );

        if (result !== null) {
          console.log('✅ Senha redefinida para: postgres');
          updateEnvFile('postgres');

          // Restaurar arquivo
          fs.copyFileSync(backupPath, pgHbaPath);
          fs.unlinkSync(backupPath);
          runCommand(`Restart-Service ${pgService} -Force`, { shell: 'powershell.exe' });
          console.log('✅ Arquivo restaurado');
          return true;
        } else {
          console.error('❌ Erro ao redefinir senha');
          // Restaurar backup
          fs.copyFileSync(backupPath, pgHbaPath);
          return false;
        }
      }, 3000);
    }, 2000);
  } catch (error) {
    console.error('❌ Erro ao reiniciar serviço:', error.message);
    // Restaurar backup
    fs.copyFileSync(backupPath, pgHbaPath);
    return false;
  }

  return false;
}

function updateEnvFile(password) {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${password}`);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Arquivo .env atualizado');
  }
}

// Executar
resetPassword().then(success => {
  if (success) {
    console.log('\n✅ Pronto! Execute: npm run db:init');
  } else {
    console.log('\n⚠️  Não foi possível resetar automaticamente.');
    console.log('   Execute o PowerShell como Administrador e execute:');
    console.log('   .\\reset-postgres-password.ps1');
  }
});












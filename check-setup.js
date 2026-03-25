#!/usr/bin/env node

/**
 * 🔍 EdenX - Verificador de Instalação
 * 
 * Execute este script para verificar se tudo está configurado corretamente:
 * node check-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n╔════════════════════════════════════════╗');
console.log('║   🔍 EdenX - Verificador de Setup    ║');
console.log('╚════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Verificar Node.js
check('Node.js instalado', () => {
  const version = execSync('node -v', { encoding: 'utf8' }).trim();
  console.log(`   └─ Versão: ${version}`);
  return true;
});

// 2. Verificar npm
check('npm instalado', () => {
  const version = execSync('npm -v', { encoding: 'utf8' }).trim();
  console.log(`   └─ Versão: ${version}`);
  return true;
});

// 3. Verificar estrutura backend
check('Pasta backend existe', () => {
  return fs.existsSync(path.join(__dirname, 'backend'));
});

check('Arquivo server.js existe', () => {
  return fs.existsSync(path.join(__dirname, 'backend', 'server.js'));
});

check('Arquivo package.json existe', () => {
  return fs.existsSync(path.join(__dirname, 'backend', 'package.json'));
});

check('Arquivo schema.sql existe', () => {
  return fs.existsSync(path.join(__dirname, 'backend', 'schema.sql'));
});

// 4. Verificar arquivos frontend
check('Arquivo index.html existe', () => {
  return fs.existsSync(path.join(__dirname, 'index.html'));
});

check('Arquivo styles.css existe', () => {
  return fs.existsSync(path.join(__dirname, 'styles.css'));
});

check('Arquivo script.js existe', () => {
  return fs.existsSync(path.join(__dirname, 'script.js'));
});

check('Arquivo api-client.js existe', () => {
  return fs.existsSync(path.join(__dirname, 'api-client.js'));
});

check('Arquivo app.js existe', () => {
  return fs.existsSync(path.join(__dirname, 'app.js'));
});

// 5. Verificar documentação
check('README.md existe', () => {
  return fs.existsSync(path.join(__dirname, 'README.md'));
});

check('ARQUITETURA.md existe', () => {
  return fs.existsSync(path.join(__dirname, 'ARQUITETURA.md'));
});

check('TESTES.md existe', () => {
  return fs.existsSync(path.join(__dirname, 'TESTES.md'));
});

check('ENTREGA.md existe', () => {
  return fs.existsSync(path.join(__dirname, 'ENTREGA.md'));
});

// 6. Verificar dependencies backend
check('Backend dependencies instaladas', () => {
  return fs.existsSync(path.join(__dirname, 'backend', 'node_modules'));
});

// 7. Verificar .env
check('Arquivo .env.example existe', () => {
  return fs.existsSync(path.join(__dirname, 'backend', '.env.example'));
});

const envExists = fs.existsSync(path.join(__dirname, 'backend', '.env'));
check('.env configurado', () => {
  if (!envExists) {
    console.log('   └─ ⚠️  Copie .env.example para .env e configure MySQL');
    return false;
  }
  return true;
});

// 8. Verificar MySQL
check('MySQL instalado', () => {
  try {
    execSync('mysql --version', { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch (e) {
    console.log('   └─ ⚠️  MySQL não encontrado no PATH');
    return false;
  }
});

// Resumo
console.log('\n╔════════════════════════════════════════╗');
console.log(`║   Resultado: ${passed} ✅ | ${failed} ❌           ║`);
console.log('╚════════════════════════════════════════╝\n');

if (failed === 0) {
  console.log('🎉 TUDO PRONTO! Siga os próximos passos:\n');
  console.log('1️⃣  Configure o banco de dados:');
  console.log('   mysql -u root -p < backend/schema.sql\n');
  
  if (!envExists) {
    console.log('2️⃣  Configure as variáveis de ambiente:');
    console.log('   cp backend/.env.example backend/.env');
    console.log('   # Edite backend/.env com suas credenciais\n');
    console.log('3️⃣  Instale dependências:');
    console.log('   cd backend && npm install && cd ..\n');
  }
  
  console.log('4️⃣  Inicie o servidor:');
  console.log('   cd backend && npm run dev\n');
  
  console.log('5️⃣  Abra o frontend:');
  console.log('   Abra index.html em seu navegador\n');
  
  process.exit(0);
} else {
  console.log('⚠️  Existem problemas a resolver:\n');
  
  if (!fs.existsSync(path.join(__dirname, 'backend', 'node_modules'))) {
    console.log('📦 Instale dependencies:');
    console.log('   cd backend && npm install && cd ..\n');
  }
  
  if (!envExists) {
    console.log('⚙️  Configure variáveis de ambiente:');
    console.log('   cp backend/.env.example backend/.env');
    console.log('   # Edite com suas credenciais MySQL\n');
  }
  
  try {
    execSync('mysql --version', { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    console.log('💾 Instale MySQL:');
    console.log('   https://dev.mysql.com/downloads/mysql/\n');
  }
  
  process.exit(1);
}

#!/bin/bash

# Script de instalação automática para EdenX
# Windows, Mac e Linux

echo "╔════════════════════════════════════════╗"
echo "║  🚀 EdenX - Setup Automático          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Detectar sistema operacional
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    OS="windows"
fi

echo "📊 Sistema detectado: $OS"
echo ""

# Verificar Node.js
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instale de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION encontrado"
echo ""

# Instalar backend
echo "📦 Instalando backend..."
cd backend
npm install

# Criar arquivo .env
echo ""
echo "⚙️  Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo backend/.env com suas credenciais MySQL!"
    echo "   - DB_HOST: localhost"
    echo "   - DB_USER: root"
    echo "   - DB_PASSWORD: sua_senha"
else
    echo "✓ Arquivo .env já existe"
fi

# Criar pastas de upload
echo ""
echo "📁 Criando pastas de upload..."
mkdir -p uploads/posts uploads/stories uploads/reels
echo "✓ Pastas criadas"

# Backend
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ Setup Concluído!                  ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1️⃣  Configure o banco de dados MySQL:"
echo "   mysql -u root -p < backend/schema.sql"
echo ""
echo "2️⃣  Edite as credenciais em backend/.env"
echo ""
echo "3️⃣  Inicie o backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4️⃣  Abra o frontend:"
echo "   Abra index.html em http://localhost:3000"
echo ""
echo "5️⃣  Usuários de teste (após executar schema.sql):"
echo "   - Email: neon_nina@edenx.com"
echo "   - Email: cyber_punk@edenx.com"
echo "   - Email: dexter_dev@edenx.com"
echo "   (Senhas: use qualquer senha após registrar novo usuário)"
echo ""

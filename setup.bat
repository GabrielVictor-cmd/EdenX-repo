@echo off
REM Script de instalação para Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║  🚀 EdenX - Setup Automático (Windows) ║
echo ╚════════════════════════════════════════╝
echo.

REM Verificar Node.js
echo 🔍 Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale de: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% encontrado
echo.

REM Instalar backend
echo 📦 Instalando backend...
cd backend
call npm install

REM Criar arquivo .env
echo.
echo ⚙️  Configurando variáveis de ambiente...
if not exist ".env" (
    copy .env.example .env
    echo ✓ Arquivo .env criado
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo backend/.env com suas credenciais MySQL!
) else (
    echo ✓ Arquivo .env já existe
)

REM Criar pastas de upload
echo.
echo 📁 Criando pastas de upload...
if not exist "uploads" mkdir uploads
if not exist "uploads\posts" mkdir uploads\posts
if not exist "uploads\stories" mkdir uploads\stories
if not exist "uploads\reels" mkdir uploads\reels
echo ✓ Pastas criadas

REM Finalizar
echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ Setup Concluído!                  ║
echo ╚════════════════════════════════════════╝
echo.
echo 📝 Próximos passos:
echo.
echo 1️⃣  Configure o banco de dados MySQL:
echo    mysql -u root -p ^< backend/schema.sql
echo.
echo 2️⃣  Edite as credenciais em backend\.env
echo.
echo 3️⃣  Inicie o backend:
echo    cd backend ^&^& npm run dev
echo.
echo 4️⃣  Abra o frontend:
echo    Abra index.html em http://localhost:3000
echo.
echo 5️⃣  Usuários de teste:
echo    - neon_nina@edenx.com
echo    - cyber_punk@edenx.com
echo.
pause

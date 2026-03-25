@echo off
REM Script de Configuração do Banco de Dados EdenX para Windows

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🔧 CONFIGURAÇÃO DO BANCO DE DADOS - EdenX             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar se arquivo .env existe
if not exist ".env" (
    echo ⚠️  Arquivo .env não encontrado!
    echo Criando arquivo .env com configurações padrão...
    copy ".env.example" ".env" >nul
    echo ✓ Arquivo .env criado
)

echo 📋 Configurações atuais em .env:
echo.
findstr "DB_" .env
echo.

:menu
echo ❓ Deseja alterar a senha do MySQL?
echo 1) Não (usar configuração atual)
echo 2) Sim (configurar agora)
echo.
set /p opcao="Escolha (1 ou 2): "

if "%opcao%"=="2" (
    set /p user="Usuário MySQL [EdenX]: "
    if "!user!"=="" set user=root
    
    set /p password="Senha MySQL: 1234"
    
    REM Atualizar .env
    powershell -NoProfile -Command ^
        "(Get-Content '.env') -replace '^DB_USER=.*', 'DB_USER=%user%' | Set-Content '.env'; " ^
        "(Get-Content '.env') -replace '^DB_PASSWORD=.*', 'DB_PASSWORD=%password%' | Set-Content '.env'"
    
    echo ✓ Credenciais atualizadas!
) else if "%opcao%"=="1" (
    echo ✓ Usando configuração atual
) else (
    echo ✗ Opção inválida
    goto menu
)

echo.
echo 🔌 Testando conexão com MySQL...
echo.

REM Executar script de inicialização
node init-database.js

echo.
echo ✅ Banco de dados configurado com sucesso!
echo.
echo Para iniciar o backend, execute:
echo   npm start      (Produção)
echo   npm run dev    (Desenvolvimento)
echo.
pause

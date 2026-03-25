#!/bin/bash

# Script de Configuração do Banco de Dados EdenX
# Configure as credenciais do MySQL abaixo

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🔧 CONFIGURAÇÃO DO BANCO DE DADOS - EdenX             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Criando arquivo .env com configurações padrão..."
    cp .env.example .env
fi

echo "📋 Configurações atuais em .env:"
echo ""
cat .env | grep "DB_"
echo ""

echo "❓ Deseja alterar a senha do MySQL?"
echo "1) Não (usar configuração atual)"
echo "2) Sim (configurar agora)"
read -p "Escolha (1 ou 2): " opcao

if [ "$opcao" = "2" ]; then
    read -p "Usuário MySQL [root]: " user
    user=${user:-root}
    
    read -sp "Senha MySQL: " password
    echo ""
    
    # Atualizar .env
    sed -i "s/DB_USER=.*/DB_USER=$user/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$password/" .env
    
    echo "✓ Credenciais atualizadas!"
fi

echo ""
echo "🔌 Testando conexão com MySQL..."
echo ""

# Executar script de inicialização
node init-database.js

echo ""
echo "✅ Banco de dados configurado com sucesso!"
echo ""
echo "Para iniciar o backend, execute:"
echo "  npm start      (Produção)"
echo "  npm run dev    (Desenvolvimento)"

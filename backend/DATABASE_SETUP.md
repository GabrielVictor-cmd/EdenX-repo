# 🔌 Conectar Banco de Dados

Este guia explica como conectar o banco de dados MySQL ao backend EdenX.

## Pré-requisitos

✓ **MySQL 8.0+** instalado e rodando  
✓ **Node.js 14+** instalado  

## Passos para Conexão

### 1️⃣ Verificar MySQL Rodando

Certifique-se de que o MySQL está em execução:

```bash
# Windows - Verificar no CMD
netstat -an | findstr 3306

# ou verifique nos Serviços do Windows
```

Se não estiver rodando, inicie o MySQL:
- **Windows**: Abra Serviços → MySQL → Iniciar
- **Linux**: `sudo systemctl start mysql`
- **Mac**: `brew services start mysql`

### 2️⃣ Configurar Arquivo `.env`

O arquivo `.env` já foi criado em `backend/.env` com as seguintes configurações:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=edenx_db
PORT=3001
NODE_ENV=development
JWT_SECRET=edenx_secret_key_development_2024
```

**Ajuste se necessário:**
- Altere `DB_USER` e `DB_PASSWORD` conforme suas credenciais MySQL
- Se não conseguir conectar, verifique as permissões do usuário MySQL

### 3️⃣ Instalar Dependências

```bash
cd backend
npm install
```

### 4️⃣ Inicializar o Banco de Dados

Crie as tabelas e schema:

```bash
npm run init-db
```

✓ Você deve ver mensagens como:
```
✓ Conectado ao MySQL
✓ Executado: CREATE DATABASE IF NOT EXISTS edenx_db;
✓ Executado: CREATE TABLE IF NOT EXISTS users...
✓ Banco de dados inicializado com sucesso!
```

### 5️⃣ Iniciar o Backend

```bash
npm start      # Produção
npm run dev    # Desenvolvimento (com nodemon)
```

✓ Você deve ver:
```
✓ Conexão com banco de dados estabelecida com sucesso
Servidor rodando na porta 3001
```

## 🐛 Solução de Problemas

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Problema:** MySQL não está rodando  
**Solução:**
- Inicie o MySQL
- Verifique se a porta 3306 está correta
- Tente: `mysql -u root -p` no terminal

### ❌ "Access denied for user 'root'@'localhost'"

**Problema:** Credenciais incorretas  
**Solução:**
- Edite `.env` com as credenciais corretas
- Teste a conexão: `mysql -u root -p`

### ❌ "Database does not exist"

**Problema:** Schema não foi executado  
**Solução:**
- Execute: `npm run init-db`
- Verifique permissões do usuário MySQL

### ❌ "Port 3001 is already in use"

**Problema:** Porta 3001 já está em uso  
**Solução:**
- Altere em `.env`: `PORT=3002`
- Ou finalize o processo que usa a porta

## ✅ Verificar Conexão

Para verificar se o banco está conectado corretamente, você pode acessar:

```bash
curl http://localhost:3001/api/users
```

Se receber uma resposta (mesmo que erro), a conexão está funcionando!

## 📊 Estrutura do Banco

As tabelas criadas são:
- `users` - Usuários da plataforma
- `posts` - Posts/publicações
- `reels` - Vídeos curtos
- `stories` - Histórias temporárias
- `messages` - Mensagens privadas
- `followers` - Relação de seguidores
- `likes` - Curtidas em posts
- `comments` - Comentários

## 🔐 Segurança em Produção

Antes de fazer deploy:
1. Altere o `JWT_SECRET` em `.env`
2. Use senha segura para MySQL
3. Configure SSL/TLS para conexão remota
4. Use variáveis de ambiente em plataformas como Vercel, Heroku, etc.

---

Para mais informações, consulte: [README.md](../README.md)

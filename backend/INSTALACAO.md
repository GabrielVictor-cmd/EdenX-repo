# 🚀 EdenX Backend - Guia de Instalação

## Pré-requisitos

- Node.js (v14 ou superior) - [Download](https://nodejs.org/)
- MySQL Server (v5.7 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- Git

## Passo 1: Instalação do Node.js e Dependências

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install
```

## Passo 2: Configurar Banco de Dados MySQL

### Opção A: Usando MySQL Workbench

1. Abra MySQL Workbench
2. Conecte-se ao seu servidor MySQL
3. Clique em `File > Open SQL Script` e selecione `schema.sql`
4. Clique em "Execute" (ou Ctrl+Shift+Enter)

### Opção B: Usando Command Line

```bash
# Entre no MySQL
mysql -u root -p

# Execute o script
source path/to/schema.sql
```

## Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=edenx_db

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (mude isso em produção!)
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## Passo 4: Criar Pastas de Uploads

```bash
# Windows
mkdir uploads\posts
mkdir uploads\stories
mkdir uploads\reels

# Linux/Mac
mkdir -p uploads/posts
mkdir -p uploads/stories
mkdir -p uploads/reels
```

## Passo 5: Iniciar o Servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

Se tudo correr bem, você verá:
```
✓ Conexão com banco de dados estabelecida com sucesso
🚀 Servidor EdenX rodando em http://localhost:3001
📱 WebSocket ativo para mensagens em tempo real
```

## Endpoints Principais

### Autenticação
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login

### Posts
- `GET /api/posts/feed` - Carregar feed
- `POST /api/posts` - Criar novo post
- `POST /api/posts/:postId/like` - Curtir post
- `POST /api/posts/:postId/comments` - Adicionar comentário

### Stories
- `GET /api/stories/active` - Listar stories ativos
- `POST /api/stories` - Criar novo story
- `POST /api/stories/:storyId/view` - Marcar como visualizado

### Mensagens
- `GET /api/messages/list` - Listar conversas
- `GET /api/messages/conversation/:otherUserId` - Carregar conversa
- `POST /api/messages` - Enviar mensagem

### Busca
- `GET /api/search/users?query=...` - Buscar usuários
- `GET /api/search/posts?query=...` - Buscar posts

### Reels
- `GET /api/reels` - Listar reels
- `POST /api/reels` - Criar novo reel

## Solução de Problemas

### Erro: "connect ECONNREFUSED"
- Certifique-se de que o MySQL está rodando
- Verifique as credenciais no `.env`

### Erro: "Table doesn't exist"
- Execute o `schema.sql` novamente através do MySQL

### Porta 3001 já em uso
- Mude a porta no `.env`: `PORT=3002`

## API Documentation

A API está pronta para ser integrada. Use o token JWT retornado no login para autenticar outras requisições:

```javascript
// Exemplo de requisição autenticada
fetch('/api/posts/feed', {
  headers: {
    'Authorization': 'Bearer seu_token_jwt_aqui'
  }
})
```

## WebSocket (Mensagens em Tempo Real)

O servidor inclui suporte a WebSocket para mensagens em tempo real. Conecte-se usando:

```javascript
const socket = io('http://localhost:3001');

socket.emit('user-online', userId);
socket.on('receive-message', (data) => {
  console.log('Nova mensagem:', data);
});
```

# 🎯 EdenX - Rede Social Cyberpunk

**Status**: ✓ Backend pronto | ✓ Frontend integrado | ✓ API RESTful | ✓ WebSocket real-time

Um projeto de rede social com tema cyberpunk neon, desenvolvido em HTML5, CSS3, JavaScript Frontend e Node.js/Express Backend.

## 🚀 Quick Start (5 minutos)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais MySQL
npm run dev
```

### MySQL

```bash
mysql -u root -p < backend/schema.sql
```

### Frontend

Abra `index.html` em `http://localhost:3000` (servidor estático) ou use Live Server do VS Code.

## 📋 Requisitos

- **Node.js** v14+ - [Download](https://nodejs.org/)
- **MySQL** 5.7+ - [Download](https://dev.mysql.com/)
- **Navegador moderno** (Chrome, Firefox, Edge)

## 🏗️ Estrutura do Projeto

```
EdenX/
├── index.html              # HTML principal
├── styles.css              # Estilos CSS
├── script.js              # Scripts originais
├── api-client.js          # Cliente API (novo)
├── app.js                 # Lógica da aplicação (novo)
├── images/                # Imagens do projeto
└── backend/               # ⭐ Servidor Node.js
    ├── server.js          # Arquivo principal
    ├── package.json
    ├── .env.example       # Template de variáveis
    ├── schema.sql         # Schema do banco de dados
    ├── config/
    │   └── database.js    # Config do MySQL
    ├── models/            # Modelos de dados
    │   ├── User.js
    │   ├── Post.js
    │   ├── Story.js
    │   ├── Message.js
    │   └── Reel.js
    ├── controllers/       # Lógica de negócio
    │   ├── userController.js
    │   ├── postController.js
    │   ├── storyController.js
    │   ├── messageController.js
    │   ├── searchController.js
    │   └── reelController.js
    ├── routes/            # Rotas da API
    │   ├── users.js
    │   ├── posts.js
    │   ├── stories.js
    │   ├── messages.js
    │   ├── search.js
    │   └── reels.js
    ├── middleware/        # Middlewares
    │   └── auth.js        # Autenticação JWT
    ├── uploads/           # Pasta para uploads
    │   ├── posts/
    │   ├── stories/
    │   └── reels/
    └── INSTALACAO.md      # Guia de instalação detalhado
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil autenticado
- `PUT /api/users/profile` - Atualizar perfil

### Posts
- `GET /api/posts/feed` - Feed do usuário
- `POST /api/posts` - Criar post
- `GET /api/posts/:postId` - Detalhe do post
- `POST /api/posts/:postId/like` - Curtir
- `DELETE /api/posts/:postId/like` - Remover curtida
- `POST /api/posts/:postId/comments` - Adicionar comentário
- `GET /api/posts/:postId/comments` - Listar comentários

### Stories
- `GET /api/stories/active` - Stories ativos (24h)
- `POST /api/stories` - Criar story
- `GET /api/stories/user/:userId` - Stories de um usuário
- `GET /api/stories/followers/list` - Stories dos seguidores
- `POST /api/stories/:storyId/view` - Marcar como visto

### Mensagens (Real-time com WebSocket)
- `GET /api/messages/list` - Listar conversas
- `GET /api/messages/conversation/:userId` - Carregar conversa
- `POST /api/messages` - Enviar mensagem
- `GET /api/messages/unread/count` - Contar não lidas

### Reels (Com lazy loading)
- `GET /api/reels` - Listar reels (paginado)
- `POST /api/reels` - Criar reel
- `GET /api/reels/:reelId` - Detalhe do reel
- `POST /api/reels/:reelId/like` - Curtir reel

### Busca
- `GET /api/search/users?query=...` - Buscar usuários
- `GET /api/search/posts?query=...` - Buscar posts

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)**. 

### Como usar:
1. Faça login/registro
2. Armazene o token retornado
3. Envie em todas as requisições autenticadas:
```javascript
headers: {
  'Authorization': 'Bearer seu_token_aqui'
}
```

## 🔄 WebSocket (Real-time)

Mensagens em tempo real via Socket.IO:

```javascript
// Conectar
const socket = io('http://localhost:3001');

// Enviar
socket.emit('send-message', {
  senderId: userId,
  recipientId: 123,
  message: 'Olá!'
});

// Receber
socket.on('receive-message', (data) => {
  console.log('Nova mensagem:', data);
});
```

## 📊 Banco de Dados

### Tabelas Principais:
- **users** - Usuários cadastrados
- **posts** - Posts/feeds
- **stories** - Stories (expira em 24h)
- **messages** - Mensagens (real-time)
- **reels** - Vídeos curtos
- **likes** - Curtidas em posts
- **comments** - Comentários
- **followers** - Relacionamento de seguimento

## 🎨 Funcionalidades Implementadas

✅ **Autenticação**
- Registro com validação
- Login com JWT
- Perfil do usuário
- Seguir/Deixar de seguir

✅ **Posts**
- Criar posts com imagem
- Sistema de curtidas
- Comentários
- Feed personalizado

✅ **Stories** ⭐
- Criar stories (expira 24h)
- Visualizar stories de outros
- Rastrear visualizações
- Histórico automático

✅ **Mensagens** ⭐
- Chat real-time (WebSocket)
- Histórico de conversas
- Marcar como lido
- Notificações

✅ **Reels** ⭐
- Lazy loading (carrega ao scroll)
- Curtir reels
- Vídeos com legenda
- Paginação automática

✅ **Busca**
- Buscar usuários
- Buscar posts
- Buscar por tags

## 🔧 Variáveis de Ambiente (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=edenx_db

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui_mude_em_producao

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🧪 Teste a API

### Exemplo: Registrar usuário
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "neon_user",
    "email": "neon@edenx.com",
    "password": "senha123",
    "passwordConfirm": "senha123"
  }'
```

### Exemplo: Fazer login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "neon@edenx.com",
    "password": "senha123"
  }'
```

## 📱 Desenvolvimento

### Frontend

Os arquivos do frontend estão organizados para fácil manutenção:

- **script.js** - Lógica original (mantido para compatibilidade)
- **api-client.js** - Cliente HTTP + Gerenciador de APIs
- **app.js** - Lógica de integração (lazy loading, stories, etc)

### Backend

Para desenvolvimento com auto-reload:
```bash
cd backend
npm install -g nodemon
npm run dev
```

## 🚀 Deploy

### Vercel/Netlify (Frontend)
```bash
npm install -g vercel
vercel
```

### Heroku (Backend)
```bash
heroku login
heroku create seu-app
git push heroku main
```

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `ECONNREFUSED` | MySQL não está rodando |
| `Table doesn't exist` | Execute `schema.sql` novamente |
| `Port 3001 in use` | Mude `PORT` no `.env` |
| `401 Unauthorized` | Token inválido/expirado |
| `CORS error` | Verifique `api-client.js` URL |

## 📝 Licença

MIT License - Projeto educacional

## 👥 Contribuindo

Sinta-se livre para fazer um fork e sugerir melhorias!

---

**Desenvolvido com ❤️ para a comunidade EdenX**

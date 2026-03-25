# 🏗️ Arquitetura do EdenX

## Diagrama de Fluxo

```
┌─────────────────┐
│   FRONTEND      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │
         │ HTTP + WebSocket
         │
┌────────▼──────────────────┐
│   API GATEWAY (Port 3001)  │
│   Express.js + Socket.IO   │
└────────┬──────────────────┘
         │
    ┌────┴────┬─────────────┬──────────┬──────────┐
    │          │             │          │          │
┌───▼──┐  ┌───▼──┐  ┌───────▼──┐  ┌──▼──────┐  ┌▼──────┐
│Users │  │Posts │  │ Messages │  │Stories  │  │Reels  │
│(Auth)│  │(Feed)│  │(Real-tm) │  │(24h)    │  │(Video)│
└───┬──┘  └───┬──┘  └───────┬──┘  └──┬──────┘  └┬──────┘
    │         │             │         │         │
    └─────────┴─────────────┴─────────┴─────────┘
              │
    ┌─────────▼──────────┐
    │  MySQL Database    │
    │  (InnoDB)          │
    └────────────────────┘
```

## Componentes Principais

### 1. Frontend
**Arquivos**: `index.html`, `styles.css`, `script.js`, `app.js`, `api-client.js`

- Interface responsiva com tema cyberpunk
- Integração com APIs RESTful
- WebSocket para mensagens real-time
- Lazy loading para reels
- Upload de imagens/vídeos

### 2. Backend API
**Stack**: Node.js + Express.js

**Rotas Principais**:
- `/api/users` - Autenticação e perfil
- `/api/posts` - Feed e posts
- `/api/stories` - Stories (24h)
- `/api/messages` - Mensagens
- `/api/reels` - Vídeos curtos
- `/api/search` - Busca global

### 3. Banco de Dados
**SGBD**: MySQL 5.7+

**Tabelas**:
```
users ──┬─── followers
        ├─── posts ──┬─── likes
        │            └─── comments
        ├─── stories ──── story_views
        ├─── messages
        └─── reels ──┬─── reel_likes
                     └─── reel_comments
```

### 4. Autenticação
- **Tipo**: JWT (JSON Web Tokens)
- **Duração**: 24 horas
- **Armazenamento**: localStorage
- **Header**: `Authorization: Bearer <token>`

### 5. WebSocket (Real-time)
- **Biblioteca**: Socket.IO
- **Eventos**:
  - `user-online` - Usuário conecta
  - `send-message` - Envia mensagem
  - `receive-message` - Recebe mensagem
  - `new-post` - Novo post criado
  - `new-story` - Novo story criado

## Fluxo de Autenticação

```
1. Usuário registra/loga
        ↓
2. API retorna JWT + dados
        ↓
3. Frontend armazena em localStorage
        ↓
4. Cada requisição envia Bearer token
        ↓
5. Middleware valida JWT
        ↓
6. Processa requisição
```

## Fluxo de Lazy Loading (Reels)

```
1. Página carrega
        ↓
2. API: GET /reels?limit=20&offset=0
        ↓
3. Mostrar 20 reels
        ↓
4. Usuário scroll
        ↓
5. Detecta 80% da página
        ↓
6. API: GET /reels?limit=20&offset=20
        ↓
7. Adiciona mais reels dinamicamente
```

## Fluxo de Stories

```
CRIAR STORY:
1. Usuário clica "Seu story"
2. Upload de imagem
3. API: POST /stories (com imagem)
4. Definir expiration = NOW() + 24H
5. Emitir WebSocket 'new-story'
6. Story aparece em tempo real

VER STORY:
1. Usuário clica em story
2. Sistema abre modal
3. API: POST /stories/:id/view (rastrear)
4. Mostrar por X segundos
5. Fechar automaticamente

EXPIRAÇÃO:
- Cron job a cada hora deleta stories expirados
- queryTimeExpired DELETE de stories
```

## Stack Técnico Completo

### Frontend
```
HTML5
├── CSS3 (Custom Properties, Grid, Flexbox)
├── JavaScript ES6+
│   ├── api-client.js (Camada API)
│   ├── app.js (Lógica principal)
│   └── script.js (Compatibilidade)
├── Socket.IO (WebSocket)
└── Font Awesome 6 (Ícones)
```

### Backend
```
Node.js
├── Express.js (Framework web)
├── Socket.IO (WebSocket)
├── Multer (Upload de arquivos)
├── JWT (Autenticação)
├── bcryptjs (Hash de senhas)
└── dotenv (Variáveis de ambiente)
```

### Banco de Dados
```
MySQL 5.7+
├── InnoDB (Integridade referencial)
├── Índices otimizados
├── Triggers (Limpeza de stories)
└── Particionamento de histórico (opcional)
```

## Segurança

### Implementado ✓
- Hash de senhas com bcryptjs
- JWT com expiração
- CORS habilitado
- Validação de inputs
- Proteção contra XSS (escapar HTML)
- SQL Injection prevention (prepared statements)

### Recomendado para Produção
- HTTPS/TLS
- Rate limiting
- CSRF tokens
- Content Security Policy (CSP)
- Helmet.js
- Autorização baseada em roles
- Audit logging
- 2FA opcional

## Performance

### Otimizações Implementadas
- Lazy loading de reels (20 por vez)
- Índices no MySQL para buscas rápidas
- Caching de stories ativos (24h)
- Paginação em todos endpoints
- Compressão de imagens (opcional)

### Métricas Esperadas
- API response: < 200ms
- Lazy load: 2-3 segundos por batch
- WebSocket: < 100ms real-time

## Escalabilidade

### Horizontal
- Adicionar múltiplos workers Node.js
- Load balancer (Nginx/HAProxy)
- Redis para sessões compartilhadas

### Vertical
- MySQL connection pooling
- Query caching
- CDN para assets estáticos
- Message queue (RabbitMQ/Redis) para uploads

## Deployment

### Desenvolvimento
```bash
Backend: npm run dev (nodemon)
Frontend: Live Server (VS Code)
```

### Produção
```bash
Backend: Heroku/AWS/DigitalOcean
Frontend: Vercel/Netlify
Database: AWS RDS/Google Cloud SQL
```

## Roadmap Futuro

- [ ] Sistema de notificações push
- [ ] Histórico de edições de posts
- [ ] Hashtags com trending topics
- [ ] Sistema de recomendação
- [ ] Filtros em stories (stickers, emojis)
- [ ] Grupos e comunidades
- [ ] Streaming ao vivo
- [ ] Desafios (challenges)
- [ ] Sistema de moeda interna
- [ ] Analytics para criadores

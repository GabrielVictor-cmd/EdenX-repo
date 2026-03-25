# 🧪 Guia de Testes - EdenX

## Prerequisitos
- Backend rodando em `http://localhost:3001`
- MySQL conectado e schema importado
- Navegador com DevTools aberto (F12)

## 1️⃣ Teste de Autenticação

### Registrar
```javascript
// No console do navegador
await register('seu_username', 'seu_email@test.com', 'senha123', 'senha123')
// Verify: localStorage deve ter 'edenx_token'
```

### Login
```javascript
await login('seu_email@test.com', 'senha123')
console.log(SESSION) // Verificar se token está preenchido
```

## 2️⃣ Teste de Posts

### Criar Post
```javascript
// Com URL de imagem
await createPost('Meu primeiro post! 🎉', 'https://picsum.photos/800/1000')

// Com arquivo
const fileInput = document.createElement('input')
fileInput.type = 'file'
fileInput.accept = 'image/*'
fileInput.onchange = (e) => createPost('Post com imagem', null, e.target.files[0])
fileInput.click()
```

### Carregar Feed
```javascript
const result = await getFeed(20, 0)
console.log(result.data) // Deve retornar array de posts
```

### Curtir Post
```javascript
// Encontre um postId da lista de posts
await likePost(1)
// Verifique se likes_count aumentou
```

## 3️⃣ Teste de Stories

### Criar Story
```javascript
// Com URL
await createStory('https://picsum.photos/400/600')

// Com arquivo
const input = document.createElement('input')
input.type = 'file'
input.accept = 'image/*'
input.onchange = (e) => createStory(null, e.target.files[0])
input.click()
```

### Listar Stories Ativos
```javascript
const result = await getActiveStories()
console.log(result.data) // Stories ativos (24h)
```

### Marcar Como Visto
```javascript
await markStoryViewed(1) // story_id
```

## 4️⃣ Teste de Mensagens

### Enviar Mensagem
```javascript
// Primeira, encontre user_id de outro usuário
// Digamos que é o ID 2
await sendMessage(2, 'Olá! Como você está?')
```

### Listar Conversas
```javascript
const result = await getConversations()
console.log(result.data) // Lista de conversas
```

### Carregar Conversa
```javascript
// Carrega histórico com outro usuário
const result = await getConversation(2, 50, 0)
console.log(result.data) // Array de mensagens
```

## 5️⃣ Teste de Reels

### Listar Reels
```javascript
const result = await getReels(20, 0)
console.log(result.data) // Lista com lazy loading

// Teste lazy loading - scroll no container
const reelsContainer = document.getElementById('view-reels')
reelsContainer.scrollTop = reelsContainer.scrollHeight
// Deve carregar mais reels
```

### Curtir Reel
```javascript
await likeReel(1) // reel_id
```

## 6️⃣ Teste de Busca

### Buscar Usuários
```javascript
const result = await searchUsers('neon')
console.log(result.data) // Usuários encontrados
```

### Buscar Posts
```javascript
const result = await searchPosts('cyberpunk')
console.log(result.data) // Posts encontrados
```

## 🔌 Teste WebSocket (Mensagens Real-time)

### Conectar
```javascript
initWebSocket()
console.log(socket) // Deve estar conectado
```

### Enviar via Socket
```javascript
socket.emit('send-message', {
  senderId: SESSION.userId,
  recipientId: 2,
  message: 'Teste WebSocket'
})
```

### Receber Mensagem
```javascript
window.addEventListener('new-message', (e) => {
  console.log('Mensagem recebida:', e.detail)
})
```

## 📊 Teste de Performance

### Lazy Loading dos Reels
1. Abra a aba "Reels"
2. Scroll até o final
3. Verifique no DevTools > Network
4. Deve fazer requisição com `offset` incrementado

### Carregamento de Stories
1. Clique em "Seu story" no topo
2. Upload uma imagem
3. Recarregue a página
4. Story deve aparecer na lista

## 🔐 Teste de Autenticação JWT

### Verificar Token
```javascript
const token = localStorage.getItem('edenx_token')
console.log(token)

// Decodificar (base64)
const payload = token.split('.')[1]
console.log(JSON.parse(atob(payload)))
```

### Fazer Request Autenticada
```javascript
const result = await fetch('http://localhost:3001/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${SESSION.token}`
  }
})
const data = await result.json()
console.log(data)
```

## 🧪 API Testing com cURL

### Registrar
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@test.com","password":"123456","passwordConfirm":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Criar Post (com token)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"caption":"Test post","image_url":"https://picsum.photos/800/1000"}'
```

## ✅ Checklist de Testes

- [ ] Registrar novo usuário
- [ ] Fazer login
- [ ] Criar post com imagem
- [ ] Curtir post
- [ ] Adicionar comentário
- [ ] Criar story
- [ ] Visualizar story
- [ ] Enviar mensagem
- [ ] Receber mensagem (WebSocket)
- [ ] Listar conversas
- [ ] Carregar reels com scroll
- [ ] Curtir reel
- [ ] Buscar usuário
- [ ] Buscar post
- [ ] Seguir usuário
- [ ] Verificar lazy loading dos reels

## 📝 Notas Importantes

- Tokens JWT expiram em 24h (configurável em server.js)
- Stories expiram automaticamente após 24h
- WebSocket requer ambos cliente e servidor online
- Upload máximo: 5MB (configurável)
- Lazy loading carrega 20 itens por vez

## 🐛 Se algo não funcionar

1. Abra DevTools (F12)
2. Verifique Console para erros
3. Verifique Network tab para requisições
4. Confirme que backend está rodando
5. Confirme que MySQL está online
6. Limpe localStorage: `localStorage.clear()`

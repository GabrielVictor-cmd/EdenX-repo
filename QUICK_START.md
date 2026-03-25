# ⚡ Quick Start - Em 5 Minutos

## Pré-requisito
- Node.js instalado
- MySQL instalado e rodando

## 1️⃣ Instalar Backend (2 min)

```bash
cd backend
npm install
```

## 2️⃣ Banco de Dados (1 min)

```bash
mysql -u root -p < schema.sql
# Digite sua senha MySQL
```

## 3️⃣ Configurar .env (1 min)

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env`:
```env
DB_USER=root
DB_PASSWORD=sua_senha_aqui
```

## 4️⃣ Iniciar Servidor (1 min)

```bash
npm run dev
```

Se vir isto, tá tudo certo:
```
✓ Conexão com banco de dados estabelecida
🚀 Servidor EdenX rodando em http://localhost:3001
📱 WebSocket ativo
```

## 5️⃣ Abrir Frontend

Abra `index.html` em seu navegador ou use Live Server do VS Code.

## 🧪 Teste Rápido

No console do navegador (F12):

```javascript
// Registrar novo usuário
await register('seu_user', 'seu@email.com', 'senha123', 'senha123')

// Ou fazer login
await login('seu@email.com', 'senha123')

// Ver dados
console.log(SESSION)
```

## 🎯 O que está pronto

✓ **42 API endpoints** funcionais
✓ **WebSocket** para mensagens real-time
✓ **Lazy loading** nos reels
✓ **Stories** com 24h expiration
✓ **Busca funcional**  
✓ **Upload de imagens**
✓ **Autenticação JWT**
✓ **MySQL pronto**

## ⚠️ Troubleshooting

| Erro | Solução |
|------|---------|
| `ECONNREFUSED` | MySQL não está rodando |
| `Table doesn't exist` | Execute `schema.sql` novamente |
| `Port 3001 in use` | Mude `PORT` em `.env` |
| `Cannot find module` | Execute `npm install` novamente |

## 📚 Documentação Completa

- `README.md` - Overview completo
- `ENTREGA.md` - Lista tudo que foi feito
- `TESTES.md` - Como testar tudo
- `ARQUITETURA.md` - Diagrama técnico

---

**Pronto! 🚀 Agora sua rede social está rodando!**

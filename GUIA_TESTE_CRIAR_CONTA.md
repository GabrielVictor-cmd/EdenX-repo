# 🧪 Guia Rápido de Teste - Criar Conta

## ✅ Verificação Pré-Teste

Antes de testar, verifique:
- [ ] Node.js está instalado
- [ ] npm install foi executado no backend
- [ ] Arquivo `edenx.db` existe em `backend/`
- [ ] Porta 3000 e 3001 estão livres

---

## 🚀 Iniciar a Aplicação

### Terminal 1 - Backend
```bash
cd backend
npm start
```
Esperado: 
```
✓ Conexão com banco de dados SQLite estabelecida com sucesso
✓ Servidor rodando na porta 3001
```

### Terminal 2 - Frontend (opcional, se necessário)
```bash
# Se usar live server ou similar
python -m http.server 3000
```

---

## 📝 Teste 1: Criar conta com nome completo

1. Abra: `http://localhost:3000/login/signup.html`
2. Preencha:
   - Nome Completo: **João Silva**
   - E-mail: **joao@gmail.com**
   - Senha: **123456**
   - Confirmar Senha: **123456**
3. Clique em "CADASTRAR"

**Resultado Esperado:**
```
✓ Conta criada com sucesso!
```
(Redireciona para página principal)

**Username Gerado:** `joao_silva`

---

## 📝 Teste 2: Login com dados criados

1. Abra: `http://localhost:3000/login/index.html`
2. Preencha:
   - Usuário/E-mail: **joao@gmail.com**
   - Senha: **123456**
3. Clique em "ENTRAR"

**Resultado Esperado:**
```
✓ Login bem-sucedido!
```
(Redireciona para página principal com usuário logado)

---

## 📝 Teste 3: Criar segunda conta similar

1. Abra: `http://localhost:3000/login/signup.html`
2. Preencha:
   - Nome Completo: **João Silva** (MESMO NOME)
   - E-mail: **joao2@gmail.com**
   - Senha: **123456**
   - Confirmar Senha: **123456**
3. Clique em "CADASTRAR"

**Resultado Esperado:**
```
✓ Conta criada com sucesso!
```
(Funciona sem erro, mesmo com nome duplicado)

**Username Gerado:** `joao_silva_1710778890000`
(Timestamp adicionado para evitar conflito)

---

## 📝 Teste 4: Registrar com apenas email

1. Abra: `http://localhost:3000/login/signup.html`
2. Preencha:
   - Nome Completo: (deixar vazio)
   - E-mail: **maria@gmail.com**
   - Senha: **senha123**
   - Confirmar Senha: **senha123**
3. Clique em "CADASTRAR"

**Resultado Esperado:**
```
✓ Conta criada com sucesso!
```

**Username Gerado:** `maria`
(Derivado do email automaticamente)

---

## 🔍 Verificação no Banco de Dados

Para verificar dados criados (usar DB Browser for SQLite ou similar):

```sql
-- Ver todos os usuários criados
SELECT id, username, email, created_at FROM users;

-- Resultado esperado:
-- 1 | joao_silva | joao@gmail.com | 2026-03-17 10:30:45
-- 2 | joao_silva_1710778890000 | joao2@gmail.com | 2026-03-17 10:31:20
-- 3 | maria | maria@gmail.com | 2026-03-17 10:32:15
```

---

## ❌ Se Algum Teste Falhar:

### Erro: "Email já cadastrado"
- Significa que um email já foi usado
- Use outro email para teste

### Erro: "As senhas não correspondem"
- Verifique se as senhas estão iguais
- A confirmação deve ser idêntica

### Erro: "Erro de conexão com o servidor"
- Verifique if backend está rodando (`npm start`)
- Verifique se está na porta 3001
- Verifique firewall

### Erro: "Erro ao registrar usuário" (genérico)
- Reinicie o backend: Ctrl+C e `npm start`
- Se persistir, execute: `node reset-database.js`

---

## 📊 Checklist de Conclusão

- [ ] Teste 1: Conta criada com nome completo ✓
- [ ] Teste 2: Login funcionando ✓
- [ ] Teste 3: Segundo cadastro similar funcionou ✓
- [ ] Teste 4: Cadastro sem nome funcionou ✓
- [ ] Banco de dados tem múltiplos usuários ✓

**Se todas as caixas estão marcadas: 🎉 As correções funcionam perfeitamente!**

---

## 🔄 Para Resetar e Testar Novamente

```bash
cd backend
node reset-database.js
npm start
```

Isso apaga todos os dados e cria um banco limpo.

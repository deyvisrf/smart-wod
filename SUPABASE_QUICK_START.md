# 🚀 Supabase Quick Start - SmartWod

## ⚡ Setup Rápido (5 minutos)

### 1. Criar projeto no Supabase
- Acesse https://supabase.com
- Clique **"New Project"**
- Nome: `smartwod`
- Região: `South America (São Paulo)`
- Aguarde 2-3 minutos

### 2. Configurar variáveis
```bash
# Copie env.example.txt para .env.local
copy env.example.txt .env.local

# Edite .env.local com suas chaves reais do Supabase
```

**Onde encontrar as chaves:**
- No painel Supabase: **Settings > API**
- **Project URL**: `https://[id].supabase.co`
- **anon key**: Chave que começacom `eyJhbGciOiJIUzI1NiIs...`

### 3. Executar scripts SQL
No **SQL Editor** do Supabase, execute nesta ordem:
1. `supabase/migrations/001_initial_tables.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_functions_triggers.sql`
4. `supabase/migrations/004_storage_setup.sql`

### 4. Configurar Auth
**Authentication > Settings:**
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Testar
```bash
npm run dev
```
- Acesse http://localhost:3000
- Crie uma conta de teste
- Verifique se funciona

## 🔍 Verificar Setup
```bash
node scripts/verify-supabase-setup.js
```

## 📖 Guide Completo
Para instruções detalhadas e solução de problemas, consulte:
**[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**

## 🆘 Problemas Comuns

**❌ "Invalid API key"**
- Verifique `.env.local`
- Reinicie o servidor (`Ctrl+C` + `npm run dev`)

**❌ "Could not connect"**
- Aguarde alguns minutos (banco inicializando)

**❌ "RLS policy violation"**
- Execute todos os scripts SQL
- Certifique-se de estar logado

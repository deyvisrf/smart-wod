# Configuração do Supabase

## 1. Criar projeto no Supabase
1. Acesse https://supabase.com e crie uma conta
2. Clique em "New Project"
3. Escolha uma organização e configure:
   - Nome do projeto: "smartwod"
   - Database Password: [gere uma senha forte]
   - Região: South America (São Paulo) - mais próxima do Brasil

## 2. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui

# OpenAI (já existente)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

**Como encontrar as chaves:**
- URL e Anon Key: Vá em Settings > API no painel do Supabase

## 3. Executar scripts SQL
Após criar o projeto, execute os scripts SQL no SQL Editor do Supabase para criar as tabelas e políticas.

## 4. Configurar Storage
Configure os buckets no Storage para upload de imagens:
- `avatars` - para fotos de perfil
- `wod-media` - para imagens dos WODs

## 5. Configurar Authentication
No painel Auth > Settings:
- Habilitar email/password signup
- Configurar OAuth providers (Google, Facebook)
- Configurar URLs de redirect para localhost e domínio de produção

# 🚀 Guide Completo de Setup do Supabase - SmartWod

Este guide te leva do zero até ter o Supabase completamente configurado para o SmartWod.

## 📋 Pré-requisitos

- Conta no GitHub (para login no Supabase)
- Projeto Next.js do SmartWod funcionando localmente

## 🌟 Passo 1: Criar Conta e Projeto no Supabase

### 1.1 Criar Conta
1. Acesse https://supabase.com
2. Clique em **"Start your project"**
3. Clique em **"Sign up"**
4. Entre com GitHub (recomendado) ou email

### 1.2 Criar Projeto
1. Após login, clique em **"New Project"**
2. Selecione ou crie uma **Organização**
3. Configure o projeto:
   - **Name**: `smartwod` (ou nome de sua preferência)
   - **Database Password**: Gere uma senha forte (anote ela!)
   - **Region**: `South America (São Paulo)` (mais próxima do Brasil)
   - **Pricing Plan**: `Free tier` (suficiente para desenvolvimento)
4. Clique em **"Create new project"**
5. **Aguarde 2-3 minutos** até o projeto ser provisionado

## 🔑 Passo 2: Obter Chaves de API

### 2.1 Encontrar as Chaves
1. No painel do projeto, vá em **Settings** (ícone de engrenagem) > **API**
2. Anote estas informações:
   - **Project URL**: `https://[seu-id-projeto].supabase.co`
   - **anon/public key**: Chave que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2.2 Configurar Variáveis de Ambiente
1. Na raiz do projeto SmartWod, crie o arquivo `.env.local`:

```bash
# Navegue até a pasta do projeto
cd C:\Users\deyvi\Documents\smart-wod

# Crie o arquivo .env.local
echo. > .env.local
```

2. Abra `.env.local` e adicione:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU-ID-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI

# OpenAI (mantenha se já configurado)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

**⚠️ Substitua:**
- `SEU-ID-PROJETO` pelo ID real do seu projeto
- `SUA_ANON_KEY_AQUI` pela chave anon copiada

## 🗄️ Passo 3: Criar Tabelas no Banco de Dados

### 3.1 Acessar SQL Editor
1. No painel Supabase, vá em **SQL Editor** (ícone `</>`)
2. Clique em **"New query"**

### 3.2 Executar Scripts SQL
Execute os scripts nesta ordem exata:

#### Script 1: Tabelas Principais
Copie e cole o conteúdo de `supabase/migrations/001_initial_tables.sql` e clique **RUN**:

<details>
<summary>📄 Ver conteúdo do Script 1</summary>

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuários (complementa auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  wods_count INTEGER DEFAULT 0
);

-- Tabela de WODs
CREATE TABLE public.wods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  warmup JSONB,
  main JSONB,
  cooldown JSONB,
  notes TEXT,
  equipment TEXT[],
  style TEXT,
  preset TEXT,
  load_recommendations JSONB,
  media TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- Tabela de curtidas
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wod_id)
);

-- Tabela de comentários
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de seguidores
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Tabela de grupos
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  members_count INTEGER DEFAULT 1
);

-- Tabela de desafios
CREATE TABLE public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  participants_count INTEGER DEFAULT 1
);

-- Tabela de mensagens
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Índices para melhor performance
CREATE INDEX idx_wods_user_id ON public.wods(user_id);
CREATE INDEX idx_wods_created_at ON public.wods(created_at DESC);
CREATE INDEX idx_likes_wod_id ON public.likes(wod_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_comments_wod_id ON public.comments(wod_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_messages_from_user_id ON public.messages(from_user_id);
CREATE INDEX idx_messages_to_user_id ON public.messages(to_user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wods_updated_at BEFORE UPDATE ON public.wods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
</details>

#### Script 2: RLS Policies (Segurança)
Clique **"New query"** novamente e execute o conteúdo de `supabase/migrations/002_rls_policies.sql`:

<details>
<summary>🔒 Ver conteúdo do Script 2</summary>

```sql
-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PROFILES
-- Todos podem ver perfis públicos
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS PARA WODS
-- Todos podem ver WODs
CREATE POLICY "WODs are viewable by everyone" ON public.wods
  FOR SELECT USING (true);

-- Usuários autenticados podem criar WODs
CREATE POLICY "Authenticated users can create WODs" ON public.wods
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios WODs
CREATE POLICY "Users can update own WODs" ON public.wods
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios WODs
CREATE POLICY "Users can delete own WODs" ON public.wods
  FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICAS PARA LIKES
-- Todos podem ver likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

-- Usuários autenticados podem dar like
CREATE POLICY "Authenticated users can like" ON public.likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Usuários podem remover apenas seus próprios likes
CREATE POLICY "Users can delete own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICAS PARA COMMENTS
-- Todos podem ver comentários
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

-- Usuários autenticados podem comentar
CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios comentários
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios comentários
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICAS PARA FOLLOWS
-- Todos podem ver seguidores
CREATE POLICY "Follows are viewable by everyone" ON public.follows
  FOR SELECT USING (true);

-- Usuários autenticados podem seguir outros
CREATE POLICY "Authenticated users can follow" ON public.follows
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = follower_id);

-- Usuários podem remover apenas seus próprios follows
CREATE POLICY "Users can unfollow" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- POLÍTICAS PARA GROUPS
-- Todos podem ver grupos
CREATE POLICY "Groups are viewable by everyone" ON public.groups
  FOR SELECT USING (true);

-- Usuários autenticados podem criar grupos
CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios grupos
CREATE POLICY "Users can update own groups" ON public.groups
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios grupos
CREATE POLICY "Users can delete own groups" ON public.groups
  FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICAS PARA CHALLENGES
-- Todos podem ver desafios
CREATE POLICY "Challenges are viewable by everyone" ON public.challenges
  FOR SELECT USING (true);

-- Usuários autenticados podem criar desafios
CREATE POLICY "Authenticated users can create challenges" ON public.challenges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios desafios
CREATE POLICY "Users can update own challenges" ON public.challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios desafios
CREATE POLICY "Users can delete own challenges" ON public.challenges
  FOR DELETE USING (auth.uid() = user_id);

-- POLÍTICAS PARA MESSAGES
-- Usuários podem ver mensagens onde são remetente ou destinatário
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Usuários autenticados podem enviar mensagens
CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = from_user_id);

-- Usuários podem atualizar apenas suas próprias mensagens (para marcar como lida)
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Usuários podem deletar apenas mensagens que enviaram
CREATE POLICY "Users can delete own sent messages" ON public.messages
  FOR DELETE USING (auth.uid() = from_user_id);
```
</details>

#### Script 3: Functions e Triggers
Clique **"New query"** novamente e execute o conteúdo de `supabase/migrations/003_functions_triggers.sql`:

<details>
<summary>⚙️ Ver conteúdo do Script 3</summary>

```sql
-- Função para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, bio, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar contadores quando um like é adicionado/removido
CREATE OR REPLACE FUNCTION public.handle_like_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar contador de likes no WOD
    UPDATE public.wods 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.wod_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar contador de likes no WOD
    UPDATE public.wods 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.wod_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para likes
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_changes();

CREATE TRIGGER on_like_deleted
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_changes();

-- Função para atualizar contadores quando um comentário é adicionado/removido
CREATE OR REPLACE FUNCTION public.handle_comment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar contador de comentários no WOD
    UPDATE public.wods 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.wod_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar contador de comentários no WOD
    UPDATE public.wods 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.wod_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para comentários
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_changes();

CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_changes();

-- Função para atualizar contadores quando um follow é adicionado/removido
CREATE OR REPLACE FUNCTION public.handle_follow_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar following_count do seguidor
    UPDATE public.profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- Incrementar followers_count do seguido
    UPDATE public.profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar following_count do seguidor
    UPDATE public.profiles 
    SET following_count = following_count - 1 
    WHERE id = OLD.follower_id;
    
    -- Decrementar followers_count do seguido
    UPDATE public.profiles 
    SET followers_count = followers_count - 1 
    WHERE id = OLD.following_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para follows
CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_follow_changes();

CREATE TRIGGER on_follow_deleted
  AFTER DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_follow_changes();

-- Função para atualizar contador de WODs no perfil
CREATE OR REPLACE FUNCTION public.handle_wod_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar contador de WODs do usuário
    UPDATE public.profiles 
    SET wods_count = wods_count + 1 
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar contador de WODs do usuário
    UPDATE public.profiles 
    SET wods_count = wods_count - 1 
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para WODs
CREATE TRIGGER on_wod_created
  AFTER INSERT ON public.wods
  FOR EACH ROW EXECUTE FUNCTION public.handle_wod_changes();

CREATE TRIGGER on_wod_deleted
  AFTER DELETE ON public.wods
  FOR EACH ROW EXECUTE FUNCTION public.handle_wod_changes();
```
</details>

#### Script 4: Storage Setup
Clique **"New query"** novamente e execute o conteúdo de `supabase/migrations/004_storage_setup.sql`:

<details>
<summary>📦 Ver conteúdo do Script 4</summary>

```sql
-- Criar buckets de storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('wod-media', 'wod-media', true);

-- Políticas para o bucket de avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatar images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Políticas para o bucket de mídia dos WODs
CREATE POLICY "WOD media images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'wod-media');

CREATE POLICY "Users can upload WOD media images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'wod-media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own WOD media images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'wod-media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own WOD media images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'wod-media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```
</details>

### 3.3 Verificar Criação das Tabelas
1. Vá em **Table Editor** (ícone de tabela)
2. Você deve ver todas as tabelas criadas:
   - `profiles`
   - `wods`
   - `likes`
   - `comments`
   - `follows`
   - `groups`
   - `challenges`
   - `messages`

## 🔐 Passo 4: Configurar Autenticação

### 4.1 Configurações de Email
1. Vá em **Authentication** > **Settings**
2. Na seção **Auth Settings**:
   - **Enable email confirmations**: ✅ Habilitado (recomendado)
   - **Enable secure email change**: ✅ Habilitado
   - **Double confirm email changes**: ✅ Habilitado

### 4.2 Configurar URLs de Redirect
Na seção **URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Adicione:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/home`

### 4.3 Configurar OAuth (Google)

#### Para Google OAuth:
1. Va para **Auth** > **Providers**
2. Encontre **Google** e clique no toggle para habilitar
3. **Você precisará de:**
   - Client ID do Google
   - Client Secret do Google

#### Como obter credenciais do Google:
1. Acesse https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique **Create Credentials** > **OAuth client ID**
5. Selecione **Web application**
6. Configure:
   - **Name**: SmartWod
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: 
     - `https://[seu-projeto].supabase.co/auth/v1/callback`
7. Copie **Client ID** e **Client Secret**
8. Cole no painel Supabase e clique **Save**

## 📦 Passo 5: Configurar Storage

### 5.1 Verificar Buckets
1. Vá em **Storage**
2. Você deve ver os buckets:
   - `avatars` - para fotos de perfil
   - `wod-media` - para imagens dos WODs

### 5.2 Testar Upload (Opcional)
1. Clique em `avatars`
2. Clique **Upload file**
3. Envie uma imagem teste
4. Verifique se aparece na lista

## 🧪 Passo 6: Testar a Configuração

### 6.1 Verificar Conexão
No seu projeto Next.js, teste se a conexão está funcionando:

```bash
# No terminal, na pasta do projeto
npm run dev
```

### 6.2 Verificar Autenticação
1. Abra http://localhost:3000
2. Deve redirecionar para `/auth/login`
3. Tente criar uma conta de teste
4. Verifique se o perfil foi criado automaticamente em **Table Editor** > `profiles`

### 6.3 Verificar RLS
No SQL Editor, teste uma query:

```sql
-- Deve retornar dados apenas se você estiver logado
SELECT * FROM profiles;
```

## ✅ Checklist Final

Marque cada item conforme concluir:

- [ ] ✅ Projeto criado no Supabase
- [ ] ✅ Variáveis de ambiente configuradas (`.env.local`)
- [ ] ✅ Script 1 executado (tabelas criadas)
- [ ] ✅ Script 2 executado (RLS policies)
- [ ] ✅ Script 3 executado (functions e triggers)
- [ ] ✅ Script 4 executado (storage setup)
- [ ] ✅ Todas as tabelas visíveis no Table Editor
- [ ] ✅ Auth configurado (email confirmations, URLs)
- [ ] ✅ OAuth Google configurado (opcional)
- [ ] ✅ Buckets de storage visíveis
- [ ] ✅ App rodando sem erros (`npm run dev`)
- [ ] ✅ Login/cadastro funcionando
- [ ] ✅ Perfil criado automaticamente

## 🚨 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se as variáveis no `.env.local` estão corretas
- Reinicie o servidor Next.js (`Ctrl+C` e `npm run dev`)

### Erro: "Could not connect to database"
- Aguarde alguns minutos, o banco pode estar inicializando
- Verifique se o projeto foi criado com sucesso no painel

### Erro: "RLS policy violation"
- Verifique se todas as policies foram executadas corretamente
- Certifique-se de estar logado ao tentar acessar dados

### Tabelas não aparecem
- Execute novamente o Script 1
- Verifique se não há erros no SQL Editor

### OAuth não funciona
- Verifique se as URLs de redirect estão corretas
- Confirme se o Client ID e Secret estão corretos

## 🎉 Próximos Passos

Após completar este setup:

1. **Testar o login** - criar conta e entrar
2. **Migrar dados** - transferir do localStorage para Supabase
3. **Testar funcionalidades** - WODs, likes, comments, etc.
4. **Deploy** - configurar para produção

---

**🆘 Precisa de ajuda?** Confira a documentação oficial do Supabase: https://supabase.com/docs

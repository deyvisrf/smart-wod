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

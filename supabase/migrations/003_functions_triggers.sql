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

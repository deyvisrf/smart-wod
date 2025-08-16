'use client'

import { supabase } from './supabase'
import type { Database } from './supabase'

// Tipos das tabelas
type LikeRow = Database['public']['Tables']['likes']['Row']
type LikeInsert = Database['public']['Tables']['likes']['Insert']
type CommentRow = Database['public']['Tables']['comments']['Row']
type CommentInsert = Database['public']['Tables']['comments']['Insert']
type FollowRow = Database['public']['Tables']['follows']['Row']
type FollowInsert = Database['public']['Tables']['follows']['Insert']

// Tipos para o frontend
export interface Like {
  id: string
  user_id: string
  wod_id: string
  created_at: string
  user?: {
    name: string
    username: string
    avatar_url?: string
  }
}

export interface Comment {
  id: string
  user_id: string
  wod_id: string
  text: string
  created_at: string
  updated_at: string
  user?: {
    name: string
    username: string
    avatar_url?: string
  }
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  follower?: {
    name: string
    username: string
    avatar_url?: string
  }
  following?: {
    name: string
    username: string
    avatar_url?: string
  }
}

export interface WodWithSocial {
  id: string
  title: string
  user_id: string
  created_at: string
  likes_count: number
  comments_count: number
  is_liked: boolean
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  // ... outros campos do WOD
}

// === SERVIÇOS DE LIKES ===
export class LikeService {
  // Toggle like em um WOD
  static async toggleLike(wodId: string, userId: string): Promise<{ liked: boolean; count: number }> {
    try {
      // Verificar se já tem like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('wod_id', wodId)
        .eq('user_id', userId)
        .single()

      if (existingLike) {
        // Remover like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('wod_id', wodId)
          .eq('user_id', userId)

        if (error) throw error

        // Buscar novo count
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('wod_id', wodId)

        return { liked: false, count: count || 0 }
      } else {
        // Adicionar like
        const { error } = await supabase
          .from('likes')
          .insert({ wod_id: wodId, user_id: userId })

        if (error) throw error

        // Buscar novo count
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('wod_id', wodId)

        return { liked: true, count: count || 0 }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      throw error
    }
  }

  // Buscar likes de um WOD
  static async getWodLikes(wodId: string): Promise<Like[]> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          user:profiles(name, username, avatar_url)
        `)
        .eq('wod_id', wodId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map((like: any) => ({
        ...like,
        user: like.user as any
      }))
    } catch (error) {
      console.error('Error fetching WOD likes:', error)
      return []
    }
  }

  // Verificar se usuário curtiu um WOD
  static async hasUserLiked(wodId: string, userId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('wod_id', wodId)
        .eq('user_id', userId)
        .single()

      return !!data
    } catch (error) {
      return false
    }
  }
}

// === SERVIÇOS DE COMENTÁRIOS ===
export class CommentService {
  // Adicionar comentário
  static async addComment(wodId: string, userId: string, text: string): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ wod_id: wodId, user_id: userId, text })
        .select(`
          *,
          user:profiles(name, username, avatar_url)
        `)
        .single()

      if (error) throw error
      return {
        ...data,
        user: data.user as any
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      return null
    }
  }

  // Buscar comentários de um WOD
  static async getWodComments(wodId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(name, username, avatar_url)
        `)
        .eq('wod_id', wodId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data.map((comment: any) => ({
        ...comment,
        user: comment.user as any
      }))
    } catch (error) {
      console.error('Error fetching WOD comments:', error)
      return []
    }
  }

  // Deletar comentário
  static async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting comment:', error)
      return false
    }
  }

  // Editar comentário
  static async updateComment(commentId: string, userId: string, text: string): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ text, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('user_id', userId)
        .select(`
          *,
          user:profiles(name, username, avatar_url)
        `)
        .single()

      if (error) throw error
      return {
        ...data,
        user: data.user as any
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      return null
    }
  }
}

// === SERVIÇOS DE FOLLOWS ===
export class FollowService {
  // Toggle follow de um usuário
  static async toggleFollow(followingId: string, followerId: string): Promise<{ following: boolean; count: number }> {
    try {
      // Verificar se já segue
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', followingId)
        .eq('follower_id', followerId)
        .single()

      if (existingFollow) {
        // Deixar de seguir
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('following_id', followingId)
          .eq('follower_id', followerId)

        if (error) throw error

        // Buscar novo count de seguidores
        const { count } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', followingId)

        return { following: false, count: count || 0 }
      } else {
        // Seguir
        const { error } = await supabase
          .from('follows')
          .insert({ following_id: followingId, follower_id: followerId })

        if (error) throw error

        // Buscar novo count de seguidores
        const { count } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', followingId)

        return { following: true, count: count || 0 }
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      throw error
    }
  }

  // Verificar se usuário segue outro
  static async isFollowing(followingId: string, followerId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', followingId)
        .eq('follower_id', followerId)
        .single()

      return !!data
    } catch (error) {
      return false
    }
  }

  // Buscar seguidores de um usuário
  static async getFollowers(userId: string): Promise<Follow[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          follower:profiles!follows_follower_id_fkey(name, username, avatar_url)
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map((follow: any) => ({
        ...follow,
        follower: follow.follower as any
      }))
    } catch (error) {
      console.error('Error fetching followers:', error)
      return []
    }
  }

  // Buscar usuários que alguém segue
  static async getFollowing(userId: string): Promise<Follow[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          following:profiles!follows_following_id_fkey(name, username, avatar_url)
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map((follow: any) => ({
        ...follow,
        following: follow.following as any
      }))
    } catch (error) {
      console.error('Error fetching following:', error)
      return []
    }
  }
}

// === SERVIÇO DE FEED ===
export class FeedService {
  // Buscar feed do usuário (WODs de quem ele segue + próprios)
  static async getUserFeed(userId: string, limit: number = 20, offset: number = 0): Promise<WodWithSocial[]> {
    try {
      // Buscar IDs de quem o usuário segue
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId)

      const followingIds = following?.map((f: any) => f.following_id) || []
      const userIds = [userId, ...followingIds]

      // Buscar WODs do feed
      const { data, error } = await supabase
        .from('wods')
        .select(`
          *,
          user:profiles(name, username, avatar_url),
          likes!wods_likes_wod_id_fkey(user_id),
          _likes_count:likes(count),
          _comments_count:comments(count)
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        // Se der erro na tabela wods, retornar array vazio
        if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('WODs table not found. This is normal for new applications.')
          return []
        }
        throw error
      }

      // Processar dados para incluir informações sociais
      return data.map((wod: any) => ({
        id: wod.id,
        title: wod.title,
        user_id: wod.user_id,
        created_at: wod.created_at,
        likes_count: (wod as any)._likes_count?.[0]?.count || 0,
        comments_count: (wod as any)._comments_count?.[0]?.count || 0,
        is_liked: wod.likes?.some((like: any) => like.user_id === userId) || false,
        user: wod.user as any
      }))
    } catch (error: any) {
      console.error('Error fetching user feed:', error)
      // Se a tabela não existe, retornar array vazio com mensagem
      if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        console.warn('Tables not found. Please run the SQL migrations in Supabase.')
      }
      return []
    }
  }

  // Buscar WODs públicos (para discover/explorar)
  static async getPublicFeed(limit: number = 20, offset: number = 0): Promise<WodWithSocial[]> {
    try {
      const { data, error } = await supabase
        .from('wods')
        .select(`
          *,
          user:profiles(name, username, avatar_url),
          _likes_count:likes(count),
          _comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        // Se der erro na tabela wods, retornar array vazio
        if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('WODs table not found. This is normal for new applications.')
          return []
        }
        throw error
      }

      return data.map((wod: any) => ({
        id: wod.id,
        title: wod.title,
        user_id: wod.user_id,
        created_at: wod.created_at,
        likes_count: (wod as any)._likes_count?.[0]?.count || 0,
        comments_count: (wod as any)._comments_count?.[0]?.count || 0,
        is_liked: false, // Não temos contexto do usuário aqui
        user: wod.user as any
      }))
    } catch (error: any) {
      console.error('Error fetching public feed:', error)
      // Se der erro na tabela wods, retornar array vazio
      if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        console.warn('Tables not found. Please run the SQL migrations in Supabase.')
      }
      return []
    }
  }
}

// Hook para migração de dados do localStorage
export async function migrateSocialData(userId: string): Promise<{
  posts: number
  likes: number
  comments: number
  errors: number
}> {
  let posts = 0
  let likes = 0
  let comments = 0
  let errors = 0

  try {
    // Migrar posts compartilhados
    const sharedPosts = localStorage.getItem('shared_posts')
    if (sharedPosts) {
      const postsData = JSON.parse(sharedPosts)
      // TODO: Implementar migração de posts quando tivermos a estrutura
      posts = postsData.length || 0
    }

    // Migrar likes (se tivermos no localStorage)
    const localLikes = localStorage.getItem('user_likes')
    if (localLikes) {
      const likesData = JSON.parse(localLikes)
      // TODO: Implementar migração de likes quando necessário
      likes = likesData.length || 0
    }

    // Migrar comentários (se tivermos no localStorage)
    const localComments = localStorage.getItem('user_comments')
    if (localComments) {
      const commentsData = JSON.parse(localComments)
      // TODO: Implementar migração de comentários quando necessário
      comments = commentsData.length || 0
    }

  } catch (error) {
    console.error('Error during social data migration:', error)
    errors++
  }

  return { posts, likes, comments, errors }
}

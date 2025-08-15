import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client para uso geral (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client para componentes do cliente
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados (serão expandidos conforme criamos as tabelas)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          bio: string | null
          location: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          followers_count: number
          following_count: number
          wods_count: number
        }
        Insert: {
          id: string
          name: string
          bio?: string | null
          location?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          followers_count?: number
          following_count?: number
          wods_count?: number
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          location?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          followers_count?: number
          following_count?: number
          wods_count?: number
        }
      }
      wods: {
        Row: {
          id: string
          user_id: string
          title: string
          warmup: any | null
          main: any | null
          cooldown: any | null
          notes: string | null
          equipment: string[] | null
          style: string | null
          preset: string | null
          load_recommendations: any | null
          media: string[] | null
          created_at: string
          updated_at: string
          likes_count: number
          comments_count: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          warmup?: any | null
          main?: any | null
          cooldown?: any | null
          notes?: string | null
          equipment?: string[] | null
          style?: string | null
          preset?: string | null
          load_recommendations?: any | null
          media?: string[] | null
          created_at?: string
          updated_at?: string
          likes_count?: number
          comments_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          warmup?: any | null
          main?: any | null
          cooldown?: any | null
          notes?: string | null
          equipment?: string[] | null
          style?: string | null
          preset?: string | null
          load_recommendations?: any | null
          media?: string[] | null
          created_at?: string
          updated_at?: string
          likes_count?: number
          comments_count?: number
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          wod_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wod_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wod_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          wod_id: string
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wod_id: string
          text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wod_id?: string
          text?: string
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          members_count: number
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          members_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          members_count?: number
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          title: string
          goal: string
          starts_at: string
          ends_at: string
          created_at: string
          updated_at: string
          participants_count: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          goal: string
          starts_at: string
          ends_at: string
          created_at?: string
          updated_at?: string
          participants_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          goal?: string
          starts_at?: string
          ends_at?: string
          created_at?: string
          updated_at?: string
          participants_count?: number
        }
      }
      messages: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          text: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          text: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          text?: string
          created_at?: string
          read_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

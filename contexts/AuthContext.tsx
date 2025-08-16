'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClientSafe } from '../lib/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const supabase = getSupabaseClientSafe()
    if (!supabase) {
      console.warn('Supabase client not available for fetchProfile')
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Se perfil não existe, criar um novo
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          await createProfile(userId)
          return
        }
        throw error
      }
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const createProfile = async (userId: string) => {
    const supabase = getSupabaseClientSafe()
    if (!supabase) {
      console.warn('Supabase client not available for createProfile')
      return
    }

    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user?.email || '',
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
          username: user?.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
          bio: null,
          location: null,
          avatar_url: user?.user_metadata?.avatar_url || null,
          website: null,
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      console.log('Profile created successfully:', data)
    } catch (error) {
      console.error('Error creating profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signOut = async () => {
    const supabase = getSupabaseClientSafe()
    if (!supabase) {
      console.warn('Supabase client not available for signOut')
      return
    }

    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const supabase = getSupabaseClientSafe()
    
    // Verificar se supabase está disponível
    if (!supabase) {
      console.error('Supabase client not available in AuthContext')
      setLoading(false)
      return
    }

    // Obter sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state change:', event, !!session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

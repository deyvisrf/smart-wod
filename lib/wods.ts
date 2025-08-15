'use client'

import { supabase } from './supabase'
import type { Database } from './supabase'

// Tipo da tabela wods
type WodRow = Database['public']['Tables']['wods']['Row']
type WodInsert = Database['public']['Tables']['wods']['Insert']
type WodUpdate = Database['public']['Tables']['wods']['Update']

// Tipo para WOD estruturado (mantém compatibilidade com o formato atual)
export interface WodData {
  id?: string
  title: string
  level: string
  duration_minutes?: number
  warmup?: {
    title: string
    items: string[]
  }
  main?: {
    title: string
    items: string[]
  }
  cooldown?: {
    title: string
    items: string[]
  }
  notes?: string
  equipment?: string[]
  style?: string
  preset?: string
  load_recommendations?: any
  created_at?: string
  updated_at?: string
  user_id?: string
}

// Conversores entre o formato do localStorage e o banco
export function wodToDatabase(wod: WodData): Omit<WodInsert, 'user_id'> {
  return {
    title: wod.title,
    // Por enquanto, usando campos existentes até rodar a migration
    warmup: wod.warmup ? JSON.stringify(wod.warmup) : null,
    main: wod.main ? JSON.stringify(wod.main) : null,
    cooldown: wod.cooldown ? JSON.stringify(wod.cooldown) : null,
    notes: wod.notes || null,
    equipment: wod.equipment || [],
    style: wod.style || null,
    preset: wod.preset || null,
    load_recommendations: wod.load_recommendations ? JSON.stringify(wod.load_recommendations) : null,
  }
}

export function wodFromDatabase(row: WodRow): WodData {
  return {
    id: row.id,
    title: row.title,
    level: 'Intermediário', // Default por enquanto
    duration_minutes: undefined, // Por enquanto undefined até migration
    warmup: row.warmup ? JSON.parse(row.warmup as string) : undefined,
    main: row.main ? JSON.parse(row.main as string) : undefined,
    cooldown: row.cooldown ? JSON.parse(row.cooldown as string) : undefined,
    notes: row.notes || undefined,
    equipment: row.equipment || [],
    style: row.style || undefined,
    preset: row.preset || undefined,
    load_recommendations: row.load_recommendations ? JSON.parse(row.load_recommendations as string) : undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id
  }
}

// Serviços CRUD para WODs
export class WodService {
  // Listar todos os WODs do usuário
  static async getUserWods(userId: string): Promise<WodData[]> {
    try {
      const { data, error } = await supabase
        .from('wods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(wodFromDatabase)
    } catch (error) {
      console.error('Error fetching user WODs:', error)
      return []
    }
  }

  // Buscar WOD por ID
  static async getWodById(id: string, userId: string): Promise<WodData | null> {
    try {
      const { data, error } = await supabase
        .from('wods')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return wodFromDatabase(data)
    } catch (error) {
      console.error('Error fetching WOD by ID:', error)
      return null
    }
  }

  // Criar novo WOD
  static async createWod(wodData: WodData, userId: string): Promise<WodData | null> {
    try {
      const dbData = wodToDatabase(wodData)
      const { data, error } = await supabase
        .from('wods')
        .insert({ ...dbData, user_id: userId })
        .select()
        .single()

      if (error) throw error
      return wodFromDatabase(data)
    } catch (error) {
      console.error('Error creating WOD:', error)
      return null
    }
  }

  // Atualizar WOD existente
  static async updateWod(id: string, wodData: Partial<WodData>, userId: string): Promise<WodData | null> {
    try {
      const dbData = wodToDatabase(wodData as WodData)
      const { data, error } = await supabase
        .from('wods')
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return wodFromDatabase(data)
    } catch (error) {
      console.error('Error updating WOD:', error)
      return null
    }
  }

  // Excluir WOD
  static async deleteWod(id: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wods')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting WOD:', error)
      return false
    }
  }

  // Buscar WODs por termo (título, equipamento, estilo)
  static async searchWods(userId: string, searchTerm: string): Promise<WodData[]> {
    try {
      const { data, error } = await supabase
        .from('wods')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchTerm}%,style.ilike.%${searchTerm}%,equipment.cs.{${searchTerm}}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(wodFromDatabase)
    } catch (error) {
      console.error('Error searching WODs:', error)
      return []
    }
  }
}

// Hook para migração de dados do localStorage
export async function migrateLocalStorageWods(userId: string): Promise<{
  migrated: number
  skipped: number
  errors: number
}> {
  let migrated = 0
  let skipped = 0
  let errors = 0

  try {
    // Buscar WODs do localStorage
    const localWods = localStorage.getItem('saved_wods')
    if (!localWods) {
      return { migrated: 0, skipped: 0, errors: 0 }
    }

    const wods: any[] = JSON.parse(localWods)
    
    for (const localWod of wods) {
      try {
        // Converter formato do localStorage para o novo formato
        const wodData: WodData = {
          title: localWod.title,
          level: 'Intermediário', // Default, já que localStorage não tem esse campo
          duration_minutes: undefined,
          warmup: localWod.warmup,
          main: localWod.main,
          cooldown: localWod.cooldown,
          notes: localWod.notes,
          equipment: localWod.equipment || [],
          style: localWod.style,
          preset: localWod.preset,
          load_recommendations: localWod.loadRecommendations
        }

        // Tentar criar no banco
        const created = await WodService.createWod(wodData, userId)
        if (created) {
          migrated++
        } else {
          errors++
        }
      } catch (error) {
        console.error('Error migrating WOD:', localWod.title, error)
        errors++
      }
    }

    // Se migração bem-sucedida, limpar localStorage
    if (migrated > 0 && errors === 0) {
      localStorage.removeItem('saved_wods')
      console.log(`Successfully migrated ${migrated} WODs from localStorage`)
    }

  } catch (error) {
    console.error('Error during WOD migration:', error)
    errors++
  }

  return { migrated, skipped, errors }
}

import { supabase, isSupabaseConfigured, apiError } from '../lib/supabase'
import { demoCategories } from '../data/demo'

export const getAllCategories = async () => {
  if (!isSupabaseConfigured || !supabase) return { data: demoCategories, error: null }
  const { data, error } = await supabase.from('categories').select('*').order('display_order')
  return { data: data || [], error: error ? apiError(error) : null }
}

export const createCategory = async (category) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id: crypto.randomUUID(), ...category }, error: null }
  const { data, error } = await supabase.from('categories').insert(category).select().single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const updateCategory = async (id, category) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, ...category }, error: null }
  const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const deactivateCategory = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, is_active: false }, error: null }
  const { data, error } = await supabase.from('categories').update({ is_active: false }).eq('id', id).select().single()
  return { data: data || null, error: error ? apiError(error) : null }
}

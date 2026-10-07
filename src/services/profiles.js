import { supabase, isSupabaseConfigured, apiError } from '../lib/supabase'
import { signUp } from './auth'

export const getProfile = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: null }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const getUsers = async () => {
  if (!isSupabaseConfigured || !supabase) return { data: [], error: null }
  const { data, error } = await supabase.from('profiles').select('id, full_name, display_name, email, role, is_active, created_at').order('created_at', { ascending: false })
  return { data: data || [], error: error ? apiError(error) : null }
}

export const updateUserRole = async (id, role) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, role }, error: null }
  const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select('id, full_name, role, is_active').single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const setUserActive = async (id, is_active) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, is_active }, error: null }
  const { data, error } = await supabase.from('profiles').update({ is_active }).eq('id', id).select('id, is_active').single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const clearPasswordChange = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { error } = await supabase.from('profiles').update({ must_change_password: false }).eq('id', id)
  return { error: error ? apiError(error) : null }
}

export const createUser = async ({ fullName, email, password, role }) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Supabase is not configured.' }
  const { data, error } = await signUp({ fullName, email, password })
  if (error) return { data: null, error: apiError(error) }
  if (!data.user?.id) return { data: null, error: 'Account could not be created.' }
  // Admin-created accounts are approved right away.
  const result = await supabase.from('profiles').update({ role, is_active: true, must_change_password: true }).eq('id', data.user.id).select('id').single()
  return { data: result.data || null, error: result.error ? apiError(result.error) : null }
}

export const updateOwnProfile = async (id, { full_name, display_name, bio }) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: null }
  const { data, error } = await supabase.from('profiles').update({ full_name, display_name, bio }).eq('id', id).select('id').single()
  return { data: data || null, error: error ? apiError(error) : null }
}

// Runs public.admin_delete_user, which removes the auth account and its profile.
export const deleteUser = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { error } = await supabase.rpc('admin_delete_user', { target: id })
  return { error: error ? apiError(error) : null }
}

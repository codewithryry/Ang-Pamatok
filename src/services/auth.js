import { supabase, signupClient, isSupabaseConfigured } from '../lib/supabase'

export const signIn = async (email, password) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.' }
  return supabase.auth.signInWithPassword({ email, password })
}

// New accounts start inactive and need admin approval (see handle_new_user).
export const signUp = async ({ fullName, email, password }) => {
  if (!isSupabaseConfigured || !signupClient) return { data: null, error: 'Supabase is not configured.' }
  return signupClient.auth.signUp({ email, password, options: { data: { full_name: fullName, display_name: fullName } } })
}

export const signOut = async () => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  return supabase.auth.signOut()
}

export const requestPasswordReset = async (email) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Supabase is not configured.' }
  return supabase.auth.resetPasswordForEmail(email)
}

export const resetPassword = async (accessToken, password) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Supabase is not configured.' }
  return supabase.auth.updateUser({ password })
}

export const getCurrentUser = () => isSupabaseConfigured && supabase ? supabase.auth.getUser() : Promise.resolve({ data: { user: null }, error: null })

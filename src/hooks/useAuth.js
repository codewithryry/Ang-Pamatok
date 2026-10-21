import { useEffect, useState } from 'react'
import { getCurrentUser, signOut } from '../services/auth'
import { getProfile } from '../services/profiles'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Role and display fields live in public.profiles, not on the auth user.
const withProfile = async (authUser) => {
  if (!authUser) return null
  const { data: profile } = await getProfile(authUser.id)
  return profile ? { ...authUser, ...profile } : authUser
}

// Shared across components so pages mounted after ProtectedRoute get the user immediately.
let cachedUser

export const useAuth = () => {
  const [session, setSessionState] = useState(cachedUser ?? null)
  const [loading, setLoading] = useState(cachedUser === undefined)
  const setSession = (user) => {
    cachedUser = user
    setSessionState(user)
  }
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const { data } = await getCurrentUser()
        const user = await withProfile(data?.user)
        if (active) setSession(user)
      } catch {
        // A failed auth check falls through to the login redirect instead of an endless loader.
        if (active) setSession(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Password changes and token refreshes don't change the profile; reloading it here
      // could overwrite fresher data (e.g. a just-cleared must_change_password flag).
      if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') return
      // Deferred so the Supabase query doesn't run inside the auth callback.
      setTimeout(async () => {
        const user = await withProfile(nextSession?.user)
        if (active) setSession(user)
      }, 0)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setError(null)
    const { error } = await signOut()
    setError(error?.message || null)
  }

  const refresh = async () => {
    const { data } = await getCurrentUser()
    setSession(await withProfile(data?.user))
  }

  return { user: session, loading, error, logout, refresh }
}

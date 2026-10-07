import { supabase, isSupabaseConfigured, apiError } from '../lib/supabase'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE = 5 * 1024 * 1024

export const uploadCoverImage = async (file, userId) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Supabase is not configured.' }
  if (!ALLOWED_TYPES.has(file.type)) return { data: null, error: 'Only JPG, PNG, and WEBP images are supported.' }
  if (file.size > MAX_SIZE) return { data: null, error: 'Images must be smaller than 5 MB.' }
  const safeName = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]}`
  const { error } = await supabase.storage.from('article-images').upload(safeName, file, { cacheControl: '3600', upsert: false, contentType: file.type })
  if (error) return { data: null, error: apiError(error, 'The image could not be uploaded.') }
  const { data } = supabase.storage.from('article-images').getPublicUrl(safeName)
  return { data: data.publicUrl, error: null }
}

export const removeCoverImage = async (url) => {
  if (!isSupabaseConfigured || !supabase || !url) return { data: null, error: null }
  const path = url.split('/article-images/').pop()
  if (!path) return { data: null, error: null }
  const { error } = await supabase.storage.from('article-images').remove([path])
  return { data: null, error: error ? apiError(error, 'The image could not be removed.') : null }
}

import { supabase, isSupabaseConfigured, apiError } from '../lib/supabase'

export const reactionTypes = [['like', '👍', 'Gusto'], ['love', '❤️', 'Pagmamahal'], ['wow', '😮', 'Gulat'], ['sad', '😢', 'Lungkot'], ['angry', '😠', 'Galit']]

export const getReactions = async (articleId) => {
  if (!isSupabaseConfigured || !supabase) return { data: {}, error: null }
  const { data, error } = await supabase.from('article_reactions').select('reaction, count').eq('article_id', articleId)
  return { data: Object.fromEntries((data || []).map((row) => [row.reaction, row.count])), error: error ? apiError(error) : null }
}

// Moves this reader's reaction from `previous` to `next` (either may be null).
export const setReaction = async (articleId, next, previous) => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { error } = await supabase.rpc('set_article_reaction', { article_id: articleId, next_reaction: next, previous_reaction: previous })
  return { error: error ? apiError(error) : null }
}

export const getComments = async (articleId) => {
  if (!isSupabaseConfigured || !supabase) return { data: [], error: null }
  const { data, error } = await supabase.from('article_comments').select('id, name, body, created_at').eq('article_id', articleId).order('created_at', { ascending: false })
  return { data: data || [], error: error ? apiError(error) : null }
}

export const addComment = async (articleId, { name, body }) => {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Hindi muna magagamit ang mga tugon.' }
  const { data, error } = await supabase.from('article_comments').insert({ article_id: articleId, name: name.trim(), body: body.trim() }).select('id, name, body, created_at').single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const deleteComment = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { error } = await supabase.from('article_comments').delete().eq('id', id)
  return { error: error ? apiError(error) : null }
}

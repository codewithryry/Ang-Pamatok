import { supabase, isSupabaseConfigured, apiError } from '../lib/supabase'
import { demoArticles, demoCategories } from '../data/demo'

const articleSelect = `*, category:categories(*), author:profiles(id, full_name, display_name, avatar_url, bio)`

const publishedDemo = () => demoArticles.filter((article) => article.status === 'published' && article.published_at)

export const getPublishedArticles = async ({ category, page = 1, search, limit = 12 } = {}) => {
  if (!isSupabaseConfigured || !supabase) {
    let data = publishedDemo()
    if (category) data = data.filter((article) => article.category_id === category)
    if (search) {
      const term = search.toLowerCase()
      data = data.filter((article) => [article.title, article.excerpt, article.category?.name, article.author?.full_name].join(' ').toLowerCase().includes(term))
    }
    return { data, count: data.length, error: null }
  }
  let query = supabase.from('articles').select(articleSelect).eq('status', 'published').not('published_at', 'is', null).order('published_at', { ascending: false })
  if (category) query = query.eq('category_id', category)
  // PostgREST can't mix embedded-table filters into or(), so search the article's own text.
  if (search) { const term = search.replace(/[,()%*]/g, ' ').trim(); query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`) }
  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1)
  return { data: data || [], count: count || 0, error: error ? apiError(error) : null }
}

export const getArticleBySlug = async (slug) => {
  if (!isSupabaseConfigured || !supabase) return { data: publishedDemo().find((article) => article.slug === slug) || null, error: null }
  const { data, error } = await supabase.from('articles').select(articleSelect).eq('slug', slug).eq('status', 'published').not('published_at', 'is', null).single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const getArticleById = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { data: demoArticles.find((article) => article.id === id) || null, error: null }
  const { data, error } = await supabase.from('articles').select(articleSelect).eq('id', id).single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const getFeaturedArticle = async () => {
  if (!isSupabaseConfigured || !supabase) return { data: publishedDemo().find((article) => article.is_featured) || null, error: null }
  const { data, error } = await supabase.from('articles').select(articleSelect).eq('status', 'published').eq('is_featured', true).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(1).maybeSingle()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const getCategories = async () => {
  if (!isSupabaseConfigured || !supabase) return { data: demoCategories, error: null }
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order')
  return { data: data || [], error: error ? apiError(error) : null }
}

export const getRelatedArticles = async (article) => {
  if (!isSupabaseConfigured || !supabase) return { data: publishedDemo().filter((item) => item.category_id === article.category_id && item.id !== article.id).slice(0, 3), error: null }
  const { data, error } = await supabase.from('articles').select(articleSelect).eq('status', 'published').eq('category_id', article.category_id).neq('id', article.id).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(3)
  return { data: data || [], error: error ? apiError(error) : null }
}

export const getDashboardArticles = async (userId, role, filters = {}) => {
  if (!isSupabaseConfigured || !supabase) {
    const data = demoArticles.filter((article) => role === 'admin' || article.author_id === userId)
    return { data, count: data.length, error: null }
  }
  let query = supabase.from('articles').select(articleSelect).order('updated_at', { ascending: false })
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.category) query = query.eq('category_id', filters.category)
  if (filters.search) query = query.or(`title.ilike.%${filters.search}%,author.full_name.ilike.%${filters.search}%,category.name.ilike.%${filters.search}%`)
  const { data, count, error } = await query
  return { data: data || [], count: count || 0, error: error ? apiError(error) : null }
}

export const createArticle = async (payload) => {
  if (!isSupabaseConfigured || !supabase) return { data: { ...payload, id: crypto.randomUUID() }, error: null }
  const { data, error } = await supabase.from('articles').insert(payload).select(articleSelect).single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const updateArticle = async (id, payload) => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, ...payload }, error: null }
  const { data, error } = await supabase.from('articles').update(payload).eq('id', id).select(articleSelect).single()
  return { data: data || null, error: error ? apiError(error) : null }
}

export const changeArticleStatus = async (id, status, reason = '') => {
  if (!isSupabaseConfigured || !supabase) return { data: { id, status }, error: null }
  const { data, error } = await supabase.from('articles').update({ status, published_at: status === 'published' ? new Date().toISOString() : null, rejection_reason: status === 'rejected' ? reason : null }).eq('id', id).select().single()
  return { data: data || null, error: error ? apiError(error) : null }
}

// Counts one read per browser session; returns the new total, or null if counting is unavailable.
export const recordArticleView = async (id) => {
  if (!isSupabaseConfigured || !supabase) return null
  const key = `pamatok-viewed-${id}`
  try { if (sessionStorage.getItem(key)) return null } catch { /* storage unavailable */ }
  const { data, error } = await supabase.rpc('increment_article_view', { article_id: id })
  if (error) return null
  try { sessionStorage.setItem(key, '1') } catch { /* storage unavailable */ }
  return typeof data === 'number' ? data : null
}

// Deletes an article (admins only via RLS); revisions, reactions and comments cascade.
export const deleteArticle = async (id) => {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  const { data, error } = await supabase.from('articles').delete().eq('id', id).select('id')
  if (error) return { error: apiError(error) }
  return { error: data?.length ? null : 'You do not have permission to delete this article.' }
}

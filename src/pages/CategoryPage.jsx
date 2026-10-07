import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { publicCategoryName } from '../lib/format'
import { getCategories, getPublishedArticles } from '../services/articles'

export const CategoryPage = () => {
  const { category } = useParams()
  const [metadata, setMetadata] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; const load = async () => { const categoriesResult = await getCategories(); const categoryResult = categoriesResult.data?.find((item) => item.slug === category); const articlesResult = await getPublishedArticles({ category: categoryResult?.id, limit: 24 }); if (!active) return; setMetadata(categoryResult); setArticles(articlesResult.data); setLoading(false); setError(categoriesResult.error || articlesResult.error) }; load(); return () => { active = false } }, [category])
  if (loading) return <main className="container page-shell"><div className="category-hero"><div className="skeleton skeleton--line" /><div className="skeleton skeleton--line medium" /></div><LoadingState count={6} /></main>
  if (error || !metadata) return <main className="container page-shell"><div className="notice">{error || 'Hindi makita ang paksang ito.'}<Link to="/">Bumalik sa tahanan</Link></div></main>
  return <main className="container page-shell"><header className="category-hero"><span className="eyebrow">ANG PAMATOK · {publicCategoryName(metadata)}</span><h1>{publicCategoryName(metadata)}</h1><p>{metadata.description}</p><div className="category-count">{articles.length} akda</div></header><ArticleGrid articles={articles} columns={3} />{articles.length === 0 && <EmptyState title="Wala pang nailathalang akda" description="Dito lilitaw ang mga bagong akda kapag handa na ang mga ito." action={{ to: '/search', label: 'Hanapin sa lahat ng akda' }} />}</main>
}

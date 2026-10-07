import { ArrowLeft, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '../components/ArticleCard'
import { EmptyState } from '../components/EmptyState'
import { PageLoader } from '../components/LoadingState'
import { getArticleBySlug, getRelatedArticles } from '../services/articles'
import { formatDate } from '../lib/format'

export const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; const load = async () => { const result = await getArticleBySlug(slug); if (!active) return; if (result.error || !result.data) { setError(result.error || 'This story could not be found.'); setLoading(false); return }; setArticle(result.data); const relatedResult = await getRelatedArticles(result.data); if (active) { setRelated(relatedResult.data); setLoading(false); setError(relatedResult.error) } }; load(); return () => { active = false } }, [slug])
  useEffect(() => { document.title = article ? `${article.title} | ANG PAMATOK` : 'Story not found — ANG PAMATOK'; document.querySelector('meta[name="description"]')?.setAttribute('content', article?.excerpt || ''); document.querySelector('meta[property="og:title"]')?.setAttribute('content', article?.title || ''); document.querySelector('meta[property="og:description"]')?.setAttribute('content', article?.excerpt || ''); document.querySelector('meta[property="og:image"]')?.setAttribute('content', article?.cover_image_url || ''); }, [article])
  if (loading) return <main className="article-page"><PageLoader /></main>
  if (error || !article) return <main className="container page-shell"><EmptyState title="Story unavailable" description={error || 'The story may have been moved or removed.'} action={{ to: '/', label: 'Return home' }} /></main>
  return <main className="article-page"><article><header className="article-header container"><Link className="back-link" to={`/${article.category?.slug || 'news'}`}><ArrowLeft size={16} /> Back to {article.category?.name}</Link><span className="eyebrow">{article.category?.name}</span><h1>{article.title}</h1>{article.excerpt && <p className="article-deck">{article.excerpt}</p>}<div className="article-byline"><span className="author-avatar">{article.author?.display_name?.slice(0, 2).toUpperCase()}</span><div><strong>{article.author?.display_name || article.author?.full_name || 'Staff Writer'}</strong><span><CalendarDays size={14} /> {formatDate(article.published_at)}</span></div></div></header><div className="article-hero"><img src={article.cover_image_url} alt="" width="1600" height="900" /></div><div className="article-content-wrap container"><div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} /></div></article><section className="related-section container"><div className="section-heading"><div><span className="eyebrow">Keep reading</span><h2>More from {article.category?.name}</h2></div></div><div className="article-grid article-grid--3">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></section></main>
}

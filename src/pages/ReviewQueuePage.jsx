import { Check, Clock3, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { useDialog } from '../components/DialogProvider'
import { changeArticleStatus, getDashboardArticles } from '../services/articles'
import { useAuth } from '../hooks/useAuth'

export const ReviewQueuePage = () => {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { confirm, toast } = useDialog()
  useEffect(() => { let active = true; const load = async () => { const result = await getDashboardArticles(user.id, user.role, { status: 'review' }); if (!active) return; setArticles(result.data); setLoading(false); setError(result.error) }; load(); return () => { active = false } }, [user])
  const act = async (id, status, reason = '') => { if (!await confirm(status === 'rejected' ? { title: 'Reject this article?', message: 'It will be returned to the writer for revision.', confirmLabel: 'Reject' } : { title: 'Publish this article?', message: 'It will be visible to everyone on the public site.', confirmLabel: 'Publish', tone: 'primary' })) return; const result = await changeArticleStatus(id, status, reason); if (result.error) { setError(result.error); return }; setArticles((current) => current.filter((article) => article.id !== id)); toast(status === 'published' ? 'Article published.' : status === 'rejected' ? 'Article returned for revision.' : 'Article archived.') }
  return <div className="dashboard-page"><div className="dashboard-intro"><span className="queue-count">{articles.length} waiting</span></div>{error && <div className="form-error" role="alert">{error}</div>}{loading ? <LoadingState count={6} compact /> : articles.length ? <div className="review-list">{articles.map((article) => <article className="review-card" key={article.id}><div className="review-card__meta"><span>{article.category?.name}</span><span><Clock3 size={14} /> {new Date(article.updated_at).toLocaleDateString()}</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><div className="review-card__author"><span>{article.author?.display_name || article.author?.full_name}</span><strong>{article.author?.bio || 'Student contributor'}</strong></div><div className="review-actions"><Link className="button button--outline" to={`/article/${article.slug}`}>Read</Link><Link className="button button--outline" to={`/dashboard/articles/${article.id}/edit`}>Edit</Link><button className="button button--primary" onClick={() => act(article.id, 'published')}><Check size={16} /> Publish</button><button className="button button--danger" onClick={() => act(article.id, 'rejected')}><X size={16} /> Reject</button></div></article>)}</div> : <div className="dashboard-empty"><Clock3 size={30} /><h4>No articles waiting for review</h4><p>The review queue is clear.</p></div>}</div>
}

import { ArrowUpRight, BookOpen, FileCheck2, FileText, Hourglass, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { getDashboardArticles } from '../services/articles'

const statusLabels = { draft: 'Draft', review: 'Under review', published: 'Published', rejected: 'Rejected', archived: 'Archived' }

export const DashboardPage = () => {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; const load = async () => { const result = await getDashboardArticles(user.id, user.role); if (!active) return; setArticles(result.data); setLoading(false); setError(result.error); }; load(); return () => { active = false } }, [user])
  const counts = articles.reduce((result, article) => ({ ...result, [article.status]: result[article.status] + 1 }), { draft: 0, review: 0, published: 0, rejected: 0, archived: 0 })
  const cards = [{ label: 'Drafts', value: counts.draft, icon: FileText, tone: 'cream' }, { label: 'Under review', value: counts.review, icon: Hourglass, tone: 'gold' }, { label: 'Published', value: counts.published, icon: FileCheck2, tone: 'red' }, { label: 'Total articles', value: articles.length, icon: BookOpen, tone: 'dark' }]
  return <div className="dashboard-page"><div className="dashboard-intro"><div><span className="eyebrow">Welcome back</span><h2>{user?.full_name || user?.display_name || user?.email}</h2><p>Manage your editorial work from one place.</p></div><Link className="button button--primary" to="/dashboard/articles/new"><Plus size={17} /> New article</Link></div><div className="stats-grid">{cards.map(({ label, value, icon: Icon, tone }) => <div className={`stat-card stat-card--${tone}`} key={label}><Icon size={21} /><div><span>{label}</span><strong>{value}</strong></div></div>)}</div><section className="dashboard-panel"><div className="panel-heading"><div><h3>Recent articles</h3><p>Latest work across the publication.</p></div><Link to="/dashboard/articles">View all <ArrowUpRight size={16} /></Link></div>{loading ? <LoadingState count={5} compact /> : error ? <div className="notice">{error}</div> : articles.length ? <div className="dashboard-list">{articles.slice(0, 5).map((article) => <div className="dashboard-list__row" key={article.id}><div className="dashboard-list__title"><strong>{article.title}</strong><span>{article.category?.name || 'Uncategorized'} · Updated {new Date(article.updated_at).toLocaleDateString()}</span></div><span className={`status-badge status-badge--${article.status}`}>{statusLabels[article.status] || article.status}</span><Link to={`/article/${article.slug}`}>View</Link></div>)}</div> : <div className="dashboard-empty"><FileText size={28} /><h4>No articles yet</h4><p>Create your first article to begin the editorial workflow.</p><Link className="button button--primary" to="/dashboard/articles/new">Create article</Link></div>}</section></div>
}

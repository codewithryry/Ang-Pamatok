import { Filter, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { getDashboardArticles } from '../services/articles'
import { getAllCategories } from '../services/categories'

const statuses = ['all', 'draft', 'review', 'published', 'rejected', 'archived']

export const ArticlesPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; const load = async () => { const [articleResult, categoryResult] = await Promise.all([getDashboardArticles(user.id, user.role), getAllCategories()]); if (!active) return; setArticles(articleResult.data); setCategories(categoryResult.data); setLoading(false); setError(articleResult.error || categoryResult.error) }; load(); return () => { active = false } }, [user])
  const filtered = useMemo(() => articles.filter((article) => (status === 'all' || article.status === status) && (category === 'all' || article.category_id === category) && (!search || `${article.title} ${article.author?.full_name || ''} ${article.category?.name || ''}`.toLowerCase().includes(search.toLowerCase()))), [articles, status, category, search])
  return <div className="dashboard-page"><div className="filters-panel filters-panel--actions"><div className="search-filter"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles…" /></div><div className="filter-select"><Filter size={17} /><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option value={item} key={item}>{item === 'all' ? 'All statuses' : item.replace('review', 'Under review').replace('draft', 'Draft').replace('published', 'Published').replace('rejected', 'Rejected').replace('archived', 'Archived')}</option>)}</select></div><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><Link className="button button--primary" to="/dashboard/articles/new"><Plus size={17} /> New article</Link></div>{loading ? <LoadingState count={7} compact /> : error ? <div className="notice">{error}</div> : filtered.length ? <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{filtered.map((article) => <tr key={article.id}><td><strong>{article.title}</strong><small>{article.author?.display_name || article.author?.full_name}</small></td><td>{article.category?.name || '—'}</td><td><span className={`status-badge status-badge--${article.status}`}>{article.status.replace('review', 'Under review')}</span></td><td>{new Date(article.updated_at).toLocaleDateString()}</td><td><div className="table-actions"><Link to={`/article/${article.slug}`}>View</Link><Link to={`/dashboard/articles/${article.id}/edit`}>Edit</Link>{article.status === 'review' && <button onClick={() => navigate('/dashboard/review')}>Review</button>}</div></td></tr>)}</tbody></table></div> : <div className="dashboard-empty"><Filter size={28} /><h4>No articles match</h4><p>Adjust your filters or create a new article.</p></div>}</div>
}

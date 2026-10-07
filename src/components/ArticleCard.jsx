import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

export const ArticleCard = ({ article, featured = false }) => {
  const category = article.category?.name || 'Article'
  return (
    <article className={`article-card ${featured ? 'article-card--featured' : ''}`}>
      <Link className="article-card__image" to={`/article/${article.slug}`} aria-label={`Read ${article.title}`}>
        <img src={article.cover_image_url} alt="" loading="lazy" width="800" height="520" />
        <span className="article-card__arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="article-card__body">
        <span className="eyebrow">{category}</span>
        <h3><Link to={`/article/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <div className="article-meta"><span>{article.author?.display_name || article.author?.full_name || 'Staff Writer'}</span><span><CalendarDays size={14} /> {formatDate(article.published_at)}</span></div>
      </div>
    </article>
  )
}

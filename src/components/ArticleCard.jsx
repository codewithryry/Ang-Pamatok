import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, publicCategoryName } from '../lib/format'
import logo from '../assets/Pamatok.png'

export const ArticleCard = ({ article, featured = false }) => {
  const category = publicCategoryName(article.category)
  return (
    <article className={`article-card ${featured ? 'article-card--featured' : ''}`}>
      <Link className={`article-card__image ${article.cover_image_url ? '' : 'article-card__image--placeholder'}`} to={`/article/${article.slug}`} aria-label={`Basahin: ${article.title}`}>
        {article.cover_image_url ? <img src={article.cover_image_url} alt="" loading="lazy" width="800" height="520" /> : <img className="article-card__placeholder" src={logo} alt="" loading="lazy" />}
        <span className="article-card__arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="article-card__body">
        <span className="eyebrow">{category}</span>
        <h3><Link to={`/article/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <div className="article-meta"><span>{article.author?.display_name || article.author?.full_name || 'Patnugutan'}</span><span><CalendarDays size={14} /> {formatDate(article.published_at)}</span><Link className="article-card__more" to={`/article/${article.slug}`}>Ipagpatuloy ang pagbasa <ArrowRight size={14} /></Link></div>
      </div>
    </article>
  )
}

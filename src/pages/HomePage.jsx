import { ArrowRight, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { getFeaturedArticle, getPublishedArticles } from '../services/articles'
import { formatDate } from '../lib/format'

const sections = [['Latest', 'news'], ['Sci-Tech', 'sci-tech'], ['Opinion', 'opinion'], ['Editorial', 'editorial'], ['Features', 'feature'], ['Literary', 'literary']]

export const HomePage = () => {
  const [featured, setFeatured] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; Promise.all([getFeaturedArticle(), getPublishedArticles({ limit: 9 })]).then(([featuredResult, latestResult]) => { if (!active) return; setFeatured(featuredResult.data); setArticles(latestResult.data); setLoading(false); setError(featuredResult.error || latestResult.error) }).catch(() => active && setError('We could not load the latest stories.')) ; return () => { active = false } }, [])
  return (
    <main>
      <section className="hero-section container">
        {loading ? <LoadingState count={1} /> : featured ? <Link className="featured-story" to={`/article/${featured.slug}`}><div className="featured-story__image"><img src={featured.cover_image_url} alt="" width="1600" height="1000" /></div><div className="featured-story__content"><span className="eyebrow">Featured · {featured.category?.name}</span><h1>{featured.title}</h1><p>{featured.excerpt}</p><div className="article-meta"><span>{featured.author?.display_name || 'Staff Writer'}</span><span><CalendarDays size={14} /> {formatDate(featured.published_at)}</span></div><span className="read-link">Read the story <ArrowRight size={17} /></span></div></Link> : <EmptyState title="No stories yet" description="The first featured story will appear here." />}
      </section>
      <section className="container latest-section"><div className="section-heading"><div><span className="eyebrow">The latest</span><h2>Stories from the campus</h2></div><Link to="/search">Browse all stories <ArrowRight size={16} /></Link></div>{error ? <div className="notice">{error}</div> : loading ? <LoadingState count={6} /> : <ArticleGrid articles={articles} columns={3} />}</section>
      {sections.map(([title, slug], index) => <section className={`section-block section-block--${slug}`} key={slug}><div className="container"><div className="section-heading"><div><span className="eyebrow">{index === 0 ? 'Latest edition' : 'Explore'}</span><h2>{title}</h2></div><Link to={`/${slug}`}>View {title.toLowerCase()} <ArrowRight size={16} /></Link></div><ArticleGrid articles={articles.filter((article) => article.category?.slug === slug).slice(0, 3)} columns={3} /></div></section>)}
      <section className="editorial-note container"><span className="eyebrow">The ANG PAMATOK standard</span><h2>Stories are written by students, for students.</h2><p>Our publication is built around careful reporting, thoughtful perspectives, and a community that is ready to listen.</p><Link to="/about">Learn about us <ArrowRight size={17} /></Link></section>
    </main>
  )
}

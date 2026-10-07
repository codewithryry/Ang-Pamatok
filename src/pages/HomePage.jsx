import { ArrowRight, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { getFeaturedArticle, getPublishedArticles } from '../services/articles'
import { formatDate } from '../lib/format'
import logo from '../assets/Pamatok.png'

const sections = [['Balita', 'balita'], ['Ag-Tek', 'ag-tek'], ['Opinyon', 'opinyon'], ['Editoryal', 'editoryal'], ['Lathalain', 'lathalain'], ['Panitikan', 'panitikan'], ['Kultura', 'kultura'], ['Investigative', 'investigative']]

export const HomePage = () => {
  const [featured, setFeatured] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; Promise.all([getFeaturedArticle(), getPublishedArticles({ limit: 9 })]).then(([featuredResult, latestResult]) => { if (!active) return; setFeatured(featuredResult.data); setArticles(latestResult.data); setLoading(false); setError(featuredResult.error || latestResult.error) }).catch(() => active && setError('We could not load the latest stories.')) ; return () => { active = false } }, [])
  const lead = featured || articles[0]
  const side = articles.filter((article) => article.id !== lead?.id).slice(0, 4)
  return (
    <main>
      {loading ? <section className="hero-section container"><LoadingState count={1} /></section> : lead ? <section className="home-hero">
        {lead.cover_image_url && <img className="home-hero__bg" src={lead.cover_image_url} alt="" />}
        <img className="home-hero__mark" src={logo} alt="" aria-hidden="true" />
        <div className="container home-hero__inner">
          <div className="home-hero__lead">
            <span className="home-hero__tag">{featured ? 'Featured' : 'Latest'} · {lead.category?.name || 'Story'}</span>
            <h1><Link to={`/article/${lead.slug}`}>{lead.title}</Link></h1>
            <div className="home-hero__meta"><span>By {lead.author?.full_name || lead.author?.display_name || 'Staff Writer'}</span><span><CalendarDays size={14} /> {formatDate(lead.published_at)}</span></div>
            {lead.excerpt && <p>{lead.excerpt}</p>}
            <Link className="button home-hero__cta" to={`/article/${lead.slug}`}>Read article <ArrowRight size={17} /></Link>
          </div>
          {side.length > 0 && <aside className="home-hero__list" aria-label="Latest stories"><span className="home-hero__list-title">Latest stories</span>{side.map((article) => <Link className="home-hero__item" to={`/article/${article.slug}`} key={article.id}><span className="home-hero__thumb">{article.cover_image_url ? <img src={article.cover_image_url} alt="" loading="lazy" /> : (article.category?.name || 'A')[0]}</span><span className="home-hero__item-text"><small>{article.category?.name} · {formatDate(article.published_at)}</small><strong>{article.title}</strong></span></Link>)}</aside>}
        </div>
      </section> : <section className="hero-section container"><EmptyState title="No stories yet" description="The first featured story will appear here." /></section>}
      <section className="container latest-section"><div className="section-heading"><div><span className="eyebrow">The latest</span><h2>Stories from the campus</h2></div><Link to="/search">Browse all stories <ArrowRight size={16} /></Link></div>{error ? <div className="notice">{error}</div> : loading ? <LoadingState count={6} /> : <ArticleGrid articles={articles} columns={3} />}</section>
      {sections.map(([title, slug], index) => <section className={`section-block section-block--${slug}`} key={slug}><div className="container"><div className="section-heading"><div><span className="eyebrow">{index === 0 ? 'Latest edition' : 'Explore'}</span><h2>{title}</h2></div><Link to={`/${slug}`}>View {title.toLowerCase()} <ArrowRight size={16} /></Link></div><ArticleGrid articles={articles.filter((article) => article.category?.slug === slug).slice(0, 3)} columns={3} /></div></section>)}
      <section className="editorial-note container"><span className="eyebrow">The ANG PAMATOK standard</span><h2>Stories are written by students, for students.</h2><p>Our publication is built around careful reporting, thoughtful perspectives, and a community that is ready to listen.</p><Link to="/about">Learn about us <ArrowRight size={17} /></Link></section>
    </main>
  )
}

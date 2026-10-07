import { ArrowRight, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { LoadingState } from '../components/LoadingState'
import { getFeaturedArticle, getPublishedArticles } from '../services/articles'
import { formatDate, publicCategoryName } from '../lib/format'
import logo from '../assets/Pamatok.png'

const sections = [['Balita', 'balita'], ['Agham at Teknolohiya', 'ag-tek'], ['Pananaw', 'opinyon'], ['Paninindigan', 'editoryal'], ['Lathalain', 'lathalain'], ['Panitikan', 'panitikan'], ['Kultura', 'kultura'], ['Pagsisiyasat', 'investigative']]

export const HomePage = () => {
  const [featured, setFeatured] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; Promise.all([getFeaturedArticle(), getPublishedArticles({ limit: 9 })]).then(([featuredResult, latestResult]) => { if (!active) return; setFeatured(featuredResult.data); setArticles(latestResult.data); setLoading(false); setError(featuredResult.error || latestResult.error) }).catch(() => active && setError('Hindi makuha ang mga pinakabagong akda.')) ; return () => { active = false } }, [])
  const lead = featured || articles[0]
  const side = articles.filter((article) => article.id !== lead?.id).slice(0, 4)
  return (
    <main>
      {loading ? <section className="hero-section container"><LoadingState count={1} /></section> : lead ? <section className="home-hero">
        {lead.cover_image_url && <img className="home-hero__bg" src={lead.cover_image_url} alt="" />}
        <img className="home-hero__mark" src={logo} alt="" aria-hidden="true" />
        <div className="container home-hero__inner">
          <div className="home-hero__lead">
            <span className="home-hero__tag">{featured ? 'Itinatampok' : 'Pinakabago'} · {publicCategoryName(lead.category)}</span>
            <h1><Link to={`/article/${lead.slug}`}>{lead.title}</Link></h1>
            <div className="home-hero__meta"><span>Ni {lead.author?.full_name || lead.author?.display_name || 'Patnugutan'}</span><span><CalendarDays size={14} /> {formatDate(lead.published_at)}</span></div>
            {lead.excerpt && <p>{lead.excerpt}</p>}
            <Link className="button home-hero__cta" to={`/article/${lead.slug}`}>Basahin ang akda <ArrowRight size={17} /></Link>
          </div>
          {side.length > 0 && <aside className="home-hero__list" aria-label="Mga pinakabagong akda"><span className="home-hero__list-title">Mga Pinakabagong Akda</span>{side.map((article) => <Link className="home-hero__item" to={`/article/${article.slug}`} key={article.id}><span className="home-hero__thumb">{article.cover_image_url ? <img src={article.cover_image_url} alt="" loading="lazy" /> : publicCategoryName(article.category)[0]}</span><span className="home-hero__item-text"><small>{publicCategoryName(article.category)} · {formatDate(article.published_at)}</small><strong>{article.title}</strong></span></Link>)}</aside>}
        </div>
      </section> : <section className="home-hero home-hero--welcome">
        <img className="home-hero__mark" src={logo} alt="" aria-hidden="true" />
        <div className="container home-hero__inner">
          <div className="home-hero__lead">
            <span className="home-hero__tag">Ang Pamatok · Malapit nang ilathala</span>
            <h1>Tinataguyod ang malayang pamamahayag.</h1>
            <p>Dito ilalathala ang mga balita, pananaw, at akda ng mga mag-aaral. Abangan ang aming mga unang akda.</p>
            <Link className="button home-hero__cta" to="/about">Kilalanin kami <ArrowRight size={17} /></Link>
          </div>
          <aside className="home-hero__list" aria-label="Mga paksa"><span className="home-hero__list-title">Mga Paksa</span>{sections.slice(0, 4).map(([title, slug]) => <Link className="home-hero__item" to={`/${slug}`} key={slug}><span className="home-hero__thumb">{title[0]}</span><span className="home-hero__item-text"><small>Paksa</small><strong>{title}</strong></span></Link>)}</aside>
        </div>
      </section>}
      <section className="container latest-section"><div className="section-heading"><div><span className="eyebrow">Mga pinakabago</span><h2>Mga akda mula sa kampus</h2></div><Link to="/search">Tingnan ang lahat ng akda <ArrowRight size={16} /></Link></div>{error ? <div className="notice">{error}</div> : loading ? <LoadingState count={6} /> : <ArticleGrid articles={articles} columns={3} />}</section>
      {sections.map(([title, slug], index) => <section className={`section-block section-block--${slug}`} key={slug}><div className="container"><div className="section-heading"><div><span className="eyebrow">{index === 0 ? 'Pinakabagong labas' : 'Tuklasin'}</span><h2>{title}</h2></div><Link to={`/${slug}`}>Tingnan ang {title.toLowerCase()} <ArrowRight size={16} /></Link></div><ArticleGrid articles={articles.filter((article) => article.category?.slug === slug).slice(0, 3)} columns={3} /></div></section>)}
      <section className="editorial-note container"><span className="eyebrow">Pamantayan ng ANG PAMATOK</span><h2>Isinusulat ng mga mag-aaral, para sa mga mag-aaral.</h2><p>Nakasalig ang aming pahayagan sa masusing pag-uulat, malalim na pananaw, at pamayanang handang makinig.</p><Link to="/about">Kilalanin kami <ArrowRight size={17} /></Link></section>
    </main>
  )
}

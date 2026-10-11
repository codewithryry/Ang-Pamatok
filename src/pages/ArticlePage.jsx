import { CalendarDays, Clock3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { splitForInArticleAd } from '../config/ads'
import { ArticleEngagement } from '../components/ArticleEngagement'
import { EmptyState } from '../components/EmptyState'
import { PageLoader } from '../components/LoadingState'
import { ListenPlayer } from '../components/ListenPlayer'
import { ReadingRail } from '../components/ReadingRail'
import { getArticleBySlug, getPublishedArticles, getRelatedArticles, recordArticleView } from '../services/articles'
import { formatDate, publicCategoryName } from '../lib/format'
import logo from '../assets/Pamatok.png'

const readMinutes = (html = '') => Math.max(1, Math.round(html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length / 200))

export const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [views, setViews] = useState(0)
  const [fontSize, setFontSize] = useState(() => { try { return localStorage.getItem('pamatok-font-size') || 'md' } catch { return 'md' } })
  const contentRef = useRef(null)
  useEffect(() => { let active = true; const load = async () => { const result = await getArticleBySlug(slug); if (!active) return; if (result.error || !result.data) { setError(result.error || 'Hindi makita ang akdang ito.'); setLoading(false); return }; setArticle(result.data); setViews(result.data.view_count || 0); recordArticleView(result.data.id).then((count) => { if (active && count !== null) setViews(count) }); let relatedResult = await getRelatedArticles(result.data); if (!relatedResult.error && !relatedResult.data.length) { const latest = await getPublishedArticles({ limit: 4 }); relatedResult = { ...latest, data: latest.data.filter((item) => item.id !== result.data.id).slice(0, 3) } }; if (active) { setRelated(relatedResult.data); setLoading(false); setError(relatedResult.error) } }; load(); return () => { active = false } }, [slug])
  useEffect(() => { document.title = article ? `${article.title} | Ang Pamatok` : 'Hindi makita ang akda | Ang Pamatok'; document.querySelector('meta[name="description"]')?.setAttribute('content', article?.excerpt || ''); document.querySelector('meta[property="og:title"]')?.setAttribute('content', article?.title || ''); document.querySelector('meta[property="og:description"]')?.setAttribute('content', article?.excerpt || ''); document.querySelector('meta[property="og:image"]')?.setAttribute('content', article?.cover_image_url || ''); }, [article])
  const changeFontSize = (size) => { setFontSize(size); try { localStorage.setItem('pamatok-font-size', size) } catch { /* storage unavailable */ } }
  if (loading) return <main className="article-page"><PageLoader /></main>
  if (error || !article) return <main className="container page-shell"><EmptyState title="Akda ay hindi makuha" description={error || 'Maaaring inilipat o inalis ang akdang ito.'} action={{ to: '/', label: 'Bumalik sa tahanan' }} /></main>
  return <main className="article-page"><article><header className="article-banner"><span className="article-banner__watermark" aria-hidden="true">{publicCategoryName(article.category)}</span><div className="container article-banner__inner"><span className="article-banner__tab">{publicCategoryName(article.category)}</span><h1>{article.title}</h1>{article.excerpt && <p className="article-banner__deck">{article.excerpt}</p>}<div className="article-banner__meta"><span className="article-banner__author"><span className="article-banner__avatar">{(article.author?.full_name || article.author?.display_name || 'Patnugutan').split(/\s+/).filter(Boolean).filter((part, index, parts) => index === 0 || index === parts.length - 1).map((part) => part[0]).join('').toUpperCase()}</span><span className="article-banner__byline">Sinulat ni <strong>{article.author?.full_name || article.author?.display_name || 'Patnugutan'}</strong></span></span><span className="article-banner__fact"><CalendarDays size={14} /> {formatDate(article.published_at)}</span><span className="article-banner__fact"><Clock3 size={14} /> Tinatayang {readMinutes(article.content)} minutong pagbasa</span></div></div></header>{article.cover_image_url && <figure className="article-cover container"><img src={article.cover_image_url} alt="" width="1600" height="900" /></figure>}<div className="article-content-wrap article-content-wrap--tools container"><ReadingRail article={article} views={views} fontSize={fontSize} onFontSize={changeFontSize} contentRef={contentRef} /><div className="article-body"><ListenPlayer title={article.title} html={article.content} /><div ref={contentRef}>{(([before, after]) => after ? <><div className={`article-content article-content--${fontSize}`} dangerouslySetInnerHTML={{ __html: before }} /><AdSlot placement="in-article" /><div className={`article-content article-content--rest article-content--${fontSize}`} dangerouslySetInnerHTML={{ __html: after }} /></> : <div className={`article-content article-content--${fontSize}`} dangerouslySetInnerHTML={{ __html: before }} />)(splitForInArticleAd(article.content))}</div></div><AdSlot placement="article-sidebar" /></div><ArticleEngagement articleId={article.id} /></article>{related.length > 0 && <section className="continue-section container"><h2 className="continue-title">Ipagpatuloy ang Pagbasa</h2><div className="continue-grid">{related.map((item) => <Link className="continue-card" to={`/article/${item.slug}`} key={item.id}><span className="continue-card__image">{item.cover_image_url ? <img src={item.cover_image_url} alt="" loading="lazy" /> : <img className="continue-card__placeholder" src={logo} alt="" />}</span><span className="continue-card__body"><small>{publicCategoryName(item.category)}</small><strong>{item.title}</strong><span className="continue-card__meta"><Clock3 size={14} /> Tinatayang {readMinutes(item.content)} minutong pagbasa</span></span></Link>)}</div></section>}</main>
}

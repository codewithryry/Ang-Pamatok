import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Pamatok.png'
import { getPublishedArticles } from '../services/articles'
import { publicCategoryName } from '../lib/format'

// Search panel that drops down over the page; results update as the reader types.
export const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const term = query.replace(/[,()%*]/g, ' ').trim()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = setTimeout(() => inputRef.current?.focus(), 30)
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; clearTimeout(focus); window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  useEffect(() => {
    if (term.length < 2) { setResults([]); setLoading(false); return }
    let active = true
    setLoading(true)
    const timer = setTimeout(async () => {
      const result = await getPublishedArticles({ search: term, limit: 8 })
      if (!active) return
      setResults(result.data)
      setLoading(false)
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [term])

  if (!open) return null
  const close = () => { onClose(); setQuery('') }
  return <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Maghanap ng mga akda">
    <div className="search-overlay__backdrop" onClick={close} />
    <div className="search-overlay__panel">
      <div className="search-overlay__bar container"><Search size={20} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ANG PAMATOK..." aria-label="Search ANG PAMATOK" /><button type="button" onClick={close} aria-label="Isara ang paghahanap"><X size={20} /></button></div>
      {term.length >= 2 && <div className="search-overlay__results container">
        {loading && !results.length ? <p className="search-overlay__hint">Naghahanap…</p> : results.length ? <ul>{results.map((article) => <li key={article.id}><Link to={`/article/${article.slug}`} onClick={close}>
          <span className="search-overlay__thumb">{article.cover_image_url ? <img src={article.cover_image_url} alt="" loading="lazy" /> : <img className="search-overlay__placeholder" src={logo} alt="" />}</span>
          <span className="search-overlay__text"><span className="search-overlay__tag">{publicCategoryName(article.category)}</span><strong>{article.title}</strong>{article.excerpt && <small>{article.excerpt}</small>}</span>
        </Link></li>)}</ul> : <p className="search-overlay__hint">Walang akdang nakita para sa “{term}”.</p>}
      </div>}
    </div>
  </div>
}

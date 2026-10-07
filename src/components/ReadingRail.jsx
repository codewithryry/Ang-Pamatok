import { Check, Eye, Link2, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const RING = 2 * Math.PI * 17
const sizes = [['sm', 'Smaller text'], ['md', 'Default text'], ['lg', 'Larger text']]
const compact = (value) => value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value)

const FacebookIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3Z" /></svg>
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" /></svg>

// Side toolbar for the article page: views, reading progress, text size and sharing.
export const ReadingRail = ({ article, views, fontSize, onFontSize, contentRef }) => {
  const [progress, setProgress] = useState(0)
  const [reading, setReading] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const update = () => {
      const el = contentRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const read = window.innerHeight * 0.4 - rect.top
      setProgress(Math.min(1, Math.max(0, total > 0 ? read / total : 1)))
      setReading(rect.top < 40 && rect.bottom > 80)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [contentRef])

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url) } catch { const field = document.createElement('textarea'); field.value = url; document.body.appendChild(field); field.select(); document.execCommand('copy'); field.remove() }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const nativeShare = () => navigator.share?.({ title: article.title, text: article.excerpt, url }).catch(() => {})

  return <aside className="reading-rail" aria-label="Reading tools">
    <div className="reading-rail__group" title={`${views} views`}><Eye size={17} /><span className="reading-rail__count">{compact(views)}</span></div>
    <div className="reading-rail__group reading-rail__group--progress" title={`${Math.round(progress * 100)}% read`}>
      <svg className="reading-rail__ring" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" className="reading-rail__track" /><circle cx="20" cy="20" r="17" className="reading-rail__progress" strokeDasharray={RING} strokeDashoffset={RING * (1 - progress)} /></svg>
      <span className="reading-rail__count">{Math.round(progress * 100)}%</span>
    </div>
    <div className="reading-rail__group reading-rail__sizes"><span className="reading-rail__label">Aa</span>{sizes.map(([size, label]) => <button type="button" key={size} className={`reading-rail__size reading-rail__size--${size} ${fontSize === size ? 'is-active' : ''}`} onClick={() => onFontSize(size)} aria-label={label} aria-pressed={fontSize === size}>A</button>)}</div>
    <div className="reading-rail__group">
      <button type="button" className="reading-rail__icon" onClick={copyLink} aria-label="Copy link" title={copied ? 'Link copied' : 'Copy link'}>{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
      <a className="reading-rail__icon" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" title="Share on Facebook"><FacebookIcon /></a>
      <a className="reading-rail__icon" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" title="Share on X"><XIcon /></a>
      {typeof navigator !== 'undefined' && navigator.share && <button type="button" className="reading-rail__icon" onClick={nativeShare} aria-label="More sharing options" title="Share"><Share2 size={16} /></button>}
    </div>
    {copied && <span className="reading-rail__toast" role="status">Link copied</span>}
    <div className={`now-reading ${reading ? 'is-visible' : ''}`} aria-hidden="true"><span className="reading-progress-bar" style={{ transform: `scaleX(${progress})` }} /><div className="now-reading__inner container"><span className="now-reading__label">Now reading:</span><span className="now-reading__title">{article.title}</span></div></div>
  </aside>
}

import { Lock, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDialog } from './DialogProvider'
import { formatDate } from '../lib/format'
import { addComment, deleteComment, getComments, getReactions, reactionTypes, setReaction } from '../services/engagement'

// Comments are closed for now to keep database storage small. Set to true (and restore the
// article_comments_public_insert policy) to reopen them.
const COMMENTS_OPEN = false

const readStored = (key) => { try { return localStorage.getItem(key) } catch { return null } }
const writeStored = (key, value) => { try { if (value) localStorage.setItem(key, value); else localStorage.removeItem(key) } catch { /* storage unavailable */ } }

// Reader reactions and comments shown under an article.
export const ArticleEngagement = ({ articleId }) => {
  const { user } = useAuth()
  const { confirm, toast } = useDialog()
  const reactionKey = `pamatok-reaction-${articleId}`
  const [counts, setCounts] = useState({})
  const [mine, setMine] = useState(() => readStored(reactionKey))
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ name: readStored('pamatok-commenter') || '', body: '' })
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const canModerate = user?.role === 'admin' || user?.role === 'editor'

  useEffect(() => {
    let active = true
    Promise.all([getReactions(articleId), getComments(articleId)]).then(([reactionResult, commentResult]) => {
      if (!active) return
      setCounts(reactionResult.data)
      setComments(commentResult.data)
    })
    return () => { active = false }
  }, [articleId])

  const react = async (type) => {
    const previous = mine
    const next = previous === type ? null : type
    setMine(next)
    writeStored(reactionKey, next)
    setCounts((current) => ({ ...current, ...(previous && { [previous]: Math.max(0, (current[previous] || 0) - 1) }), ...(next && { [next]: (current[next] || 0) + 1 }) }))
    const result = await setReaction(articleId, next, previous)
    if (result.error) {
      setMine(previous)
      writeStored(reactionKey, previous)
      setCounts((await getReactions(articleId)).data)
    }
  }

  const post = async (event) => {
    event.preventDefault()
    setPosting(true)
    setError('')
    const result = await addComment(articleId, form)
    setPosting(false)
    if (result.error) { setError(result.error); return }
    writeStored('pamatok-commenter', form.name.trim())
    setComments([result.data, ...comments])
    setForm({ ...form, body: '' })
  }

  const remove = async (id) => {
    if (!await confirm({ title: 'Delete this comment?', message: 'It will be removed from the article permanently.', confirmLabel: 'Delete' })) return
    const result = await deleteComment(id)
    if (result.error) { setError(result.error); return }
    setComments(comments.filter((comment) => comment.id !== id))
    toast('Comment deleted.')
  }

  return <div className="engagement">
    <section className="engagement-card reactions">
      <h2>How did this piece make you feel?</h2>
      <div className="reactions__list">{reactionTypes.map(([type, emoji, label]) => <button type="button" key={type} className={`reaction ${mine === type ? 'is-active' : ''}`} onClick={() => react(type)} aria-pressed={mine === type} aria-label={`${label} (${counts[type] || 0})`} title={label}><span aria-hidden="true">{emoji}</span><strong>{counts[type] || 0}</strong></button>)}</div>
    </section>
    <section className="engagement-card discussions">
      <div className="discussions__heading"><h2>Discussions</h2><span className="discussions__count">{comments.length}</span></div>
      {COMMENTS_OPEN && <p className="discussions__intro">Join the conversation and share your perspective on this piece.</p>}
      {COMMENTS_OPEN ? <form className="discussions__form" onSubmit={post}>
        {error && <div className="form-error" role="alert">{error}</div>}
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" required maxLength="60" aria-label="Your name" />
        <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="Write a respectful comment…" required maxLength="1000" rows="4" aria-label="Comment" />
        <div className="discussions__actions"><span>{form.body.length}/1000</span><button className="button button--primary" disabled={posting}><Send size={16} /> {posting ? 'Posting…' : 'Post comment'}</button></div>
      </form> : <div className="discussions__locked"><Lock size={18} /><span>Discussions are closed for now.</span></div>}
      {comments.length ? <ul className="discussions__list">{comments.map((comment) => <li key={comment.id}><span className="discussions__avatar">{comment.name.trim()[0]?.toUpperCase()}</span><div><div className="discussions__meta"><strong>{comment.name}</strong><span>{formatDate(comment.created_at)}</span>{canModerate && <button type="button" onClick={() => remove(comment.id)} aria-label="Delete comment"><Trash2 size={14} /></button>}</div><p>{comment.body}</p></div></li>)}</ul> : <div className="discussions__empty"><MessageSquare size={22} /><span>{COMMENTS_OPEN ? 'No conversations yet. Be the first to start the discussion!' : 'No comments on this piece.'}</span></div>}
    </section>
  </div>
}

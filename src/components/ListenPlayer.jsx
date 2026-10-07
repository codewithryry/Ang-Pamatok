import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const WORDS_PER_MINUTE = 160
const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

// Browsers cut off very long utterances, so the article is read in sentence-sized chunks.
const toChunks = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text]
  const chunks = []
  let current = ''
  sentences.forEach((sentence) => {
    if ((current + sentence).length > 220 && current) { chunks.push(current); current = '' }
    current += sentence
  })
  if (current.trim()) chunks.push(current)
  return chunks
}

// "Listen to article" narration using the browser's built-in speech synthesis.
export const ListenPlayer = ({ title, html }) => {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const text = useMemo(() => {
    const body = new DOMParser().parseFromString(html || '', 'text/html').body.textContent || ''
    return `${title}. ${body}`.replace(/\s+/g, ' ').trim()
  }, [title, html])
  const chunks = useMemo(() => toChunks(text), [text])
  const offsets = useMemo(() => chunks.reduce((list, chunk, index) => [...list, index ? list[index - 1] + chunks[index - 1].length : 0], []), [chunks])
  const totalSeconds = Math.max(1, Math.round(text.split(' ').length / WORDS_PER_MINUTE * 60))
  const [state, setState] = useState('idle')
  const [progress, setProgress] = useState(0)
  const indexRef = useRef(0)

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel() }, [supported, text])

  if (!supported || !text) return null

  const speakFrom = (index) => {
    if (index >= chunks.length) { setState('done'); setProgress(1); return }
    indexRef.current = index
    const utterance = new SpeechSynthesisUtterance(chunks[index])
    utterance.lang = document.documentElement.lang || 'en'
    utterance.onboundary = (event) => setProgress(Math.min(1, (offsets[index] + event.charIndex) / text.length))
    utterance.onend = () => { if (indexRef.current === index) speakFrom(index + 1) }
    window.speechSynthesis.speak(utterance)
  }

  const toggle = () => {
    const synth = window.speechSynthesis
    if (state === 'playing') { synth.pause(); setState('paused'); return }
    if (state === 'paused') { synth.resume(); setState('playing'); return }
    synth.cancel()
    setProgress(0)
    setState('playing')
    speakFrom(0)
  }

  const restart = () => {
    window.speechSynthesis.cancel()
    indexRef.current = -1
    setProgress(0)
    setState('playing')
    setTimeout(() => speakFrom(0), 50)
  }

  return <div className={`listen-player ${state === 'playing' ? 'is-playing' : ''}`}>
    <button type="button" className="listen-player__toggle" onClick={toggle} aria-label={state === 'playing' ? 'Pause narration' : 'Listen to article'}>{state === 'playing' ? <Pause size={18} /> : <Play size={18} />}</button>
    <div className="listen-player__info">
      <span className="listen-player__label">Listen to article</span>
      <span className="listen-player__meta">Synthesized narration · {formatTime(progress * totalSeconds)} / {formatTime(totalSeconds)}</span>
      <span className="listen-player__track"><span style={{ transform: `scaleX(${progress})` }} /></span>
    </div>
    <span className="listen-player__bars" aria-hidden="true"><i /><i /><i /><i /></span>
    {state !== 'idle' && <button type="button" className="listen-player__restart" onClick={restart} aria-label="Restart narration" title="Restart"><RotateCcw size={15} /></button>}
  </div>
}

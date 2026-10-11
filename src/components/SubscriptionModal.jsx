import { useEffect, useRef, useState } from 'react'
import { Check, CreditCard, Crown, FlaskConical, LogIn, Minus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDialog } from './DialogProvider'

// Mock subscription experience. Nothing here touches Supabase or a payment gateway;
// the simulated state lives only in this browser session.
const STORAGE_KEY = 'pamatok-mock-subscription'
const prices = { monthly: { amount: '₱49', period: '/buwan' }, yearly: { amount: '₱490', period: '/taon' } }
const features = [
  ['Pagbasa ng lahat ng akda', true, true],
  ['Bagong labas sa email linggu-linggo', true, true],
  ['Pagbasa nang walang patalastas', false, true],
  ['Maagang access sa mga pagsisiyasat', false, true],
  ['Eksklusibong lathalain at panayam', false, true],
  ['Badge ng tagasuporta sa mga komento', false, true],
]

const readMock = (userId) => { try { return JSON.parse(sessionStorage.getItem(`${STORAGE_KEY}:${userId}`)) } catch { return null } }
const writeMock = (userId, value) => { try { sessionStorage.setItem(`${STORAGE_KEY}:${userId}`, JSON.stringify(value)) } catch { /* storage unavailable */ } }
const addPeriod = (cycle) => { const date = new Date(); if (cycle === 'yearly') date.setFullYear(date.getFullYear() + 1); else date.setMonth(date.getMonth() + 1); return date.toISOString() }
const formatLong = (iso) => new Date(iso).toLocaleDateString('fil-PH', { year: 'numeric', month: 'long', day: 'numeric' })

export const SubscriptionModal = ({ open, onClose }) => {
  const { session, loading } = useAuth()
  const { confirm, toast } = useDialog()
  const [closing, setClosing] = useState(false)
  const [cycle, setCycle] = useState('monthly')
  const [view, setView] = useState('plans')
  const [subscription, setSubscription] = useState(null)
  const closeRef = useRef(null)
  const userId = session?.id

  useEffect(() => { if (open) { setSubscription(userId ? readMock(userId) : null); setView('plans'); setClosing(false) } }, [open, userId])

  const requestClose = () => { setClosing(true); window.setTimeout(onClose, 180) }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    // Leave Escape to the confirm dialog while one is open on top of this modal.
    const onKey = (event) => { if (event.key === 'Escape' && !document.querySelector('.dialog')) requestClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const save = (value) => { setSubscription(value); writeMock(userId, value) }
  const isPremium = Boolean(subscription)

  const subscribe = async () => {
    const price = prices[cycle]
    const ok = await confirm({ title: 'Kumpirmahin ang Premium', message: `Simulated lamang ito: ${price.amount}${price.period}. Walang tunay na bayad na sisingilin.`, confirmLabel: 'Subscribe', cancelLabel: 'Huwag muna', tone: 'primary' })
    if (!ok) return
    save({ status: 'active', cycle, startedAt: new Date().toISOString(), renewsAt: addPeriod(cycle) })
    setView('manage')
    toast('Aktibo na ang iyong (mock) Premium na subscription.')
  }

  const switchCycle = async (next) => {
    if (next === subscription.cycle) return
    const ok = await confirm({ title: 'Palitan ang billing cycle?', message: `Gagawin itong ${next === 'yearly' ? 'taunan' : 'buwanan'} sa susunod na renewal. Simulated lamang ito.`, confirmLabel: 'Palitan', tone: 'primary' })
    if (!ok) return
    save({ ...subscription, cycle: next })
    toast('Napalitan ang billing cycle (mock).')
  }

  const cancel = async () => {
    const ok = await confirm({ title: 'Kanselahin ang subscription?', message: `Mananatili ang Premium hanggang ${formatLong(subscription.renewsAt)}. Simulated lamang ito at walang tunay na subscription na kakanselahin.`, confirmLabel: 'Kanselahin', cancelLabel: 'Panatilihin' })
    if (!ok) return
    save({ ...subscription, status: 'canceled' })
    toast('Nakansela ang (mock) subscription.', 'info')
  }

  const resume = () => { save({ ...subscription, status: 'active' }); toast('Ipinagpatuloy ang (mock) subscription.') }
  const reset = () => { save(null); setView('plans') }

  const price = prices[cycle]
  return (
    <div className={`subscription-modal ${closing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="subscription-title">
      <div className="subscription-modal__backdrop" onClick={requestClose} />
      <div className="subscription-modal__panel">
        <button type="button" ref={closeRef} className="subscription-modal__close" onClick={requestClose} aria-label="Isara"><X size={18} /></button>
        <header className="subscription-modal__head">
          <span className="eyebrow">Suportahan ang Ang Pamatok</span>
          <h2 id="subscription-title">{view === 'manage' && isPremium ? 'Pamahalaan ang subscription' : 'Pumili ng plano'}</h2>
          <p className="subscription-modal__mock"><FlaskConical size={14} /> Demo lamang — simulated ang mga plano at estado. Walang tunay na bayad o account data na binabago.</p>
        </header>

        {view === 'manage' && isPremium ? <div className="subscription-manage">
          <div className="subscription-status">
            <span className="subscription-status__icon"><Crown size={20} /></span>
            <div><strong>Premium · {subscription.cycle === 'yearly' ? 'Taunan' : 'Buwanan'}</strong><span className={`subscription-badge subscription-badge--${subscription.status}`}>{subscription.status === 'active' ? 'Aktibo' : 'Nakansela'} (mock)</span></div>
          </div>
          <dl className="subscription-details">
            <div><dt>Halaga</dt><dd>{prices[subscription.cycle].amount}{prices[subscription.cycle].period}</dd></div>
            <div><dt>Nagsimula</dt><dd>{formatLong(subscription.startedAt)}</dd></div>
            <div><dt>{subscription.status === 'active' ? 'Susunod na renewal' : 'Matatapos sa'}</dt><dd>{formatLong(subscription.renewsAt)}</dd></div>
            <div><dt>Paraan ng bayad</dt><dd><CreditCard size={15} /> Halimbawang card •••• 4242</dd></div>
          </dl>
          {subscription.status === 'active' && <div className="subscription-cycle" role="group" aria-label="Billing cycle">
            <span>Billing cycle</span>
            <div className="subscription-toggle">{['monthly', 'yearly'].map((item) => <button type="button" key={item} className={subscription.cycle === item ? 'is-active' : ''} aria-pressed={subscription.cycle === item} onClick={() => switchCycle(item)}>{item === 'yearly' ? 'Taunan' : 'Buwanan'}</button>)}</div>
          </div>}
          <div className="subscription-actions">
            <button type="button" className="button button--outline" onClick={() => setView('plans')}>Tingnan ang mga plano</button>
            {subscription.status === 'active' ? <button type="button" className="button dialog__danger" onClick={cancel}>Cancel Subscription</button> : <button type="button" className="button button--primary" onClick={resume}>Ipagpatuloy ang Premium</button>}
          </div>
          <button type="button" className="subscription-reset" onClick={reset}>I-reset ang demo</button>
        </div> : <>
          <div className="subscription-toggle subscription-toggle--center" role="group" aria-label="Billing cycle">{['monthly', 'yearly'].map((item) => <button type="button" key={item} className={cycle === item ? 'is-active' : ''} aria-pressed={cycle === item} onClick={() => setCycle(item)}>{item === 'yearly' ? 'Taunan · tipid 2 buwan' : 'Buwanan'}</button>)}</div>
          <div className="subscription-plans">
            <article className={`subscription-plan ${!isPremium ? 'is-current' : ''}`}>
              <h3>Libre</h3>
              <p className="subscription-plan__price"><strong>₱0</strong><span>magpakailanman</span></p>
              <p className="subscription-plan__desc">Para sa bawat mambabasa ng pahayagang pangkampus.</p>
              <ul>{features.map(([label, free]) => <li key={label} className={free ? '' : 'is-off'}>{free ? <Check size={15} /> : <Minus size={15} />}{label}</li>)}</ul>
              <button type="button" className="button button--outline" disabled>{!isPremium ? 'Kasalukuyang plano' : 'Libreng plano'}</button>
            </article>
            <article className={`subscription-plan subscription-plan--premium ${isPremium ? 'is-current' : ''}`}>
              <span className="subscription-plan__ribbon">Inirerekomenda</span>
              <h3><Crown size={18} /> Premium</h3>
              <p className="subscription-plan__price"><strong>{price.amount}</strong><span>{price.period}</span></p>
              <p className="subscription-plan__desc">Suportahan ang malayang pamamahayag ng mga mag-aaral.</p>
              <ul>{features.map(([label, , premium]) => <li key={label} className={premium ? '' : 'is-off'}><Check size={15} />{label}</li>)}</ul>
              {loading ? <button type="button" className="button button--primary" disabled>Naglo-load...</button>
                : !session ? <Link className="button button--primary" to="/login" onClick={onClose}><LogIn size={16} /> Mag-log in para mag-subscribe</Link>
                  : isPremium ? <button type="button" className="button button--primary" onClick={() => setView('manage')}>Manage Subscription</button>
                    : <button type="button" className="button button--primary" onClick={subscribe}>Subscribe</button>}
            </article>
          </div>
          {!session && !loading && <p className="subscription-modal__signin">Wala pang account? <Link to="/register" onClick={onClose}>Gumawa ng account</Link></p>}
        </>}
      </div>
    </div>
  )
}

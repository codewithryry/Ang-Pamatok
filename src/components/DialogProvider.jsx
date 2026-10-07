import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const DialogContext = createContext({ confirm: async () => false, toast: () => {} })

const toastIcons = { success: CheckCircle2, error: XCircle, info: Info }

// App-wide confirm dialog and toast notifications, used instead of the browser's built-in popups.
export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null)
  const [toasts, setToasts] = useState([])
  const confirmRef = useRef(null)

  const confirm = useCallback((options) => new Promise((resolve) => setDialog({ ...options, resolve })), [])
  const toast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, tone }])
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3500)
  }, [])

  const close = useCallback((value) => {
    setDialog((current) => { current?.resolve(value); return null })
  }, [])

  useEffect(() => {
    if (!dialog) return
    confirmRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') close(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog, close])

  return <DialogContext.Provider value={{ confirm, toast }}>
    {children}
    {dialog && <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog__backdrop" onClick={() => close(false)} />
      <div className={`dialog__panel dialog__panel--${dialog.tone || 'danger'}`}>
        <span className="dialog__icon"><AlertTriangle size={22} /></span>
        <h2 id="dialog-title">{dialog.title}</h2>
        {dialog.message && <p>{dialog.message}</p>}
        <div className="dialog__actions">
          <button type="button" className="button button--outline" onClick={() => close(false)}>{dialog.cancelLabel || 'Cancel'}</button>
          <button type="button" ref={confirmRef} className={`button ${dialog.tone === 'primary' ? 'button--primary' : 'dialog__danger'}`} onClick={() => close(true)}>{dialog.confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>}
    <div className="toast-stack" aria-live="polite">{toasts.map(({ id, message, tone }) => { const Icon = toastIcons[tone] || Info; return <div key={id} className={`toast toast--${tone}`}><Icon size={18} /><span>{message}</span><button type="button" onClick={() => setToasts((current) => current.filter((item) => item.id !== id))} aria-label="Dismiss"><X size={15} /></button></div> })}</div>
  </DialogContext.Provider>
}

export const useDialog = () => useContext(DialogContext)

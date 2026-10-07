import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'
import { resetPassword } from '../services/auth'
import { clearPasswordChange } from '../services/profiles'

export const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const { user, refresh } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); if (password !== confirm) { setError('Passwords do not match.'); return }; setLoading(true); setError(''); const { error: authError } = await resetPassword(null, password); if (authError) { setLoading(false); setError(authError.message || authError); return }; const result = await clearPasswordChange(user.id); if (result.error) { setLoading(false); setError(result.error); return }; await refresh(); setLoading(false); navigate('/dashboard', { replace: true }) }
  return <main className="auth-page auth-page--center"><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><Brand /><div className="auth-form__heading"><h1>Change password</h1><p>Your account was created by an admin. Set your own password to continue.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="8" autoComplete="new-password" /></label><label>Confirm new password<input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required minLength="8" autoComplete="new-password" /></label><button className="button button--primary button--wide" disabled={loading}>{loading ? 'Saving…' : <>Save password <ArrowRight size={17} /></>}</button></form></section></main>
}

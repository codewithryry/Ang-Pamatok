import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { requestPasswordReset } from '../services/auth'

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); const { error: authError } = await requestPasswordReset(email); setLoading(false); if (authError) setError(authError.message || authError); else setMessage('Check your email for a password reset link.') }
  return <main className="auth-page auth-page--center"><section className="auth-form-wrap"><Link className="back-link" to="/login"><ArrowLeft size={16} /> Back to login</Link><form className="auth-form" onSubmit={submit}><Brand /><div className="auth-form__heading"><h1>Reset password</h1><p>Enter the email tied to your editorial account.</p></div>{message && <div className="form-success" role="status">{message}</div>}{error && <div className="form-error" role="alert">{error}</div>}<label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><button className="button button--primary button--wide" disabled={loading}>{loading ? 'Sending…' : <>Send reset link <ArrowRight size={17} /></>}</button></form></section></main>
}

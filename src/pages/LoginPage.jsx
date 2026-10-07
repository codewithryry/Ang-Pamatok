import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import logo from '../assets/Pamatok.png'
import { signIn, signOut } from '../services/auth'
import { getProfile } from '../services/profiles'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); const { data, error: authError } = await signIn(email, password); if (authError) { setLoading(false); setError(authError.message || authError); return }; const { data: profile } = await getProfile(data.user.id); if (!profile?.is_active) { await signOut(); setLoading(false); setError('Your account is waiting for admin approval.'); return }; setLoading(false); navigate(profile.must_change_password ? '/change-password' : '/dashboard', { replace: true }) }
  return <main className="auth-page"><section className="auth-brand"><img className="auth-brand__watermark" src={logo} alt="" aria-hidden="true" /><Brand compact hideLogo /><div><span className="eyebrow">Pasukan ng Patnugutan</span><h1>Dito nagsisimula ang mga kuwento.</h1><p>Mag-login upang lumikha, magsuri, at maglathala ng mga akda para sa ANG PAMATOK.</p></div><div className="auth-brand__note"><LockKeyhole size={20} /><span>Ligtas na pagpasok gamit ang Supabase Auth</span></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="auth-form__heading"><span className="eyebrow">Welcome back</span><h2>Sign in</h2><p>Use your email and password.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<div className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><button className="button button--primary button--wide" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}</button><Link className="forgot-link" to="/forgot-password">Forgot your password?</Link><p className="auth-switch">New to the editorial team? <Link to="/register">Create an account</Link></p></form></section></main>
}

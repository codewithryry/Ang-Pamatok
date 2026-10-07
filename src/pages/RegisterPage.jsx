import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import logo from '../assets/Pamatok.png'
import { PasswordInput } from '../components/PasswordInput'
import { signUp } from '../services/auth'

export const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const update = (key, value) => setForm({ ...form, [key]: value })
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); const { error: authError } = await signUp(form); setLoading(false); if (authError) { setError(authError.message || authError); return }; setDone(true) }
  return <main className="auth-page"><section className="auth-brand"><img className="auth-brand__watermark" src={logo} alt="" aria-hidden="true" /><Brand compact hideLogo /><div><span className="eyebrow">Pasukan ng Patnugutan</span><h1>Sumali sa patnugutan.</h1><p>Gumawa ng account bilang mag-aaral. Susuriin at aaprubahan ito ng tagapangasiwa bago ka makapag-log in.</p></div><div className="auth-brand__note"><LockKeyhole size={20} /><span>Ligtas na pagpasok gamit ang Supabase Auth</span></div></section><section className="auth-form-wrap"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link>{done ? <div className="auth-form"><div className="auth-form__heading"><span className="eyebrow">Almost there</span><h2>Account created</h2><p>Your account is waiting for admin approval. You can sign in once it has been verified.</p></div><Link className="button button--primary button--wide" to="/login">Back to sign in</Link></div> : <form className="auth-form" onSubmit={submit}><div className="auth-form__heading"><span className="eyebrow">Student account</span><h2>Register</h2><p>Use your name, email, and a password.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<label>Full name<input value={form.fullName} onChange={(event) => update('fullName', event.target.value)} required autoComplete="name" placeholder="Juan Dela Cruz" /></label><label>Email address<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required autoComplete="email" placeholder="juan.delacruz@email.com" /></label><label>Password<PasswordInput value={form.password} onChange={(event) => update('password', event.target.value)} required minLength="8" autoComplete="new-password" placeholder="Hindi bababa sa 8 karakter" /></label><button className="button button--primary button--wide" disabled={loading}>{loading ? 'Creating account…' : <>Create account <ArrowRight size={17} /></>}</button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form>}</section></main>
}

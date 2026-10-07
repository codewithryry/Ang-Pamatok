import { Check, KeyRound, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { PasswordInput } from '../components/PasswordInput'
import { resetPassword } from '../services/auth'
import { updateOwnProfile } from '../services/profiles'

export const ProfilePage = () => {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({ full_name: '', display_name: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwords, setPasswords] = useState({ password: '', confirm: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  useEffect(() => { if (user) setForm({ full_name: user.full_name || '', display_name: user.display_name || '', bio: user.bio || '' }) }, [user])
  const update = (key, value) => { setForm({ ...form, [key]: value }); setMessage('') }
  const save = async (event) => { event.preventDefault(); setSaving(true); setError(''); setMessage(''); const result = await updateOwnProfile(user.id, form); setSaving(false); if (result.error) { setError(result.error); return }; await refresh(); setMessage('Profile saved.') }
  const changePassword = async (event) => { event.preventDefault(); setPasswordError(''); setPasswordMessage(''); if (passwords.password !== passwords.confirm) { setPasswordError('Passwords do not match.'); return }; setPasswordSaving(true); const { error: authError } = await resetPassword(null, passwords.password); setPasswordSaving(false); if (authError) { setPasswordError(authError.message || authError); return }; setPasswords({ password: '', confirm: '' }); setPasswordMessage('Password updated.') }
  const role = user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : ''
  return <div className="dashboard-page settings-form">
    <form className="settings-card" onSubmit={save}><div className="panel-heading"><div><h3>Account profile</h3><p>Your name and bio appear on the stories you write.</p></div></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="form-grid"><label className="field">Full name<input value={form.full_name} onChange={(event) => update('full_name', event.target.value)} required maxLength="120" /></label><label className="field">Display name<input value={form.display_name} onChange={(event) => update('display_name', event.target.value)} maxLength="80" /></label><label className="field">Email address<input value={user?.email || ''} disabled /></label><label className="field">Role<input value={role} disabled /></label><label className="field field--wide">Bio<textarea value={form.bio} onChange={(event) => update('bio', event.target.value)} rows="4" maxLength="400" placeholder="A short line about you, shown with your stories." /></label></div><div className="form-actions"><button className="button button--primary" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save profile'}</button>{message && <span className="saved-message"><Check size={16} /> {message}</span>}</div></form>
    <form className="settings-card" onSubmit={changePassword}><div className="panel-heading"><div><h3>Change password</h3><p>Use at least 8 characters.</p></div></div>{passwordError && <div className="form-error" role="alert">{passwordError}</div>}<div className="form-grid"><label className="field">New password<PasswordInput value={passwords.password} onChange={(event) => setPasswords({ ...passwords, password: event.target.value })} required minLength="8" autoComplete="new-password" /></label><label className="field">Confirm new password<PasswordInput value={passwords.confirm} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} required minLength="8" autoComplete="new-password" /></label></div><div className="form-actions"><button className="button button--primary" disabled={passwordSaving}><KeyRound size={16} /> {passwordSaving ? 'Updating…' : 'Update password'}</button>{passwordMessage && <span className="saved-message"><Check size={16} /> {passwordMessage}</span>}</div></form>
  </div>
}

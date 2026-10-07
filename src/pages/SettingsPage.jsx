import { Check, Save } from 'lucide-react'
import { useState } from 'react'

export const SettingsPage = () => {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ publicationName: 'ANG PAMATOK', description: 'Student Publication', defaultStatus: 'draft' })
  const submit = (event) => { event.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000) }
  return <div className="dashboard-page"><form className="settings-form" onSubmit={submit}><section className="settings-card"><div className="panel-heading"><div><h3>Publication identity</h3><p>Core publication details shown across the public site.</p></div></div><div className="form-grid"><label className="field field--wide">Publication name<input value={form.publicationName} onChange={(event) => setForm({ ...form, publicationName: event.target.value })} required /></label><label className="field field--wide">Short description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label><label className="field">Default article status<select value={form.defaultStatus} onChange={(event) => setForm({ ...form, defaultStatus: event.target.value })}><option value="draft">Draft</option><option value="review">Under review</option></select></label></div></section><div className="form-actions"><button className="button button--primary" type="submit"><Save size={16} /> Save settings</button>{saved && <span className="saved-message"><Check size={16} /> Settings saved</span>}</div></form></div>
}

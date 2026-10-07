import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)
  return <div className="password-input"><input {...props} type={visible ? 'text' : 'password'} /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
}

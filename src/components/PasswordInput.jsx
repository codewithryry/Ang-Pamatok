import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)
  return <div className="password-input"><input {...props} type={visible ? 'text' : 'password'} /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Itago ang lihim na salita' : 'Ipakita ang lihim na salita'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
}

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function UpdatePasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    if (token_hash && type === 'recovery') {
      setAccessToken(token_hash)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw updateError
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <p>Contraseña actualizada exitosamente</p>
        <button onClick={() => navigate('/golfpanel/login')}>Ir al inicio de sesión</button>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div>
        <p>Enlace inválido o expirado</p>
        <button onClick={() => navigate('/golfpanel/login')}>Ir al inicio de sesión</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Crear nueva contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nueva contraseña:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <label>
          Confirmar contraseña:
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </form>
    </div>
  )
}
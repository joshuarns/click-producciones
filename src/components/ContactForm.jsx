import { useState } from 'react'
import { site } from '../data/site'

// Se envía a /enviar.php (public/enviar.php), que corre en el hosting.
export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/enviar.php', { method: 'POST', body: new FormData(form) })
      const data = await res.json()
      if (!data.ok) throw new Error(data.message)
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError(err.message && !err.message.includes('JSON') ? err.message : '')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform cform--sent" role="status">
        <span className="cform__check" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <h3>¡Gracias! Recibimos tu solicitud.</h3>
        <p>Te contactaremos muy pronto con tu cotización.</p>
        <button type="button" className="contact__copy" onClick={() => setStatus('idle')}>
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      <h3 className="cform__title">Cuéntanos de tu proyecto</h3>

      <div className="cform__row">
        <label className="cform__field">
          <span>Nombre *</span>
          <input name="nombre" type="text" autoComplete="name" required maxLength={200} />
        </label>
        <label className="cform__field">
          <span>Empresa</span>
          <input name="empresa" type="text" autoComplete="organization" maxLength={200} />
        </label>
      </div>

      <div className="cform__row">
        <label className="cform__field">
          <span>Correo *</span>
          <input name="correo" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label className="cform__field">
          <span>Teléfono</span>
          <input name="telefono" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>

      <label className="cform__field">
        <span>Servicio de interés</span>
        <select name="servicio" defaultValue="">
          <option value="">Selecciona una opción</option>
          {site.services.map((s) => (
            <option key={s.title}>{s.title}</option>
          ))}
          <option>Otro</option>
        </select>
      </label>

      <label className="cform__field">
        <span>Mensaje *</span>
        <textarea name="mensaje" rows={4} required maxLength={5000} placeholder="¿Qué necesitas, para cuándo y dónde?" />
      </label>

      {/* Campo trampa para bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="cform__trap" aria-hidden="true" />

      {status === 'error' && (
        <p className="cform__error" role="alert">
          {error || 'No pudimos enviar tu mensaje.'} Intenta de nuevo o escríbenos por{' '}
          <a href={site.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          .
        </p>
      )}

      <button type="submit" className="btn btn--primary cform__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </form>
  )
}

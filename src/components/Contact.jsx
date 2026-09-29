import { useState } from 'react'
import Reveal from './Reveal'
import { site } from '../data/site'
import './Contact.css'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <section className="section contact" id="contacto">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Cotizaciones</p>
        </Reveal>

        <Reveal as="h2" className="contact__title" delay={0.05}>
          Solicita tu <span className="serif">cotización</span>
        </Reveal>

        <Reveal as="p" className="contact__lead" delay={0.08}>
          Envíanos un mensaje por correo o directamente por WhatsApp y con gusto te preparamos una propuesta a la
          medida de tu empresa.
        </Reveal>

        <Reveal delay={0.1} className="contact__actions">
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn btn--primary contact__wa">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"
              />
            </svg>
            Cotizar por WhatsApp
          </a>
          <span className="contact__or">o escríbenos a</span>
        </Reveal>

        <Reveal delay={0.12} className="contact__mail-row">
          <a href={`mailto:${site.email}`} className="contact__mail">
            {site.email}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18L18 6M8 6h10v10" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </a>
          <button className="contact__copy" onClick={copyEmail} aria-live="polite">
            {copied ? '¡Copiado!' : 'Copiar correo'}
          </button>
        </Reveal>

        <Reveal delay={0.15} className="contact__grid">
          <div>
            <h3>WhatsApp</h3>
            <a href={site.whatsapp} target="_blank" rel="noreferrer">
              {site.phone}
            </a>
          </div>
          <div>
            <h3>Ubicación</h3>
            <p>{site.location}</p>
          </div>
          <div>
            <h3>Redes</h3>
            <ul>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

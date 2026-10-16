import { useState } from 'react'
import Reveal from './Reveal'
import { WhatsAppIcon } from './WhatsAppButton'
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
            <WhatsAppIcon />
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

import { useState } from 'react'
import Reveal from './Reveal'
import { WhatsAppIcon } from './WhatsAppButton'
import ContactForm from './ContactForm'
import { site } from '../data/site'
import './Contact.css'

const svg = (children) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
)

const ICONS = {
  location: svg(
    <g fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </g>,
  ),
  instagram: svg(
    <g fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </g>,
  ),
  vimeo: svg(
    <path
      fill="currentColor"
      d="M22 7.4c-.1 1.9-1.4 4.6-4.1 8-2.7 3.5-5 5.3-6.9 5.3-1.2 0-2.2-1.1-3-3.3L6.4 11.4c-.6-2.2-1.2-3.3-1.9-3.3-.1 0-.6.3-1.5.9L2 8c.9-.8 1.9-1.7 2.8-2.5 1.3-1.1 2.2-1.7 2.9-1.7 1.5-.1 2.4.9 2.8 3.1.4 2.4.6 3.9.8 4.5.4 2 .9 3 1.4 3 .4 0 1-.6 1.8-1.9.8-1.3 1.3-2.2 1.3-2.9.1-1.1-.3-1.7-1.3-1.7-.5 0-.9.1-1.4.3.9-3 2.7-4.5 5.3-4.4 1.9 0 2.8 1.3 2.7 3.7z"
    />,
  ),
  linkedin: svg(
    <path
      fill="currentColor"
      d="M6.9 8.8H3.6V20h3.3V8.8zM5.2 3.5a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9zM20.4 13.6c0-3-1.6-5-4.3-5-1.4 0-2.4.8-2.9 1.6V8.8H10V20h3.3v-5.8c0-1.5.6-2.6 2-2.6 1.3 0 1.8 1 1.8 2.6V20h3.3v-6.4z"
    />,
  ),
}

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

        <div className="contact__layout">
          <div className="contact__info">
            <Reveal as="p" className="contact__lead" delay={0.08}>
              Llena el formulario o envíanos un mensaje por correo o directamente por WhatsApp, y con gusto te
              preparamos una propuesta a la medida de tu empresa.
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

            <Reveal delay={0.15} className="contact__details">
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="detail">
                <span className="detail__icon">
                  <WhatsAppIcon />
                </span>
                <span className="detail__text">
                  <small>WhatsApp</small>
                  {site.phone}
                </span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location)}`}
                target="_blank"
                rel="noreferrer"
                className="detail"
              >
                <span className="detail__icon">{ICONS.location}</span>
                <span className="detail__text">
                  <small>Ubicación</small>
                  {site.location}
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.18} className="contact__socials">
              <span className="contact__socials-label">Síguenos</span>
              <ul>
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                      {ICONS[s.label.toLowerCase()]}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="contact__form">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

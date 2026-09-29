import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import Logo from './Logo'
import useLockBody from '../hooks/useLockBody'
import { site } from '../data/site'
import './Nav.css'

const LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#video', label: 'Video' },
  { href: '#portafolio', label: 'Portafolio' },
  { href: '#clientes', label: 'Clientes' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })

  useLockBody(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label={`${site.name}, ir al inicio`} onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <a href="#contacto" className="nav__cta">
          Cotizar
        </a>

        <button
          className="nav__burger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="container mobile-menu__links" aria-label="Móvil">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="mobile-menu__num">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="container mobile-menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <div>
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

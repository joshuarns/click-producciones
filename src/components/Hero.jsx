import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import heroVideo from '../assets/video/video-hero.mp4'
import { site } from '../data/site'
import './Hero.css'

const LINES = [
  <>Comunicación visual</>,
  <>
    que <span className="serif hero__accent">impacta</span>
  </>,
]

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { amount: 0.1 })
  const [ready, setReady] = useState(false)
  // Si el usuario pide menos movimiento, el video arranca en pausa.
  const [paused, setPaused] = useState(() => reduceMotion ?? false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  // Solo reproduce cuando el hero está visible y el usuario no lo pausó.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView && !paused) video.play().catch(() => {})
    else video.pause()
  }, [inView, paused])

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__media" style={{ scale: videoScale }} aria-hidden="true">
        <video
          ref={videoRef}
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src={heroVideo}
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
        />
      </motion.div>
      <div className="hero__shade" aria-hidden="true" />

      <motion.div className="container hero__content" style={{ y: titleY, opacity: fade }}>
        <motion.p
          className="eyebrow hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {site.tagline} · Más de {site.years} años
        </motion.p>

        <h1 className="hero__title">
          {LINES.map((line, i) => (
            <span className="hero__line" key={i}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="hero__bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          <p className="hero__lead">
            Somos tu aliado estratégico en imagen empresarial: fotografía y video corporativo con la más alta calidad,
            para que tus mensajes lleguen claros a tus clientes y colaboradores.
          </p>
          <div className="hero__actions">
            <a href="#portafolio" className="btn btn--primary">
              Ver nuestro trabajo
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2v12M3 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <a href="#contacto" className="btn btn--ghost">
              Solicitar cotización
            </a>
            <button
              className="hero__toggle"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Reproducir video de fondo' : 'Pausar video de fondo'}
              aria-pressed={paused}
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 1.5h2.6v11H3zM8.4 1.5H11v11H8.4z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

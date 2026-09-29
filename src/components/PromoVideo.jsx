import { useRef, useState } from 'react'
import Reveal from './Reveal'
// TODO: reemplazar por el video promocional definitivo (se usa el video del hero como provisional).
import promoVideo from '../assets/video/video-hero.mp4'
import './PromoVideo.css'

export default function PromoVideo() {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)

  const play = () => {
    setStarted(true)
    videoRef.current?.play().catch(() => {})
  }

  return (
    <section className="section promo" id="video">
      <div className="container">
        <div className="promo__head">
          <Reveal>
            <p className="eyebrow">Video promocional</p>
            <h2 className="promo__title">
              Conoce nuestro <span className="serif">trabajo</span>
            </h2>
          </Reveal>
          <Reveal as="p" className="promo__lead" delay={0.1}>
            Te invitamos a conocer más de lo que hacemos a través de este video promocional y del portafolio de
            proyectos que te mostramos a continuación.
          </Reveal>
        </div>

        <Reveal className="promo__player" delay={0.1}>
          <video
            ref={videoRef}
            src={promoVideo}
            controls={started}
            playsInline
            preload="metadata"
            onPlay={() => setStarted(true)}
          />
          {!started && (
            <button className="promo__play" onClick={play} aria-label="Reproducir video promocional">
              <span className="promo__play-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 14 14">
                  <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="promo__play-label">Ver video</span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  )
}

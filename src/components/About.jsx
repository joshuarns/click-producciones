import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import Reveal from './Reveal'
import { site } from '../data/site'
import './About.css'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, suffix])

  return (
    <span ref={ref} className="stat__value">
      0{suffix}
    </span>
  )
}

const PILLARS = [
  {
    title: 'Diferencia tu marca',
    text: 'En un mercado saturado de nuevas ofertas, la manera en que tus mensajes llegan al cliente que te interesa es lo que te posiciona.',
  },
  {
    title: 'Fortalece a tu equipo',
    text: 'Una operación eficiente nace de un ambiente interno donde el compromiso y la valoración de tus colaboradores son primordiales.',
  },
  {
    title: 'Comunica con inteligencia',
    text: 'Ambos objetivos requieren registros fotográficos y audiovisuales claros, efectivos e impactantes.',
  },
]

const TEAM = ['Fotógrafos', 'Videógrafos', 'Editores']

export default function About() {
  return (
    <section className="section about" id="nosotros">
      <div className="container">
        <div className="about__intro">
          <Reveal>
            <p className="eyebrow">Nosotros</p>
          </Reveal>
          <Reveal as="h2" className="about__statement" delay={0.05}>
            No somos cualquier proveedor de fotografía y video. Somos tu{' '}
            <span className="serif">aliado estratégico</span> en la producción de imágenes empresariales y videos
            corporativos.
          </Reveal>
        </div>

        <div className="pillars">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} className="pillar" delay={i * 0.08}>
              <span className="pillar__num">0{i + 1}</span>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__text">{p.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="stats">
          {site.stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.08}>
              <Counter value={s.value} suffix={s.suffix} />
              <span className="stat__label">{s.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="services" id="servicios">
          <Reveal>
            <h3 className="services__heading">Servicios</h3>
            <p className="services__intro">
              Más de {site.years} años dando servicio a todo tipo de empresas.
            </p>
          </Reveal>
          <ol className="services__list">
            {site.services.map((s, i) => (
              <Reveal as="li" key={s.title} className="service" delay={i * 0.05}>
                <span className="service__num">0{i + 1}</span>
                <h4 className="service__title">{s.title}</h4>
                <p className="service__text">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="team">
          <p className="team__text">
            Contamos con <strong>equipo tecnológico de vanguardia</strong> y, sobre todo, con personal profesional de
            la más vasta experiencia y preparación, para que tus imágenes fijas o en movimiento{' '}
            <span className="serif">cumplan con los objetivos esperados.</span>
          </p>
          <ul className="team__roles">
            {TEAM.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

import Reveal from './Reveal'
import { site } from '../data/site'
import './Clients.css'

const files = import.meta.glob('../assets/img/clientes/*', { eager: true, import: 'default' })
const logos = site.clients.map(({ name, logo }) => ({ name, src: files[`../assets/img/clientes/${logo}`] }))

export default function Clients() {
  return (
    <section className="section clients-section" id="clientes">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Clientes</p>
          <h2 className="clients__title">
            Empresas que han <span className="serif">confiado</span> en nosotros
          </h2>
        </Reveal>
      </div>

      <div className="clients" aria-label="Clientes">
        <div className="clients__track">
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="clients__item" aria-hidden={i >= logos.length}>
              <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

import Reveal from './Reveal'
import { site } from '../data/site'
import './Clients.css'

const logos = Object.entries(import.meta.glob('../assets/img/clientes/*.jpg', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src], i) => ({ src, name: site.clients[i] }))

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

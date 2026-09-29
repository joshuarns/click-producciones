import Reveal from './Reveal'
import { site } from '../data/site'
import './Clients.css'

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
          {[...site.clients, ...site.clients].map((c, i) => (
            <span key={i} className="clients__item" aria-hidden={i >= site.clients.length}>
              {c}
              <span className="clients__sep" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

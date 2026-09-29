import Logo from './Logo'
import { site } from '../data/site'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />
        <p>
          © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
        </p>
        <a href="#top" className="footer__top">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  )
}

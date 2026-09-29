import logo from '../assets/img/logo-click.png'
import { site } from '../data/site'
import './Logo.css'

export default function Logo({ className = '' }) {
  return <img src={logo} alt={site.name} className={`logo ${className}`} width="640" height="192" />
}

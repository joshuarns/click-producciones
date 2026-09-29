import { MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import PromoVideo from './components/PromoVideo'
import Gallery from './components/Gallery'
import Clients from './components/Clients'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#nosotros" className="sr-only">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <PromoVideo />
        <Gallery />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from 'motion/react'
import { CATEGORIES, projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import Lightbox from './Lightbox'
import Reveal from './Reveal'
import './Gallery.css'

const ALL = 'Todos'
const FILTERS = [ALL, ...CATEGORIES]

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

export default function Gallery() {
  const [filter, setFilter] = useState(ALL)
  const [activeId, setActiveId] = useState(null)
  const [hovering, setHovering] = useState(false)
  const opener = useRef(null)
  const fine = useFinePointer()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const x = useSpring(cursorX, { stiffness: 600, damping: 45, mass: 0.6 })
  const y = useSpring(cursorY, { stiffness: 600, damping: 45, mass: 0.6 })

  const filtered = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )
  const counts = useMemo(() => {
    const c = { [ALL]: projects.length }
    CATEGORIES.forEach((cat) => (c[cat] = projects.filter((p) => p.category === cat).length))
    return c
  }, [])

  const activeIndex = filtered.findIndex((p) => p.id === activeId)

  const open = (id) => {
    opener.current = document.activeElement
    setHovering(false)
    setActiveId(id)
  }

  const close = () => {
    setActiveId(null)
    // Devolver el foco a la tarjeta que abrió el visor
    requestAnimationFrame(() => opener.current?.focus?.({ preventScroll: true }))
  }

  return (
    <section className="section gallery" id="catalogo">
      <div className="container">
        <div className="gallery__head">
          <Reveal>
            <p className="eyebrow">Catálogo de fotografía</p>
            <h2 className="gallery__title">
              Imágenes que <span className="serif">comunican</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <LayoutGroup id="filters">
              <div className="filters" role="toolbar" aria-label="Filtrar fotografías por categoría">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filters__btn ${filter === f ? 'is-active' : ''}`}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {filter === f && (
                      <motion.span
                        layoutId="filter-pill"
                        className="filters__pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="filters__label">{f}</span>
                    <sup className="filters__count">{counts[f]}</sup>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </Reveal>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} fotografías en {filter}
        </p>

        <motion.ul
          layout
          className="grid"
          onPointerMove={(e) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                hideCursor={fine}
                onOpen={() => open(p.id)}
                onHover={setHovering}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {fine && (
        <motion.div
          className="cursor"
          aria-hidden="true"
          style={{ x, y }}
          animate={{ scale: hovering ? 1 : 0, opacity: hovering ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          Ver
        </motion.div>
      )}

      <AnimatePresence>
        {activeIndex !== -1 && (
          <Lightbox
            projects={filtered}
            index={activeIndex}
            onNavigate={(i) => setActiveId(filtered[i].id)}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

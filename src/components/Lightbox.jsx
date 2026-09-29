import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import useLockBody from '../hooks/useLockBody'
import './Lightbox.css'

const ease = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

const slide = {
  enter: (dir) => ({ x: dir === 0 ? 0 : dir > 0 ? 90 : -90, opacity: 0, scale: dir === 0 ? 0.97 : 1 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -90 : dir < 0 ? 90 : 0, opacity: 0 }),
}

export default function Lightbox({ projects, index, onNavigate, onClose }) {
  const project = projects[index]
  const total = projects.length
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  // Imagen activa + dirección de la animación. Se reinicia al cambiar de proyecto.
  const [view, setView] = useState({ id: project.id, img: 0, dir: 0 })
  if (view.id !== project.id) setView({ id: project.id, img: 0, dir: 0 })
  const current = view.id === project.id ? view.img : 0

  useLockBody(true)

  // Recorre imágenes; al llegar al extremo, pasa al proyecto contiguo.
  const go = useCallback(
    (delta) => {
      const next = current + delta
      if (next >= 0 && next < project.images.length) {
        setView({ id: project.id, img: next, dir: delta })
        return
      }
      const pIndex = (index + delta + total) % total
      const target = projects[pIndex]
      setView({ id: target.id, img: delta > 0 ? 0 : target.images.length - 1, dir: delta })
      onNavigate(pIndex)
    },
    [current, index, onNavigate, project, projects, total],
  )

  const goProject = (delta) => {
    const pIndex = (index + delta + total) % total
    setView({ id: projects[pIndex].id, img: 0, dir: delta })
    onNavigate(pIndex)
  }

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        // Trampa de foco dentro del diálogo
        const nodes = dialogRef.current?.querySelectorAll('button, a[href]')
        if (!nodes?.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Precarga de imágenes vecinas para navegación instantánea
  useEffect(() => {
    const neighbors = [project.images[current + 1], project.images[current - 1], projects[(index + 1) % total]?.images[0]]
    neighbors.filter(Boolean).forEach((src) => {
      const i = new Image()
      i.src = src
    })
  }, [current, index, project, projects, total])

  return (
    <motion.div
      ref={dialogRef}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="lb__top">
        <span className="lb__counter">
          Foto <strong>{pad(index + 1)}</strong> / {pad(total)}
        </span>
        <button ref={closeRef} className="lb__close" onClick={onClose} aria-label="Cerrar visor">
          <span>Cerrar</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>

      <motion.div
        className="lb__body"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="lb__stage">
          <AnimatePresence initial={false} custom={view.dir}>
            <motion.img
              key={`${project.id}-${current}`}
              src={project.images[current]}
              alt={`${project.title} — imagen ${current + 1} de ${project.images.length}`}
              className="lb__img"
              custom={view.dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -500) go(1)
                else if (info.offset.x > 70 || info.velocity.x > 500) go(-1)
              }}
              draggable={false}
            />
          </AnimatePresence>

          <button className="lb__arrow lb__arrow--prev" onClick={() => go(-1)} aria-label="Imagen anterior">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12.5 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button className="lb__arrow lb__arrow--next" onClick={() => go(1)} aria-label="Imagen siguiente">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>

          {project.images.length > 1 && (
            <div className="lb__dots" aria-hidden="true">
              {project.images.map((_, i) => (
                <span key={i} className={i === current ? 'is-active' : ''} />
              ))}
            </div>
          )}
        </div>

        <aside className="lb__info">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              <p className="eyebrow">{project.category}</p>
              <h2 id="lb-title" className="lb__title">
                {project.title}
              </h2>

              {project.client && (
                <dl className="lb__meta">
                  <div>
                    <dt>Cliente</dt>
                    <dd>{project.client}</dd>
                  </div>
                </dl>
              )}

              <p className="lb__desc">{project.description}</p>

              <ul className="lb__tags">
                {project.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              {project.images.length > 1 && (
                <div className="lb__thumbs">
                  {project.images.map((src, i) => (
                    <button
                      key={src}
                      className={i === current ? 'is-active' : ''}
                      onClick={() => setView({ id: project.id, img: i, dir: i > current ? 1 : -1 })}
                      aria-label={`Ver imagen ${i + 1}`}
                      aria-current={i === current}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="lb__pnav">
            <button onClick={() => goProject(-1)}>
              <small>Anterior</small>
              {projects[(index - 1 + total) % total].title}
            </button>
            <button onClick={() => goProject(1)} className="lb__pnav-next">
              <small>Siguiente</small>
              {projects[(index + 1) % total].title}
            </button>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  )
}

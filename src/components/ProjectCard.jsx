import { forwardRef, useState } from 'react'
import { motion } from 'motion/react'

const ProjectCard = forwardRef(function ProjectCard({ project, index, hideCursor, onOpen, onHover }, ref) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.li
      ref={ref}
      layout
      className={`card card--${project.size}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        className={`card__btn ${hideCursor ? 'card__btn--cursor' : ''}`}
        onClick={onOpen}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        aria-label={`Ver fotografía: ${project.title}`}
      >
        <div className={`card__media ${loaded ? 'is-loaded' : ''}`}>
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className="card__overlay">
          <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
          <div className="card__info">
            <h3 className="card__title">{project.category}</h3>
            <p className="card__meta">{project.title}</p>
          </div>
          <span className="card__arrow" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M5 13L13 5M6 5h7v7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </div>
      </button>
    </motion.li>
  )
})

export default ProjectCard

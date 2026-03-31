import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

export const Route = createFileRoute('/')({
  component: NexStudioLanding,
})

type FormState = {
  name: string
  email: string
  company: string
  budget: string
  details: string
}

const WHATSAPP_NUMBER = '15551234567'

const expertiseCards = [
  {
    title: 'Brand Systems',
    description:
      'Visual identities and tone frameworks built for scale across every channel.',
  },
  {
    title: 'Motion Campaigns',
    description:
      'High-impact launch films, short-form reels, and digital spots with narrative rhythm.',
  },
  {
    title: 'Web Experience',
    description:
      'Conversion-focused landing experiences with cinematic interactions and clean code.',
  },
  {
    title: 'Performance Creative',
    description:
      'Ad concepts iterated quickly with data feedback loops for sustained growth.',
  },
]

function NexStudioLanding() {
  const [showLoader, setShowLoader] = useState(true)
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    budget: '',
    details: '',
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(false), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const size = 18
    const width = 22
    const height = 18

    canvas.width = width * size
    canvas.height = height * size

    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }
    let snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ]
    let food = { x: 14, y: 9 }
    let score = 0

    const placeFood = () => {
      let candidate = { x: 0, y: 0 }
      do {
        candidate = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
        }
      } while (snake.some((part) => part.x === candidate.x && part.y === candidate.y))
      food = candidate
    }

    const resetGame = () => {
      direction = { x: 1, y: 0 }
      nextDirection = { x: 1, y: 0 }
      snake = [
        { x: 8, y: 8 },
        { x: 7, y: 8 },
        { x: 6, y: 8 },
      ]
      score = 0
      placeFood()
    }

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#06080f'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(75, 130, 255, 0.12)'
      for (let x = 0; x <= width; x += 1) {
        context.beginPath()
        context.moveTo(x * size, 0)
        context.lineTo(x * size, canvas.height)
        context.stroke()
      }
      for (let y = 0; y <= height; y += 1) {
        context.beginPath()
        context.moveTo(0, y * size)
        context.lineTo(canvas.width, y * size)
        context.stroke()
      }

      context.fillStyle = '#64ffe0'
      snake.forEach((part, index) => {
        const inset = index === 0 ? 2 : 3
        context.fillRect(part.x * size + inset, part.y * size + inset, size - inset * 2, size - inset * 2)
      })

      context.fillStyle = '#ff5c98'
      context.beginPath()
      context.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2.8, 0, Math.PI * 2)
      context.fill()

      context.fillStyle = 'rgba(200, 213, 255, 0.9)'
      context.font = '600 12px Space Grotesk, sans-serif'
      context.fillText(`Score: ${score}`, 10, 16)
    }

    const tick = () => {
      direction = nextDirection
      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      }

      const hitWall = head.x < 0 || head.x >= width || head.y < 0 || head.y >= height
      const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y)

      if (hitWall || hitSelf) {
        resetGame()
        draw()
        return
      }

      snake.unshift(head)

      if (head.x === food.x && head.y === food.y) {
        score += 10
        placeFood()
      } else {
        snake.pop()
      }

      draw()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' && direction.y !== 1) nextDirection = { x: 0, y: -1 }
      if (event.key === 'ArrowDown' && direction.y !== -1) nextDirection = { x: 0, y: 1 }
      if (event.key === 'ArrowLeft' && direction.x !== 1) nextDirection = { x: -1, y: 0 }
      if (event.key === 'ArrowRight' && direction.x !== -1) nextDirection = { x: 1, y: 0 }
    }

    window.addEventListener('keydown', handleKeyDown)
    draw()

    const interval = window.setInterval(tick, 120)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const onInputChange =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
    }

  const onBookCall = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = [
      'Discovery Call Request - NEX STUDIO',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Budget: ${form.budget}`,
      `Project Details: ${form.details}`,
    ].join('\n')

    const target = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className={`intro-loader ${showLoader ? 'show' : 'hide'}`} aria-hidden={!showLoader}>
        <div className="loader-mark">NEX STUDIO</div>
      </div>

      <main className="landing-shell">
        <nav className="top-nav">
          <a className="brand" href="#home">
            NEX STUDIO
          </a>
          <div className="nav-links">
            <a href="#expertise">Expertise</a>
            <a href="#arcade">Arcade</a>
            <a href="#connect">Connect</a>
            <a className="cta" href="#book">
              BOOK A MEET
            </a>
          </div>
        </nav>

        <section id="home" className="hero-section">
          <div className="hero-content reveal">
            <p className="kicker">Creative Agency / Digital Studio</p>
            <h1>
              Launch ideas that <span>ignite screens</span> and move markets.
            </h1>
            <p className="hero-copy">
              NEX STUDIO designs bold campaigns, premium digital experiences, and storytelling systems for
              modern brands.
            </p>
            <a className="hero-cta" href="#book">
              Start Your Mission
            </a>
          </div>
          <div className="rocket-wrap" aria-hidden="true">
            <div className="rocket">
              <div className="rocket-window" />
              <div className="rocket-fin left" />
              <div className="rocket-fin right" />
            </div>
            <div className="exhaust" />
          </div>
        </section>

        <section id="expertise" className="section-block reveal">
          <h2>Expertise</h2>
          <p className="section-copy">End-to-end creative systems engineered for attention and conversion.</p>
          <div className="card-grid">
            {expertiseCards.map((card) => (
              <article key={card.title} className="glass-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="arcade" className="section-block arcade reveal">
          <div>
            <h2>Arcade</h2>
            <p className="section-copy">Take a break before the strategy session. Use arrow keys to play.</p>
          </div>
          <canvas ref={canvasRef} className="snake-canvas" />
        </section>

        <section id="connect" className="section-block reveal">
          <h2>Connect</h2>
          <div className="connect-links">
            <a href="https://wa.me/15551234567" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://meet.google.com" target="_blank" rel="noreferrer">
              Google Meet
            </a>
          </div>
        </section>

        <section id="book" className="section-block reveal">
          <h2>Book a Discovery Call</h2>
          <form className="booking-form" onSubmit={onBookCall}>
            <label>
              Name
              <input required value={form.name} onChange={onInputChange('name')} />
            </label>
            <label>
              Email
              <input type="email" required value={form.email} onChange={onInputChange('email')} />
            </label>
            <label>
              Company
              <input required value={form.company} onChange={onInputChange('company')} />
            </label>
            <label>
              Budget Range
              <input placeholder="$5k - $25k" required value={form.budget} onChange={onInputChange('budget')} />
            </label>
            <label>
              Project Brief
              <textarea required rows={4} value={form.details} onChange={onInputChange('details')} />
            </label>
            <button type="submit">Send via WhatsApp</button>
          </form>
        </section>
      </main>
    </>
  )
}

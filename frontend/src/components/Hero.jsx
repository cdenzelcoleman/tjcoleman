import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroContent = [
    {
      title: "thoughtful writing",
      subtitle: "exploring ideas that matter through careful prose"
    },
    {
      title: "quiet contemplation", 
      subtitle: "finding meaning in the spaces between words"
    },
    {
      title: "stories worth telling",
      subtitle: "narratives that linger long after reading"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero">
      <div className="hero-slider">
        {heroContent.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <Link to="/written" className="hero-cta">begin reading</Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="hero-indicators">
        {heroContent.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
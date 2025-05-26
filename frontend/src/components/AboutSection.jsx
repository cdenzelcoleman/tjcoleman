import { useState, useEffect } from 'react'

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState({
    title: "About Me",
    subtitle: "My Journey & Vision",
    content: "",
    mission: "",
    values: [],
    image: ""
  })

  useEffect(() => {
    // This will be connected to backend API later
    setAboutContent({
      title: "About Me",
      subtitle: "My Journey & Vision", 
      content: "Welcome to my space of inspiration and growth. I'm passionate about sharing insights, experiences, and motivation that can help others on their journey of personal and professional development.",
      mission: "To inspire and empower individuals to claim their potential and live with ease, authenticity, and purpose.",
      values: [
        "Authenticity - Being true to yourself and your values",
        "Growth - Continuous learning and improvement", 
        "Community - Building meaningful connections",
        "Purpose - Living with intention and meaning",
        "Balance - Finding harmony in all aspects of life"
      ],
      image: ""
    })
  }, [])

  return (
    <div className="about-section">
      <div className="container">
        <div className="about-hero">
          <div className="about-content">
            <h1>{aboutContent.title}</h1>
            <h2>{aboutContent.subtitle}</h2>
            <p className="about-intro">{aboutContent.content}</p>
          </div>
          {aboutContent.image && (
            <div className="about-image">
              <img src={aboutContent.image} alt="About me" />
            </div>
          )}
        </div>

        <div className="mission-section">
          <h3>My Mission</h3>
          <p>{aboutContent.mission}</p>
        </div>

        <div className="values-section">
          <h3>Core Values</h3>
          <ul className="values-list">
            {aboutContent.values.map((value, index) => (
              <li key={index} className="value-item">
                {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="connect-section">
          <h3>Let's Connect</h3>
          <p>
            I believe in the power of community and meaningful conversations. 
            Whether you're looking for inspiration, want to share your own journey, 
            or simply connect with like-minded individuals, I'd love to hear from you.
          </p>
          <div className="connect-actions">
            <a href="/written" className="connect-btn">
              Read My Writings
            </a>
            <a href="/video" className="connect-btn secondary">
              Watch My Content
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
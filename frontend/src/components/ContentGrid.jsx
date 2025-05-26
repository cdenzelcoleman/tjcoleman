import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SubscriptionModal from './SubscriptionModal'
import './ContentGrid.css'

const ContentGrid = () => {
  const [videos, setVideos] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showSubscription, setShowSubscription] = useState(false)

  // Mock data for demonstration
  const mockContent = [
    {
      id: 1,
      title: "on the nature of quiet moments",
      content: "In the spaces between our hurried thoughts, there exists a peculiar stillness that speaks more loudly than our most urgent concerns. It is here, in these pockets of silence, that we might find something resembling truth.",
      category: "general",
      author: "elena summers",
      views: 847,
      type: 'blog'
    },
    {
      id: 2,
      title: "sustainable practices in daily life",
      content: "The revolution we seek need not be grand or sweeping. Sometimes it begins with the simple act of choosing differently, of seeing our ordinary decisions as small but meaningful votes for the world we wish to inhabit.",
      category: "innovation",
      author: "marcus chen",
      views: 523,
      type: 'blog'
    },
    {
      id: 3,
      title: "reflections on creative work",
      content: "To create is to engage in a conversation with possibility. Each blank page, each empty canvas, each silent moment before the first note—these are invitations to discover what we did not know we carried within us.",
      category: "inspiration",
      author: "sara williams",
      views: 692,
      type: 'blog'
    }
  ]

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch blog posts only - focus on written content
      const blogResponse = await fetch('/api/blog-posts/')
      if (blogResponse.ok) {
        const blogData = await blogResponse.json()
        setBlogPosts(blogData)
      } else {
        // Fallback to mock data
        setBlogPosts(mockContent)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      // Fallback to mock data
      setBlogPosts(mockContent)
    } finally {
      setLoading(false)
    }
  }

  // Filter blog posts only
  const filteredContent = blogPosts.filter(item => {
    if (filter === 'all') return true
    return item.category === filter
  })

  const categories = [
    { id: 'all', label: 'all' },
    { id: 'general', label: 'thoughts' },
    { id: 'innovation', label: 'innovation' },
    { id: 'inspiration', label: 'inspiration' },
    { id: 'technology', label: 'technology' },
    { id: 'impact', label: 'impact' }
  ]

  if (loading) {
    return (
      <div className="content-loading">
        <div className="loading-spinner"></div>
        <p>Loading stories...</p>
      </div>
    )
  }

  return (
    <section className="content-section">
      <div className="content-header">
        <Link to="/written" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ cursor: 'pointer', transition: 'color 0.3s ease' }} 
              onMouseEnter={(e) => e.target.style.color = 'var(--sage)'}
              onMouseLeave={(e) => e.target.style.color = 'inherit'}>
            recent writings
          </h2>
        </Link>
        <p>thoughtful essays and stories, written with care</p>
        <button 
          className="subscribe-cta"
          onClick={() => setShowSubscription(true)}
        >
          subscribe to updates
        </button>
      </div>

      <div className="content-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${filter === category.id ? 'active' : ''}`}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="content-grid">
        {filteredContent.map((item, index) => (
          <article 
            key={`${item.type}-${item.id}`} 
            className="content-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-image">
              <div className="image-placeholder">
                <span className="category-tag">{item.category}</span>
                written piece
              </div>
              <div className="card-overlay">
                <Link to={`/blog/${item.id}`} className="read-btn">
                  read
                </Link>
              </div>
            </div>
            
            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">
                {item.content?.substring(0, 140) || item.description}...
              </p>
              <div className="card-meta">
                <span className="author">
                  {item.author?.username || item.author}
                </span>
                <span className="views">{item.views} reads</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <SubscriptionModal 
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
    </section>
  )
}

export default ContentGrid
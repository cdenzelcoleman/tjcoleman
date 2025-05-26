import { useState, useEffect } from 'react'
import { X, Mail, CheckCircle } from 'lucide-react'
import api from '../utils/api'

const EmailSubscribePopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user has already seen the popup or is subscribed
    const hasSeenPopup = localStorage.getItem('hasSeenSubscribePopup')
    const isAlreadySubscribed = localStorage.getItem('isEmailSubscribed')
    
    if (!hasSeenPopup && !isAlreadySubscribed) {
      // Show popup after 3 seconds delay
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      await api.post('/api/subscribe/', { email })
      setIsSubscribed(true)
      localStorage.setItem('isEmailSubscribed', 'true')
      
      // Close popup after 2 seconds of success message
      setTimeout(() => {
        closePopup()
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    localStorage.setItem('hasSeenSubscribePopup', 'true')
  }

  if (!showPopup) return null

  return (
    <div className="email-subscribe-popup">
      <div className="popup-backdrop" onClick={closePopup} />
      <div className="popup-content">
        <button className="popup-close-btn" onClick={closePopup}>
          <X size={20} />
        </button>
        
        {!isSubscribed ? (
          <>
            <div className="popup-icon">
              <Mail size={48} />
            </div>
            
            <h2>Stay Connected</h2>
            <p>Get the latest updates, motivational content, and exclusive insights delivered to your inbox.</p>
            
            <form onSubmit={handleSubmit} className="subscribe-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting || !email.trim()}
                  className="subscribe-btn"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </form>
            
            <p className="privacy-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        ) : (
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>Thank You!</h2>
            <p>You've successfully subscribed to our newsletter. Welcome to the community!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailSubscribePopup
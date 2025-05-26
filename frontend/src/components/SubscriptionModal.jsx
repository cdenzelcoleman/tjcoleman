import { useState } from 'react'
import './SubscriptionModal.css'

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        setEmail('')
        setName('')
      } else {
        setMessage(data.error || 'Subscription failed')
        setIsSuccess(false)
      }
    } catch (err) {
      setMessage('Network error occurred')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="subscription-overlay">
      <div className="subscription-modal">
        <div className="modal-header">
          <h2>Stay Updated</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p>Get notified when we publish new inspiring stories and content.</p>
          
          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="subscription-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="subscribe-btn"
              disabled={loading || !email}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <div className="privacy-note">
            <small>
              We respect your privacy. Unsubscribe at any time.
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
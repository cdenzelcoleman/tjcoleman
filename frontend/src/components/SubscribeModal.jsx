import { useState } from 'react'
import { X, Bell, Check, Mail } from 'lucide-react'
import api from '../utils/api'

const SubscribeModal = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/videos/1/subscribe/', {
        email: email
      })
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="share-modal" onClick={onClose}>
        <div className="share-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center' }}>
            <Check size={48} color="#4ecdc4" style={{ marginBottom: '1rem' }} />
            <h3>Successfully Subscribed!</h3>
            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
              You'll receive notifications when new videos are uploaded.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="share-modal" onClick={onClose}>
      <div className="share-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>
            <Bell size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Subscribe for Updates
          </h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
          Get notified when new videos are uploaded to VideoHub!
        </p>

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            background: 'rgba(255, 107, 107, 0.1)',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: loading || !email ? 'rgba(78, 205, 196, 0.5)' : '#4ecdc4',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.8rem', 
          opacity: 0.6,
          textAlign: 'center',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px'
        }}>
          📧 We'll only send you notifications about new video uploads.<br />
          You can unsubscribe at any time.
        </div>
      </div>
    </div>
  )
}

export default SubscribeModal
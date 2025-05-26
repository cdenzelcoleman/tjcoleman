import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Hero from './components/Hero'
import ContentGrid from './components/ContentGrid'
import VideoSection from './components/VideoSection'
import WrittenSection from './components/WrittenSection'
import EventsSection from './components/EventsSection'
import AboutSection from './components/AboutSection'
import BlogPost from './components/BlogPost'
import EmailSubscribePopup from './components/EmailSubscribePopup'
import api from './utils/api'
import './index.css';
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => { 
    try {
      const response = await api.get('/api/admin/status/')
      setIsAdmin(response.data.is_admin)
      if (response.data.is_admin) {
        setAdminUser(response.data.user)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (credentials) => {
    try {
      const response = await api.post('/api/admin/login/', credentials)
      setIsAdmin(true)
      setAdminUser(response.data.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const handleAdminLogout = async () => {
    try {
      await api.post('/api/admin/logout/')
      setIsAdmin(false)
      setAdminUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ContentGrid />
              </>
            } />
            <Route path="/written" element={<WrittenSection />} />
            <Route path="/video" element={<VideoSection />} />
            <Route path="/events" element={<EventsSection />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/blog/:id" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer 
          isAdmin={isAdmin}
          adminUser={adminUser}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
        />
        <EmailSubscribePopup />
      </div>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VideoFeed from './components/VideoFeed'
import AdminPanel from './components/AdminPanel'
import Navigation from './components/Navigation'
import AdminLogin from './components/AdminLogin'
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
        <Navigation 
          isAdmin={isAdmin} 
          adminUser={adminUser}
          onAdminLogout={handleAdminLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VideoFeed />} />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminPanel adminUser={adminUser} />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

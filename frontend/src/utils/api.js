import axios from 'axios'

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Important for session authentication
  headers: {
    'Content-Type': 'application/json',
  },
})

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken'
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Initialize CSRF token
const initializeCSRF = async () => {
  try {
    await api.get('/api/csrf/')
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
  }
}

// Initialize CSRF on module load
initializeCSRF()

// Add CSRF token to requests
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Authentication error - user may need to login again')
    }
    return Promise.reject(error)
  }
)

export default api
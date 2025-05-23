import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VideoFeed from './components/VideoFeed'
import UploadVideo from './components/UploadVideo'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VideoFeed />} />
            <Route path="/upload" element={<UploadVideo />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

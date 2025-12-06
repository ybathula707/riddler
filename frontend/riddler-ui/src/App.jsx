import { useState } from 'react'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setMessage({ text: '', type: '' })

    // Validate URL
    if (!videoUrl.trim()) {
      setMessage({ text: 'Please enter a video URL', type: 'error' })
      return
    }

    if (!validateUrl(videoUrl)) {
      setMessage({ text: 'Please enter a valid URL', type: 'error' })
      return
    }

    // Submit to backend
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      setMessage({ text: 'Video URL submitted successfully!', type: 'success' })
      setVideoUrl('') // Clear form on success
      console.log('Response:', data)
    } catch (error) {
      setMessage({ 
        text: `Failed to submit: ${error.message}`, 
        type: 'error' 
      })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className={`left-section ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="container">
          <div className="header-with-logo">
            <h1>🎯 Riddler</h1>
          </div>
          <p className="subtitle">Enter a lecture video URL to create a quiz</p>
          
          <form onSubmit={handleSubmit} className="video-form">
            <div className="form-group">
              <label htmlFor="videoUrl">Video URL</label>
              <input
                type="text"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/video"
                disabled={isLoading}
                className="video-input"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Video URL'
              )}
            </button>
          </form>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <button 
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      <div className="right-section">
        {isLoading ? (
          <div className="loading-container">
            <div className="large-spinner"></div>
            <p className="loading-text">Processing your video...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        ) : (
          <div className="placeholder-container">
            <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="placeholder-text">Quiz results will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

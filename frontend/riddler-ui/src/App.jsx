import { useState } from 'react'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

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
      <div className="container">
        <h1>Lecture Quiz Submission</h1>
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
  )
}

export default App

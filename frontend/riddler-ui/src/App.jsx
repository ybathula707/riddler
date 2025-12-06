import { useState } from 'react'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=0-MOtwYijkY')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [quizData, setQuizData] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submittedAnswers, setSubmittedAnswers] = useState({})

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
    
    // Clear previous messages and quiz data
    setMessage({ text: '', type: '' })
    setQuizData(null)
    setSelectedAnswers({})

    // Validate URL
    if (!videoUrl.trim()) {
      setMessage({ text: 'Please enter a video URL', type: 'error' })
      return
    }

    if (!validateUrl(videoUrl)) {
      setMessage({ text: 'Please enter a valid URL', type: 'error' })
      return
    }

    // Submit to backend (MOCKED FOR DEVELOPMENT)
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response data
      const data = {
        questions: [
          {
            id: "d4b20191-ec1b-45cd-b42c-5da4a5defab3",
            content: "What is the capital of France?",
            answers: [
              {
                id: "da8b428c-8b35-445f-9fbf-e02eb23fb0f8",
                content: "Paris"
              },
              {
                id: "526a81e5-96bd-4c17-8090-c66462f55be3",
                content: "London"
              },
              {
                id: "3c9f8d2e-1a4b-4f7c-9e5d-8b2c6a1d9f3e",
                content: "Berlin"
              },
              {
                id: "7e2f9c1b-5d8a-4e3c-b6f7-2a9c8d4e6f1b",
                content: "Madrid"
              }
            ],
            correct_answers: ["da8b428c-8b35-445f-9fbf-e02eb23fb0f8"]
          },
          {
            id: "8f3c2b1a-9d7e-4c5f-a2b6-1e8d9c3f7a2b",
            content: "What is 2 + 2?",
            answers: [
              {
                id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
                content: "3"
              },
              {
                id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
                content: "4"
              },
              {
                id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
                content: "5"
              }
            ],
            correct_answers: ["2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"]
          }
        ]
      }

      setQuizData(data)
      setMessage({ text: 'Quiz generated successfully!', type: 'success' })
      setVideoUrl('') // Clear form on success
      console.log('Mock Response:', data)

      /* UNCOMMENT WHEN BACKEND IS READY:
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
      setQuizData(data)
      setMessage({ text: 'Quiz generated successfully!', type: 'success' })
      setVideoUrl('') // Clear form on success
      console.log('Response:', data)
      */
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

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleQuestionSubmit = (questionId) => {
    const selectedAnswerId = selectedAnswers[questionId]
    const question = quizData.questions.find(q => q.id === questionId)
    
    if (!question || !selectedAnswerId) return
    
    // Check if the selected answer is correct
    const isCorrect = question.correct_answers.includes(selectedAnswerId)
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionId]: {
        answerId: selectedAnswerId,
        isCorrect: isCorrect
      }
    }))
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
        ) : quizData && quizData.questions ? (
          <div className="quiz-container">
            <h2 className="quiz-title">Quiz Questions</h2>
            <div className="questions-list">
              {quizData.questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <h3 className="question-number">Question {index + 1}</h3>
                  <p className="question-content">{question.content}</p>
                  <div className="answers-list">
                    {question.answers.map((answer) => (
                      <label
                        key={answer.id}
                        className={`answer-option ${
                          selectedAnswers[question.id] === answer.id ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={answer.id}
                          checked={selectedAnswers[question.id] === answer.id}
                          onChange={() => handleAnswerSelect(question.id, answer.id)}
                          className="answer-radio"
                        />
                        <span className="answer-text">{answer.content}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="question-submit-button"
                    disabled={!selectedAnswers[question.id]}
                    onClick={() => handleQuestionSubmit(question.id)}
                  >
                    Submit Answer
                  </button>
                  
                  {submittedAnswers[question.id] && (
                    <div className={`answer-feedback ${submittedAnswers[question.id].isCorrect ? 'correct' : 'incorrect'}`}>
                      {submittedAnswers[question.id].isCorrect ? (
                        <>
                          <svg className="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="feedback-text">Correct!</span>
                        </>
                      ) : (
                        <>
                          <svg className="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="feedback-text">Incorrect</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
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

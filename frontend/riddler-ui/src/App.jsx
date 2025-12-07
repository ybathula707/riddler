import { useState } from 'react'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('https://youtu.be/MMv-027KEqU?si=1tZHtCfGPNkm1Xmd')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [quizData, setQuizData] = useState(null)
  const [quizId, setQuizId] = useState(null)
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

  const pollQuizStatus = async (quizId) => {
    const maxPollingTime = 10 * 60 * 1000 // 10 minutes in milliseconds
    const pollingInterval = 5000 // 5 seconds
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check if 10 minutes have passed
          if (Date.now() - startTime >= maxPollingTime) {
            reject(new Error('Quiz generation timeout after 10 minutes'))
            return
          }

          // Poll the quiz status
          const response = await fetch(`http://localhost:5003/quiz/${quizId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`)
          }

          const quizResponse = await response.json()
          console.log('Polling response:', quizResponse)

          // Check if quiz_json is not null
          if (quizResponse.quiz.quiz_json && quizResponse.quiz.quiz_json !== null) {
            resolve(JSON.parse(quizResponse.quiz.quiz_json))
            return
          }

          // Continue polling after 5 seconds
          setTimeout(poll, pollingInterval)
        } catch (error) {
          reject(error)
        }
      }

      // Start polling
      poll()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages and quiz data
    setMessage({ text: '', type: '' })
    setQuizData(null)
    setSelectedAnswers({})
    setSubmittedAnswers({})

    // Validate URL
    if (!videoUrl.trim()) {
      setMessage({ text: 'Please enter a video URL', type: 'error' })
      return
    }

    if (!validateUrl(videoUrl)) {
      setMessage({ text: 'Please enter a valid URL', type: 'error' })
      return
    }
      
    setIsLoading(true)
    try {
      // Step 1: Create the quiz in the backend
      const newQuizResponse = await fetch('http://localhost:5003/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      })

      if (!newQuizResponse.ok) {
        throw new Error(`Server responded with status: ${newQuizResponse.status}`)
      }

      const createQuizResult = await newQuizResponse.json()
      console.log('Quiz created:', createQuizResult)

      // Extract the quiz ID from the response
      const quizId = createQuizResult.quiz.id
      if (!quizId) {
        throw new Error('No quiz ID returned from server')
      }

      // Step 2: Start polling for quiz generation completion
      setMessage({ text: 'Generating quiz... This may take a few minutes', type: 'success' })
      
      const quizData = await pollQuizStatus(quizId)

      // Step 3: Set the quiz data and quiz ID when ready
      setQuizId(quizId)
      setQuizData(quizData)
      setMessage({ text: 'Quiz generated successfully!', type: 'success' })
      setVideoUrl('') // Clear form on success
      console.log('Final quiz data:', quizData)

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

  const handleQuestionSubmit = async (questionId) => {
    const selectedAnswerId = selectedAnswers[questionId]
    const question = quizData.questions.find(q => q.id === questionId)
    
    if (!question || !selectedAnswerId || !quizId) return
    
    // Check if the selected answer is correct
    const isCorrect = question.correct_answers.includes(selectedAnswerId)
    
    // Update local state first
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionId]: {
        answerId: selectedAnswerId,
        isCorrect: isCorrect
      }
    }))

    // Send POST request to review endpoint
    try {
      const selectedAnswer = question.answers.find(ans => ans.id === selectedAnswerId)
      
      const reviewData = {
        question: {
          id: question.id,
          content: question.content
        },
        correct_answers: question.correct_answers,
        submitted_answer: {
          id: selectedAnswerId,
          content: selectedAnswer.content
        },
        is_correct: isCorrect
      }

      const response = await fetch(`http://localhost:5003/quiz/${quizId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        console.error('Failed to submit review:', response.status)
      } else {
        const result = await response.json()
        console.log('Review submitted successfully:', result)
        
        // Update state with quiz visualization image if present
        if (result.quiz_viz) {
          setSubmittedAnswers(prev => ({
            ...prev,
            [questionId]: {
              ...prev[questionId],
              quizViz: result.quiz_viz
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error)
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
                    <>
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
                      
                      {submittedAnswers[question.id].quizViz && (
                        <div className="quiz-visualization">
                          <img 
                            src={`data:image/png;base64,${submittedAnswers[question.id].quizViz}`}
                            alt="Quiz Visualization"
                            className="quiz-viz-image"
                          />
                        </div>
                      )}
                    </>
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

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem(`quizResults_${id}`);
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, [id]);

  if (!results) {
    return (
      <div className="results-loading">
        <p>Loading results...</p>
      </div>
    );
  }

  const percentage = results.percentage;
  const getScoreColor = () => {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! 🏆';
    if (percentage >= 80) return 'Excellent! 🌟';
    if (percentage >= 70) return 'Good Job! 👍';
    if (percentage >= 60) return 'Not Bad! 💪';
    return 'Keep Practicing! 📚';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h1>Quiz Results</h1>
        <h2>{results.quizTitle}</h2>
      </div>

      <div className="score-card" style={{ borderColor: getScoreColor() }}>
        <div className="score-circle" style={{ borderColor: getScoreColor() }}>
          <div className="score-percentage" style={{ color: getScoreColor() }}>
            {percentage}%
          </div>
          <div className="score-fraction">
            {results.score} / {results.totalQuestions}
          </div>
        </div>
        <div className="score-message">{getScoreMessage()}</div>
      </div>

      <div className="results-stats">
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{results.score}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{results.totalQuestions - results.score}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatTime(results.timeSpent)}</div>
          <div className="stat-label">Time Spent</div>
        </div>
      </div>

      <div className="review-section">
        <h3>Review Your Answers</h3>
        <div className="questions-review">
          {results.questions.map((question, index) => {
            const userAnswer = results.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="review-question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="review-question-text">{question.question}</p>
                <div className="review-answers">
                  <div className="answer-item">
                    <span className="answer-label">Your Answer:</span>
                    <span className={`answer-value ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {userAnswer || 'Not answered'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="answer-item">
                      <span className="answer-label">Correct Answer:</span>
                      <span className="answer-value correct">
                        {question.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="results-actions">
        <Link to="/quizzes" className="action-button primary">
          Take Another Quiz
        </Link>
        <Link to={`/quiz/${id}`} className="action-button secondary">
          Retake This Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;


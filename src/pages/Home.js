import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Quiz System</h1>
        <p className="hero-subtitle">
          Test your knowledge, challenge yourself, and learn something new!
        </p>
        <div className="hero-buttons">
          <Link to="/quizzes" className="btn btn-primary">
            Browse Quizzes
          </Link>
          <Link to="/create" className="btn btn-secondary">
            Create Quiz
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Multiple Choice Questions</h3>
            <p>Answer questions with multiple options and get instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Timer Based</h3>
            <p>Challenge yourself with time-limited quizzes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Results</h3>
            <p>View your score and review all answers after completion</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Your Own</h3>
            <p>Build custom quizzes with your own questions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Score Tracking</h3>
            <p>See your performance and track your progress</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Beautiful UI</h3>
            <p>Enjoy a modern and intuitive user interface</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">10+</div>
          <div className="stat-label">Quiz Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">50+</div>
          <div className="stat-label">Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free</div>
        </div>
      </div>
    </div>
  );
};

export default Home;


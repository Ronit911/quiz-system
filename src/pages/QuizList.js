import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load quizzes from localStorage or use default quizzes
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      const parsed = JSON.parse(savedQuizzes);
      setQuizzes(parsed);
      setFilteredQuizzes(parsed);
    } else {
      // Default quizzes
      const defaultQuizzes = [
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          description: 'Test your knowledge of JavaScript basics',
          category: 'Programming',
          questionCount: 5,
          duration: 10,
          difficulty: 'Easy'
        },
        {
          id: 2,
          title: 'React Concepts',
          description: 'Master React components, hooks, and state management',
          category: 'Programming',
          questionCount: 8,
          duration: 15,
          difficulty: 'Medium'
        },
        {
          id: 3,
          title: 'General Knowledge',
          description: 'Test your general knowledge across various topics',
          category: 'General',
          questionCount: 10,
          duration: 20,
          difficulty: 'Medium'
        },
        {
          id: 4,
          title: 'Science & Nature',
          description: 'Explore questions about science and nature',
          category: 'Science',
          questionCount: 7,
          duration: 12,
          difficulty: 'Hard'
        },
        {
          id: 5,
          title: 'History Quiz',
          description: 'Test your historical knowledge',
          category: 'History',
          questionCount: 6,
          duration: 10,
          difficulty: 'Medium'
        },
        {
          id: 6,
          title: 'Mathematics Basics',
          description: 'Basic math questions for everyone',
          category: 'Mathematics',
          questionCount: 5,
          duration: 8,
          difficulty: 'Easy'
        }
      ];
      setQuizzes(defaultQuizzes);
      setFilteredQuizzes(defaultQuizzes);
      localStorage.setItem('quizzes', JSON.stringify(defaultQuizzes));
    }
  }, []);

  useEffect(() => {
    let filtered = quizzes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuizzes(filtered);
  }, [searchTerm, selectedCategory, quizzes]);

  const categories = ['all', ...new Set(quizzes.map(q => q.category))];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#4caf50';
      case 'Medium':
        return '#ff9800';
      case 'Hard':
        return '#f44336';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="quiz-list">
      <div className="quiz-list-header">
        <h1>Available Quizzes</h1>
        <p>Choose a quiz to test your knowledge</p>
      </div>

      <div className="quiz-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="quizzes-grid">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-card-header">
                <h3>{quiz.title}</h3>
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-info">
                <div className="info-item">
                  <span className="info-icon">📚</span>
                  <span>{quiz.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">❓</span>
                  <span>{quiz.questionCount} Questions</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <span>{quiz.duration} min</span>
                </div>
              </div>
              <Link to={`/quiz/${quiz.id}`} className="quiz-button">
                Start Quiz
              </Link>
            </div>
          ))
        ) : (
          <div className="no-quizzes">
            <p>No quizzes found. Try adjusting your filters or create a new quiz!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;


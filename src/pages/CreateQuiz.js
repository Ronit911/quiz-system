import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'General',
    duration: 10,
    difficulty: 'Easy',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const categories = ['General', 'Programming', 'Science', 'History', 'Mathematics', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleQuizChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }

    if (!currentQuestion.correctAnswer) {
      alert('Please select the correct answer');
      return;
    }

    const newQuestion = {
      id: quizData.questions.length + 1,
      question: currentQuestion.question,
      options: [...currentQuestion.options],
      correctAnswer: currentQuestion.correctAnswer
    };

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    });

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({
      ...quizData,
      questions: newQuestions.map((q, i) => ({ ...q, id: i + 1 }))
    });
  };

  const handleSubmit = () => {
    if (!quizData.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (quizData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Get existing quizzes
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    
    // Create new quiz object
    const newQuiz = {
      id: existingQuizzes.length > 0 
        ? Math.max(...existingQuizzes.map(q => q.id)) + 1 
        : 1,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      questionCount: quizData.questions.length,
      duration: parseInt(quizData.duration),
      difficulty: quizData.difficulty,
      questions: quizData.questions
    };

    // Save quiz metadata
    const updatedQuizzes = [...existingQuizzes, {
      id: newQuiz.id,
      title: newQuiz.title,
      description: newQuiz.description,
      category: newQuiz.category,
      questionCount: newQuiz.questionCount,
      duration: newQuiz.duration,
      difficulty: newQuiz.difficulty
    }];
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    // Save full quiz data (for taking the quiz)
    // Store it in a way that TakeQuiz can access it
    const allQuizzesData = JSON.parse(localStorage.getItem('allQuizzesData') || '{}');
    allQuizzesData[newQuiz.id] = newQuiz;
    localStorage.setItem('allQuizzesData', JSON.stringify(allQuizzesData));

    alert('Quiz created successfully!');
    navigate('/quizzes');
  };

  return (
    <div className="create-quiz">
      <div className="create-quiz-header">
        <h1>Create New Quiz</h1>
        <p>Build your own custom quiz with multiple choice questions</p>
      </div>

      <div className="quiz-form-section">
        <h2>Quiz Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizChange}
              placeholder="Enter quiz title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleQuizChange}
              placeholder="Enter quiz description"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={quizData.category}
              onChange={handleQuizChange}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={quizData.duration}
              onChange={handleQuizChange}
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={quizData.difficulty}
              onChange={handleQuizChange}
              className="form-select"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="questions-section">
        <h2>Questions ({quizData.questions.length})</h2>

        <div className="add-question-form">
          <h3>Add New Question</h3>
          <div className="form-group">
            <label>Question *</label>
            <textarea
              name="question"
              value={currentQuestion.question}
              onChange={handleQuestionChange}
              placeholder="Enter your question"
              className="form-textarea"
              rows="2"
            />
          </div>

          <div className="options-group">
            <label>Options *</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={option}
                  checked={currentQuestion.correctAnswer === option}
                  onChange={handleQuestionChange}
                  disabled={!option.trim()}
                  className="correct-radio"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="form-input option-input"
                />
              </div>
            ))}
            <small className="form-hint">Select the radio button next to the correct answer</small>
          </div>

          <button onClick={addQuestion} className="add-question-btn">
            Add Question
          </button>
        </div>

        {quizData.questions.length > 0 && (
          <div className="questions-list">
            <h3>Added Questions</h3>
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="question-item">
                <div className="question-item-header">
                  <span className="question-number">Q{index + 1}</span>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="question-options">
                  {q.options.map((opt, optIndex) => (
                    <span
                      key={optIndex}
                      className={`option-tag ${
                        opt === q.correctAnswer ? 'correct' : ''
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="submit-section">
        <button onClick={handleSubmit} className="submit-quiz-btn">
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;


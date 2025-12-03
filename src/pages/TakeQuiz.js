import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load quiz data
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const quizData = quizzes.find(q => q.id === parseInt(id));
    
    if (!quizData) {
      // If quiz not found, use default quiz data
      const defaultQuizzes = getDefaultQuizzes();
      const defaultQuiz = defaultQuizzes.find(q => q.id === parseInt(id));
      if (defaultQuiz) {
        setQuiz(defaultQuiz);
        setTimeLeft(defaultQuiz.duration * 60);
      } else {
        navigate('/quizzes');
      }
    } else {
      // Try to load full quiz data from localStorage first (for custom quizzes)
      const allQuizzesData = JSON.parse(localStorage.getItem('allQuizzesData') || '{}');
      let fullQuizData = allQuizzesData[quizData.id];
      
      // If not found, try default quiz data
      if (!fullQuizData) {
        fullQuizData = getFullQuizData(quizData.id);
      }
      
      if (fullQuizData) {
        setQuiz(fullQuizData);
        setTimeLeft(fullQuizData.duration * 60);
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && quiz) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsSubmitted(true);
            // Calculate score
            let score = 0;
            quiz.questions.forEach(question => {
              if (answers[question.id] === question.correctAnswer) {
                score++;
              }
            });

            // Save results
            const results = {
              quizId: quiz.id,
              quizTitle: quiz.title,
              score,
              totalQuestions: quiz.questions.length,
              percentage: Math.round((score / quiz.questions.length) * 100),
              answers,
              questions: quiz.questions,
              timeSpent: quiz.duration * 60
            };

            localStorage.setItem(`quizResults_${id}`, JSON.stringify(results));
            navigate(`/results/${id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted, quiz, answers, id, navigate]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Calculate score
    let score = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    // Save results
    const results = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      answers,
      questions: quiz.questions,
      timeSpent: quiz.duration * 60 - timeLeft
    };

    localStorage.setItem(`quizResults_${id}`, JSON.stringify(results));
    navigate(`/results/${id}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return <div className="loading">Loading quiz...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="take-quiz">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-timer">
          <span className="timer-icon">⏱️</span>
          <span className={timeLeft < 60 ? 'timer-warning' : ''}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </div>

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>
        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`option-item ${
                answers[currentQuestion.id] === option ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          ← Previous
        </button>
        <div className="question-indicators">
          {quiz.questions.map((q, index) => (
            <div
              key={q.id}
              className={`indicator ${
                index === currentQuestionIndex ? 'active' : ''
              } ${answers[q.id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="nav-button submit-button"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="nav-button"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to get default quiz data
const getDefaultQuizzes = () => {
  return [
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
};

// Helper function to get full quiz data with questions
const getFullQuizData = (quizId) => {
  const quizQuestions = {
    1: {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      category: 'Programming',
      questionCount: 5,
      duration: 10,
      difficulty: 'Easy',
      questions: [
        {
          id: 1,
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
          correctAnswer: 'var x = 5;'
        },
        {
          id: 2,
          question: 'Which method is used to add an element to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 'push()'
        },
        {
          id: 3,
          question: 'What does === mean in JavaScript?',
          options: ['Assignment', 'Equality with type coercion', 'Strict equality', 'Inequality'],
          correctAnswer: 'Strict equality'
        },
        {
          id: 4,
          question: 'Which keyword is used to declare a constant in JavaScript?',
          options: ['const', 'constant', 'let', 'var'],
          correctAnswer: 'const'
        },
        {
          id: 5,
          question: 'What is the result of typeof null?',
          options: ['"null"', '"object"', '"undefined"', 'null'],
          correctAnswer: '"object"'
        }
      ]
    },
    2: {
      id: 2,
      title: 'React Concepts',
      description: 'Master React components, hooks, and state management',
      category: 'Programming',
      questionCount: 8,
      duration: 15,
      difficulty: 'Medium',
      questions: [
        {
          id: 1,
          question: 'What is React?',
          options: ['A database', 'A JavaScript library for building UIs', 'A CSS framework', 'A backend framework'],
          correctAnswer: 'A JavaScript library for building UIs'
        },
        {
          id: 2,
          question: 'Which hook is used to manage state in functional components?',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correctAnswer: 'useState'
        },
        {
          id: 3,
          question: 'What does JSX stand for?',
          options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'],
          correctAnswer: 'JavaScript XML'
        },
        {
          id: 4,
          question: 'How do you pass data from parent to child component?',
          options: ['Using state', 'Using props', 'Using context', 'Using refs'],
          correctAnswer: 'Using props'
        },
        {
          id: 5,
          question: 'What is the purpose of useEffect hook?',
          options: ['To manage state', 'To handle side effects', 'To create components', 'To handle events'],
          correctAnswer: 'To handle side effects'
        },
        {
          id: 6,
          question: 'Which method is called after a component is rendered?',
          options: ['componentDidMount', 'componentWillMount', 'componentDidUpdate', 'render'],
          correctAnswer: 'componentDidMount'
        },
        {
          id: 7,
          question: 'What is a key prop used for in React?',
          options: ['To identify elements uniquely', 'To style components', 'To pass data', 'To handle events'],
          correctAnswer: 'To identify elements uniquely'
        },
        {
          id: 8,
          question: 'What is Virtual DOM?',
          options: ['A real DOM', 'A JavaScript representation of DOM', 'A CSS concept', 'A database'],
          correctAnswer: 'A JavaScript representation of DOM'
        }
      ]
    },
    3: {
      id: 3,
      title: 'General Knowledge',
      description: 'Test your general knowledge across various topics',
      category: 'General',
      questionCount: 10,
      duration: 20,
      difficulty: 'Medium',
      questions: [
        {
          id: 1,
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris'
        },
        {
          id: 2,
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 'Mars'
        },
        {
          id: 3,
          question: 'What is the largest ocean on Earth?',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
          correctAnswer: 'Pacific Ocean'
        },
        {
          id: 4,
          question: 'Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
          correctAnswer: 'Leonardo da Vinci'
        },
        {
          id: 5,
          question: 'What is the smallest prime number?',
          options: ['0', '1', '2', '3'],
          correctAnswer: '2'
        },
        {
          id: 6,
          question: 'Which gas do plants absorb from the atmosphere?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          correctAnswer: 'Carbon Dioxide'
        },
        {
          id: 7,
          question: 'What is the chemical symbol for gold?',
          options: ['Go', 'Gd', 'Au', 'Ag'],
          correctAnswer: 'Au'
        },
        {
          id: 8,
          question: 'How many continents are there?',
          options: ['5', '6', '7', '8'],
          correctAnswer: '7'
        },
        {
          id: 9,
          question: 'What is the longest river in the world?',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          correctAnswer: 'Nile'
        },
        {
          id: 10,
          question: 'Which year did World War II end?',
          options: ['1943', '1944', '1945', '1946'],
          correctAnswer: '1945'
        }
      ]
    },
    4: {
      id: 4,
      title: 'Science & Nature',
      description: 'Explore questions about science and nature',
      category: 'Science',
      questionCount: 7,
      duration: 12,
      difficulty: 'Hard',
      questions: [
        {
          id: 1,
          question: 'What is the speed of light in vacuum?',
          options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
          correctAnswer: '300,000 km/s'
        },
        {
          id: 2,
          question: 'What is the hardest natural substance on Earth?',
          options: ['Gold', 'Diamond', 'Platinum', 'Iron'],
          correctAnswer: 'Diamond'
        },
        {
          id: 3,
          question: 'How many bones are in the human body?',
          options: ['196', '206', '216', '226'],
          correctAnswer: '206'
        },
        {
          id: 4,
          question: 'What is the most abundant gas in Earth\'s atmosphere?',
          options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
          correctAnswer: 'Nitrogen'
        },
        {
          id: 5,
          question: 'What is the process by which plants make food?',
          options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
          correctAnswer: 'Photosynthesis'
        },
        {
          id: 6,
          question: 'What is the smallest unit of matter?',
          options: ['Molecule', 'Atom', 'Electron', 'Proton'],
          correctAnswer: 'Atom'
        },
        {
          id: 7,
          question: 'What is the pH of pure water?',
          options: ['5', '6', '7', '8'],
          correctAnswer: '7'
        }
      ]
    },
    5: {
      id: 5,
      title: 'History Quiz',
      description: 'Test your historical knowledge',
      category: 'History',
      questionCount: 6,
      duration: 10,
      difficulty: 'Medium',
      questions: [
        {
          id: 1,
          question: 'In which year did the American Civil War begin?',
          options: ['1860', '1861', '1862', '1863'],
          correctAnswer: '1861'
        },
        {
          id: 2,
          question: 'Who was the first President of the United States?',
          options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
          correctAnswer: 'George Washington'
        },
        {
          id: 3,
          question: 'Which empire was ruled by Julius Caesar?',
          options: ['Greek Empire', 'Roman Empire', 'Byzantine Empire', 'Ottoman Empire'],
          correctAnswer: 'Roman Empire'
        },
        {
          id: 4,
          question: 'When did World War I begin?',
          options: ['1912', '1914', '1916', '1918'],
          correctAnswer: '1914'
        },
        {
          id: 5,
          question: 'Who wrote "The Communist Manifesto"?',
          options: ['Vladimir Lenin', 'Karl Marx', 'Friedrich Engels', 'Joseph Stalin'],
          correctAnswer: 'Karl Marx'
        },
        {
          id: 6,
          question: 'In which year did the Berlin Wall fall?',
          options: ['1987', '1989', '1991', '1993'],
          correctAnswer: '1989'
        }
      ]
    },
    6: {
      id: 6,
      title: 'Mathematics Basics',
      description: 'Basic math questions for everyone',
      category: 'Mathematics',
      questionCount: 5,
      duration: 8,
      difficulty: 'Easy',
      questions: [
        {
          id: 1,
          question: 'What is 15 + 27?',
          options: ['40', '42', '44', '46'],
          correctAnswer: '42'
        },
        {
          id: 2,
          question: 'What is 8 × 7?',
          options: ['54', '56', '58', '60'],
          correctAnswer: '56'
        },
        {
          id: 3,
          question: 'What is the square root of 64?',
          options: ['6', '7', '8', '9'],
          correctAnswer: '8'
        },
        {
          id: 4,
          question: 'What is 100 ÷ 4?',
          options: ['20', '25', '30', '35'],
          correctAnswer: '25'
        },
        {
          id: 5,
          question: 'What is 3²?',
          options: ['6', '9', '12', '15'],
          correctAnswer: '9'
        }
      ]
    }
  };

  return quizQuestions[quizId] || null;
};

export default TakeQuiz;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import CreateQuiz from './pages/CreateQuiz';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/:id" element={<TakeQuiz />} />
            <Route path="/results/:id" element={<QuizResults />} />
            <Route path="/create" element={<CreateQuiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          Quiz System
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/quizzes" 
              className={location.pathname === '/quizzes' ? 'active' : ''}
            >
              Quizzes
            </Link>
          </li>
          <li>
            <Link 
              to="/create" 
              className={location.pathname === '/create' ? 'active' : ''}
            >
              Create Quiz
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


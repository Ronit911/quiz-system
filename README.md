# Quiz System - React Application

A comprehensive Quiz System built with React.js featuring multiple pages, quiz creation, taking quizzes, and viewing detailed results.

## Features

-  **Multiple Choice Questions** - Answer questions with multiple options
-  **Timer Based** - Challenge yourself with time-limited quizzes
-  **Detailed Results** - View your score and review all answers
-  **Create Your Own** - Build custom quizzes with your own questions
-  **Score Tracking** - See your performance and track progress
-  **Beautiful UI** - Modern and intuitive user interface
-  **Search & Filter** - Find quizzes by category or search term
-  **Responsive Design** - Works on desktop, tablet, and mobile devices

## Pages

1. **Home** - Welcome page with features overview
2. **Quiz List** - Browse all available quizzes with search and filter
3. **Take Quiz** - Interactive quiz taking with timer and progress tracking
4. **Quiz Results** - Detailed results with score and answer review
5. **Create Quiz** - Build your own custom quizzes

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js) or yarn

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React
- React DOM
- React Router DOM
- React Scripts

### Step 2: Start the Development Server

After installation is complete, run:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, you can manually navigate to that URL.

## Usage

### Taking a Quiz

1. Navigate to the "Quizzes" page
2. Browse available quizzes or use search/filter
3. Click "Start Quiz" on any quiz
4. Answer questions and navigate using Previous/Next buttons
5. Submit when finished or when time runs out
6. View your results and review answers

### Creating a Quiz

1. Navigate to "Create Quiz" page
2. Fill in quiz information (title, description, category, duration, difficulty)
3. Add questions with 4 options each
4. Mark the correct answer for each question
5. Click "Create Quiz" to save

### Viewing Results

After completing a quiz, you'll see:
- Your score percentage
- Number of correct/incorrect answers
- Time spent
- Detailed review of all questions and answers

## Project Structure

```
quiz-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── QuizList.js
│   │   ├── QuizList.css
│   │   ├── TakeQuiz.js
│   │   ├── TakeQuiz.css
│   │   ├── QuizResults.js
│   │   ├── QuizResults.css
│   │   ├── CreateQuiz.js
│   │   └── CreateQuiz.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Technologies Used

- **React** - UI library
- **React Router DOM** - Routing and navigation
- **CSS3** - Styling with modern features
- **LocalStorage** - Data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Quiz data is stored in browser's localStorage
- Created quizzes persist across browser sessions
- Results are saved and can be reviewed later

## License

This project is open source and available for educational purposes.


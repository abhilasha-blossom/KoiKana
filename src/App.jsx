import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StartMenu from './components/StartMenu';
import AboutPage from './components/AboutPage';
import KanaPage from './components/KanaPage';
import SpeakingPage from './components/SpeakingPage';
import KanjiPage from './components/KanjiPage';
import QuizPage from './components/QuizPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/start" element={<StartMenu />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/kana" element={<KanaPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/kanji" element={<KanjiPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StartMenu from './components/StartMenu';
import KanaPage from './components/KanaPage';
import AboutPage from './components/AboutPage';
import SpeakingPage from './components/SpeakingPage';
import KanjiPage from './components/KanjiPage';
import QuizPage from './components/QuizPage';
import NameStampPage from './components/NameStampPage';
import VocabularyPage from './components/VocabularyPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FDF6E3] font-sans text-gray-800">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/start" element={<StartMenu />} />
          <Route path="/kana" element={<KanaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/kanji" element={<KanjiPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/name-stamp" element={<NameStampPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

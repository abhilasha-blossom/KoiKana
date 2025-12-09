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
import ShopPage from './components/ShopPage';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

import SignInPage from './components/SignInPage';
import BackgroundMusic from './components/BackgroundMusic';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-[#FDF6E3] font-sans text-gray-800 transition-colors duration-500">
            <BackgroundMusic />
            <Routes>
              <Route path="/" element={<SignInPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/start" element={<StartMenu />} />
              <Route path="/kana" element={<KanaPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/speaking" element={<SpeakingPage />} />
              <Route path="/kanji" element={<KanjiPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/name-stamp" element={<NameStampPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/shop" element={<ShopPage />} />
            </Routes>
          </div>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;

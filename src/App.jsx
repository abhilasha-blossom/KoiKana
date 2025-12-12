import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage'; // Restored Import
import StartMenu from './components/StartMenu';
import YokaiPage from './components/YokaiPage';
import OnsenPage from './components/OnsenPage'; // New Feature
import KanaPage from './components/KanaPage';
import AboutPage from './components/AboutPage';
import SpeakingPage from './components/SpeakingPage';
import KanjiPage from './components/KanjiPage';
import QuizPage from './components/QuizPage';
import NameStampPage from './components/NameStampPage';
import VocabularyPage from './components/VocabularyPage';
import ShopPage from './components/ShopPage';
import HaikuGardenPage from './components/HaikuGardenPage';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ProgressProvider } from './context/ProgressContext';


import SignInPage from './components/SignInPage';
import UpdatePasswordPage from './components/UpdatePasswordPage';
import DictionaryPage from './components/DictionaryPage';
import RadioPlayer from './components/RadioPlayer';
import SushiGamePage from './components/SushiGamePage';
import MochiGamePage from './components/MochiGamePage';
import KanjiDojoPage from './components/KanjiDojoPage';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProgressProvider>
          <Router>
            <div className="min-h-screen bg-[#FDF6E3] font-sans text-gray-800 transition-colors duration-500">
              <RadioPlayer />
              <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/start" element={<StartMenu />} />
                <Route path="/kana" element={<KanaPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/speaking" element={<SpeakingPage />} />
                <Route path="/kanji" element={<KanjiPage />} />
                <Route path="/yokai" element={<YokaiPage />} />
                <Route path="/onsen" element={<OnsenPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/name-stamp" element={<NameStampPage />} />
                <Route path="/vocabulary" element={<VocabularyPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/haiku" element={<HaikuGardenPage />} />
                <Route path="/sushi" element={<SushiGamePage />} />
                <Route path="/mochi" element={<MochiGamePage />} />
                <Route path="/dojo" element={<KanjiDojoPage />} />
              </Routes>
            </div>
          </Router>
        </ProgressProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;

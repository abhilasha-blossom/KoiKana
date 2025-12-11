import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Flame, Flower2, Edit2, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import useAudio from '../hooks/useAudio';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import ProfileEditModal from './ProfileEditModal';

const LandingPage = () => {
  const { streak, mastery, xp, username, updateUsername, avatar } = useProgress();
  const { user } = useAuth();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const masteredCount = Object.keys(mastery).length;

  const [petals, setPetals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username || '');
  const [imgError, setImgError] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setTempName(username || '');
    setImgError(false); // Reset error when username/avatar changes
  }, [username, avatar]);

  useEffect(() => {
    const generatedPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${10 + Math.random() * 10}s`,
    }));
    setPetals(generatedPetals);
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateUsername(tempName.trim());
      setIsEditing(false);
      playSound('correct');
    } else {
      setIsEditing(false); // Revert if empty
      setTempName(username || '');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    }
  };

  const isLoggedIn = !!user || !!username;

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-[#FFF0F5] overscroll-none selection:bg-pink-200">

      {showProfileModal && <ProfileEditModal onClose={() => setShowProfileModal(false)} />}

      {/* Sign Out Button (Top Left) */}
      <div className="absolute top-6 left-6 z-50 animate-fade-in">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-white/60 hover:bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-red-100 text-red-400 hover:text-red-500 font-bold transition-all hover:scale-105 active:scale-95 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline text-sm">Sign Out</span>
        </button>
      </div>

      {/* Top Right Stats & Profile */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 animate-fade-in">

        {/* Stats Group (Only show if logged in/active) */}
        <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-orange-100">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
            <span className="font-bold text-[#4A3B52]">{streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-purple-100">
            <Sparkles className="w-5 h-5 text-purple-500 fill-purple-200" />
            <span className="font-bold text-[#4A3B52]">{xp} XP</span>
          </div>
        </div>

        {/* Profile Button - The "Right Top" Request */}
        {isLoggedIn && (
          <button
            onClick={() => setShowProfileModal(true)}
            className="relative w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden group hover:scale-110 transition-transform duration-300 cursor-pointer bg-white"
            title="Edit Profile"
          >
            {avatar && !imgError ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-400">
                <User className="w-8 h-8" />
              </div>
            )}
            {/* Overlay Icon */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-white drop-shadow-md" />
            </div>
          </button>
        )}
      </div>

      {/* Morning Mist Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-pink-300/50 rounded-full blur-[60px] md:blur-[80px] animate-blob mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-48 h-48 md:w-[400px] md:h-[400px] bg-purple-300/50 rounded-full blur-[60px] md:blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 md:w-[600px] md:h-[600px] bg-orange-200/50 rounded-full blur-[80px] md:blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply pointer-events-none"></div>

      {/* Sakura Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute top-[-20px] w-3 h-3 bg-pink-300/60 rounded-full"
            style={{
              left: petal.left,
              animation: `fall ${petal.animationDuration} linear infinite, sway 3s ease-in-out infinite alternate`,
              animationDelay: petal.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Spacer for top content (balance) - Reduced for better mobile fit */}
      <div className="flex-none h-16 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center gap-4 px-4 min-h-0">

        {/* Logo Container - PURE STATIC LOGO as requested */}
        <div
          className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-700 ease-in-out"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 bg-white/60 rounded-full blur-3xl scale-75"></div>
          <img
            src="/assets/logo.png"
            alt="KoiKana Logo"
            className="w-full h-full object-contain relative z-10 drop-shadow-sm pointer-events-none"
          />
        </div>

        {/* Slogan - Added Below Logo */}
        <h2 className="text-xl md:text-2xl font-bold text-[#FF8FAB] tracking-wide font-serif -mt-2 drop-shadow-sm">
          Where Japanese feels like love
        </h2>

        {/* Text Content */}
        <div className="space-y-2 text-center flex-shrink-0">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#4A3B52] drop-shadow-sm flex items-center justify-center gap-2">

            {isEditing ? (
              <form onSubmit={handleNameSubmit} className="flex items-center">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/50 border-b-2 border-pink-400 text-center focus:outline-none text-[#FF8FAB] px-2 py-1 rounded w-64 md:w-80 font-bold"
                  autoFocus
                  onBlur={handleNameSubmit}
                />
              </form>
            ) : (
              username ? (
                <>
                  Welcome back,
                  <span
                    onClick={() => { setTempName(username); setIsEditing(true); }}
                    className="text-[#FF8FAB] cursor-pointer hover:underline decoration-pink-300 underline-offset-4 decoration-2 flex items-center gap-2 group relative"
                    title="Click to edit nickname"
                  >
                    {username}
                    <Edit2 className="w-5 h-5 text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-1/2 -translate-y-1/2" />
                  </span>
                </>
              ) : (
                <>Where Japanese feels like <span className="text-[#FF8FAB]">love</span></>
              )
            )}

          </h1>
          <p className="text-sm md:text-lg text-[#7A6B82] max-w-lg mx-auto leading-relaxed font-medium px-4">
            Learn through emotions, storytelling, and aesthetic comfort.
            <br className="hidden md:block" />Welcome to your personal sanctuary.
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center mt-2 flex-shrink-0">
          <Link to="/start"
            onMouseEnter={() => playSound('pop')}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-sm rounded-full 
                        shadow-[0_4px_20px_rgba(255,182,193,0.5)] 
                        hover:shadow-[0_8px_30px_rgba(255,182,193,0.7)] 
                        hover:-translate-y-1
                        transition-all duration-300 ease-out
                        border border-white/50
                        flex items-center gap-3 overflow-hidden min-w-[180px] justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#FFD1DC] to-[#E6E6FA] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="text-base md:text-lg font-bold text-[#4A3B52] z-10 transition-colors">Start Journey</span>
            <ArrowRight className="w-5 h-5 text-[#4A3B52] group-hover:translate-x-1 transition-transform z-10" />
          </Link>

          <Link to="/quiz"
            onMouseEnter={() => playSound('pop')}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-white/60 backdrop-blur-sm rounded-full 
                        shadow-[0_4px_20px_rgba(230,230,250,0.5)] 
                        hover:shadow-[0_8px_30px_rgba(230,230,250,0.7)] 
                        hover:-translate-y-1
                        transition-all duration-300 ease-out
                        border border-white/50
                        flex items-center gap-3 overflow-hidden min-w-[180px] justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#E6E6FA] to-[#C4C4E1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="text-base md:text-lg font-bold text-[#7A6B82] group-hover:text-[#4A3B52] z-10 transition-colors">Training Dojo</span>
            <Sparkles className="w-5 h-5 text-[#7A6B82] group-hover:text-[#4A3B52] group-hover:scale-110 transition-transform z-10" />
          </Link>
        </div>
      </div>

      {/* Zen Garden Footer (Relative, prevents overlap) */}
      <div className="relative z-10 w-full bg-white/30 backdrop-blur-md border-t border-white/40 p-3 md:p-4 flex flex-col items-center gap-2 flex-none mt-auto">
        <h3 className="text-[#4A3B52] font-bold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
          <Flower2 className="w-4 h-4 text-pink-500" />
          Your Zen Garden
        </h3>
        {masteredCount === 0 ? (
          <p className="text-xs md:text-sm text-[#7A6B82] italic">The garden is waiting for your first bloom...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl animate-fade-in">
            {Array.from({ length: masteredCount }).map((_, i) => (
              <div key={i} className="relative group animate-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <Flower2 className="w-5 h-5 md:w-6 md:h-6 text-pink-400 fill-pink-200 drop-shadow-sm transition-transform hover:scale-125 cursor-help" />
              </div>
            ))}
          </div>
        )}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#8B4513]/20 to-transparent rounded-full mt-1"></div>
      </div>
    </div>
  );
};

export default LandingPage;

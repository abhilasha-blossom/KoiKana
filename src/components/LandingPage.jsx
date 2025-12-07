import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Generate random petals
  const petals = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
  }));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden bg-[#FFF0F5]">

      {/* Morning Mist Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/50 rounded-full blur-[80px] animate-blob mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-300/50 rounded-full blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-200/50 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply"></div>

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

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-10 animate-fade-in-up px-4">

        {/* Logo Container */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-transform hover:scale-105 duration-700 ease-in-out"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 bg-white/60 rounded-full blur-3xl scale-75"></div>
          <img
            src="/assets/logo.png"
            alt="KoiKana Logo"
            className="w-full h-full object-contain relative z-10 drop-shadow-sm"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#4A3B52] drop-shadow-sm">
            Where Japanese feels like <span className="text-[#FF8FAB]">love</span>
          </h1>
          <p className="text-lg md:text-xl text-[#7A6B82] max-w-lg mx-auto leading-relaxed font-medium">
            Learn through emotions, storytelling, and aesthetic comfort.
            <br />Welcome to your personal sanctuary.
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">

          {/* Start Journey Button */}
          <Link to="/kana"
            className="group relative px-8 py-4 bg-white/80 backdrop-blur-sm rounded-full 
                        shadow-[0_4px_20px_rgba(255,182,193,0.5)] 
                        hover:shadow-[0_8px_30px_rgba(255,182,193,0.7)] 
                        hover:-translate-y-1
                        transition-all duration-300 ease-out
                        border border-white/50
                        flex items-center gap-3 overflow-hidden min-w-[200px] justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#FFD1DC] to-[#E6E6FA] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="text-lg font-bold text-[#4A3B52] z-10 transition-colors">Start Journey</span>
            <ArrowRight className="w-5 h-5 text-[#4A3B52] group-hover:translate-x-1 transition-transform z-10" />
          </Link>

          {/* Training Dojo Button */}
          <Link to="/quiz"
            className="group relative px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full 
                        shadow-[0_4px_20px_rgba(230,230,250,0.5)] 
                        hover:shadow-[0_8px_30px_rgba(230,230,250,0.7)] 
                        hover:-translate-y-1
                        transition-all duration-300 ease-out
                        border border-white/50
                        flex items-center gap-3 overflow-hidden min-w-[200px] justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#E6E6FA] to-[#C4C4E1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="text-lg font-bold text-[#7A6B82] group-hover:text-[#4A3B52] z-10 transition-colors">Training Dojo</span>
            <Sparkles className="w-5 h-5 text-[#7A6B82] group-hover:text-[#4A3B52] group-hover:scale-110 transition-transform z-10" />
          </Link>

        </div>

      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          0% { top: -10%; opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes sway {
          0% { transform: translateX(0px) rotate(0deg); }
          100% { transform: translateX(25px) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

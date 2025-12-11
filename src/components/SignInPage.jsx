import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { ArrowRight, LogIn, User } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const SignInPage = () => {
    const [name, setName] = useState('');
    const [showGuestInput, setShowGuestInput] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { updateUsername } = useProgress();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { playSound } = useAudio();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleGuestSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            playSound('correct');
            updateUsername(name.trim());
            navigate('/home');
        }
    };

    return (
        <div className="h-screen w-full bg-[#FAFAF9] relative overflow-hidden flex flex-col items-center justify-center font-sans">
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

            {/* --- ATMOSPHERE: PASTEL SUNSET PATH --- */}

            {/* 1. Sky Gradient (Peach to Soft Pink) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF9A9E] via-[#FECFEF] to-[#E0C3FC] pointer-events-none"></div>

            {/* 2. The Great Sun (Center - Perfectly Centered) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-[#FFECD2] to-[#FCB69F] rounded-full animate-sun-glow"></div>
            </div>

            {/* 3. Stylized Clouds (SVG Background) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-60">
                <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                    <path fill="#FFFFFF" fillOpacity="0.6" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    <circle cx="10%" cy="20%" r="30" fill="white" opacity="0.4" />
                    <circle cx="15%" cy="25%" r="40" fill="white" opacity="0.3" />
                    <circle cx="85%" cy="15%" r="35" fill="white" opacity="0.4" />
                </svg>
            </div>

            {/* --- TOP NAVIGATION (Sign In / Sign Up) --- */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/50 text-[#503C5C] font-bold hover:bg-white/50 transition-all shadow-sm hover:shadow-md group"
                >
                    <LogIn className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    <span>Sign In / Sign Up</span>
                </button>
            </div>

            {/* --- ILLUSTRATION LAYER --- */}
            <div className="relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-center">

                <div className="relative w-full flex justify-center items-center">
                    <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-2xl">
                        <defs>
                            <linearGradient id="gateRed" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#F43F5E" />
                                <stop offset="100%" stopColor="#FB7185" />
                            </linearGradient>
                            <linearGradient id="lanternStone" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#A8A29E" />
                                <stop offset="100%" stopColor="#78716C" />
                            </linearGradient>
                            <filter id="softGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* --- PERSPECTIVE PATH --- */}
                        <path d="M300,500 L380,350 L420,350 L500,500 Z" fill="#F5F5F4" opacity="0.8" />
                        <path d="M300,500 L380,350" stroke="#E7E5E4" strokeWidth="2" />
                        <path d="M500,500 L420,350" stroke="#E7E5E4" strokeWidth="2" />

                        {/* --- TORII GATE --- */}
                        <g transform="translate(200, 50)">
                            <path d="M60,350 L70,50 L90,50 L100,350 Z" fill="url(#gateRed)" />
                            <path d="M300,350 L310,50 L330,50 L340,350 Z" fill="url(#gateRed)" />
                            <rect x="50" y="100" width="300" height="20" rx="2" fill="url(#gateRed)" />
                            <path d="M20,60 Q200,30 380,60 L380,85 Q200,55 20,85 Z" fill="#881337" />
                            <path d="M25,65 Q200,35 375,65 L375,75 Q200,45 25,75 Z" fill="#F43F5E" />
                            <path d="M75,90 Q200,105 325,90" stroke="#FEF3C7" strokeWidth="4" fill="none" />
                            <rect x="190" y="65" width="20" height="30" fill="#1C1917" />
                            <rect x="192" y="67" width="16" height="26" stroke="#FBBF24" strokeWidth="1" fill="none" />
                        </g>

                        {/* --- STONE LANTERNS --- */}
                        <g transform="translate(50, 280)">
                            <path d="M20,120 L80,120 L70,110 L30,110 Z" fill="url(#lanternStone)" />
                            <rect x="40" y="70" width="20" height="40" fill="url(#lanternStone)" />
                            <rect x="25" y="40" width="50" height="30" fill="url(#lanternStone)" />
                            <rect x="35" y="45" width="30" height="20" fill="#FEF9C3" filter="url(#softGlow)" />
                            <path d="M10,40 L50,10 L90,40 Z" fill="#57534E" />
                            <circle cx="50" cy="10" r="5" fill="#57534E" />
                        </g>
                        <g transform="translate(650, 280)">
                            <path d="M20,120 L80,120 L70,110 L30,110 Z" fill="url(#lanternStone)" />
                            <rect x="40" y="70" width="20" height="40" fill="url(#lanternStone)" />
                            <rect x="25" y="40" width="50" height="30" fill="url(#lanternStone)" />
                            <rect x="35" y="45" width="30" height="20" fill="#FEF9C3" filter="url(#softGlow)" />
                            <path d="M10,40 L50,10 L90,40 Z" fill="#57534E" />
                            <circle cx="50" cy="10" r="5" fill="#57534E" />
                        </g>
                    </svg>

                    {/* --- ACTIONS CONTAINER --- */}
                    {/* Positioned lower than before to clear the gate base completely */}
                    <div className="absolute bottom-0 translate-y-[45%] w-full flex justify-center z-50">
                        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_0_50px_rgba(255,182,193,0.4)] border border-pink-100 w-full max-w-sm text-center transform hover:-translate-y-1 transition-all duration-500">

                            {!showGuestInput ? (
                                <div className="space-y-4">
                                    <h1 className="text-xl font-black text-[#503C5C] mb-2 tracking-wide font-serif">
                                        Welcome Traveler
                                    </h1>

                                    <button
                                        onClick={() => setShowGuestInput(true)}
                                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Continue as Guest
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-xl font-black text-[#503C5C] mb-4 tracking-wide font-serif">
                                        Enter Your Name
                                    </h1>
                                    <form onSubmit={handleGuestSubmit} className="relative group">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Traveler Name..."
                                            className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 pl-5 pr-12 focus:outline-none focus:border-pink-400 focus:bg-white text-[#4A3B52] placeholder:text-pink-300 font-bold text-lg text-center transition-all duration-300"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={!name.trim()}
                                            className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-tr from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 rounded-lg text-white flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                        >
                                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => setShowGuestInput(false)}
                                        className="mt-4 text-xs font-bold text-gray-400 hover:text-pink-500 transition-colors"
                                    >
                                        Back
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Foreground Clouds */}
            <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-white opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-pink-200 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default SignInPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProgress from '../hooks/useProgress';

const LoadingScreen = ({ onComplete }) => {
    const navigate = useNavigate();
    const { username } = useProgress();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            // If onComplete is passed (embedded mode), use it.
            // Otherwise (standalone route), navigate.
            if (onComplete) {
                onComplete();
            } else {
                navigate('/home', { state: { fromLoading: true } });
            }
        }, 6500);

        const interval = setInterval(() => {
            setProgress(old => {
                if (old >= 100) return 100;
                // Smooth linear progression
                return Math.min(old + 1, 100);
            });
        }, 60);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div className="h-screen w-full bg-[#FAFAF9] flex flex-col items-center justify-center relative overflow-hidden cursor-none selection:bg-none">

            {/* MINIMAL BACKGROUND */}
            <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-[#DCE7C8] rounded-full blur-[90px] animate-float opacity-40"></div>
            <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-[#E2E8D5] rounded-full blur-[100px] animate-float animation-delay-2000 opacity-50"></div>

            {/* MAIN COMPOSITION */}
            <div className="relative z-10 w-full max-w-lg h-80 flex flex-col items-center justify-center">

                {/* --- THE BOWL (CHAWAN) --- */}
                <div className="relative w-56 h-40 filter drop-shadow-2xl">
                    <svg viewBox="0 0 200 160" className="w-full h-full">
                        <defs>
                            <linearGradient id="bowlCream" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FAF9F6" />
                                <stop offset="100%" stopColor="#E5E5E0" />
                            </linearGradient>
                            {/* Removed noise filter for clearer print as requested */}
                        </defs>

                        {/* --- BOWL INNER (Back) --- */}
                        <path d="M10,50 Q100,20 190,50 L195,60 Q190,160 100,165 Q10,160 5,60 Z" fill="#A1A1AA" />
                        <ellipse cx="100" cy="50" rx="90" ry="15" fill="#71717A" />

                        {/* --- MATCHA LIQUID FILL --- */}
                        <mask id="liquidMask">
                            <path d="M10,50 Q100,20 190,50 L195,60 Q190,160 100,165 Q10,160 5,60 Z" fill="white" />
                        </mask>
                        <g mask="url(#liquidMask)">
                            <rect
                                x="0"
                                y={165 - (progress * 1.15)}
                                width="200" height="165"
                                fill="#556B2F"
                                className="transition-all duration-100 ease-linear"
                            />
                            <ellipse
                                cx="100"
                                cy={165 - (progress * 1.15)}
                                rx={progress > 0 ? 90 * (1) : 0}
                                ry={progress > 0 ? 15 * (1) : 0}
                                fill="#A7D176"
                                className="transition-all duration-100 ease-linear"
                            />
                            {/* Bubbles */}
                            <g className="animate-spin-slow-reverse origin-[100px_100px]">
                                <circle cx="80" cy={165 - (progress * 1.15)} r="4" fill="#EBF5DF" opacity="0.6" />
                                <circle cx="120" cy={165 - (progress * 1.15) + 5} r="2" fill="#EBF5DF" opacity="0.5" />
                            </g>
                        </g>

                        {/* --- BOWL OUTER (Front) --- */}
                        <path d="M5,60 Q10,160 100,165 Q190,160 195,60 Q100,90 5,60 Z" fill="url(#bowlCream)" />

                        {/* --- DECORATION (Sakura Decal) --- */}
                        {/* Enlarged, Stronger Pink (#FF69B4), White Outline */}
                        <g transform="translate(140, 110) scale(0.9) rotate(-10)" opacity="1">
                            {/* White Outline Layer */}
                            <path d="M0,0 C-10,-10 10,-10 0,-20 C-10,-10 -20,-5 -10,0 C-20,5 -10,10 0,0" fill="none" stroke="white" strokeWidth="3" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="none" stroke="white" strokeWidth="3" transform="rotate(72)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="none" stroke="white" strokeWidth="3" transform="rotate(144)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="none" stroke="white" strokeWidth="3" transform="rotate(216)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="none" stroke="white" strokeWidth="3" transform="rotate(288)" />

                            {/* Color Fill Layer */}
                            <path d="M0,0 C-10,-10 10,-10 0,-20 C-10,-10 -20,-5 -10,0 C-20,5 -10,10 0,0" fill="#FF69B4" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="#FF69B4" transform="rotate(72)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="#FF69B4" transform="rotate(144)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="#FF69B4" transform="rotate(216)" />
                            <path d="M0,0 C10,-10 20,-5 10,0 C20,5 10,10 0,0" fill="#FF69B4" transform="rotate(288)" />

                            {/* Center */}
                            <circle cx="0" cy="0" r="3" fill="#FFD700" stroke="white" strokeWidth="1" />
                        </g>

                        <g transform="translate(60, 100) scale(0.6) rotate(15)" opacity="0.9">
                            <path d="M0,0 C-10,-10 10,-10 0,-20 C-10,-10 -20,-5 -10,0 C-20,5 -10,10 0,0" fill="#FF69B4" stroke="white" strokeWidth="2" />
                            <path d="M0,0 C-10,-10 10,-10 0,-20 C-10,-10 -20,-5 -10,0 C-20,5 -10,10 0,0" fill="#FF69B4" stroke="white" strokeWidth="2" transform="rotate(72)" />
                            <circle cx="0" cy="0" r="3" fill="#FFD700" />
                        </g>
                    </svg>
                </div>

                {/* --- STEAM --- */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none opacity-40 mix-blend-multiply">
                    <div className="absolute inset-0 bg-white blur-[20px] rounded-full animate-steam-rise-slow"></div>
                </div>

            </div>

            {/* TEXT STATUS */}
            <div className="mt-8 text-center space-y-2 z-10">
                <h2 className="text-xl font-bold text-[#556B2F] font-serif tracking-widest uppercase animate-pulse-slow">
                    {progress < 100 ? "Brewing..." : "Tea is Ready"}
                </h2>
                <div className="w-48 h-1 bg-[#E2E8D5] mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-[#556B2F] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

        </div>
    );
};

export default LoadingScreen;

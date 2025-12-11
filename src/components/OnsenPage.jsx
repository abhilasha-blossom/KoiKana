import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wind, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAudio from '../hooks/useAudio';
import { useTheme } from '../context/ThemeContext';

const ZEN_QUOTES = [
    {
        kanji: "雨降って地固まる",
        romaji: "Ame futte ji katamaru",
        english: "After the rain, the earth hardens."
    },
    {
        kanji: "一期一会",
        romaji: "Ichigo Ichie",
        english: "One life, one encounter. Cherish this moment."
    },
    {
        kanji: "七転び八起き",
        romaji: "Nanakorobi yaoki",
        english: "Fall seven times, stand up eight."
    },
    {
        kanji: "日日是好日",
        romaji: "Nichi nichi kore koujitsu",
        english: "Every day is a good day."
    },
    {
        kanji: "行雲流水",
        romaji: "Kouun ryuusui",
        english: "Drift like clouds, flow like water."
    }
];

const OnsenPage = () => {
    const { playSound } = useAudio();
    const [mistParticles, setMistParticles] = useState([]);

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [fadeKey, setFadeKey] = useState(0);

    // Generate gentle mist
    useEffect(() => {
        const particles = Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            width: `${200 + Math.random() * 300}px`, // Larger, softer puffs
            delay: `${Math.random() * 5}s`,
            duration: `${20 + Math.random() * 10}s`
        }));
        setMistParticles(particles);

        // Cycle quotes
        const quoteInterval = setInterval(() => {
            setCurrentQuoteIndex(prev => (prev + 1) % ZEN_QUOTES.length);
            setFadeKey(prev => prev + 1);
        }, 8000);

        return () => clearInterval(quoteInterval);
    }, []);

    const currentQuote = ZEN_QUOTES[currentQuoteIndex];

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-[#FDFBF7] font-serif transition-colors duration-1000">

            {/* --- CONTROLS --- */}
            <div className="absolute top-8 left-8 z-50">
                <Link to="/start"
                    onClick={() => playSound('click')}
                    className="group flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <div className="p-3 bg-white/40 backdrop-blur-md rounded-full shadow-sm group-hover:scale-110 transition-transform border border-white/60">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                </Link>
            </div>

            {/* --- BACKGROUND LAYERS --- */}

            {/* 1. Mesh Gradient (Soft, Flowing Colors) */}
            <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,_hsla(253,16%,7%,0)_0,_hsla(253,16%,7%,0)_50%),radial-gradient(at_50%_0%,_hsla(225,39%,30%,0)_0,_hsla(225,39%,30%,0)_50%),radial-gradient(at_100%_0%,_hsla(339,49%,30%,0)_0,_hsla(339,49%,30%,0)_50%)]"></div>
            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-100 via-purple-50 to-orange-50 animate-pulse-slow"></div>

            {/* 2. Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            {/* 3. Zen Circle / Enso (Subtle Background Decor) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-slate-900/5 rounded-full blur-[100px] pointer-events-none transform rotate-45"></div>


            {/* --- FOREGROUND MIST --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {mistParticles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute -bottom-20 bg-white rounded-full blur-[80px] opacity-40 animate-mist-rise"
                        style={{
                            left: p.left,
                            width: p.width,
                            height: p.width,
                            animationDelay: p.delay,
                            animationDuration: p.duration
                        }}
                    ></div>
                ))}
            </div>

            {/* --- CONTENT --- */}
            <div className="relative z-20 text-center max-w-3xl px-8 flex flex-col items-center">

                {/* Decorative Icon */}
                <div className="mb-12 opacity-30">
                    <Mountain strokeWidth={1} size={48} className="text-slate-400" />
                </div>

                {/* Quote Container */}
                <div key={fadeKey} className="animate-fade-in-up flex flex-col items-center">

                    {/* Kanji - Large & Elegant */}
                    <h1 className="text-5xl md:text-7xl text-slate-700/80 mb-6 font-medium tracking-widest jp-font drop-shadow-sm select-none">
                        {currentQuote.kanji}
                    </h1>

                    {/* Romaji - Uppercase & Spaced */}
                    <p className="text-slate-400 text-sm md:text-base uppercase tracking-[0.4em] mb-8 font-sans font-medium">
                        {currentQuote.romaji}
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-[1px] bg-slate-300/50 mb-8"></div>

                    {/* English - Italic & Clear */}
                    <p className="text-slate-600 text-xl md:text-3xl font-light italic leading-relaxed max-w-xl">
                        "{currentQuote.english}"
                    </p>
                </div>

            </div>

            {/* --- FOOTER --- */}
            <div className="absolute bottom-12 w-full text-center z-20">
                <div className="flex items-center justify-center gap-3 text-slate-400/60 animate-pulse-slow">
                    <Wind size={16} />
                    <span className="text-xs tracking-[0.3em] uppercase sans-serif">Breathe In &middot; Breathe Out</span>
                </div>
            </div>

        </div>
    );
};

export default OnsenPage;

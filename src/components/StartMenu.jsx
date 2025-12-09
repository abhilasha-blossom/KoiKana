import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, Mic, ScrollText, Sparkles, Flower, Palette } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import OmikujiModal from './OmikujiModal';

const StartMenu = () => {
    const { playSound } = useAudio();
    const [showFortune, setShowFortune] = useState(false);

    return (
        <div className="h-screen bg-[#FFF0F5] relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-pink-200">
            {/* Omikuji Modal */}
            {showFortune && <OmikujiModal onClose={() => setShowFortune(false)} />}

            {/* Soft Moving Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-teal-200/40 to-emerald-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            {/* Back Button */}
            <Link to="/" className="absolute top-4 left-4 p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-[#4A3B52] z-50 hover:scale-110 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Omikuji Button */}
            <button
                onClick={() => setShowFortune(true)}
                className="absolute top-4 right-4 p-1.5 pr-3 rounded-full bg-red-50 hover:bg-red-100/80 transition-all duration-300 backdrop-blur-md shadow-sm border border-red-200 text-red-500 z-50 hover:scale-105 group flex items-center gap-2"
            >
                <div className="w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                    <Flower className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs hidden md:block">Daily Fortune</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6 relative z-10 animate-fade-in-up flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm text-xs font-medium text-pink-500 mb-2 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Select a Module
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[#4A3B52] mb-1 drop-shadow-sm tracking-tight leading-tight">
                    Choose Your Path
                </h1>
                <p className="text-[#7A6B82] text-sm md:text-base font-medium max-w-lg mx-auto">
                    Where will your journey take you today?
                </p>
            </div>

            {/* BENTO BOX GRID */}
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] relative z-10 p-2 overflow-y-auto md:overflow-visible no-scrollbar h-full md:h-auto content-center">

                {/* 1. LEARN KANA (Main Feature) - Top Left Big Box */}
                <Link
                    to="/kana"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 md:row-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(236,72,153,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-white/20 to-rose-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Floating Decor */}
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-pink-500 shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <PenTool className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#4A3B52] mb-2 leading-[1.1] tracking-tight">Master <br /> <span className="text-pink-500">Kana</span></h2>
                        <p className="text-[#7A6B82] font-medium text-sm md:text-base max-w-[200px] leading-relaxed">Hiragana & Katakana.</p>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center gap-3">
                        <span className="w-10 h-1 bg-pink-500 rounded-full group-hover:w-16 transition-all duration-500"></span>
                        <span className="text-pink-600 font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500 delay-100">Start</span>
                    </div>
                </Link>

                {/* 2. ABOUT JAPANESE - Top Right Wide */}
                <Link
                    to="/about"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-white/20 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-300/40 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#4A3B52] mb-0.5 group-hover:text-purple-700 transition-colors">About Japanese</h3>
                            <p className="text-[#7A6B82] text-sm">Understand the 3 alphabets</p>
                        </div>
                    </div>
                </Link>

                {/* 3. SPEAKING - Middle Right Wide */}
                <Link
                    to="/speaking"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 via-white/20 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-teal-300/40 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex flex-row-reverse items-center justify-end gap-4 text-right w-full">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                            <Mic className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end">
                            <h3 className="text-xl font-bold text-[#4A3B52] mb-0.5 group-hover:text-teal-700 transition-colors">Speaking</h3>
                            <p className="text-[#7A6B82] text-sm">Phrases & greetings</p>
                        </div>
                    </div>
                </Link>

                {/* 4. NAME STAMP - Bottom Left */}
                <Link
                    to="/name-stamp"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-white/20 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -left-8 -top-8 w-32 h-32 bg-red-200/40 rounded-full blur-[50px] group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                            <PenTool className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#4A3B52] group-hover:text-red-600 transition-colors">Name Stamp</h3>
                            <p className="text-[#7A6B82] text-sm">Make your Hanko 💮</p>
                        </div>
                    </div>
                </Link>

                {/* 5. KANJI - Bottom Right */}
                <Link
                    to="/kanji"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-white/20 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <ScrollText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#4A3B52] group-hover:text-amber-700 transition-colors">Kanji Module</h3>
                            <p className="text-[#7A6B82] text-sm">Unlock the world</p>
                        </div>
                    </div>
                </Link>

                {/* 6. VOCABULARY - Bottom Row */}
                <Link
                    to="/vocabulary"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(236,72,153,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100/30 via-white/20 to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#4A3B52] group-hover:text-pink-600 transition-colors">Vocabulary</h3>
                            <p className="text-[#7A6B82] text-sm">Expand words</p>
                        </div>
                    </div>
                </Link>

                {/* 7. THEME SHOP - Bottom Row */}
                <Link
                    to="/shop"
                    onMouseEnter={() => playSound('pop')}
                    className="md:col-span-2 group relative bg-white/40 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(74,222,128,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 via-white/20 to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#4A3B52] group-hover:text-green-600 transition-colors">Theme Shop</h3>
                            <p className="text-[#7A6B82] text-sm">Customize look 🎨</p>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default StartMenu;

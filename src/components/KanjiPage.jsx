import React from 'react';
import { ArrowLeft, ScrollText, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';

const KanjiPage = () => {
    return (
        <div className="min-h-screen bg-[#FFF0F5] relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            <Link to="/start" className="absolute top-6 left-6 p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm text-[#4A3B52] z-50">
                <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="text-center max-w-lg mx-auto relative z-10 animate-fade-in-up">
                <div className="inline-block p-6 bg-amber-100/80 rounded-full text-amber-600 mb-8 shadow-sm animate-bounce">
                    <ScrollText className="w-12 h-12" />
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-[#4A3B52] mb-4 jp-font">
                    Kanji Module
                </h1>
                <p className="text-2xl text-amber-600 font-bold mb-6">Coming Soon</p>

                <p className="text-[#7A6B82] text-lg leading-relaxed mb-10">
                    We are crafting a beautiful way to learn the 2,000+ characters of meaning.
                    <br />Slow and steady wins the race! 🐢
                </p>

                <div className="flex justify-center gap-4 opacity-50">
                    <span className="text-4xl">山</span>
                    <span className="text-4xl">川</span>
                    <span className="text-4xl">日</span>
                    <span className="text-4xl">月</span>
                </div>
            </div>
        </div>
    );
};

export default KanjiPage;

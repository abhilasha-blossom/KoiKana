import React, { useState } from 'react';
import { ArrowLeft, Brush, Shuffle, Sparkles, Trophy, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import WritingCanvas from './WritingCanvas';
import { kanjiData } from '../data/kanjiData';
import useAudio from '../hooks/useAudio';

const KanjiDojoPage = () => {
    const { playSound } = useAudio();

    // Pick a random N5 kanji to start
    const getRandomKanji = () => kanjiData[Math.floor(Math.random() * kanjiData.length)];

    const [currentKanji, setCurrentKanji] = useState(getRandomKanji());
    const [streak, setStreak] = useState(0);

    const handleNext = () => {
        playSound('pop');
        let next = getRandomKanji();
        // Ensure differnet one
        while (next.char === currentKanji.char) {
            next = getRandomKanji();
        }
        setCurrentKanji(next);
    };

    const handleComplete = (success) => {
        if (success) {
            setStreak(s => s + 1);
            // Auto advance? Or wait for user?
            // Let user click "Again" or "Next" in canvas, but Canvas handles "Again".
            // We can provide a "Next" button outside.
        } else {
            setStreak(0);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans relative overflow-hidden flex flex-col items-center">

            {/* Background Texture (Rice Paper / Dojo Floor) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none mix-blend-overlay"></div>

            {/* Ambient Ink Drops */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-black rounded-full blur-[100px] opacity-20 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-neutral-800 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

            {/* Header */}
            <div className="w-full p-6 flex justify-between items-center relative z-10">
                <Link to="/start" className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors text-neutral-300">
                    <ArrowLeft size={24} />
                </Link>

                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-widest uppercase">
                        <Brush className="w-8 h-8 text-amber-500" />
                        Kanji Dojo
                    </h1>
                    <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] mt-1">THE WAY OF THE BRUSH</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-neutral-800 px-4 py-2 rounded-full font-bold text-amber-500 border border-neutral-700 flex items-center gap-2">
                        <Trophy size={16} />
                        Streak: {streak}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 pb-20 gap-8">

                {/* Kanji Info Card */}
                <div className="text-center animate-fade-in-up">
                    <div className="text-6xl mb-4 font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] jp-font">
                        {currentKanji.char}
                    </div>
                    <div className="text-xl font-bold text-neutral-300 mb-1">
                        {currentKanji.meaning.toUpperCase()}
                    </div>
                    <div className="flex gap-4 justify-center text-sm text-neutral-500">
                        <span>On: {currentKanji.onyomi.join(', ')}</span>
                        <span>•</span>
                        <span>Kun: {currentKanji.kunyomi.join(', ')}</span>
                    </div>
                </div>

                {/* The Canvas */}
                <div className="relative">
                    {/* Glow effect behind canvas */}
                    <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-125 pointer-events-none"></div>

                    <WritingCanvas
                        char={currentKanji.char}
                        onComplete={handleComplete}
                    // Note: WritingCanvas handles its own internal "Success" state UI.
                    // We rely on it.
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-4 mt-8 relative z-20">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-900/50 transition-all hover:scale-105 active:scale-95 text-lg"
                    >
                        <Shuffle size={20} />
                        Next Character
                    </button>
                    <Link
                        to="/sushi"
                        className="flex items-center gap-3 px-6 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold shadow-lg shadow-orange-900/50 transition-all hover:scale-105 active:scale-95 text-lg"
                    >
                        <Utensils size={20} />
                        Sushi Break
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default KanjiDojoPage;

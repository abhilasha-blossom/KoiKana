import React from 'react';
import { ArrowLeft, Mic, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAudio from '../hooks/useAudio';

const PHRASES_DATA = [
    { jp: "こんにちは", romaji: "Konnichiwa", en: "Hello" },
    { jp: "おはよう", romaji: "Ohayou", en: "Good Morning" },
    { jp: "こんばんは", romaji: "Konbanwa", en: "Good Evening" },
    { jp: "ありがとう", romaji: "Arigatou", en: "Thank You" },
    { jp: "すみません", romaji: "Sumimasen", en: "Excuse me / Sorry" },
    { jp: "はい", romaji: "Hai", en: "Yes" },
    { jp: "いいえ", romaji: "Iie", en: "No" },
    { jp: "さようなら", romaji: "Sayounara", en: "Goodbye" },
    { jp: "おやすみ", romaji: "Oyasumi", en: "Good Night" }
];

const SpeakingPage = () => {
    const { playSound } = useAudio();

    return (
        <div className="min-h-screen bg-[#FFF0F5] relative overflow-x-hidden p-6 pb-20">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-pulse-slow"></div>

            {/* Header / Nav */}
            <div className="max-w-4xl mx-auto mb-12 relative z-10 flex flex-col items-center">
                <div className="w-full flex justify-start mb-6">
                    <Link to="/start" className="inline-flex items-center gap-2 p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm text-[#4A3B52]">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold">Back</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4 mb-2">
                    <div className="p-4 bg-teal-100/80 rounded-full text-teal-600">
                        <Mic className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#4A3B52] drop-shadow-sm">
                        Speaking Practice
                    </h1>
                </div>
                <p className="text-[#7A6B82] font-medium text-lg">Everyday phrases to help you connect.</p>
            </div>

            {/* Grid Content */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up relative z-10">
                {PHRASES_DATA.map((phrase, i) => (
                    <div
                        key={i}
                        onClick={() => playSound('pop')}
                        className="group relative bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 shadow-sm hover:shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all hover:-translate-y-2 cursor-pointer overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center text-center gap-3">
                            <span className="text-4xl font-black text-[#4A3B52] jp-font mb-2 group-hover:scale-110 transition-transform duration-300">
                                {phrase.jp}
                            </span>
                            <span className="text-xl font-bold text-teal-600">
                                {phrase.romaji}
                            </span>
                            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent rounded-full my-1"></div>
                            <span className="text-gray-500 font-medium tracking-wide">
                                {phrase.en}
                            </span>
                        </div>

                        {/* Audio Icon Hint */}
                        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-teal-400">
                            <Volume2 className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpeakingPage;

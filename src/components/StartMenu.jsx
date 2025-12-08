import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, Mic, ScrollText } from 'lucide-react';
import useAudio from '../hooks/useAudio';

const StartMenu = () => {
    const { playSound } = useAudio();

    const menuOptions = [
        {
            id: 'about',
            title: 'About Japanese',
            desc: 'The beautiful logic of 3 alphabets',
            icon: <BookOpen className="w-8 h-8" />,
            link: '/about',
            color: 'from-pink-100 to-rose-50',
            textColor: 'text-pink-600',
            delay: '0s'
        },
        {
            id: 'kana',
            title: 'Learn Kana',
            desc: 'Master Hiragana & Katakana',
            icon: <PenTool className="w-8 h-8" />,
            link: '/kana',
            color: 'from-purple-100 to-indigo-50',
            textColor: 'text-purple-600',
            delay: '0.1s'
        },
        {
            id: 'speaking',
            title: 'Speaking',
            desc: 'Everyday phrases & greetings',
            icon: <Mic className="w-8 h-8" />,
            link: '/speaking',
            color: 'from-teal-100 to-emerald-50',
            textColor: 'text-teal-600',
            delay: '0.2s'
        },
        {
            id: 'kanji',
            title: 'Kanji',
            desc: 'The world of symbols (Coming Soon)',
            icon: <ScrollText className="w-8 h-8" />,
            link: '/kanji',
            color: 'from-amber-100 to-orange-50',
            textColor: 'text-amber-600',
            delay: '0.3s'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FFF0F5] relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-pulse-slow"></div>

            <Link to="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm text-[#4A3B52] z-50">
                <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="text-center mb-12 relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-[#4A3B52] mb-3 drop-shadow-sm">
                    Choose Your Path
                </h1>
                <p className="text-[#7A6B82] text-lg">Where would you like to start today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full relative z-10">
                {menuOptions.map((opt) => (
                    <Link
                        key={opt.id}
                        to={opt.link}
                        onMouseEnter={() => playSound('pop')}
                        className={`
                            group relative overflow-hidden p-8 rounded-[2.5rem] transition-all duration-500
                            bg-gradient-to-br ${opt.color} bg-opacity-60 backdrop-blur-xl border border-white/60
                            hover:shadow-[0_8px_30px_rgba(255,209,220,0.6)] hover:-translate-y-2
                            animate-fade-in-up
                        `}
                        style={{ animationDelay: opt.delay }}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Decor Circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>

                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[#4A3B52] mb-2 group-hover:scale-105 transition-transform origin-left">
                                    {opt.title}
                                </h3>
                                <p className="text-[#7A6B82] font-medium">{opt.desc}</p>
                            </div>
                            <div className={`p-4 bg-white/50 rounded-2xl ${opt.textColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {opt.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StartMenu;

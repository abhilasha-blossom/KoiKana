import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Star, Scroll, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import useAudio from '../hooks/useAudio';
import { YOKAI_DATA } from '../data/yokaiData';
import { useTheme } from '../context/ThemeContext';

const YokaiPage = () => {
    const { streak, xp, mastery } = useProgress();
    const { playSound } = useAudio();
    const { theme } = useTheme();
    const [selectedYokai, setSelectedYokai] = useState(null);

    // Calculate Unlocks
    const stats = { streak, xp, mastery };
    const unlockedYokai = YOKAI_DATA.map(yokai => ({
        ...yokai,
        isUnlocked: yokai.condition(stats)
    }));

    const totalUnlocked = unlockedYokai.filter(y => y.isUnlocked).length;

    // Handle Card Click
    const handleCardClick = (yokai) => {
        if (!yokai.isUnlocked) {
            playSound('error');
            return;
        }
        playSound('pop');
        setSelectedYokai(yokai);
    };

    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-500 flex flex-col items-center p-4 relative overflow-hidden`}>

            {/* Background Texture (Japanese Pattern) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>

            {/* Header */}
            <header className="w-full max-w-4xl flex items-center justify-between mb-8 relative z-10">
                <Link to="/start"
                    onClick={() => playSound('click')}
                    className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                    <ArrowLeft className={`${theme.text} w-6 h-6`} />
                </Link>
                <div className="text-center">
                    <h1 className={`text-4xl font-bold ${theme.activeText} flex items-center gap-3 justify-center jp-font`}>
                        <Scroll className="w-8 h-8" />
                        百鬼夜行
                    </h1>
                    <p className={`${theme.text} opacity-80 text-sm tracking-widest uppercase mt-1`}>
                        Yokai Collection • {totalUnlocked} / {YOKAI_DATA.length} Spirits
                    </p>
                    <p className={`text-xs md:text-sm ${theme.text} opacity-70 mt-3 max-w-md mx-auto leading-relaxed`}>
                        Unlock hidden Japanese spirits by maintaining streaks, earning XP, and mastering characters.
                    </p>
                </div>
                <div className="w-12"></div> {/* Spacer */}
            </header>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl pb-20 z-10">
                {unlockedYokai.map((yokai) => (
                    <button
                        key={yokai.id}
                        onClick={() => handleCardClick(yokai)}
                        className={`
                            relative aspect-[3/4] rounded-2xl border-4 transition-all duration-300 group
                            flex flex-col items-center justify-center gap-2
                            overflow-hidden shadow-sm hover:shadow-xl
                            ${yokai.isUnlocked
                                ? 'bg-white/80 border-white hover:-translate-y-2 cursor-pointer'
                                : 'bg-gray-200/50 border-gray-300/50 cursor-not-allowed grayscale opacity-70'}
                        `}
                    >
                        {yokai.isUnlocked ? (
                            <>
                                {/* Unlocked Content */}
                                <div className={`text-6xl animate-bounce-in group-hover:scale-110 transition-transform duration-500`}>
                                    {yokai.emoji}
                                </div>
                                <div className="text-center px-2">
                                    <h3 className={`font-bold ${theme.text} text-lg`}>{yokai.name}</h3>
                                    <p className="text-xs text-gray-500 font-serif">{yokai.kanji}</p>
                                </div>
                                <div className={`absolute top-2 right-2 ${yokai.color} opacity-20 group-hover:opacity-100 transition-opacity`}>
                                    <Sparkles size={16} />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Locked Content */}
                                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-xs text-center text-gray-500 font-medium px-4">
                                    {yokai.unlockHint}
                                </span>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedYokai && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedYokai(null)}
                >
                    <div className="relative bg-[#FAF9F6] w-full max-w-sm rounded-[2rem] shadow-2xl border-8 border-white p-8 flex flex-col items-center text-center overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Background */}
                        <div className={`absolute top-0 w-full h-32 ${selectedYokai.BgColor} opacity-50 rounded-b-[50%]`}></div>

                        <button
                            onClick={() => setSelectedYokai(null)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                        >
                            <span className="text-gray-400 text-xl font-bold">×</span>
                        </button>

                        <div className="relative z-10 mt-4 mb-4 text-8xl animate-bounce-slow filter drop-shadow-md">
                            {selectedYokai.emoji}
                        </div>

                        <h2 className="text-3xl font-bold text-[#4A3B52] mb-1">{selectedYokai.name}</h2>
                        <h3 className="text-xl text-pink-500 jp-font font-bold mb-4">{selectedYokai.kanji}</h3>

                        <div className="w-full h-px bg-gray-200 mb-4"></div>

                        <div className="text-gray-600 leading-relaxed text-sm font-medium">
                            {selectedYokai.description}
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <span className={`w-2 h-2 rounded-full ${selectedYokai.color.replace('text', 'bg')}`}></span>
                            {selectedYokai.type} CLASS
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default YokaiPage;

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import useProgress from '../hooks/useProgress';
import { ArrowLeft, Lock, Check, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAudio from '../hooks/useAudio';

const ShopPage = () => {
    const { theme, setTheme, currentThemeId, availableThemes } = useTheme();
    const { xp, unlockedThemes, buyTheme } = useProgress();
    const { playSound } = useAudio();

    const [previewThemeId, setPreviewThemeId] = useState(currentThemeId);
    const [prevCurrentThemeId, setPrevCurrentThemeId] = useState(currentThemeId);

    // Sync preview with current theme changes (render-time)
    if (currentThemeId !== prevCurrentThemeId) {
        setPrevCurrentThemeId(currentThemeId);
        setPreviewThemeId(currentThemeId);
    }

    const activePreviewTheme = availableThemes[previewThemeId] || theme;

    const handleBuy = (themeId, cost) => {
        const success = buyTheme(themeId, cost);
        if (success) {
            playSound('success');
        } else {
            playSound('error');
        }
    };

    const handleEquip = (themeId) => {
        setTheme(themeId);
        playSound('pop');
    };

    return (
        <div className={`h-screen ${theme.colors.bg} flex flex-col items-center p-4 relative overflow-hidden transition-colors duration-500`}>
            {/* Background Atmosphere */}
            <div className={`absolute top-[-20%] left-[-10%] w-64 h-64 md:w-[600px] md:h-[600px] ${theme.colors.blob1} rounded-full blur-[60px] md:blur-[100px] animate-blob mix-blend-multiply pointer-events-none transition-colors duration-500`}></div>
            <div className={`absolute bottom-[-20%] right-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] ${theme.colors.blob2} rounded-full blur-[60px] md:blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none transition-colors duration-500`}></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl h-full">
                {/* Header with Back Button integrated */}
                <div className="flex-none w-full flex flex-col items-center mb-4 relative">
                    {/* Back Button positioned relative to container */}
                    <div className="w-full flex justify-start mb-2 px-2 lg:px-0">
                        <Link to="/start" className="p-2 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors shadow-sm border border-white/50 z-50">
                            <ArrowLeft className={`${theme.colors.primary} w-5 h-5`} />
                        </Link>
                    </div>

                    <h1 className={`text-3xl font-bold ${theme.colors.primary} mb-1 drop-shadow-sm flex items-center justify-center gap-2`}>
                        <Palette className="w-6 h-6" /> Theme Shop
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-1 rounded-full shadow-sm border border-white/50">
                        <span className="text-base">✨</span>
                        <span className={`text-lg font-black ${theme.colors.accent}`}>{xp} XP</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full h-full overflow-hidden">
                    {/* LEFT: THEME LIST */}
                    <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-20 no-scrollbar content-start">
                        {Object.values(availableThemes).map((t) => {
                            const isUnlocked = unlockedThemes.includes(t.id);
                            const isEquipped = currentThemeId === t.id;
                            const canAfford = xp >= t.cost;

                            return (
                                <div
                                    key={t.id}
                                    onMouseEnter={() => setPreviewThemeId(t.id)}
                                    className={`
                                        relative group overflow-hidden bg-white/30 backdrop-blur-xl border 
                                        ${previewThemeId === t.id ? `border-${t.colors.accent.split('-')[1]}-400 ring-2 ring-${t.colors.accent.split('-')[1]}-200` : 'border-white/40'}
                                        rounded-3xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default
                                    `}
                                >
                                    {/* Preview Blob */}
                                    <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full ${t.colors.blob1} blur-2xl transition-transform group-hover:scale-150`}></div>

                                    <div className="relative z-10">
                                        <h3 className={`text-lg font-bold ${theme.colors.primary} mb-1 flex items-center justify-between`}>
                                            {t.name}
                                            {isEquipped && <Check className="text-green-500 w-4 h-4" />}
                                        </h3>

                                        <div className="flex items-center justify-between mt-3">
                                            {isUnlocked ? (
                                                isEquipped ? (
                                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEquip(t.id)}
                                                        className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${t.colors.button} text-white font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-xs`}
                                                    >
                                                        Equip
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handleBuy(t.id, t.cost)}
                                                    disabled={!canAfford}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all text-xs
                                                        ${canAfford
                                                            ? `bg-white text-gray-800 hover:bg-gray-50 shadow-sm`
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                                    `}
                                                >
                                                    {canAfford ? 'Buy' : 'Locked'}
                                                    <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] ml-1">{t.cost} XP</span>
                                                </button>
                                            )}

                                            {!isUnlocked && (
                                                <Lock className="text-gray-400 w-3 h-3 ml-auto" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT: PREVIEW PANEL */}
                    <div className="hidden lg:block w-full lg:w-2/5 relative h-full">
                        <div className={`
                            w-full h-[90%] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white/50 relative
                            transition-all duration-500
                        `}>
                            {/* Mock App UI - Background */}
                            <div className={`absolute inset-0 ${activePreviewTheme.colors.bg} transition-colors duration-500`}>
                                {/* Mock Atmosphere */}
                                <div className={`absolute top-[-20%] left-[-10%] w-[200px] h-[200px] ${activePreviewTheme.colors.blob1} rounded-full blur-[60px] animate-blob mix-blend-multiply transition-colors duration-500`}></div>
                                <div className={`absolute bottom-[-10%] right-[-10%] w-[150px] h-[150px] ${activePreviewTheme.colors.blob2} rounded-full blur-[60px] animate-blob animation-delay-2000 mix-blend-multiply transition-colors duration-500`}></div>

                                {/* Mock Content */}
                                <div className="relative z-10 p-6 flex flex-col items-center h-full justify-center">
                                    <div className={`text-2xl font-bold ${activePreviewTheme.colors.primary} mb-2 transition-colors duration-500`}>Preview</div>
                                    <div className="h-1 w-12 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mb-6"></div>

                                    {/* Mock Button */}
                                    <div className={`
                                        w-full p-3 rounded-xl mb-3 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm
                                        flex items-center gap-3
                                     `}>
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${activePreviewTheme.colors.button} shadow-sm`}></div>
                                        <div className={`h-3 w-24 bg-gray-400/20 rounded-full`}></div>
                                    </div>

                                    <div className={`
                                        w-full p-3 rounded-xl mb-3 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm
                                        flex items-center gap-3
                                     `}>
                                        <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center`}>
                                            <span className={`${activePreviewTheme.colors.accent} text-sm`}>🌸</span>
                                        </div>
                                        <div className={`h-3 w-16 bg-gray-400/20 rounded-full`}></div>
                                    </div>

                                    <div className={`mt-auto px-4 py-1.5 rounded-full ${activePreviewTheme.colors.bg === 'bg-[#000000]' ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-sm`}>
                                        <span className={`text-xs font-bold ${activePreviewTheme.colors.primary}`}>
                                            {activePreviewTheme.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Frame Glare */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                        </div>

                        <p className={`text-center mt-2 font-bold ${theme.colors.primary} opacity-60 text-xs`}>
                            Hover to preview
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;

import React, { useState, useEffect } from 'react';
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

    // Initial effect to set preview to current or default if undefined
    useEffect(() => {
        if (currentThemeId) {
            setPreviewThemeId(currentThemeId);
        }
    }, [currentThemeId]);

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
        <div className={`min-h-screen ${theme.colors.bg} flex flex-col items-center p-6 relative overflow-hidden transition-colors duration-500`}>
            {/* Background Atmosphere */}
            <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] ${theme.colors.blob1} rounded-full blur-[100px] animate-blob mix-blend-multiply pointer-events-none transition-colors duration-500`}></div>
            <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] ${theme.colors.blob2} rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none transition-colors duration-500`}></div>

            <Link to="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors z-50 shadow-sm border border-white/50">
                <ArrowLeft className={theme.colors.primary} />
            </Link>

            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
                <h1 className={`text-5xl font-bold ${theme.colors.primary} mb-3 drop-shadow-sm flex items-center gap-3`}>
                    <Palette /> Theme Shop
                </h1>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-white/50 mb-8">
                    <span className="text-2xl">✨</span>
                    <span className={`text-2xl font-black ${theme.colors.accent}`}>{xp} XP</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    {/* LEFT: THEME LIST */}
                    <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
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
                                        rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default
                                    `}
                                >
                                    {/* Preview Blob */}
                                    <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full ${t.colors.blob1} blur-2xl transition-transform group-hover:scale-150`}></div>

                                    <div className="relative z-10">
                                        <h3 className={`text-xl font-bold ${theme.colors.primary} mb-1 flex items-center justify-between`}>
                                            {t.name}
                                            {isEquipped && <Check className="text-green-500 w-5 h-5" />}
                                        </h3>

                                        <div className="flex items-center justify-between mt-6">
                                            {isUnlocked ? (
                                                isEquipped ? (
                                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEquip(t.id)}
                                                        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${t.colors.button} text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm`}
                                                    >
                                                        Equip
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handleBuy(t.id, t.cost)}
                                                    disabled={!canAfford}
                                                    className={`
                                                        px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all text-sm
                                                        ${canAfford
                                                            ? `bg-white text-gray-800 hover:bg-gray-50 shadow-sm`
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                                    `}
                                                >
                                                    {canAfford ? 'Buy' : 'Locked'}
                                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs ml-1">{t.cost} XP</span>
                                                </button>
                                            )}

                                            {!isUnlocked && (
                                                <Lock className="text-gray-400 w-4 h-4 ml-auto" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT: PREVIEW PANEL */}
                    <div className="w-full lg:w-2/5 relative">
                        <div className="sticky top-6">
                            <div className={`
                                w-full aspect-[9/16] md:aspect-[3/4] lg:aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 relative
                                transition-all duration-500
                            `}>
                                {/* Mock App UI - Background */}
                                <div className={`absolute inset-0 ${activePreviewTheme.colors.bg} transition-colors duration-500`}>
                                    {/* Mock Atmosphere */}
                                    <div className={`absolute top-[-20%] left-[-10%] w-[300px] h-[300px] ${activePreviewTheme.colors.blob1} rounded-full blur-[60px] animate-blob mix-blend-multiply transition-colors duration-500`}></div>
                                    <div className={`absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] ${activePreviewTheme.colors.blob2} rounded-full blur-[60px] animate-blob animation-delay-2000 mix-blend-multiply transition-colors duration-500`}></div>

                                    {/* Mock Content */}
                                    <div className="relative z-10 p-6 flex flex-col items-center h-full justify-center">
                                        <div className={`text-4xl font-bold ${activePreviewTheme.colors.primary} mb-2 transition-colors duration-500`}>Preview</div>
                                        <div className="h-1 w-16 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mb-8"></div>

                                        {/* Mock Button */}
                                        <div className={`
                                            w-full p-4 rounded-2xl mb-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm
                                            flex items-center gap-4
                                         `}>
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${activePreviewTheme.colors.button} shadow-sm`}></div>
                                            <div className={`h-4 w-32 bg-gray-400/20 rounded-full`}></div>
                                        </div>

                                        <div className={`
                                            w-full p-4 rounded-2xl mb-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm
                                            flex items-center gap-4
                                         `}>
                                            <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center`}>
                                                <span className={`${activePreviewTheme.colors.accent}`}>🌸</span>
                                            </div>
                                            <div className={`h-4 w-24 bg-gray-400/20 rounded-full`}></div>
                                        </div>

                                        <div className={`mt-auto px-6 py-2 rounded-full ${activePreviewTheme.colors.bg === 'bg-[#000000]' ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-sm`}>
                                            <span className={`text-sm font-bold ${activePreviewTheme.colors.primary}`}>
                                                {activePreviewTheme.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Frame Glare */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                            </div>

                            <p className={`text-center mt-4 font-bold ${theme.colors.primary} opacity-60 text-sm`}>
                                Hover over a theme to preview
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;

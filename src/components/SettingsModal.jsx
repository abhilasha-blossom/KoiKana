import React, { useState } from 'react';
import { X, Volume2, Music, Trash2, AlertTriangle, Check, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const SettingsModal = ({ onClose }) => {
    const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume, resetProgress } = useSettings();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleResetClick = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        resetProgress();
        setShowResetConfirm(false);
        onClose(); // Optional: close settings after reset
    };

    const cancelReset = () => {
        setShowResetConfirm(false);
    };

    if (showResetConfirm) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={cancelReset}></div>
                <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border-2 border-red-100 animate-scale-in">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-[#4A3B52]">Reset All Progress?</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                This will permanently delete your high scores, shop items, and collected koi. <br />
                                <span className="font-bold text-red-500">This cannot be undone.</span>
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={cancelReset}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-white/50 animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <RotateCcw className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-black text-[#4A3B52]">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-8">
                    {/* Volume Controls */}
                    <div className="space-y-6">
                        {/* Music */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-[#4A3B52] font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <Music className="w-4 h-4 text-pink-500" />
                                    <span>Music Volume</span>
                                </div>
                                <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-lg text-xs">{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-600 transition-all"
                            />
                        </div>

                        {/* SFX */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-[#4A3B52] font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-teal-500" />
                                    <span>Sound Effects</span>
                                </div>
                                <span className="bg-teal-100 text-teal-600 px-2 py-0.5 rounded-lg text-xs">{Math.round(sfxVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Danger Zone */}
                    <div className="space-y-4">
                        <h3 className="text-red-500/80 font-bold text-xs uppercase tracking-wider flex items-center gap-2 px-1">
                            <AlertTriangle className="w-3 h-3" /> Danger Zone
                        </h3>
                        <button
                            onClick={handleResetClick}
                            className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-all border border-red-100 hover:border-red-200 flex items-center justify-center gap-2 group"
                        >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Reset All Progress
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

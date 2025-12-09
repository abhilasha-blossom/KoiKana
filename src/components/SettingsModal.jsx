import React from 'react';
import { X, Volume2, Music, Trash2, AlertTriangle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const SettingsModal = ({ onClose }) => {
    const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume, resetProgress } = useSettings();

    const handleReset = () => {
        if (confirm("Are you sure? This will delete ALL progress, including high scores and shop items. This cannot be undone.")) {
            resetProgress();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-white animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-[#4A3B52]">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-8">
                    {/* Volume Controls */}
                    <div className="space-y-6">
                        {/* Music */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[#4A3B52] font-bold">
                                <div className="flex items-center gap-2">
                                    <Music className="w-5 h-5 text-pink-500" />
                                    <span>Music Volume</span>
                                </div>
                                <span>{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>

                        {/* SFX */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[#4A3B52] font-bold">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-teal-500" />
                                    <span>Sound Effects</span>
                                </div>
                                <span>{Math.round(sfxVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-200"></div>

                    {/* Danger Zone */}
                    <div className="space-y-4">
                        <h3 className="text-red-500 font-bold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Danger Zone
                        </h3>
                        <button
                            onClick={handleReset}
                            className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-colors flex items-center justify-center gap-2 border border-red-200"
                        >
                            <Trash2 className="w-5 h-5" />
                            Reset All Progress
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

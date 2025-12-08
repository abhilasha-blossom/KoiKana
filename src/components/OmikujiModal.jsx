import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import useOmikuji from '../hooks/useOmikuji';
import useAudio from '../hooks/useAudio';

const OmikujiModal = ({ onClose }) => {
    const { hasDrawn, fortune, drawFortune } = useOmikuji();
    const { playSound } = useAudio();
    const [isShaking, setIsShaking] = useState(false);
    const [showResult, setShowResult] = useState(hasDrawn);

    const handleDraw = () => {
        if (hasDrawn) return;

        setIsShaking(true);
        // Simulate shake duration
        setTimeout(() => {
            playSound('correct');
            drawFortune();
            setIsShaking(false);
            setShowResult(true);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border-4 border-red-100 text-center animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <X className="w-6 h-6" />
                </button>

                {!showResult ? (
                    <div className="py-8">
                        <h2 className="text-2xl font-black text-red-500 mb-2">Daily Fortune</h2>
                        <p className="text-gray-500 mb-8">Shake for your luck!</p>

                        <div
                            onClick={handleDraw}
                            className={`w-32 h-48 mx-auto bg-red-500 rounded-lg border-4 border-red-700 relative shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center justify-center ${isShaking ? 'animate-shake' : ''}`}
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                                🧧
                            </div>
                            {/* Box Slot */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-b-lg"></div>
                        </div>

                        <p className="mt-8 text-sm text-gray-400 font-medium animate-pulse">Tap the box to shake</p>
                    </div>
                ) : (
                    <div className="py-6 animate-fade-in">
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-5xl mb-4 border-4 border-yellow-200 shadow-sm animate-bounce-slow">
                            {fortune.icon}
                        </div>
                        <h2 className={`text-4xl font-black ${fortune.color} mb-2 tracking-tight`}>{fortune.type}</h2>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">{fortune.label}</h3>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                            <p className="text-gray-600 font-medium italic">"{fortune.desc}"</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span>Come back tomorrow!</span>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(5deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-5deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-shake {
                    animation: shake 0.1s infinite;
                }
            `}</style>
        </div>
    );
};

export default OmikujiModal;

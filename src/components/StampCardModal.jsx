import React, { useEffect, useState } from 'react';
import { Calendar, Check, X, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';

const StampCardModal = ({ onClose, initialStamps, onStampComplete }) => {
    const { theme } = useTheme();
    const { playSound } = useAudio();
    const [stamps, setStamps] = useState(initialStamps);
    const [animatingStamp, setAnimatingStamp] = useState(null);

    useEffect(() => {
        // Trigger stamp animation for the new stamp
        const newStampIndex = initialStamps - 1; // 0-indexed
        if (newStampIndex >= 0 && newStampIndex < 7) {
            setTimeout(() => {
                setAnimatingStamp(newStampIndex);
                playSound('pop');
                // Trigger confetti or particle effect here if available
            }, 800);

            setTimeout(() => {
                onStampComplete();
            }, 2500);
        }
    }, []);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Just generic Day 1 - Day 7 labels are safer for a cycle that might not align with real weeks
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className={`
                bg-[#FFFBF0] w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative
                flex flex-col items-center border-[6px] border-[#D4A373]
                bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]
            `}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                    <X size={20} className="text-gray-600" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#FF8FAB] text-white px-6 py-2 rounded-full font-bold shadow-md mb-4 transform -rotate-2">
                        <Calendar size={20} />
                        <span>Radio Taiso Card</span>
                    </div>
                    <h2 className="text-3xl font-black text-[#5D4037] tracking-tight">Daily Generic Check-in</h2>
                    <p className="text-[#8D6E63] font-bold mt-2">Stamp your card every day for rewards!</p>
                </div>

                {/* Stamp Grid */}
                <div className="grid grid-cols-4 gap-4 w-full px-4 mb-8">
                    {labels.map((label, index) => {
                        const isStamped = index < stamps;
                        const isStandard = index < 6;
                        const isFinal = index === 6;
                        const isAnimating = animatingStamp === index;

                        return (
                            <div
                                key={index}
                                className={`
                                    relative
                                    aspect-[4/5] rounded-xl border-4 flex flex-col items-center justify-start py-2
                                    ${isFinal ? 'col-span-2 aspect-auto flex-row justify-center gap-4 bg-[#FFECB3] border-[#FFC107]' : 'bg-white border-[#E0E0E0]'}
                                    ${isStamped && !isFinal ? 'border-[#FF8FAB]' : ''}
                                `}
                            >
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>

                                <div className="flex-1 flex items-center justify-center w-full relative">
                                    {/* Placeholder Circle */}
                                    {!isStamped && (
                                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300"></div>
                                    )}

                                    {/* The Stamp */}
                                    {isStamped && (
                                        <div className={`
                                            transition-all duration-500
                                            ${isAnimating ? 'animate-stamp scale-150' : 'scale-100 opacity-100'}
                                        `}>
                                            <div className="w-16 h-16 relative">
                                                {/* Stamp Graphic - Traditional Red Ink Style */}
                                                <div className="absolute inset-0 border-[3px] border-red-500/80 rounded-full opacity-90 animate-pulse-slow"></div>
                                                <div className="absolute inset-1 border border-red-500/50 rounded-full"></div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 rotate-[-12deg]">
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter leading-none">Good</span>
                                                    <span className="text-2xl font-black leading-none pb-1">済</span>
                                                    <span className="text-[8px] font-bold leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isFinal && (
                                    <div className="flex flex-col items-start justify-center">
                                        <div className="text-[#F57F17] font-black uppercase text-sm">Target</div>
                                        <div className="text-[#5D4037] font-bold text-xs">Reach 7 Days</div>
                                        <div className="mt-2 bg-[#FFCA28] text-[#5D4037] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            +1000 💴
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="bg-white/50 rounded-xl p-4 w-full text-center border-2 border-[#E0E0E0]/50">
                    <p className="text-sm font-bold text-gray-500">
                        {stamps === 7
                            ? "Complete! Card will reset tomorrow."
                            : `Login ${7 - stamps} more days to complete this card!`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StampCardModal;

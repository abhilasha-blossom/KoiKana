import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const MnemonicModal = ({ item, onClose, onNext, onPrev }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform transition-all duration-300 scale-100 p-6 sm:p-8">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Container */}
                <div className="flex flex-col items-center text-center space-y-6">

                    {/* Character Header */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 jp-font drop-shadow-sm">
                            {item.char}
                        </h2>
                        <span className="text-xl font-medium text-gray-400 mt-1 uppercase tracking-widest">{item.romaji}</span>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full aspect-video sm:aspect-square max-h-[300px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner group">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={`Mnemonic for ${item.char}`}
                                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 italic">
                                Visual memory loading... 🌸
                            </div>
                        )}
                    </div>

                    {/* Story / Mnemonic Text */}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-700 font-handwritten">
                            "{item.mnemonic || 'Coming soon...'}"
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Click arrows to explore more
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between w-full pt-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MnemonicModal;

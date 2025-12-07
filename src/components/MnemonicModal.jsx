import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, PenTool, BookOpen } from 'lucide-react';
import WritingCanvas from './WritingCanvas';

const MnemonicModal = ({ item, onClose, onNext, onPrev }) => {
    const [activeTab, setActiveTab] = useState('memory'); // 'memory' | 'practice' | 'words'

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
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-500 transition-colors z-20"
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

                    {/* TABS */}
                    <div className="flex p-1 bg-gray-100/80 rounded-full w-full max-w-[300px]">
                        <button
                            onClick={() => setActiveTab('memory')}
                            className={`flex-1 py-1.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'memory' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ImageIcon className="w-4 h-4" /> View
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={`flex-1 py-1.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'practice' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <PenTool className="w-4 h-4" /> Draw
                        </button>
                        <button
                            onClick={() => setActiveTab('words')}
                            className={`flex-1 py-1.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'words' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <BookOpen className="w-4 h-4" /> Words
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="w-full relative min-h-[300px] flex items-center justify-center">
                        {activeTab === 'memory' ? (
                            <div className="w-full space-y-6 animate-fade-in">
                                {/* Image Area */}
                                {/* Visual Memory Section */}
                                <div className="relative w-full aspect-video sm:aspect-square max-h-[300px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner group mx-auto flex items-center justify-center">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={`Mnemonic for ${item.char}`}
                                            className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center">
                                            <span className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Memory Hint</span>
                                            <h3 className="text-3xl sm:text-4xl font-bold text-gray-700 font-handwritten leading-relaxed">
                                                "{item.mnemonic || 'Visualization coming soon...'}"
                                            </h3>
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
                            </div>
                        ) : activeTab === 'practice' ? (
                            <div className="w-full animate-fade-in">
                                <WritingCanvas char={item.char} />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-start space-y-4 animate-fade-in min-h-[300px] overflow-y-auto pr-2">
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Unlocked Vocabulary</h3>

                                {item.examples && item.examples.length > 0 ? (
                                    <div className="grid grid-cols-1 w-full gap-3">
                                        {item.examples.map((ex, idx) => (
                                            <div key={idx} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-2xl font-bold text-gray-800 jp-font">{ex.kana}</span>
                                                    <span className="text-xs text-gray-400 font-bold">{ex.word}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-pink-500 font-medium text-lg capitalize">{ex.meaning}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 space-y-2">
                                        <BookOpen className="w-12 h-12 opacity-20" />
                                        <p>No words unlocked yet.</p>
                                        <p className="text-xs">Keep learning to find words!</p>
                                    </div>
                                )}
                            </div>
                        )}
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
                            <div className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'memory' ? 'bg-pink-400' : 'bg-gray-200'}`}></div>
                            <div className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'practice' ? 'bg-pink-400' : 'bg-gray-200'}`}></div>
                            <div className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'words' ? 'bg-pink-400' : 'bg-gray-200'}`}></div>
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

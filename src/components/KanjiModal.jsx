import React from 'react';
import { X, BookOpen } from 'lucide-react';

const KanjiModal = ({ kanji, onClose }) => {
    if (!kanji) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#FDF6E3] dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in border-4 border-white/50 dark:border-slate-700">

                {/* Header / Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors z-10"
                >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto md:overflow-visible">

                    {/* Left Side: The Character */}
                    <div className="w-full md:w-5/12 bg-amber-100/50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-200/50 dark:border-slate-700">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white dark:bg-slate-800 rounded-3xl shadow-inner flex items-center justify-center mb-6 border border-white/60">
                            <span className="text-8xl sm:text-9xl font-black text-[#4A3B52] dark:text-amber-100 jp-font">
                                {kanji.char}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 text-center mb-2">{kanji.meaning}</h2>
                        <span className="px-3 py-1 bg-amber-200/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-bold uppercase tracking-wide">
                            {kanji.category}
                        </span>
                    </div>

                    {/* Right Side: Details */}
                    <div className="w-full md:w-7/12 p-6 md:p-8 bg-white/60 dark:bg-slate-800/60">

                        {/* Readings Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Readings</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30">
                                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">Onyomi (Chinese)</span>
                                    <div className="text-xl font-bold text-pink-700 dark:text-pink-300">
                                        {kanji.onyomi.join(' / ')}
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">Kunyomi (Japanese)</span>
                                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                        {kanji.kunyomi.join(' / ')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Examples Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Common Words</h3>
                            <div className="space-y-3">
                                {kanji.examples.map((ex, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-[#4A3B52] dark:text-gray-200 jp-font">{ex.word}</span>
                                            <span className="text-xs text-gray-400">{ex.reading}</span>
                                        </div>
                                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{ex.meaning}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanjiModal;

import React from 'react';

const KanjiCard = ({ kanji, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative w-full aspect-square cursor-pointer perspective"
        >
            <div className="w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center p-2">

                {/* Category Tag */}
                <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-amber-500/80 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                    {kanji.category}
                </div>

                {/* Character */}
                <div className="text-5xl sm:text-6xl font-black text-[#4A3B52] dark:text-amber-100 jp-font mb-1 group-hover:scale-110 transition-transform duration-300">
                    {kanji.char}
                </div>

                {/* Meaning */}
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 text-center leading-tight px-1">
                    {kanji.meaning}
                </div>

                {/* Hover Overlay for Readings (Desktop) */}
                <div className="absolute inset-0 bg-amber-50/95 dark:bg-slate-800/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    <div className="mb-2">
                        <span className="text-xs text-gray-400 uppercase block mb-0.5">Onyomi</span>
                        <span className="text-sm font-bold text-pink-500">{kanji.onyomi.join(', ')}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 uppercase block mb-0.5">Kunyomi</span>
                        <span className="text-sm font-bold text-blue-500">{kanji.kunyomi.join(', ')}</span>
                    </div>
                    <div className="mt-3 text-xs text-amber-600 font-medium">Click for details</div>
                </div>
            </div>
        </div>
    );
};

export default KanjiCard;

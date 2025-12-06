import React from 'react';

const KanaCard = ({ char, romaji, type = 'hiragana' }) => {
    const isHiragana = type === 'hiragana';
    const baseColor = isHiragana ? 'bg-pink-100' : 'bg-purple-100';
    const borderColor = isHiragana ? 'border-pink-200' : 'border-purple-200';
    const textColor = isHiragana ? 'text-pink-600' : 'text-purple-600';
    const shadowColor = isHiragana ? 'shadow-pink-200/50' : 'shadow-purple-200/50';

    return (
        <div
            className={`
        group relative flex flex-col items-center justify-center 
        w-20 h-24 sm:w-24 sm:h-28 rounded-2xl 
        ${baseColor}/40 backdrop-blur-sm border ${borderColor}
        shadow-lg ${shadowColor}
        transition-all duration-300 ease-out
        hover:scale-110 hover:-translate-y-1 hover:bg-white/60
        cursor-pointer select-none
      `}
        >
            <div className={`text-4xl sm:text-5xl font-bold ${textColor} jp-font drop-shadow-sm group-hover:drop-shadow-md transition-all`}>
                {char}
            </div>

            <div className={`
        absolute bottom-2 text-sm sm:text-base font-medium text-gray-500
        opacity-0 transform translate-y-2 
        group-hover:opacity-100 group-hover:translate-y-0 
        transition-all duration-300 delay-75
      `}>
                {romaji}
            </div>

            {/* Sparkle effect on hover */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 text-xs">
                ✨
            </div>
        </div>
    );
};

export default KanaCard;

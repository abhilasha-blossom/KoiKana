import React from 'react';
// import { Volume2 } from 'lucide-react';

const KanaCard = ({ char, romaji, type = 'hiragana', onClick }) => {
    const isHiragana = type === 'hiragana';

    // Colors
    const baseColor = isHiragana ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-[#E6E6FA] dark:bg-indigo-900/30'; // Lavender
    const borderColor = isHiragana ? 'border-pink-200 dark:border-pink-700/50' : 'border-[#D8BFD8] dark:border-indigo-700/50'; // Thistle
    const textColor = isHiragana ? 'text-pink-600 dark:text-pink-300' : 'text-[#9370DB] dark:text-indigo-300'; // Medium Purple
    const glowColor = isHiragana ? 'shadow-pink-300 dark:shadow-pink-900' : 'shadow-purple-300 dark:shadow-indigo-900';

    // Audio handler was removed as the button is currently hidden/unused.

    return (
        <div
            onClick={onClick}
            className="group [perspective:1000px] w-20 h-24 sm:w-24 sm:h-28 cursor-pointer relative"
        >
            {/* Card Inner Container - The flipper */}
            <div className={`
                relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]
                group-hover:[transform:rotateY(180deg)]
                rounded-2xl shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]
                ${glowColor}/40 group-hover:${glowColor}
            `}>

                {/* FRONT SIDE (Character) */}
                <div className={`
                    absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl
                    flex flex-col items-center justify-center
                    ${baseColor}/60 backdrop-blur-sm border ${borderColor}
                    z-20
                `}>
                    <div className={`text-4xl sm:text-5xl font-bold ${textColor} jp-font drop-shadow-sm mb-1`}>
                        {char}
                    </div>
                </div>

                {/* BACK SIDE (Romaji) */}
                <div className={`
                    absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl
                    flex items-center justify-center [transform:rotateY(180deg)]
                    bg-white/90 dark:bg-slate-800/90 border ${borderColor}
                    z-10
                `}>
                    <div className={`text-3xl font-bold ${textColor} tracking-wider`}>
                        {romaji}
                    </div>
                </div>

            </div>

            {/* Audio Button - Now outside the flipper so it stays visible */}
            {/* <button
                onClick={handlePlayAudio}
                className={`
                    absolute bottom-2 right-2 p-2 rounded-full 
                    bg-white dark:bg-slate-700 shadow-md text-gray-500 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400
                    transition-all duration-300 transform
                    hover:scale-110 active:scale-95 z-30
                `}
                title={`Pronounce ${romaji}`}
            >
                <Volume2 size={16} />
            </button> */}
        </div>
    );
};

export default KanaCard;

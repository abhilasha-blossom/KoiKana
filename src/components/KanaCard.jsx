import React from 'react';

const KanaCard = ({ char, romaji, type = 'hiragana' }) => {
    const isHiragana = type === 'hiragana';

    // Colors
    const baseColor = isHiragana ? 'bg-pink-100' : 'bg-[#E6E6FA]'; // Lavender
    const borderColor = isHiragana ? 'border-pink-200' : 'border-[#D8BFD8]'; // Thistle
    const textColor = isHiragana ? 'text-pink-600' : 'text-[#9370DB]'; // Medium Purple
    const glowColor = isHiragana ? 'shadow-pink-300' : 'shadow-purple-300';

    return (
        <div className="group [perspective:1000px] w-20 h-24 sm:w-24 sm:h-28 cursor-pointer">
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
                    flex items-center justify-center
                    ${baseColor}/60 backdrop-blur-sm border ${borderColor}
                    z-20
                `}>
                    <div className={`text-4xl sm:text-5xl font-bold ${textColor} jp-font drop-shadow-sm`}>
                        {char}
                    </div>
                </div>

                {/* BACK SIDE (Romaji) */}
                <div className={`
                    absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl
                    flex items-center justify-center [transform:rotateY(180deg)]
                    bg-white/90 border ${borderColor}
                    z-10
                `}>
                    <div className={`text-3xl font-bold ${textColor} tracking-wider`}>
                        {romaji}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default KanaCard;

import React, { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
import { CheckCircle, Heart, Star } from 'lucide-react';

const MemoryGame = ({ pool, onComplete }) => {
    const { playSound } = useAudio();
    const [cards] = useState(() => {
        // Select 8 pairs for 16 cards (or 6 for 12, etc.)
        const numPairs = 8; // 16 cards total (4x4 grid)
        const shuffledPool = [...pool].sort(() => Math.random() - 0.5).slice(0, numPairs);

        // Create pairs: One Kana, One Romaji
        const deck = [];
        shuffledPool.forEach((item) => {
            // Card 1: Kana
            deck.push({
                id: item.char + '-kana',
                content: item.char,
                type: 'kana',
                pairId: item.char,
                isFlipped: false
            });
            // Card 2: Romaji
            deck.push({
                id: item.char + '-romaji',
                content: item.romaji,
                type: 'romaji',
                pairId: item.char,
                isFlipped: false
            });
        });

        // Shuffle Deck
        return deck.sort(() => Math.random() - 0.5);
    });

    const [flipped, setFlipped] = useState([]); // [index1, index2]
    const [matched, setMatched] = useState([]); // [id1, id2, ...]
    const [disabled, setDisabled] = useState(false);

    // Handle Click
    const handleClick = (index) => {
        if (disabled || flipped.includes(index) || matched.includes(cards[index].pairId)) return;

        playSound('pop');
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [firstIndex, secondIndex] = newFlipped;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            // Check Match
            if (firstCard.pairId === secondCard.pairId) {
                // Match!
                setTimeout(() => {
                    playSound('correct');
                    setMatched(prev => [...prev, firstCard.pairId]);
                    setFlipped([]);
                    setDisabled(false);
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    playSound('hover'); // Mild error sound or distinct sound
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    // Check Completion
    useEffect(() => {
        if (matched.length > 0 && matched.length * 2 === cards.length) {
            // Won!
            onComplete(matched.length * 10); // Score based on matches
        }
    }, [matched, cards, onComplete]);

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl">
            {cards.map((card, index) => {
                const isFlipped = flipped.includes(index) || matched.includes(card.pairId);
                return (
                    <button
                        key={card.id}
                        onClick={() => handleClick(index)}
                        className="relative aspect-square rounded-2xl perspective w-full h-full outline-none focus:outline-none"
                        style={{ perspective: '1000px' }}
                    >
                        {/* Inner Container for Flip Effect */}
                        <div
                            className={`
                                w-full h-full relative transition-all duration-500
                                ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
                            `}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front (Cover) - CONCEPT C: CUTE POP */}
                            <div
                                className="absolute inset-0 z-10 bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC] rounded-[1.5rem] flex items-center justify-center shadow-[0_4px_15px_rgba(255,182,193,0.4)] border-4 border-white overflow-hidden group-hover:scale-105 transition-all"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                {/* Floating Background Elements */}
                                <div className="absolute top-2 left-2 text-white/60 animate-bounce-in delay-100"><Heart className="w-4 h-4 fill-white" /></div>
                                <div className="absolute bottom-3 right-3 text-white/60 animate-bounce-in delay-300"><Star className="w-5 h-5 fill-white" /></div>
                                <div className="absolute top-1/2 right-2 text-white/40"><div className="w-2 h-2 bg-white rounded-full"></div></div>

                                <span className="text-5xl text-white drop-shadow-sm transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🌸</span>
                            </div>

                            {/* Back (Content) - CONCEPT C: CUTE POP */}
                            <div
                                className={`
                                    absolute inset-0
                                    bg-white/95 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center
                                    border-4 ${matched.includes(card.pairId) ? 'border-[#B5FFFC] bg-green-50' : 'border-[#FFDEE9]'}
                                    shadow-md overflow-hidden
                                `}
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <span className={`font-black text-[#5D4E6D] select-none ${card.type === 'kana' ? 'text-5xl jp-font' : 'text-2xl font-bold tracking-wider'}`}>
                                    {card.content}
                                </span>
                                {matched.includes(card.pairId) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-[#B5FFFC] animate-scale-in drop-shadow-md">
                                        <CheckCircle className="w-16 h-16 fill-green-400 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default MemoryGame;

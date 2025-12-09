import React, { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
import { CheckCircle } from 'lucide-react';

const MemoryGame = ({ pool, onComplete }) => {
    const { playSound } = useAudio();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]); // [index1, index2]
    const [matched, setMatched] = useState([]); // [id1, id2, ...]
    const [disabled, setDisabled] = useState(false);
    const [gridSize, setGridSize] = useState(4); // 4x4 grid usually good

    // Initialize Game
    useEffect(() => {
        // Select 8 pairs for 16 cards (or 6 for 12, etc.)
        const numPairs = 6; // 12 cards total, fits nicely on mobile/desktop
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
        setCards(deck.sort(() => Math.random() - 0.5));
        setMatched([]);
        setFlipped([]);
    }, [pool]);

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
    }, [matched, cards]);

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
                            {/* Front (Cover) - Visible initially */}
                            <div
                                className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center border-[3px] border-white/40 shadow-lg overflow-hidden group-hover:brightness-110 transition-all"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                <span className="text-4xl text-white drop-shadow-md transform group-hover:scale-125 transition-transform duration-300">🌸</span>
                            </div>

                            {/* Back (Content) - Hidden initially, visible when flipped */}
                            <div
                                className={`
                                    absolute inset-0
                                    bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center
                                    border-[3px] ${matched.includes(card.pairId) ? 'border-green-400 bg-green-50' : 'border-indigo-100'}
                                    shadow-lg overflow-hidden
                                `}
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <span className={`font-black text-[#4A3B52] drop-shadow-sm select-none ${card.type === 'kana' ? 'text-5xl jp-font' : 'text-2xl'}`}>
                                    {card.content}
                                </span>
                                {matched.includes(card.pairId) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-green-500/40 animate-pulse bg-green-100/20 backdrop-blur-[1px]">
                                        <CheckCircle className="w-16 h-16 drop-shadow-lg" />
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

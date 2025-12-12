import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Play, RotateCcw, Utensils, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';
import { hiragana, katakana } from '../data/kanaData';

// Game Constants
const BELT_SPEED = 1; // px per tick (can increase with difficulty)

const SUSHI_TYPES = [
    { type: 'salmon', color: 'bg-orange-400', detail: 'bg-orange-200' }, // Nigiri
    { type: 'tuna', color: 'bg-red-500', detail: 'bg-red-300' }, // Nigiri
    { type: 'egg', color: 'bg-yellow-300', detail: 'bg-black' }, // Tamago (black strip)
    { type: 'shrimp', color: 'bg-rose-300', detail: 'bg-white' }, // Ebi
    { type: 'maki', color: 'bg-black', detail: 'bg-green-400' }, // Maki Roll
];

const SushiGamePage = () => {
    const { theme } = useTheme();
    const { playSound } = useAudio();

    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [input, setInput] = useState('');
    const [plates, setPlates] = useState([]); // { id, char, x, speed, sushiType }
    const [collectedSushi, setCollectedSushi] = useState([]); // Array of eaten sushi types

    const requestRef = useRef();
    const lastSpawnTime = useRef(0);

    const location = useLocation();
    const scriptType = location.state?.scriptType || 'mix'; // 'hiragana', 'katakana', 'mix'

    // Filter Kana for game
    const gameKana = useMemo(() => {
        let pool = [];
        if (scriptType === 'hiragana' || scriptType === 'mix') pool = [...pool, ...hiragana];
        if (scriptType === 'katakana' || scriptType === 'mix') pool = [...pool, ...katakana];
        return pool.filter(k => k.type === 'gojuon');
    }, [scriptType]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(3);
        setPlates([]);
        setCollectedSushi([]);
        setInput('');
        playSound('pop');
        lastSpawnTime.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnPlate = () => {
        const randomKana = gameKana[Math.floor(Math.random() * gameKana.length)];
        const randomSushi = SUSHI_TYPES[Math.floor(Math.random() * SUSHI_TYPES.length)];

        const newPlate = {
            id: Date.now() + Math.random(),
            char: randomKana.char,
            romaji: randomKana.romaji,
            x: window.innerWidth + 50, // Start off-screen right
            speed: 1.5 + (score / 100), // Speed up slightly as score increases
            sushi: randomSushi
        };
        setPlates(prev => [...prev, newPlate]);
    };

    const gameLoop = useCallback((time) => {
        if (gameState !== 'playing') return;

        // Spawn logic
        if (time - lastSpawnTime.current > Math.max(800, 2000 - (score * 5))) {
            spawnPlate();
            lastSpawnTime.current = time;
        }

        setPlates(prevPlates => {
            const nextPlates = [];
            let lifeLost = false;

            prevPlates.forEach(plate => {
                const nextX = plate.x - plate.speed;

                // Check missed
                if (nextX < -100) {
                    lifeLost = true;
                } else {
                    nextPlates.push({ ...plate, x: nextX });
                }
            });

            if (lifeLost) {
                setLives(l => {
                    const newLives = l - 1;
                    if (newLives <= 0) {
                        setGameState('gameover');
                        playSound('incorrect');
                    } else {
                        playSound('incorrect');
                    }
                    return newLives;
                });
            }

            return nextPlates;
        });

        if (lives > 0) {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    }, [gameState, score, lives]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, gameLoop]);


    const handleInput = (e) => {
        const val = e.target.value.toLowerCase();
        setInput(val);

        const matchIndex = plates.findIndex(p => p.romaji === val);
        if (matchIndex !== -1) {
            // Success!
            const plate = plates[matchIndex];
            setScore(s => s + 10);

            // Add to collection
            setCollectedSushi(prev => [...prev, plate.sushi]);

            setPlates(prev => prev.filter((_, i) => i !== matchIndex));
            setInput(''); // Clear input
            playSound('correct');
        }
    };

    // Helper to render proper sushi CSS
    const renderSushi = (sushi) => {
        if (sushi.type === 'maki') {
            return (
                <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center border-4 border-black">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full ${sushi.detail}`}></div>
                    </div>
                </div>
            );
        }
        // Nigiri Style
        return (
            <div className="relative w-20 h-10 bg-white rounded-full shadow-sm mt-4">
                {/* Topping */}
                <div className={`absolute -top-3 left-0 w-full h-8 ${sushi.color} rounded-full rotate-1 shadow-sm`}>
                    {/* Detail Stripe */}
                    {sushi.type !== 'egg' && <div className="absolute top-2 left-2 w-16 h-1 bg-white/30 rounded-full"></div>}
                    {sushi.type === 'egg' && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-black"></div>}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${theme.background} relative overflow-hidden font-sans`}>
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
                <Link to="/quiz" className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <div className="flex gap-4">
                    <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-pink-500 shadow-sm">
                        Score: {score}
                    </div>
                    <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-red-500 shadow-sm flex items-center gap-1">
                        <Heart size={16} fill="currentColor" /> {lives}
                    </div>
                </div>
            </div>

            {/* Game Content */}
            <div className="w-full h-screen flex flex-col justify-center relative">

                {/* Visual: Conveyor Belt */}
                <div className="w-full h-40 bg-[#e0e0e0] border-y-8 border-[#d0d0d0] relative flex items-center mb-20 overflow-hidden shadow-inner">
                    {/* Moving Track Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#000_20px,#000_22px)] animate-conveyor"></div>

                    {/* Plates */}
                    {plates.map(plate => (
                        <div
                            key={plate.id}
                            style={{ left: plate.x, position: 'absolute' }}
                            className="flex flex-col items-center transition-transform"
                        >
                            {/* Plate */}
                            <div className="w-24 h-24 rounded-full bg-stone-200 shadow-xl border-4 border-white flex flex-col items-center justify-center relative">
                                {/* Sushi Graphic */}
                                <div className="scale-75 mb-1">
                                    {renderSushi(plate.sushi)}
                                </div>
                                {/* Kana Bubble */}
                                <div className="absolute -top-8 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-md border border-gray-200">
                                    <span className="text-2xl font-black text-gray-800">{plate.char}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area (Centered) */}
                <div className="w-full max-w-md mx-auto relative z-30">
                    <div className="text-center mb-4">
                        <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                            Type the Romaji!
                        </span>
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInput}
                        autoFocus={gameState === 'playing'}
                        placeholder={gameState === 'playing' ? "Type here..." : ""}
                        disabled={gameState !== 'playing'}
                        className="w-full text-center text-3xl font-bold py-4 rounded-2xl border-4 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none shadow-xl transition-all"
                    />
                </div>

                {/* Overlays */}
                {gameState === 'menu' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full animate-scale-up">
                            <Utensils size={48} className="mx-auto text-pink-500 mb-4" />
                            <h1 className="text-4xl font-black text-gray-800 mb-2">Sushi Go!</h1>
                            <p className="text-gray-500 mb-8">Type the Romaji before the sushi disappears!</p>
                            <button
                                onClick={startGame}
                                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition-transform active:scale-95 text-xl flex items-center justify-center gap-2"
                            >
                                <Play size={24} fill="currentColor" /> Start Eating
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-[2rem] text-center shadow-2xl max-w-lg w-full animate-shake relative overflow-hidden">

                            <h1 className="text-4xl font-black text-red-500 mb-2">Ochimashita!</h1>
                            <p className="text-gray-500 font-bold mb-4">You dropped a plate!</p>

                            {/* COLLECTED SUSHI PLATE */}
                            <div className="bg-amber-100 rounded-xl p-4 mb-6 border-2 border-amber-200 shadow-inner max-h-48 overflow-y-auto">
                                <h3 className="text-amber-800 font-bold text-sm mb-2 uppercase tracking-widest">Your Meal</h3>
                                {collectedSushi.length === 0 ? (
                                    <p className="text-gray-400 italic text-sm">You didn&apos;t eat anything...</p>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {collectedSushi.map((s, i) => (
                                            <div key={i} className="scale-50 -m-2">
                                                {renderSushi(s)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="text-2xl font-black text-gray-800 mb-6">Total Score: {score}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={startGame}
                                    className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                                >
                                    Eat More
                                </button>
                                <Link to="/quiz" className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors flex items-center justify-center">
                                    Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SushiGamePage;

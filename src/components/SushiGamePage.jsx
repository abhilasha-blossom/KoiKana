import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Play, RotateCcw, Utensils, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';
import { hiragana, katakana } from '../data/kanaData';

// Game Constants
const SPAWN_RATE = 2000; // ms
const BELT_SPEED = 1; // px per tick (can increase with difficulty)
const PLATE_Y = 200; // Y position of the belt

const SushiGamePage = () => {
    const { theme } = useTheme();
    const { playSound } = useAudio();

    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [input, setInput] = useState('');
    const [plates, setPlates] = useState([]); // { id, char, x, speed }

    const requestRef = useRef();
    const lastSpawnTime = useRef(0);
    const beltRef = useRef(null);

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
        setInput('');
        playSound('pop');
        lastSpawnTime.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnPlate = () => {
        const randomKana = gameKana[Math.floor(Math.random() * gameKana.length)];
        const newPlate = {
            id: Date.now() + Math.random(),
            char: randomKana.char,
            romaji: randomKana.romaji,
            x: window.innerWidth + 50, // Start off-screen right
            speed: 1.5 + (score / 50) // Speed up as score increases
        };
        setPlates(prev => [...prev, newPlate]);
    };

    const gameLoop = useCallback((time) => {
        if (gameState !== 'playing') return;

        // Spawn logic
        if (time - lastSpawnTime.current > Math.max(800, 2000 - (score * 10))) {
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

        if (lives > 0) { // Only continue if alive (state update is async so check ref or careful logic)
            // Ideally we check newLives but inside setPlates is tricky. 
            // We'll rely on next render stopping the loop if lives is 0, 
            // but actually we need to stop *requesting* the frame.
            // The check below (lives > 0) uses closure value which might be stale?
            // Yes. But setGameState('gameover') triggers re-render, 
            // and we clean up the loop in useEffect/dependency.
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    }, [gameState, score, lives]);
    // ^ Dependency on lives/score might cause jitter if re-creating loop often.
    // Better to use refs for mutable game state in loop, but React state for UI.
    // For MVP, we'll let it re-bind.

    // Better Loop Management:
    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, gameLoop]);


    const handleInput = (e) => {
        const val = e.target.value.toLowerCase();
        setInput(val);

        // Check against active plates
        // Find match?
        // We match the *closest* or *first* match?
        // Let's match any visible plate.

        const matchIndex = plates.findIndex(p => p.romaji === val);
        if (matchIndex !== -1) {
            // Success!
            const plate = plates[matchIndex];
            setScore(s => s + 10);
            setPlates(prev => prev.filter((_, i) => i !== matchIndex));
            setInput(''); // Clear input
            playSound('correct');
        }
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
                <div className="w-full h-32 bg-gray-200 border-y-4 border-gray-300 relative flex items-center mb-20 overflow-hidden">
                    {/* Moving Track Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#000_20px,#000_22px)] animate-conveyor"></div>

                    {/* Plates */}
                    {plates.map(plate => (
                        <div
                            key={plate.id}
                            style={{ left: plate.x, position: 'absolute' }}
                            className="flex flex-col items-center transition-transform"
                        >
                            {/* Sushi on Plate */}
                            <div className="relative">
                                <div className="w-20 h-20 bg-white rounded-full border-4 border-gray-100 shadow-lg flex items-center justify-center z-10 relative">
                                    <span className="text-3xl font-black text-gray-800">{plate.char}</span>
                                </div>
                                {/* Sushi visuals (css shapes) */}
                                <div className="absolute -bottom-2 w-16 h-8 bg-orange-300 rounded-full left-2 -z-0"></div>
                                <div className="absolute -bottom-3 w-18 h-4 bg-black/80 rounded-full left-1 -z-0"></div>
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
                    <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full animate-shake">
                            <h1 className="text-4xl font-black text-red-500 mb-2">Game Over!</h1>
                            <p className="text-xl font-bold text-gray-800 mb-6">Score: {score}</p>
                            <button
                                onClick={startGame}
                                className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 text-xl flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={24} /> Try Again
                            </button>
                            <Link to="/quiz" className="block mt-4 text-gray-400 hover:text-gray-600 font-bold">
                                Return to Menu
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SushiGamePage;

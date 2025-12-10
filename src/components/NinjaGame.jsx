import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, X } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import { hiragana, katakana } from '../data/kanaData';

const GAME_WIDTH = 400; // or 100%
const GAME_HEIGHT = 600;
const SPAWN_RATE = 2000; // ms

const NinjaGame = ({ onExit }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [enemies, setEnemies] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [gameOver, setGameOver] = useState(false);

    // Refs for Game Loop State
    const requestRef = useRef();
    const lastSpawnTime = useRef(0);
    const scoreRef = useRef(0);
    const livesRef = useRef(3);
    const enemiesRef = useRef([]); // Sync with state for loop access
    const gameAreaRef = useRef(null);
    const { playSound } = useAudio();

    // Focus Management
    const inputRef = useRef(null);
    useEffect(() => {
        if (isPlaying && !gameOver) {
            inputRef.current?.focus();
        }
    }, [isPlaying, gameOver]);

    // Keep focus even if user clicks elsewhere in game area
    const handleGameAreaClick = () => {
        inputRef.current?.focus();
    };

    // Game Loop
    const animate = (time) => {
        if (!processRef.current) return; // Stop if unmounted/stopped

        // Spawn
        if (time - lastSpawnTime.current > (2000 - Math.min(1500, scoreRef.current * 10))) {
            // Spawn rate increases with score
            spawnEnemy();
            lastSpawnTime.current = time;
        }

        // Update positions
        enemiesRef.current = enemiesRef.current.map(e => ({
            ...e,
            y: e.y + e.speed
        })).filter(e => {
            if (e.y > GAME_HEIGHT) {
                handleMiss();
                return false;
            }
            return true;
        });

        setEnemies([...enemiesRef.current]); // Update UI
        requestRef.current = requestAnimationFrame(animate);
    };

    const processRef = useRef(false); // Flag to control loop

    const spawnEnemy = () => {
        const pool = [...hiragana, ...katakana];
        const randomChar = pool[Math.floor(Math.random() * pool.length)];

        const newEnemy = {
            id: Date.now() + Math.random(),
            char: randomChar.char,
            romaji: randomChar.romaji,
            x: Math.random() * (GAME_WIDTH - 60),
            y: -50,
            speed: 1 + (scoreRef.current / 50) * 0.5
        };

        enemiesRef.current.push(newEnemy);
    };

    const handleMiss = () => {
        livesRef.current -= 1;
        setLives(livesRef.current);
        playSound('error');
        if (livesRef.current <= 0) endGame();
    };

    const endGame = () => {
        processRef.current = false;
        setGameOver(true);
        setIsPlaying(false);
        cancelAnimationFrame(requestRef.current);
    };

    const handleInput = (e) => {
        const val = e.target.value.toLowerCase();
        setInputValue(val);

        // Check Match against REF
        const matchIndex = enemiesRef.current.findIndex(e => e.romaji === val);
        if (matchIndex !== -1) {
            // Hit!
            enemiesRef.current.splice(matchIndex, 1);
            setEnemies([...enemiesRef.current]); // Sync UI

            scoreRef.current += 10;
            setScore(scoreRef.current);
            setInputValue("");
            playSound('success');
        }
    };

    const startGame = () => {
        scoreRef.current = 0;
        livesRef.current = 3;
        enemiesRef.current = [];

        setScore(0);
        setLives(3);
        setEnemies([]);
        setGameOver(false);
        setIsPlaying(true);

        processRef.current = true;
        lastSpawnTime.current = performance.now();
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        // Cleanup function to stop animation frame when component unmounts
        return () => {
            processRef.current = false;
            cancelAnimationFrame(requestRef.current);
        };
    }, []); // Run once on mount for cleanup setup

    return (
        <div
            className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-white rounded-xl overflow-hidden relative"
            onClick={handleGameAreaClick}
        >
            {/* Header */}
            <div className="absolute top-0 inset-x-0 h-16 bg-slate-800 flex items-center justify-between px-6 z-10">
                <div className="font-bold text-xl text-yellow-400">Score: {score}</div>
                <div className="flex gap-2 text-red-400 text-2xl">
                    {'❤️'.repeat(lives)}
                </div>
                <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Game Area */}
            <div
                ref={gameAreaRef}
                className="relative w-full max-w-[400px] h-full overflow-hidden bg-[url('/patterns/seigaiha_dark.png')]"
                style={{ height: GAME_HEIGHT }}
            >
                {enemies.map(e => (
                    <div
                        key={e.id}
                        className="absolute flex items-center justify-center w-12 h-12 bg-white text-slate-900 rounded-full shadow-lg border-2 border-indigo-500 font-bold text-2xl animate-spin-slow-reverse"
                        style={{ top: e.y, left: e.x }}
                    >
                        {e.char}
                    </div>
                ))}

                {/* Game Over Screen */}
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20">
                        <h2 className="text-4xl font-black text-red-500 mb-4">GAME OVER</h2>
                        <p className="text-2xl mb-8">Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold text-lg flex items-center gap-2"
                        >
                            <RefreshCw /> Retry
                        </button>
                    </div>
                )}

                {/* Start Screen */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20 p-6 text-center">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-2">KANA NINJA</h1>
                        <p className="text-gray-300 mb-6 text-lg">Type the Romaji for the falling characters!</p>

                        <div className="bg-slate-800 p-4 rounded-xl mb-8 text-left space-y-2 border border-slate-700 max-w-xs w-full">
                            <h3 className="font-bold text-pink-400 border-b border-slate-700 pb-1 mb-2">How to Play:</h3>
                            <p className="text-sm text-gray-400">1. Look at the falling character (e.g., <span className="text-white">あ</span>)</p>
                            <p className="text-sm text-gray-400">2. Type its sound (e.g., <span className="text-white">"a"</span>)</p>
                            <p className="text-sm text-gray-400">3. Don't let them hit the bottom!</p>
                        </div>

                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 group"
                        >
                            <Play className="fill-current w-6 h-6 group-hover:ml-1 transition-all" /> START MISSION
                        </button>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-800 z-10 flex justify-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    placeholder={isPlaying ? "Type Romaji..." : "Press Start"}
                    className="w-full max-w-sm px-6 py-3 rounded-full bg-slate-700 text-white text-center font-mono text-xl focus:outline-none focus:ring-4 focus:ring-pink-500 border-none placeholder-gray-500"
                    autoFocus
                    disabled={!isPlaying}
                />
            </div>
        </div>
    );
};

export default NinjaGame;

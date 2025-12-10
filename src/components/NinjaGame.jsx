import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, X } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import * as kData from '../data/kanaData';

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
    const [highScores, setHighScores] = useState([]);

    // Focus Management
    const inputRef = useRef(null);
    const gameAreaRef = useRef(null);

    // Game Loop Refs
    const enemiesRef = useRef([]);
    const scoreRef = useRef(0);
    const livesRef = useRef(3);
    const lastSpawnTime = useRef(0);
    const requestRef = useRef(null);
    const processRef = useRef(false);

    useEffect(() => {
        if (isPlaying && !gameOver) {
            inputRef.current?.focus();
        }
    }, [isPlaying, gameOver]);

    // Keep focus even if user clicks elsewhere in game area
    const handleGameAreaClick = () => {
        inputRef.current?.focus();
    };

    // Load High Scores
    useEffect(() => {
        try {
            console.log("Ninja Game Mounted. Data checks:", { h: kData.hiragana?.length, k: kData.katakana?.length });
            const saved = localStorage.getItem('koikana_ninja_scores');
            if (saved) {
                setHighScores(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load scores:", e);
            localStorage.removeItem('koikana_ninja_scores'); // Clear corrupt data
        }
    }, []);

    const saveHighScore = (finalScore) => {
        const newScores = [...highScores, { score: finalScore, date: new Date().toISOString() }];
        newScores.sort((a, b) => b.score - a.score);
        const top5 = newScores.slice(0, 5);
        setHighScores(top5);
        localStorage.setItem('koikana_ninja_scores', JSON.stringify(top5));
    };

    const endGame = () => {
        processRef.current = false;
        setGameOver(true);
        setIsPlaying(false);
        saveHighScore(scoreRef.current); // Save score
        cancelAnimationFrame(requestRef.current);
    };

    const spawnEnemy = () => {
        console.log("Spawning Enemy!");
        if (!kData.hiragana || !kData.katakana) {
            console.error("Critical: Kana data missing in spawn!");
            return;
        }
        const pool = [...kData.hiragana, ...kData.katakana];
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

    const animate = (time) => {
        if (!processRef.current) return;

        // Spawn Logic
        if (time - lastSpawnTime.current > SPAWN_RATE) {
            spawnEnemy();
            lastSpawnTime.current = time;
        }

        // Move Enemies
        const nextEnemies = enemiesRef.current.map(e => ({
            ...e,
            y: e.y + e.speed
        }));

        // Check Collisions (Bottom)
        const survivors = [];
        let hitBottom = false;

        nextEnemies.forEach(e => {
            if (e.y > GAME_HEIGHT) {
                hitBottom = true;
            } else {
                survivors.push(e);
            }
        });

        if (hitBottom) {
            playSound('incorrect');
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
                endGame();
                return; // Stop loop
            }
        }

        enemiesRef.current = survivors;
        setEnemies([...enemiesRef.current]);

        requestRef.current = requestAnimationFrame(animate);
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
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20 p-6">
                        <h2 className="text-4xl font-black text-red-500 mb-2">GAME OVER</h2>
                        <p className="text-xl mb-6">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>

                        {/* Leaderboard */}
                        <div className="bg-slate-800 p-4 rounded-xl w-full max-w-xs mb-6 border border-slate-700">
                            <h3 className="text-pink-400 font-bold mb-2 border-b border-slate-700 pb-1 flex items-center gap-2">
                                🏆 High Scores
                            </h3>
                            <div className="space-y-1">
                                {highScores.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No scores yet!</p>
                                ) : (
                                    highScores.map((s, i) => (
                                        <div key={i} className={`flex justify-between text-sm ${s.score === score && i === 0 ? 'text-yellow-300 font-bold animate-pulse' : 'text-gray-300'}`}>
                                            <span>#{i + 1} Ninja</span>
                                            <span>{s.score}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                        >
                            <RefreshCw className="w-5 h-5" /> Retry Mission
                        </button>
                    </div>
                )}

                {/* Start Screen - Absolute Overlay inside Container */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center z-20 p-6 text-center animate-fade-in">
                        <div className="mb-4 relative">
                            <div className="absolute inset-0 bg-pink-500 blur-[40px] opacity-20 rounded-full animate-pulse-slow"></div>
                            <h1 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2 drop-shadow-sm">
                                KANA NINJA
                            </h1>
                        </div>

                        <p className="text-gray-300 mb-8 text-xl max-w-md leading-relaxed">
                            Defend the dojo! Type the <span className="text-pink-400 font-bold">Romaji</span> for each falling character before it hits the ground.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full max-w-2xl bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-md mb-8">
                            <div className="flex-1 text-left space-y-3">
                                <h3 className="font-bold text-lg text-pink-400 flex items-center gap-2">
                                    <span className="bg-pink-500/10 p-1 rounded">🎯</span> How to Play
                                </h3>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>See character (<span className="text-white font-bold">あ</span>)</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>Type sound (<span className="text-white font-bold">"a"</span>)</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>Don't let them fall!</li>
                                </ul>
                            </div>

                            <div className="w-px bg-slate-700 hidden md:block"></div>

                            <div className="flex-1 flex flex-col justify-center gap-4">
                                <button
                                    onClick={startGame}
                                    className="w-full py-4 bg-gradient-to-r from-pink-300 to-indigo-300 rounded-full font-black text-xl text-white shadow-xl shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group animate-pulse-slow"
                                >
                                    <Play className="fill-current w-6 h-6 group-hover:ml-1 transition-all" /> START MISSION
                                </button>
                                <p className="text-xs text-gray-500">Highest Score: <span className="text-indigo-400 font-bold">{highScores[0]?.score || 0}</span></p>
                            </div>
                        </div>
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

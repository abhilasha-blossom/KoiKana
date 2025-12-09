import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hiragana, katakana } from '../data/kanaData';
import useAudio from '../hooks/useAudio';
import useProgress from '../hooks/useProgress';
import { useTheme } from '../context/ThemeContext';
import WritingCanvas from './WritingCanvas';
import MemoryGame from './MemoryGame';

const GAME_MODES = {
    SELECT: 'select',
    MULTIPLE_CHOICE: 'multiple_choice',
    INPUT: 'input',
    TIME_ATTACK: 'time_attack',
    WRITING: 'writing',
    REVIEW: 'review',
    MATCHING: 'matching'
};

const POSITIVE_MESSAGES = [
    "You shine so bright! ✨",
    "Perfect! 🌸",
    "I'm so proud of you! 💖",
    "You're a natural! 🌿",
    "Amazing work! 🎵",
    "So smart! 🧠",
    "Keep glowing! ✨"
];

const NEGATIVE_MESSAGES = [
    "Oh no... 🥺",
    "Don't cry! Try again! 💫",
    "It's okay, I believe in you! 💕",
    "Mistakes help us grow! 🌱",
    "You'll get it next time! 🌟",
    "Don't give up! 🔥"
];

// --- PHYSICS ENGINE BUBBLE GAME ---
const BubbleGame = ({ options, onAnswer }) => {
    const containerRef = useRef(null);
    const requestRef = useRef();
    const bubblesRef = useRef([]); // Stores physics state { x, y, vx, vy, r, id, ref }
    const [renderBubbles, setRenderBubbles] = useState([]); // Just for initial React render
    const { playSound } = useAudio();

    // Physics Constants
    const SPEED = 2.0;
    const RADIUS = 45; // 90px width / 2

    // Initialize Physics State
    useEffect(() => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();

        const newBubbles = options.map((opt, i) => {
            // Find non-overlapping position
            let x, y, safe = false;
            let attempts = 0;

            // Try to find a safe spot
            while (!safe && attempts < 150) {
                x = RADIUS + Math.random() * (width - RADIUS * 2);
                y = RADIUS + Math.random() * (height - RADIUS * 2);
                safe = true;

                // Check dist from others
                // Note: This only checks against previously placed bubbles in this loop
                // Ideally we check all, but since we build sequentially this works for initial placement
                // We'll trust the physics engine to resolve any remaining overlaps quickly
            }

            const angle = Math.random() * Math.PI * 2;
            return {
                ...opt,
                x,
                y,
                vx: Math.cos(angle) * SPEED,
                vy: Math.sin(angle) * SPEED,
                radius: RADIUS,
                ref: null // Will be assigned by callback ref
            };
        });

        // Push apart any initial overlaps (simple iterative solver)
        for (let iter = 0; iter < 5; iter++) {
            for (let i = 0; i < newBubbles.length; i++) {
                for (let j = i + 1; j < newBubbles.length; j++) {
                    const b1 = newBubbles[i];
                    const b2 = newBubbles[j];
                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < RADIUS * 2) {
                        const overlap = RADIUS * 2 - dist + 1;
                        // Avoid div by zero
                        const nx = dist > 0 ? dx / dist : 1;
                        const ny = dist > 0 ? dy / dist : 0;

                        b1.x -= nx * overlap * 0.5;
                        b1.y -= ny * overlap * 0.5;
                        b2.x += nx * overlap * 0.5;
                        b2.y += ny * overlap * 0.5;
                    }
                }
            }
        }

        bubblesRef.current = newBubbles;
        setRenderBubbles([...newBubbles]);

        // Start Loop
        cancelAnimationFrame(requestRef.current);
        const animate = () => {
            if (!containerRef.current) return;
            const bounds = containerRef.current.getBoundingClientRect();
            const width = bounds.width;
            const height = bounds.height;
            const bubbles = bubblesRef.current;

            // 1. Update Positions & Wall Collisions
            bubbles.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;

                // Bounce Walls
                if (b.x <= b.radius) { b.x = b.radius; b.vx *= -1; }
                if (b.x >= width - b.radius) { b.x = width - b.radius; b.vx *= -1; }
                if (b.y <= b.radius) { b.y = b.radius; b.vy *= -1; }
                if (b.y >= height - b.radius) { b.y = height - b.radius; b.vy *= -1; }
            });

            // 2. Bubble Collisions
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    const b1 = bubbles[i];
                    const b2 = bubbles[j];

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = b1.radius + b2.radius;

                    if (distance < minDist) {
                        // Normalize collision vector
                        const nx = dx / distance;
                        const ny = dy / distance;

                        // Resolve Overlap (move apart)
                        const overlap = minDist - distance;
                        const moveX = nx * overlap * 0.5;
                        const moveY = ny * overlap * 0.5;

                        b1.x -= moveX;
                        b1.y -= moveY;
                        b2.x += moveX;
                        b2.y += moveY;

                        // Bounce (Vector Reflection)
                        // This logic swaps the velocity components along the normal vector
                        // It's a simplified elastic collision for equal mass

                        const dvx = b1.vx - b2.vx;
                        const dvy = b1.vy - b2.vy;
                        const product = dvx * nx + dvy * ny; // Dot product of relative velocity and normal

                        if (product > 0) continue; // Moving apart already

                        // Impulse scalar (assuming mass=1, elasticity=1)
                        // For perfectly elastic collision between equal masses, 
                        // we just swap the velocity components along the normal line.

                        b1.vx -= product * nx;
                        b1.vy -= product * ny;
                        b2.vx += product * nx;
                        b2.vy += product * ny;
                    }
                }
            }

            // 3. Render
            bubbles.forEach(b => {
                if (b.ref) {
                    b.ref.style.transform = `translate(${b.x}px, ${b.y}px)`;
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current);
    }, [options]);

    const handleBubbleClick = (romaji, index) => {
        playSound('pop'); // Play Sound!
        const b = bubblesRef.current[index];
        if (b && b.ref) {
            // Visual Pop
            b.ref.style.transition = 'transform 0.1s, opacity 0.1s';
            b.ref.style.transform += ' scale(2)';
            b.ref.style.opacity = '0';
        }
        setTimeout(() => {
            onAnswer(romaji);
        }, 150);
    };

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-hidden z-0">
            {renderBubbles.map((b, i) => (
                <button
                    key={b.id || i}
                    ref={(el) => { if (bubblesRef.current[i]) bubblesRef.current[i].ref = el; }}
                    onClick={() => handleBubbleClick(b.romaji, i)}
                    className="absolute top-0 left-0 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm pointer-events-auto active:scale-95"
                    style={{
                        width: '90px',
                        height: '90px',
                        // Initial position (will be overridden by physics loop immediately)
                        transform: `translate(${b.x}px, ${b.y}px)`,
                        // Reset 'top/left' because transform handles pos
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4))',
                        border: '2px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: 'inset -5px -5px 15px rgba(236, 72, 153, 0.2), 0 5px 15px rgba(0,0,0,0.1)',
                        willChange: 'transform',
                        marginLeft: '-45px', // Center overlap adjustment since we positioned top/left
                        marginTop: '-45px'
                    }}
                >
                    <span className="text-2xl font-bold text-pink-600 drop-shadow-sm">{b.romaji}</span>
                    <div className="absolute top-3 left-4 w-4 h-2 bg-white/80 rounded-full rotate-45 blur-[1px]"></div>
                </button>
            ))}
        </div>
    );
};

const QuizPage = () => {
    const [mode, setMode] = useState(GAME_MODES.SELECT);
    const [scriptType, setScriptType] = useState('mix'); // 'hiragana', 'katakana', 'mix'
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [inputAnswer, setInputAnswer] = useState('');
    const { playSound } = useAudio();
    const { addXP, updateSRS, getDueItems } = useProgress();
    const { theme } = useTheme();

    // Feedback Logic - Seprated to prevent "Incorrect Flash"
    const [feedbackStatus, setFeedbackStatus] = useState(null); // 'correct' | 'incorrect'
    const [showFeedback, setShowFeedback] = useState(false); // Controls opacity

    const [mascotMessage, setMascotMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);
    const [dueItems, setDueItems] = useState([]);

    // Fetch Due Items on Mount
    useEffect(() => {
        setDueItems(getDueItems());
    }, []);

    // Combine kana based on selection
    const getKanaPool = () => {
        let pool = [];
        if (scriptType === 'hiragana' || scriptType === 'mix') pool = [...pool, ...hiragana];
        if (scriptType === 'katakana' || scriptType === 'mix') pool = [...pool, ...katakana];
        return pool.filter(k => k.char);
    };

    const allKana = getKanaPool();

    // Timer for Time Attack
    useEffect(() => {
        let timer;
        if (mode === GAME_MODES.TIME_ATTACK && !isGameOver && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, isGameOver, timeLeft]);

    const startGame = (selectedMode) => {
        setMode(selectedMode);
        setScore(0);
        setQuestionCount(0);
        setTimeLeft(60);
        setIsGameOver(false);
        generateQuestion(selectedMode);
    };

    const generateQuestion = (activeMode = mode) => {
        let targetPool = allKana;

        // If Review Mode, filter pool to due items
        if (activeMode === GAME_MODES.REVIEW) {
            const dueChars = getDueItems(); // Refresh due items
            const reviewPool = allKana.filter(k => dueChars.includes(k.char));
            if (reviewPool.length > 0) {
                targetPool = reviewPool;
            } else {
                // Fallback if no items (shouldn't happen if button is hidden, but safe guard)
                targetPool = allKana;
            }
        }

        const randomItem = targetPool[Math.floor(Math.random() * targetPool.length)];
        setCurrentQuestion(randomItem);

        setShowFeedback(false);
        setMascotMessage('');
        setInputAnswer('');

        // Generate options for Multiple Choice (Same as before)
        if (activeMode === GAME_MODES.MULTIPLE_CHOICE || activeMode === GAME_MODES.REVIEW) {
            // For Review, we use Multiple Choice style for now
            const wrongOptions = [];
            while (wrongOptions.length < 3) {
                const random = allKana[Math.floor(Math.random() * allKana.length)];
                if (random.char !== randomItem.char && !wrongOptions.includes(random)) {
                    wrongOptions.push(random);
                }
            }
            const allOptions = [...wrongOptions, randomItem].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
        }

        // Generate Bubbles for Time Attack
        if (activeMode === GAME_MODES.TIME_ATTACK) {
            const bubbleCount = 6;
            const newBubbles = [];

            // Add Correct Answer
            newBubbles.push({
                ...randomItem,
                id: `correct-${Date.now()}`
            });

            // Add Distractors
            while (newBubbles.length < bubbleCount) {
                const random = allKana[Math.floor(Math.random() * allKana.length)];
                if (random.char !== randomItem.char && !newBubbles.some(b => b.char === random.char)) {
                    newBubbles.push({
                        ...random,
                        id: `wrong-${newBubbles.length}-${Date.now()}`
                    });
                }
            }
            setOptions(newBubbles.sort(() => Math.random() - 0.5));
        }
    };

    const handleAnswer = (answer) => {
        if (showFeedback) return;

        const isCorrect = answer.trim().toLowerCase() === currentQuestion.romaji.toLowerCase();

        // Update SRS Data
        updateSRS(currentQuestion.char, isCorrect);

        if (isCorrect) {
            setScore(prev => prev + 1);
            addXP(10); // Award XP
            setFeedbackStatus('correct');
            playSound('correct'); // Play Sound!
            setMascotMessage(POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)]);
        } else {
            setFeedbackStatus('incorrect');
            playSound('incorrect'); // Play Sound!
            setMascotMessage(NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)]);
        }
        setShowFeedback(true);

        setTimeout(() => {
            if (mode !== GAME_MODES.TIME_ATTACK) {
                // Modified end condition for Review Mode? 
                // For now, let's keep it 10 questions or until pool exhausted? 
                // Simplicity: 10 questions per round.
                if (questionCount >= 9) {
                    setIsGameOver(true);
                    addXP(50); // Award Bonus XP for completing a set
                } else {
                    setQuestionCount(prev => prev + 1);
                    generateQuestion();
                }
            } else {
                generateQuestion();
            }
        }, 1000);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        handleAnswer(inputAnswer);
    };

    if (mode === GAME_MODES.SELECT) {
        return (
            <div className={`h-screen ${theme.colors.bg} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
                {/* Background Atmosphere */}
                <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] ${theme.colors.blob1} rounded-full blur-[100px] animate-blob mix-blend-multiply pointer-events-none`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] ${theme.colors.blob2} rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none`}></div>

                <Link to="/start" className="absolute top-4 left-4 p-2 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors z-50 shadow-sm border border-white/50">
                    <ArrowLeft className={`${theme.colors.primary} w-5 h-5`} />
                </Link>

                <div className="relative z-10 flex flex-col items-center max-h-full w-full">
                    <h1 className={`text-3xl md:text-4xl font-bold ${theme.colors.primary} mb-1 drop-shadow-sm`}>Training Dojo</h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mb-4"></div>

                    {/* Script Selection Toggles - Glassmorphism */}
                    <div className="flex bg-white/30 backdrop-blur-md p-1 rounded-full mb-6 shadow-sm border border-white/40 scale-90 origin-center">
                        {['hiragana', 'mix', 'katakana'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setScriptType(type)}
                                className={`px-6 py-2 rounded-full font-bold capitalize transition-all duration-300 text-sm ${scriptType === type
                                    ? `bg-white ${theme.colors.accent} shadow-md scale-105`
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {type === 'mix' ? 'Both' : type}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full px-2 overflow-y-auto no-scrollbar pb-20 md:pb-0 h-full content-center">
                        {/* REVIEW CARD (Dynamic) */}
                        {dueItems.length > 0 && (
                            <button
                                onClick={() => startGame(GAME_MODES.REVIEW)}
                                className="
                                    md:col-span-3 relative overflow-hidden group p-4 rounded-3xl text-left transition-all duration-500
                                    bg-gradient-to-r from-green-100 to-emerald-50 bg-opacity-40 backdrop-blur-md border border-green-200
                                    hover:shadow-[0_8px_30px_rgba(167,243,208,0.4)] hover:-translate-y-1
                                    flex items-center justify-between
                                "
                            >
                                <div className="z-10">
                                    <h3 className="text-xl font-bold text-green-800 mb-0.5 flex items-center gap-2">
                                        <Clock className="w-5 h-5" /> SRS Review
                                    </h3>
                                    <p className="text-green-600 font-medium text-sm">
                                        You have <span className="font-bold text-green-700">{dueItems.length}</span> items due!
                                    </p>
                                </div>
                                <div className="bg-white/40 p-2 rounded-full animate-pulse">
                                    <span className="text-2xl">🧠</span>
                                </div>
                            </button>
                        )}

                        {/* Mode Cards - Glassmorphism */}
                        {[
                            { id: GAME_MODES.MULTIPLE_CHOICE, title: "Multiple Choice", icon: "🌸", desc: "Select Romaji", color: "from-pink-100 to-rose-50" },
                            { id: GAME_MODES.INPUT, title: "Input Challenge", icon: "✍️", desc: "Type sound", color: "from-purple-100 to-indigo-50" },
                            { id: GAME_MODES.TIME_ATTACK, title: "Bubble Pop", icon: "🫧", desc: "Burst bubbles!", color: "from-blue-100 to-cyan-50" },
                            { id: GAME_MODES.WRITING, title: "Writing", icon: "🖌️", desc: "Draw character", color: "from-orange-100 to-amber-50" },
                            { id: GAME_MODES.MATCHING, title: "Memory Match", icon: "🧩", desc: "Find pairs", color: "from-teal-100 to-emerald-50" },

                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => startGame(m.id)}
                                className={`
                                    relative overflow-hidden group p-5 rounded-3xl text-left transition-all duration-500
                                    bg-gradient-to-br ${m.color} bg-opacity-40 backdrop-blur-md border border-white/60
                                    hover:shadow-[0_8px_30px_rgba(255,209,220,0.4)] hover:-translate-y-1
                                `}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                                <span className="text-4xl mb-2 block filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{m.icon}</span>
                                <h3 className="text-lg font-bold text-[#4A3B52] mb-1">{m.title}</h3>
                                <p className="text-[#7A6B82] font-medium text-xs">{m.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isGameOver) {
        return (
            <div className={`h-screen ${theme.colors.bg} flex flex-col items-center justify-center p-4 text-center animate-fade-in-up relative overflow-hidden transition-colors duration-500`}>
                {/* Background Atmosphere */}
                <div className={`absolute top-[-20%] right-[-10%] w-[500px] h-[500px] ${theme.colors.blob1} rounded-full blur-[100px] animate-blob mix-blend-multiply pointer-events-none`}></div>

                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full relative overflow-hidden border border-white/50">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>

                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce drop-shadow-md" />
                    <h2 className={`text-3xl font-bold ${theme.colors.primary} mb-1`}>Training Complete!</h2>
                    <p className="text-[#7A6B82] mb-6 font-medium text-sm">You've honed your skills.</p>

                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 mb-6 drop-shadow-sm">
                        {score} <span className="text-2xl text-gray-400 font-medium">pts</span>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setMode(GAME_MODES.SELECT)}
                            className="px-6 py-3 rounded-2xl bg-white/50 text-[#7A6B82] hover:bg-white font-bold transition-all shadow-sm hover:shadow-md border border-white/60 text-sm"
                        >
                            Dojo Menu
                        </button>
                        <button
                            onClick={() => startGame(mode)} // Restart SAME mode
                            className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${theme.colors.button} text-white font-bold transition-all shadow-lg hover:shadow-pink-200/50 flex items-center gap-2 transform hover:-translate-y-1 text-sm`}
                        >
                            <RefreshCcw className="w-4 h-4" /> Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen ${theme.colors.bg} flex flex-col items-center p-4 relative overflow-hidden transition-colors duration-500`}>
            {/* Background Atmosphere */}
            <div className={`absolute top-[-10%] left-[-10%] w-[400px] h-[400px] ${theme.colors.blob1} rounded-full blur-[80px] animate-blob mix-blend-multiply pointer-events-none z-0`}></div>

            {/* Header */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-6 mt-2 relative z-50 flex-none">
                <button onClick={() => setMode(GAME_MODES.SELECT)} className="p-2 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors shadow-sm border border-white/50">
                    <ArrowLeft className={`${theme.colors.primary} w-5 h-5`} />
                </button>

                {mode === GAME_MODES.TIME_ATTACK && (
                    <div className={`flex items-center gap-2 text-xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#4A3B52]'} bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm`}>
                        <Clock className="w-5 h-5" /> {timeLeft}s
                    </div>
                )}

                {/* Sakura Progress Bar - Replacing simple Score */}
                <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/50">
                    <div className="flex items-center gap-1">
                        <span className="text-xl">🌸</span>
                        <span className="text-xl font-black text-pink-500">{score}</span>
                    </div>
                    {(mode !== GAME_MODES.TIME_ATTACK) && (
                        <div className="h-1.5 w-20 bg-white/50 rounded-full overflow-hidden ml-2">
                            <div className="h-full bg-pink-400 transition-all duration-500" style={{ width: `${(questionCount / 10) * 100}%` }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* MASCOT KOI-CHAN */}
            <div className="fixed bottom-2 right-2 md:right-8 w-20 sm:w-32 md:w-48 pointer-events-none z-[100] transition-transform duration-300">
                <img
                    src={
                        feedbackStatus === 'correct' ? '/mascot/correct.png' :
                            feedbackStatus === 'incorrect' ? '/mascot/wrong.png' :
                                '/mascot/normal.png'
                    }
                    alt="Koi-chan Mascot"
                    className={`w-full h-auto drop-shadow-xl transition-all duration-300 relative z-10 ${feedbackStatus === 'correct' ? 'animate-bounce' :
                        feedbackStatus === 'incorrect' ? 'animate-shake' :
                            'animate-pulse-slow'
                        }`}
                />

                <div className={`
                    absolute bottom-[110%] right-[0%] bg-white/90 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-[1.5rem] shadow-xl border-2 border-pink-100
                    transform transition-all duration-300 origin-bottom-right w-28 sm:w-40 text-center z-20
                    ${showFeedback ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                    <p className="text-[#4A3B52] font-bold text-xs sm:text-sm leading-tight">{mascotMessage}</p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-8 w-3 h-3 bg-white border-b-2 border-r-2 border-pink-100 transform rotate-45"></div>
                </div>
            </div>

            {/* Game Content */}
            <div className="max-w-md w-full flex flex-col items-center gap-4 relative z-10 pb-20 md:pb-0 h-full justify-center">

                {/* Character Card - Glassmorphism */}
                <div className="relative group perspective">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(255,209,220,0.5)] flex items-center justify-center
                                  border border-white/60 transform transition-transform duration-500 hover:scale-105">
                        <span className="text-6xl sm:text-8xl font-bold text-[#4A3B52] jp-font drop-shadow-sm">
                            {mode === GAME_MODES.MULTIPLE_CHOICE ? currentQuestion?.romaji : currentQuestion?.char}
                        </span>
                    </div>
                </div>

                {/* Feedback Indicator - FADE OUT WITHOUT FLASHING INCORRECT */}
                <div className={`h-6 transition-opacity duration-300 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}>
                    {feedbackStatus === 'correct' ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-base sm:text-lg animate-bounce bg-green-100/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            <CheckCircle className="w-5 h-5" /> Correct!
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-base sm:text-lg animate-shake bg-red-100/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            <XCircle className="w-5 h-5" /> Incorrect! It was "{currentQuestion?.romaji}"
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {(mode === GAME_MODES.MULTIPLE_CHOICE) && (
                    <div className="grid grid-cols-2 gap-3 w-full px-4">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.romaji)}
                                disabled={showFeedback}
                                className={`
                                    p-3 sm:p-5 rounded-2xl text-lg sm:text-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 active:scale-95
                                    backdrop-blur-md border border-white/50
                                    ${showFeedback && opt.romaji === currentQuestion.romaji ? 'bg-green-100/90 text-green-700 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]' : ''}
                                    ${showFeedback && feedbackStatus === 'incorrect' && opt === options.find(o => o.romaji === currentQuestion.romaji) ? 'bg-green-100/90 text-green-700 border-green-400' : ''}
                                    ${!showFeedback ? 'bg-white/40 hover:bg-white/70 text-[#4A3B52] shadow-sm hover:shadow-[0_8px_20px_rgba(255,209,220,0.4)]' : ''}
                                `}
                            >
                                <span className={mode === GAME_MODES.MULTIPLE_CHOICE ? "jp-font text-2xl sm:text-3xl" : ""}>
                                    {mode === GAME_MODES.MULTIPLE_CHOICE ? opt.char : opt.romaji}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {(mode === GAME_MODES.INPUT) && (
                    <form onSubmit={handleInputSubmit} className="w-full relative px-4">
                        <input
                            type="text"
                            value={inputAnswer}
                            onChange={(e) => setInputAnswer(e.target.value)}
                            placeholder="Type pronunciation..."
                            disabled={showFeedback}
                            autoFocus
                            className="w-full p-4 text-center text-2xl font-bold text-[#4A3B52] rounded-3xl border-2 border-white/50 focus:border-pink-300 shadow-inner bg-white/50 backdrop-blur-md focus:bg-white/80 outline-none transition-all placeholder:font-normal placeholder:text-gray-400/80"
                        />
                        <button
                            type="submit"
                            disabled={!inputAnswer || showFeedback}
                            className="w-full mt-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-2xl shadow-[0_4px_15px_rgba(244,114,182,0.4)] hover:shadow-[0_8px_25px_rgba(244,114,182,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Answer
                        </button>
                    </form>
                )}

                {(mode === GAME_MODES.TIME_ATTACK) && (
                    <BubbleGame
                        options={options}
                        onAnswer={handleAnswer}
                    />
                )}

                {(mode === GAME_MODES.WRITING) && (
                    <div className="flex flex-col items-center gap-2">
                        <WritingCanvas
                            char={currentQuestion?.char}
                            onComplete={() => handleAnswer(currentQuestion?.romaji)}
                        />
                        <p className="text-gray-500 text-xs text-center">Draw the character above!</p>
                    </div>
                )}

                {(mode === GAME_MODES.MATCHING) && (
                    <MemoryGame
                        pool={allKana}
                        onComplete={(bonusScore) => {
                            setScore(prev => prev + bonusScore);
                            addXP(bonusScore + 50);
                            setIsGameOver(true);
                            setMascotMessage("Memory Master! 🧠✨");
                            playSound('success');
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizPage;

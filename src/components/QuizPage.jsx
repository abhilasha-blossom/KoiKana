import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hiragana, katakana } from '../data/kanaData';

const GAME_MODES = {
    SELECT: 'select',
    MULTIPLE_CHOICE: 'multiple_choice',
    INPUT: 'input',
    TIME_ATTACK: 'time_attack'
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

const QuizPage = () => {
    const [mode, setMode] = useState(GAME_MODES.SELECT);
    const [scriptType, setScriptType] = useState('mix'); // 'hiragana', 'katakana', 'mix'
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [inputAnswer, setInputAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
    const [mascotMessage, setMascotMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);

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
        setIsGameOver(false);
        generateQuestion(selectedMode);
    };

    const generateQuestion = (activeMode = mode) => {
        const randomItem = allKana[Math.floor(Math.random() * allKana.length)];
        setCurrentQuestion(randomItem);
        setFeedback(null);
        setMascotMessage('');
        setInputAnswer('');

        // Generate options for Multiple Choice
        if (activeMode === GAME_MODES.MULTIPLE_CHOICE) {
            const wrongOptions = [];
            while (wrongOptions.length < 3) {
                const random = allKana[Math.floor(Math.random() * allKana.length)];
                if (random.char !== randomItem.char && !wrongOptions.includes(random)) {
                    wrongOptions.push(random);
                }
            }
            // Shuffle correct answer with wrong options
            const allOptions = [...wrongOptions, randomItem].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
        }

        // Generate Bubbles for Time Attack
        if (activeMode === GAME_MODES.TIME_ATTACK) {
            const bubbleCount = 6;
            const newBubbles = [];

            // Add Correct Answer
            newBubbles.push({ ...randomItem, id: 'correct', left: Math.random() * 80 + 10, delay: 0, duration: 4 + Math.random() * 3 });

            // Add Distractors
            while (newBubbles.length < bubbleCount) {
                const random = allKana[Math.floor(Math.random() * allKana.length)];
                if (random.char !== randomItem.char && !newBubbles.some(b => b.char === random.char)) {
                    newBubbles.push({
                        ...random,
                        id: `wrong-${newBubbles.length}`,
                        left: Math.random() * 80 + 10,
                        delay: Math.random() * 2,
                        duration: 4 + Math.random() * 3
                    });
                }
            }
            // Shuffle
            setOptions(newBubbles.sort(() => Math.random() - 0.5));
        }
    };

    const handleAnswer = (answer) => {
        if (feedback) return; // Prevent double clicking

        const isCorrect = answer.toLowerCase() === currentQuestion.romaji.toLowerCase();

        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback('correct');
            setMascotMessage(POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)]);
        } else {
            setFeedback('incorrect');
            setMascotMessage(NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)]);
        }

        // Delay for feedback before next question
        setTimeout(() => {
            if (mode !== GAME_MODES.TIME_ATTACK) {
                // Regular modes limit to 10 questions
                if (questionCount >= 9) {
                    setIsGameOver(true);
                } else {
                    setQuestionCount(prev => prev + 1);
                    generateQuestion();
                }
            } else {
                // Time attack just goes on until time runs out
                generateQuestion();
            }
        }, 1000);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        handleAnswer(inputAnswer);
    };

    // --- RENDER HELPERS ---

    if (mode === GAME_MODES.SELECT) {
        return (
            <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-6 relative overflow-hidden">

                {/* Background Atmosphere */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px] animate-blob mix-blend-multiply"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply"></div>

                <Link to="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors z-10 shadow-sm border border-white/50">
                    <ArrowLeft className="text-[#4A3B52]" />
                </Link>

                <div className="relative z-10 flex flex-col items-center">
                    <h1 className="text-5xl font-bold text-[#4A3B52] mb-3 drop-shadow-sm">Training Dojo</h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mb-8"></div>

                    {/* Script Selection Toggles - Glassmorphism */}
                    <div className="flex bg-white/30 backdrop-blur-md p-1.5 rounded-full mb-12 shadow-sm border border-white/40">
                        {['hiragana', 'mix', 'katakana'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setScriptType(type)}
                                className={`px-8 py-3 rounded-full font-bold capitalize transition-all duration-300 ${scriptType === type
                                    ? 'bg-white text-pink-500 shadow-md scale-105'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {type === 'mix' ? 'Both' : type}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                        {/* Mode Cards - Glassmorphism */}
                        {[
                            { id: GAME_MODES.MULTIPLE_CHOICE, title: "Multiple Choice", icon: "🌸", desc: "Select the correct Romaji", color: "from-pink-100 to-rose-50" },
                            { id: GAME_MODES.INPUT, title: "Input Challenge", icon: "✍️", desc: "Type the pronunciation", color: "from-purple-100 to-indigo-50" },
                            { id: GAME_MODES.TIME_ATTACK, title: "Bubble Pop", icon: "🫧", desc: "Burst bubbles to score!", color: "from-blue-100 to-cyan-50" },
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => startGame(m.id)}
                                className={`
                                    relative overflow-hidden group p-8 rounded-[2.5rem] text-left transition-all duration-500
                                    bg-gradient-to-br ${m.color} bg-opacity-40 backdrop-blur-md border border-white/60
                                    hover:shadow-[0_8px_30px_rgba(255,209,220,0.4)] hover:-translate-y-2
                                `}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>

                                <span className="text-6xl mb-4 block filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{m.icon}</span>
                                <h3 className="text-2xl font-bold text-[#4A3B52] mb-2">{m.title}</h3>
                                <p className="text-[#7A6B82] font-medium">{m.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isGameOver) {
        return (
            <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px] animate-blob mix-blend-multiply"></div>

                <div className="bg-white/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl max-w-md w-full relative overflow-hidden border border-white/50">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>

                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce drop-shadow-md" />
                    <h2 className="text-4xl font-bold text-[#4A3B52] mb-2">Training Complete!</h2>
                    <p className="text-[#7A6B82] mb-8 font-medium">You've honed your skills.</p>

                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 mb-8 drop-shadow-sm">
                        {score} <span className="text-3xl text-gray-400 font-medium">pts</span>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link to="/" className="px-8 py-4 rounded-2xl bg-white/50 text-[#7A6B82] hover:bg-white font-bold transition-all shadow-sm hover:shadow-md border border-white/60">
                            Home
                        </Link>
                        <button
                            onClick={() => setMode(GAME_MODES.SELECT)}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 font-bold transition-all shadow-lg hover:shadow-pink-200/50 flex items-center gap-2 transform hover:-translate-y-1"
                        >
                            <RefreshCcw className="w-5 h-5" /> Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center p-6 relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[80px] animate-blob mix-blend-multiply pointer-events-none z-0"></div>

            {/* Header */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-12 mt-4 relative z-10">
                <button onClick={() => setMode(GAME_MODES.SELECT)} className="p-3 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors shadow-sm border border-white/50">
                    <ArrowLeft className="text-[#4A3B52]" />
                </button>

                {mode === GAME_MODES.TIME_ATTACK && (
                    <div className={`flex items-center gap-2 text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#4A3B52]'} bg-white/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm`}>
                        <Clock className="w-6 h-6" /> {timeLeft}s
                    </div>
                )}

                {/* Sakura Progress Bar - Replacing simple Score */}
                <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-white/50">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">🌸</span>
                        <span className="text-2xl font-black text-pink-500">{score}</span>
                    </div>
                    {(mode !== GAME_MODES.TIME_ATTACK) && (
                        <div className="h-1.5 w-24 bg-white/50 rounded-full overflow-hidden ml-2">
                            <div className="h-full bg-pink-400 transition-all duration-500" style={{ width: `${(questionCount / 10) * 100}%` }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* MASCOT KOI-CHAN */}
            <div className="fixed bottom-0 right-0 md:right-10 w-40 md:w-56 pointer-events-none z-[100] transition-transform duration-300">

                <img
                    src={
                        feedback === 'correct' ? '/mascot/correct.png' :
                            feedback === 'incorrect' ? '/mascot/wrong.png' :
                                '/mascot/normal.png'
                    }
                    alt="Koi-chan Mascot"
                    className={`w-full h-auto drop-shadow-xl transition-all duration-300 relative z-10 ${feedback === 'correct' ? 'animate-bounce' :
                        feedback === 'incorrect' ? 'animate-shake' :
                            'animate-pulse-slow'
                        }`}
                />

                {/* Speech Bubble */}
                <div className={`
                    absolute bottom-[110%] right-[0%] bg-white/90 backdrop-blur-sm px-6 py-4 rounded-[2rem] shadow-xl border-2 border-pink-100
                    transform transition-all duration-300 origin-bottom-right w-48 text-center z-20
                    ${feedback ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                    <p className="text-[#4A3B52] font-bold text-lg leading-tight">{mascotMessage}</p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-100 transform rotate-45"></div>
                </div>
            </div>

            {/* Game Content */}
            <div className="max-w-md w-full flex flex-col items-center gap-8 relative z-10">

                {/* Character Card - Glassmorphism */}
                <div className="relative group perspective">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(255,209,220,0.5)] flex items-center justify-center
                                  border border-white/60 transform transition-transform duration-500 hover:scale-105">
                        <span className="text-8xl sm:text-9xl font-bold text-[#4A3B52] jp-font drop-shadow-sm">
                            {mode === GAME_MODES.MULTIPLE_CHOICE ? currentQuestion?.romaji : currentQuestion?.char}
                        </span>
                    </div>
                </div>

                {/* Feedback Indicator */}
                <div className={`h-8 transition-opacity duration-300 ${feedback ? 'opacity-100' : 'opacity-0'}`}>
                    {feedback === 'correct' ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-xl animate-bounce bg-green-100/80 px-4 py-1 rounded-full backdrop-blur-sm">
                            <CheckCircle /> Correct!
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-xl animate-shake bg-red-100/80 px-4 py-1 rounded-full backdrop-blur-sm">
                            <XCircle /> Incorrect! It was "{currentQuestion?.romaji}"
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {(mode === GAME_MODES.MULTIPLE_CHOICE) && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.romaji)}
                                disabled={feedback !== null}
                                className={`
                                    p-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 active:scale-95
                                    backdrop-blur-md border border-white/50
                                    ${feedback && opt.romaji === currentQuestion.romaji ? 'bg-green-100/90 text-green-700 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]' : ''}
                                    ${feedback && feedback === 'incorrect' && opt === options.find(o => o.romaji === currentQuestion.romaji) ? 'bg-green-100/90 text-green-700 border-green-400' : ''}
                                    ${!feedback ? 'bg-white/40 hover:bg-white/70 text-[#4A3B52] shadow-sm hover:shadow-[0_8px_20px_rgba(255,209,220,0.4)]' : ''}
                                `}
                            >
                                <span className={mode === GAME_MODES.MULTIPLE_CHOICE ? "jp-font text-4xl" : ""}>
                                    {mode === GAME_MODES.MULTIPLE_CHOICE ? opt.char : opt.romaji}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {(mode === GAME_MODES.INPUT) && (
                    <form onSubmit={handleInputSubmit} className="w-full relative">
                        <input
                            type="text"
                            value={inputAnswer}
                            onChange={(e) => setInputAnswer(e.target.value)}
                            placeholder="Type pronunciation..."
                            disabled={feedback !== null}
                            autoFocus
                            className="w-full p-6 text-center text-3xl font-bold text-[#4A3B52] rounded-3xl border-2 border-white/50 focus:border-pink-300 shadow-inner bg-white/50 backdrop-blur-md focus:bg-white/80 outline-none transition-all placeholder:font-normal placeholder:text-gray-400/80"
                        />
                        <button
                            type="submit"
                            disabled={!inputAnswer || feedback !== null}
                            className="w-full mt-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-[0_4px_15px_rgba(244,114,182,0.4)] hover:shadow-[0_8px_25px_rgba(244,114,182,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Answer
                        </button>
                    </form>
                )}

                {(mode === GAME_MODES.TIME_ATTACK) && (
                    <div className="absolute inset-x-0 bottom-0 h-[600px] overflow-hidden pointer-events-none">
                        {/* Bubbles Area - Pointer events allowed on buttons only */}
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.romaji)}
                                className="absolute rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm pointer-events-auto transform hover:scale-110 active:scale-125 transition-transform"
                                style={{
                                    left: `${opt.left}%`,
                                    width: '80px',
                                    height: '80px',
                                    bottom: '-100px', // Start below
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    border: '2px solid rgba(255, 255, 255, 0.8)',
                                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.15)',
                                    animation: `floatUp ${opt.duration}s linear infinite`,
                                    animationDelay: `${opt.delay}s`
                                }}
                            >
                                <span className="text-xl font-bold text-pink-600">{opt.romaji}</span>
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuizPage;

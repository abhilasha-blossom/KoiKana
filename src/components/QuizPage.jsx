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
            <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-6">
                <Link to="/" className="absolute top-6 left-6 p-2 rounded-full bg-white/50 hover:bg-white transition-colors">
                    <ArrowLeft className="text-gray-600" />
                </Link>

                <h1 className="text-4xl font-bold text-[#4A3B52] mb-2">Training Dojo</h1>
                <p className="text-[#7A6B82] mb-8">Choose your challenge</p>

                {/* Script Selection Toggles */}
                <div className="flex bg-white/40 p-1 rounded-full mb-10 shadow-inner">
                    {['hiragana', 'mix', 'katakana'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setScriptType(type)}
                            className={`px-6 py-2 rounded-full font-bold capitalize transition-all duration-300 ${scriptType === type
                                ? 'bg-white text-pink-500 shadow-sm scale-105'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {type === 'mix' ? 'Both' : type}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                    {/* Mode Cards */}
                    {[
                        { id: GAME_MODES.MULTIPLE_CHOICE, title: "Multiple Choice", icon: "🌸", desc: "Select the correct Romaji" },
                        { id: GAME_MODES.INPUT, title: "Input Challenge", icon: "✍️", desc: "Type the pronunciation" },
                        { id: GAME_MODES.TIME_ATTACK, title: "Time Attack", icon: "⚡", desc: "60 seconds to score high" },
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => startGame(m.id)}
                            className="bg-white/60 hover:bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(255,182,193,0.3)] 
                                     hover:shadow-[0_8px_30px_rgba(255,182,193,0.6)] hover:-translate-y-2 
                                     transition-all duration-300 flex flex-col items-center text-center gap-4 group"
                        >
                            <span className="text-6xl mb-2 group-hover:scale-110 transition-transform">{m.icon}</span>
                            <h3 className="text-2xl font-bold text-[#4A3B52]">{m.title}</h3>
                            <p className="text-gray-500">{m.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (isGameOver) {
        return (
            <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
                <div className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] shadow-xl max-w-md w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>

                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-4xl font-bold text-[#4A3B52] mb-2">Training Complete!</h2>
                    <p className="text-gray-500 mb-8">You've honed your skills.</p>

                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 mb-8">
                        {score} <span className="text-2xl text-gray-400 font-normal">pts</span>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link to="/" className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold transition-colors">
                            Home
                        </Link>
                        <button
                            onClick={() => setMode(GAME_MODES.SELECT)}
                            className="px-6 py-3 rounded-xl bg-pink-500 text-white hover:bg-pink-600 font-bold transition-colors flex items-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" /> Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center p-6">
            {/* Header */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-12 mt-4">
                <button onClick={() => setMode(GAME_MODES.SELECT)} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <ArrowLeft className="text-gray-600" />
                </button>

                {mode === GAME_MODES.TIME_ATTACK && (
                    <div className={`flex items-center gap-2 text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#4A3B52]'}`}>
                        <Clock className="w-6 h-6" /> {timeLeft}s
                    </div>
                )}

                <div className="text-xl font-bold text-pink-500 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    Score: {score}
                </div>
                <div className="text-xl font-bold text-pink-500 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    Score: {score}
                </div>
            </div>

            {/* MASCOT KOI-CHAN */}
            <div className="fixed bottom-0 right-0 md:right-10 w-40 md:w-56 pointer-events-none z-50 transition-transform duration-300">

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
                    absolute bottom-[110%] right-[0%] bg-white px-6 py-4 rounded-3xl shadow-lg border-2 border-pink-100
                    transform transition-all duration-300 origin-bottom-right w-48 text-center z-20
                    ${feedback ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                    <p className="text-[#4A3B52] font-bold text-lg">{mascotMessage}</p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-100 transform rotate-45"></div>
                </div>
            </div>

            {/* Game Content */}
            <div className="max-w-md w-full flex flex-col items-center gap-8">

                {/* Character Card */}
                <div className="relative group perspective">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-[2rem] shadow-xl flex items-center justify-center
                                  border-4 border-pink-100 transform transition-transform duration-500 hover:scale-105">
                        <span className="text-8xl sm:text-9xl font-bold text-[#4A3B52] jp-font">
                            {mode === GAME_MODES.MULTIPLE_CHOICE ? currentQuestion?.romaji : currentQuestion?.char}
                        </span>
                    </div>
                </div>

                {/* Feedback Indicator */}
                <div className={`h-8 transition-opacity duration-300 ${feedback ? 'opacity-100' : 'opacity-0'}`}>
                    {feedback === 'correct' ? (
                        <div className="flex items-center gap-2 text-green-500 font-bold text-xl animate-bounce">
                            <CheckCircle /> Correct!
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-xl animate-shake">
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
                                    p-6 rounded-2xl text-2xl font-bold transition-all duration-200 transform hover:-translate-y-1 active:scale-95
                                    ${feedback && opt.romaji === currentQuestion.romaji ? 'bg-green-100 text-green-700 border-2 border-green-400' : ''}
                                    ${feedback && feedback === 'incorrect' && opt === options.find(o => o.romaji === currentQuestion.romaji) ? 'bg-green-100 text-green-700 border-2 border-green-400' : ''}
                                    ${!feedback ? 'bg-white/60 hover:bg-white text-gray-700 shadow-sm hover:shadow-md' : ''}
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
                    <form onSubmit={handleInputSubmit} className="w-full">
                        <input
                            type="text"
                            value={inputAnswer}
                            onChange={(e) => setInputAnswer(e.target.value)}
                            placeholder="Type pronunciation..."
                            disabled={feedback !== null}
                            autoFocus
                            className="w-full p-4 text-center text-3xl font-bold text-gray-800 rounded-2xl border-2 border-transparent focus:border-pink-300 shadow-inner bg-white/80 focus:bg-white outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputAnswer || feedback !== null}
                            className="w-full mt-4 bg-pink-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    border: '2px solid rgba(255, 192, 203, 0.5)',
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

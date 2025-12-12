import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ChefHat, Sparkles, Heart, Star, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';

// Vocabulary Data
const MOCHI_FLAVORS = [
    { id: 'ichigo', romaji: 'Ichigo', kana: 'いちご', emoji: '🍓', color: 'bg-rose-500', dough: 'bg-rose-200' },
    { id: 'matcha', romaji: 'Matcha', kana: 'まっちゃ', emoji: '🍵', color: 'bg-green-600', dough: 'bg-green-200' },
    { id: 'anko', romaji: 'Anko', kana: 'あんこ', emoji: '🫘', color: 'bg-red-800', dough: 'bg-white' }, // White dough for daifuku
    { id: 'momo', romaji: 'Momo', kana: 'もも', emoji: '🍑', color: 'bg-pink-400', dough: 'bg-pink-100' },
    { id: 'mikan', romaji: 'Mikan', kana: 'みかん', emoji: '🍊', color: 'bg-orange-500', dough: 'bg-orange-100' },
    { id: 'sakura', romaji: 'Sakura', kana: 'さくら', emoji: '🌸', color: 'bg-pink-300', dough: 'bg-pink-50' },
    { id: 'kuri', romaji: 'Kuri', kana: 'くり', emoji: '🌰', color: 'bg-amber-700', dough: 'bg-amber-100' },
    { id: 'goma', romaji: 'Goma', kana: 'ごま', emoji: '⚫', color: 'bg-gray-800', dough: 'bg-gray-400' },
];

const MochiGamePage = () => {
    const { theme } = useTheme();
    const { playSound } = useAudio();
    const navigate = useNavigate();

    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, playing, completed
    const [score, setScore] = useState(0);
    const [ordersCompleted, setOrdersCompleted] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);

    // Round State
    const [currentOrder, setCurrentOrder] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [mochiState, setMochiState] = useState('empty'); // empty, filled, wrapped
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

    // Timer
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('completed');
                        playSound('win');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, playSound]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setOrdersCompleted(0);
        setTimeLeft(60);
        generateOrder();
    };

    const generateOrder = () => {
        setMochiState('empty');
        setFeedback(null);

        // Pick a random target
        const target = MOCHI_FLAVORS[Math.floor(Math.random() * MOCHI_FLAVORS.length)];
        setCurrentOrder(target);

        // Pick distractors (3 wrong options)
        const distractors = MOCHI_FLAVORS
            .filter(f => f.id !== target.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Combine and shuffle
        const options = [...distractors, target].sort(() => Math.random() - 0.5);
        setIngredients(options);
    };

    const handleIngredientClick = (ingredient) => {
        if (mochiState !== 'empty') return; // Prevent double clicks

        if (ingredient.id === currentOrder.id) {
            // Correct!
            playSound('pop');
            setMochiState('filled'); // Trigger animation
            setFeedback('correct');

            setTimeout(() => {
                setMochiState('wrapped');
                playSound('correct');
                setScore(s => s + 100);
                setOrdersCompleted(c => c + 1);
            }, 500);

            setTimeout(() => {
                generateOrder();
            }, 1500);
        } else {
            // Wrong!
            playSound('incorrect');
            setFeedback('wrong');
            // Shake effect handled by CSS
            setTimeout(() => setFeedback(null), 500);
        }
    };

    return (
        <div className={`min-h-screen ${theme.background} relative overflow-hidden font-sans flex flex-col`}>
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30"></div>
            </div>

            {/* Header */}
            <div className="w-full p-4 flex justify-between items-center z-20 relative">
                <Link to="/quiz" className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>

                {gameState === 'playing' && (
                    <div className="flex gap-4">
                        <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-amber-600 shadow-sm flex items-center gap-2">
                            <ChefHat size={18} /> {ordersCompleted}
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold shadow-sm transition-all ${timeLeft < 10 ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-white/80 text-gray-600'}`}>
                            ⏱️ {timeLeft}s
                        </div>
                        <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-pink-500 shadow-sm">
                            Score: {score}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">

                {gameState === 'playing' && currentOrder && (
                    <>
                        {/* CUSTOMER ORDER BUBBLE */}
                        <div className="mb-8 animate-fade-in-down w-full max-w-md px-4">
                            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border-2 border-pink-100 relative">
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rotate-45 border-r-2 border-b-2 border-pink-100"></div>
                                <div className="text-center">
                                    <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Customer Order</p>
                                    <h2 className="text-4xl font-black text-gray-800 mb-1">{currentOrder.romaji}</h2>
                                    <p className="text-gray-500 font-medium">I want something {currentOrder.id === 'sakura' ? 'floral' : 'tasty'}!</p>
                                </div>
                            </div>
                        </div>

                        {/* WORKSPACE */}
                        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                            {/* Plate */}
                            <div className="absolute inset-0 bg-white/40 rounded-full scale-110 blur-xl"></div>

                            {/* THE MOCHI */}
                            <div className={`
                                w-48 h-48 rounded-[3rem] shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden
                                ${mochiState === 'wrapped' ? currentOrder.dough : 'bg-white'}
                                ${mochiState === 'wrapped' ? 'scale-110' : 'scale-100'}
                                ${feedback === 'wrong' ? 'animate-shake border-4 border-red-300' : ''}
                             `}>
                                {/* Filling (Inside) */}
                                <div className={`
                                    absolute w-24 h-24 rounded-full transition-all duration-500
                                    ${mochiState === 'empty' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                                    ${currentOrder.color}
                                 `}></div>

                                {/* Face/Status */}
                                {mochiState === 'wrapped' && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                                        <span className="text-6xl filter drop-shadow-md">✨</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INGREDIENTS AREA */}
                        <div className="w-full px-4">
                            <p className="text-center text-gray-500 font-bold mb-4 animate-pulse">Select the {currentOrder.romaji} filling!</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                {ingredients.map((ing) => (
                                    <button
                                        key={ing.id}
                                        onClick={() => handleIngredientClick(ing)}
                                        disabled={mochiState !== 'empty'}
                                        className={`
                                            group relative p-4 rounded-2xl bg-white shadow-md border-2 border-transparent hover:border-pink-300 hover:-translate-y-1 transition-all
                                            active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    >
                                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 ${ing.color} shadow-inner flex items-center justify-center text-2xl`}>
                                            {ing.emoji}
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-2xl font-black text-gray-800 jp-font">{ing.kana}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* MENUS */}
                {gameState === 'menu' && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 animate-scale-up border border-white/50">
                        <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-inner">
                            🍡
                        </div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">Mochi Master</h1>
                        <p className="text-gray-500 font-medium mb-8">Customers are hungry! Match the Romaji orders to the correct Kana ingredients.</p>

                        <button
                            onClick={startGame}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all hover:scale-105 active:scale-95 text-xl flex items-center justify-center gap-2"
                        >
                            <ChefHat size={24} /> Open Shop
                        </button>
                    </div>
                )}

                {gameState === 'completed' && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 animate-scale-up border border-white/50">
                        <div className="mb-6">
                            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-spin-slow" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 mb-2">Shop Closed!</h1>
                        <p className="text-gray-500 font-medium mb-6">Great work today, Chef!</p>

                        <div className="bg-pink-50 rounded-2xl p-6 mb-8 border border-pink-100">
                            <div className="text-5xl font-black text-pink-500 mb-1">{score}</div>
                            <div className="text-sm font-bold text-pink-300 uppercase tracking-wider">Total Score</div>
                            <div className="mt-4 pt-4 border-t border-pink-100 flex justify-between text-gray-600 text-sm font-bold">
                                <span>Orders Served</span>
                                <span>{ordersCompleted} 🍡</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={startGame}
                                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                Play Again
                            </button>
                            <Link to="/quiz" className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-500 font-bold rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-all flex items-center justify-center">
                                Leave
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MochiGamePage;

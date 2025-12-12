import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ChefHat, Sparkles, Heart, Star, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';

// Vocabulary Data
const MOCHI_FLAVORS = [
    { id: 'ichigo', romaji: 'Ichigo', kana: 'いちご', emoji: '🍓', color: 'bg-rose-500', dough: 'bg-rose-200', text: 'text-rose-600' },
    { id: 'matcha', romaji: 'Matcha', kana: 'まっちゃ', emoji: '🍵', color: 'bg-green-600', dough: 'bg-green-200', text: 'text-green-700' },
    { id: 'anko', romaji: 'Anko', kana: 'あんこ', emoji: '🫘', color: 'bg-red-900', dough: 'bg-white', text: 'text-red-900' }, // White dough for daifuku
    { id: 'momo', romaji: 'Momo', kana: 'もも', emoji: '🍑', color: 'bg-pink-400', dough: 'bg-pink-100', text: 'text-pink-500' },
    { id: 'mikan', romaji: 'Mikan', kana: 'みかん', emoji: '🍊', color: 'bg-orange-500', dough: 'bg-orange-100', text: 'text-orange-500' },
    { id: 'sakura', romaji: 'Sakura', kana: 'さくら', emoji: '🌸', color: 'bg-pink-300', dough: 'bg-pink-50', text: 'text-pink-400' },
    { id: 'kuri', romaji: 'Kuri', kana: 'くり', emoji: '🌰', color: 'bg-amber-700', dough: 'bg-amber-100', text: 'text-amber-700' },
    { id: 'goma', romaji: 'Goma', kana: 'ごま', emoji: '⚫', color: 'bg-gray-800', dough: 'bg-gray-400', text: 'text-gray-700' },
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

                            >
        Play Again
                            </button >
    <Link to="/quiz" className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-500 font-bold rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-all flex items-center justify-center">
        Leave
    </Link>
                        </div >
                    </div >
                )}
            </div >
        </div >
    );
};

export default MochiGamePage;

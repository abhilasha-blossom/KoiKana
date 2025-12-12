import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ChefHat, Sparkles, Heart, Star, CheckCircle, Flame, Zap, ShoppingBag, BookOpen, Lock, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';

// Vocabulary Data
const MOCHI_FLAVORS = [
    { id: 'ichigo', romaji: 'Ichigo', meaning: 'Strawberry', kana: 'いちご', emoji: '🍓', color: 'bg-rose-500', dough: 'bg-rose-200', desc: "A classic favorite! Sweet, tart strawberries wrapped in soft mochi." },
    { id: 'matcha', romaji: 'Matcha', meaning: 'Green Tea', kana: 'まっちゃ', emoji: '🍵', color: 'bg-green-600', dough: 'bg-green-200', desc: "Earthy and aromatic. Made from premium shade-grown tea leaves." },
    { id: 'anko', romaji: 'Anko', meaning: 'Red Bean', kana: 'あんこ', emoji: '🫘', color: 'bg-red-900', dough: 'bg-white', desc: "Traditional sweet paste made from azuki beans. The soul of wagashi." },
    { id: 'momo', romaji: 'Momo', meaning: 'Peach', kana: 'もも', emoji: '🍑', color: 'bg-pink-400', dough: 'bg-pink-100', desc: "Juicy and fragrant white peach. A symbol of longevity." },
    { id: 'mikan', romaji: 'Mikan', meaning: 'Mandarin', kana: 'みかん', emoji: '🍊', color: 'bg-orange-500', dough: 'bg-orange-100', desc: "Refreshing citrus burst! Popular in winter under the kotatsu." },
    { id: 'sakura', romaji: 'Sakura', meaning: 'Cherry Blossom', kana: 'さくら', emoji: '🌸', color: 'bg-pink-300', dough: 'bg-pink-50', desc: "Salted cherry leaves and petals give this a unique sweet-salty taste." },
    { id: 'kuri', romaji: 'Kuri', meaning: 'Chestnut', kana: 'くり', emoji: '🌰', color: 'bg-amber-700', dough: 'bg-amber-100', desc: "Warm and nutty. A comfort flavor for the autumn season." },
    { id: 'goma', romaji: 'Goma', meaning: 'Sesame', kana: 'ごま', emoji: '⚫', color: 'bg-gray-800', dough: 'bg-gray-400', desc: "Rich, roasted black sesame paste. Nutty and aromatic." },
    { id: 'yuzu', romaji: 'Yuzu', meaning: 'Citron', kana: 'ゆず', emoji: '🍋', color: 'bg-yellow-400', dough: 'bg-yellow-100', desc: "Aromatic citrus with a distinctively tart and fragrant zest." },
    { id: 'choco', romaji: 'Choco', meaning: 'Chocolate', kana: 'ちょこ', emoji: '🍫', color: 'bg-[#5D4037]', dough: 'bg-[#D7CCC8]', desc: "A modern twist! Rich ganache wrapped in soft cocoa mochi." },
    { id: 'kinako', romaji: 'Kinako', meaning: 'Roasted Soy', kana: 'きなこ', emoji: '🥜', color: 'bg-[#D4A373]', dough: 'bg-[#FAEDCD]', desc: "Nutty roasted soybean flour. Often dusted on top of warabi mochi." },
    { id: 'imo', romaji: 'Imo', meaning: 'Sweet Potato', kana: 'いも', emoji: '🍠', color: 'bg-purple-600', dough: 'bg-purple-200', desc: "Sweet satsumaimo with a natural, earthy sweetness." },
    { id: 'ramune', romaji: 'Ramune', meaning: 'Soda', kana: 'らむね', emoji: '🥤', color: 'bg-cyan-400', dough: 'bg-cyan-100', desc: "Fizzy and fun! Tastes like the popular Japanese summer soda." },
    { id: 'melon', romaji: 'Melon', meaning: 'Melon', kana: 'めろん', emoji: '🍈', color: 'bg-green-400', dough: 'bg-green-100', desc: "Sweet musk melon flavor. A premium fruit treat." },
];

// Shop Items
const MOCHI_PLATES = [
    { id: 'wood', name: 'Traditional Wood', cost: 0, style: 'bg-[#eecfa1] border-4 border-[#d4a373] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]' },
    { id: 'porcelain', name: 'Blue Porcelain', cost: 2000, style: 'bg-blue-50 border-4 border-blue-200 shadow-md' },
    { id: 'dark', name: 'Midnight Stone', cost: 5000, style: 'bg-slate-800 border-4 border-slate-700 shadow-inner' },
    { id: 'sakura', name: 'Sakura Petal', cost: 8000, style: 'bg-pink-50 border-4 border-pink-200 shadow-pink-100' },
    { id: 'gold', name: 'Golden Luxury', cost: 20000, style: 'bg-yellow-100 border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
];

const REVIEWS = {
    high: ["Best mochi in Tokyo! ⭐⭐⭐⭐⭐", "So soft! 5 stars!", "I'm telling all my friends! 😍", "Mochi Master indeed! 🍡✨"],
    mid: ["Pretty good! ⭐⭐⭐", "Nice texture. 🙂", "Will come back.", "Not bad at all."],
    low: ["A bit hard... ⭐", "My order was wrong... 😔", "Meh.", "Service was slow..."]
};

const MochiGamePage = () => {
    const { theme } = useTheme();
    const { playSound } = useAudio();
    const navigate = useNavigate();

    // -- Persistence --
    const [yen, setYen] = useState(() => parseInt(localStorage.getItem('mochi_yen')) || 0);
    const [ownedPlates, setOwnedPlates] = useState(() => JSON.parse(localStorage.getItem('mochi_owned_plates')) || ['wood']);
    const [selectedPlateId, setSelectedPlateId] = useState(() => localStorage.getItem('mochi_selected_plate') || 'wood');
    const [unlockedFlavors, setUnlockedFlavors] = useState(() => JSON.parse(localStorage.getItem('mochi_unlocked_flavors')) || []);

    useEffect(() => { localStorage.setItem('mochi_yen', yen); }, [yen]);
    useEffect(() => { localStorage.setItem('mochi_owned_plates', JSON.stringify(ownedPlates)); }, [ownedPlates]);
    useEffect(() => { localStorage.setItem('mochi_selected_plate', selectedPlateId); }, [selectedPlateId]);
    useEffect(() => { localStorage.setItem('mochi_unlocked_flavors', JSON.stringify(unlockedFlavors)); }, [unlockedFlavors]);

    const activePlate = MOCHI_PLATES.find(p => p.id === selectedPlateId) || MOCHI_PLATES[0];

    // -- Game State --
    const [gameState, setGameState] = useState('menu'); // menu, playing, completed, shop, book
    const [score, setScore] = useState(0);
    const [ordersCompleted, setOrdersCompleted] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [finalReview, setFinalReview] = useState("");

    // Streak State
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);

    // Round State
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isGolden, setIsGolden] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [mochiState, setMochiState] = useState('empty'); // empty, filled, wrapped
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Book State
    const [selectedBookFlavor, setSelectedBookFlavor] = useState(null);

    // Timer
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const endGame = () => {
        setGameState('completed');
        playSound('win');
        setYen(prev => prev + score);

        // Generate Review
        let reviewPool = REVIEWS.low;
        if (score > 2000) reviewPool = REVIEWS.high;
        else if (score > 800) reviewPool = REVIEWS.mid;
        setFinalReview(reviewPool[Math.floor(Math.random() * reviewPool.length)]);
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setOrdersCompleted(0);
        setTimeLeft(60);
        setStreak(0);
        setHighestStreak(0);
        setFinalReview("");
        generateOrder();
    };

    const generateOrder = () => {
        setMochiState('empty');
        setFeedback(null);
        setIsTransitioning(true);

        const target = MOCHI_FLAVORS[Math.floor(Math.random() * MOCHI_FLAVORS.length)];
        const distractors = MOCHI_FLAVORS
            .filter(f => f.id !== target.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        const options = [...distractors, target].sort(() => Math.random() - 0.5);

        // Golden Chance (5%)
        const golden = Math.random() < 0.05;
        setIsGolden(golden);
        if (golden) playSound('sparkle'); // Or some rare sound

        setTimeout(() => {
            setCurrentOrder(target);
            setIngredients(options);
            setIsTransitioning(false);
        }, 600);
    };

    const handleIngredientClick = (ingredient) => {
        if (mochiState !== 'empty' || isTransitioning) return;

        if (ingredient.id === currentOrder.id) {
            // Correct!
            playSound('pop');
            setMochiState('filled');
            setFeedback('correct');

            // Unlock Flavor Logic
            if (!unlockedFlavors.includes(ingredient.id)) {
                setUnlockedFlavors(prev => [...prev, ingredient.id]);
            }

            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);

            let points = isGolden ? 500 : 100; // Base points
            if (newStreak >= 3) points += 20;
            if (newStreak >= 5) points += 50;
            if (newStreak >= 10) points += 100;

            setTimeout(() => {
                setMochiState('wrapped');
                playSound('correct');
                setScore(s => s + points);
                setOrdersCompleted(c => c + 1);
            }, 500);

            setTimeout(() => {
                generateOrder();
            }, 2000);
        } else {
            // Wrong!
            playSound('incorrect');
            setFeedback('wrong');
            setStreak(0);
            setTimeout(() => setFeedback(null), 500);
        }
    };

    const buyPlate = (plate) => {
        if (yen >= plate.cost) {
            setYen(y => y - plate.cost);
            setOwnedPlates(curr => [...curr, plate.id]);
            playSound('correct');
        } else {
            playSound('incorrect');
        }
    };

    const equipPlate = (plateId) => {
        setSelectedPlateId(plateId);
        playSound('pop');
    };

    const renderComboVisuals = () => {
        if (streak < 2) return null;

        let intensityClass = 'text-orange-500';
        let icon = <Flame size={20} className="animate-pulse" />;
        let message = "Combo!";

        if (streak >= 5) {
            intensityClass = 'text-red-500 font-black animate-bounce';
            icon = <Flame size={28} className="animate-burn" fill="currentColor" />;
            message = "HEATING UP!";
        }
        if (streak >= 10) {
            intensityClass = 'text-purple-600 font-black animate-pulse drop-shadow-lg';
            icon = <Zap size={28} className="animate-spin-slow" fill="currentColor" />;
            message = "MOCHI MASTER!";
        }

        return (
            <div className={`absolute top-20 right-4 flex flex-col items-end z-40 transition-all duration-300 animate-scale-up`}>
                <div className={`flex items-center gap-1 ${intensityClass}`}>
                    {icon}
                    <span className="text-2xl font-black">x{streak}</span>
                </div>
                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">{message}</span>
            </div>
        );
    };

    const renderFilling = (flavor) => {
        if (!flavor) return null;
        switch (flavor.id) {
            case 'ichigo': return <div className="w-full h-full rounded-full bg-rose-500 relative overflow-hidden shadow-inner"><div className="absolute top-[30%] left-[40%] w-1 h-1.5 bg-yellow-100/50 rounded-full"></div></div>;
            case 'matcha': return <div className="w-full h-full rounded-full bg-green-600 shadow-inner"></div>;
            case 'kinako': return <div className="w-full h-full rounded-full bg-[#D4A373] shadow-inner"></div>;
            case 'anko': return <div className="w-full h-full rounded-full bg-[#5e1c1c] shadow-inner"></div>;
            case 'choco': return <div className="w-full h-full rounded-full bg-[#3E2723] shadow-inner"></div>;
            case 'mikan': return <div className="w-full h-full rounded-full bg-orange-400 shadow-inner"></div>;
            case 'yuzu': return <div className="w-full h-full rounded-full bg-yellow-400 shadow-inner"></div>;
            case 'sakura': return <div className="w-full h-full rounded-full bg-pink-300 shadow-inner"></div>;
            case 'imo': return <div className="w-full h-full rounded-full bg-purple-600 shadow-inner"></div>;
            case 'goma': return <div className="w-full h-full rounded-full bg-stone-800 shadow-inner"></div>;
            case 'ramune': return <div className="w-full h-full rounded-full bg-cyan-400 shadow-inner"></div>;
            case 'melon': return <div className="w-full h-full rounded-full bg-green-400 shadow-inner"></div>;
            default: return <div className={`w-full h-full rounded-full ${flavor.color} shadow-inner`}></div>;
        }
    };

    return (
        <div className={`min-h-screen ${theme.background} relative overflow-hidden font-sans flex flex-col`}>
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            {/* Header */}
            <div className="w-full p-4 flex justify-between items-center z-20 relative">
                <Link to="/quiz" className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>

                {gameState === 'playing' ? (
                    <div className="flex gap-4">
                        <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-amber-600 shadow-sm flex items-center gap-2">
                            <ChefHat size={18} /> {ordersCompleted}
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold shadow-sm transition-all ${timeLeft < 10 ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-white/80 text-gray-600'}`}>
                            ⏱️ {timeLeft}s
                        </div>
                        <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-pink-500 shadow-sm">
                            {score}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-amber-600 shadow-sm flex items-center gap-2 border border-amber-100">
                        <span className="text-xl">💴</span> {yen.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">

                {gameState === 'playing' && (
                    <>
                        {renderComboVisuals()}

                        {/* ORDER */}
                        <div className={`mb-8 w-full max-w-md px-4 relative z-30 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            {currentOrder && (
                                <div className={`
                                    bg-white/90 backdrop-blur-md rounded-[2rem] p-6 shadow-xl relative text-center border-4
                                    ${isGolden ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse' : 'border-pink-100'}
                                `}>
                                    {isGolden && <Sparkles className="absolute top-2 right-2 text-yellow-400 animate-spin-slow" />}
                                    <p className={`uppercase text-xs font-bold tracking-widest mb-1 ${isGolden ? 'text-amber-500' : 'text-gray-400'}`}>
                                        {isGolden ? '✨ GOLDEN ORDER ✨' : 'Order'}
                                    </p>
                                    <h2 className="text-4xl font-black text-gray-800 drop-shadow-sm">{currentOrder.romaji}</h2>
                                </div>
                            )}
                        </div>

                        {/* WORKSPACE & PLATE */}
                        <div className="relative w-80 h-80 flex items-center justify-center mb-6">
                            {/* PLATE */}
                            <div className={`absolute inset-0 rounded-full transition-all duration-500 scale-110 ${activePlate.style}`}></div>

                            {/* THE MOCHI */}
                            <div className={`
                                w-48 h-48 rounded-[2.5rem] shadow-lg transition-all duration-700 flex items-center justify-center relative overflow-hidden backdrop-blur-sm z-10
                                ${mochiState === 'wrapped' && currentOrder ? currentOrder.dough : 'bg-white/80'}
                                ${mochiState === 'wrapped' ? 'scale-110' : 'scale-100'}
                                ${feedback === 'wrong' ? 'animate-shake border-4 border-red-300' : ''}
                                ${isGolden && mochiState === 'wrapped' ? 'shadow-[0_0_40px_rgba(250,204,21,0.6)]' : ''}
                             `}>
                                {/* Powder */}
                                <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>

                                {/* Filling */}
                                <div className={`
                                    absolute w-24 h-24 transition-all duration-500 z-10
                                    ${mochiState === 'empty' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                                 `}>
                                    {currentOrder && renderFilling(currentOrder)}
                                </div>

                                {/* Kawaii Face */}
                                {mochiState === 'wrapped' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animate-bounce-custom">
                                        <div className="flex gap-8 mb-1">
                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                        </div>
                                        <div className="w-3 h-1.5 bg-pink-400/50 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INGREDIENTS */}
                        <div className={`w-full px-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                {ingredients.map((ing) => (
                                    <button
                                        key={ing.id}
                                        onClick={() => handleIngredientClick(ing)}
                                        disabled={mochiState !== 'empty'}
                                        className={`
                                            p-4 rounded-3xl bg-white shadow-md border-2 border-transparent hover:border-pink-300 hover:-translate-y-1 transition-all
                                            active:scale-95 disabled:opacity-50
                                        `}
                                    >
                                        <span className="block text-2xl font-black text-gray-800 jp-font mb-1">{ing.kana}</span>
                                        <div className="w-8 h-8 mx-auto rounded-full overflow-hidden opacity-50">{renderFilling(ing)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* MENUS */}
                {gameState === 'menu' && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 animate-scale-up border border-white/50">
                        <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-inner border-4 border-white">
                            🍡
                        </div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">Mochi Master</h1>
                        <p className="text-gray-500 font-medium mb-8">Match orders to ingredients!</p>

                        <div className="flex flex-col gap-3">
                            <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-xl">
                                Open Shop
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => setGameState('shop')} className="flex-1 py-4 bg-white text-orange-500 font-bold rounded-2xl shadow-lg border-2 border-orange-100 transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2">
                                    <ShoppingBag /> Shop
                                </button>
                                <button onClick={() => setGameState('book')} className="flex-1 py-4 bg-white text-blue-500 font-bold rounded-2xl shadow-lg border-2 border-blue-100 transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2">
                                    <BookOpen /> Recipes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'shop' && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col animate-fade-in">
                        <div className="p-6 flex justify-between items-center bg-white shadow-sm">
                            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><ShoppingBag /> Plate Shop</h2>
                            <button onClick={() => setGameState('menu')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                {MOCHI_PLATES.map(plate => {
                                    const isOwned = ownedPlates.includes(plate.id);
                                    const isEquipped = selectedPlateId === plate.id;
                                    return (
                                        <div key={plate.id} className={`p-6 rounded-3xl border-4 transition-all ${isEquipped ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-white'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-lg text-gray-800">{plate.name}</h3>
                                                {isEquipped && <CheckCircle className="text-green-500" />}
                                            </div>
                                            <div className={`w-32 h-32 mx-auto rounded-full mb-6 ${plate.style} shadow-xl transform rotate-12`}></div>
                                            {isOwned ? (
                                                <button onClick={() => equipPlate(plate.id)} disabled={isEquipped} className={`w-full py-3 rounded-xl font-bold transition-all ${isEquipped ? 'bg-green-500 text-white opacity-50 cursor-default' : 'bg-gray-800 text-white hover:bg-gray-900 active:scale-95'}`}>{isEquipped ? 'Equipped' : 'Equip'}</button>
                                            ) : (
                                                <button onClick={() => buyPlate(plate)} className={`w-full py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${yen >= plate.cost ? 'border-amber-500 text-amber-600 hover:bg-amber-50 active:scale-95' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}><span className="text-sm">💴 {plate.cost.toLocaleString()}</span>{yen < plate.cost && <Lock size={16} />}</button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'book' && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col animate-fade-in">
                        <div className="p-6 flex justify-between items-center bg-white shadow-sm">
                            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><BookOpen /> Recipes</h2>
                            <button onClick={() => setGameState('menu')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {MOCHI_FLAVORS.map(flavor => {
                                    const isUnlocked = unlockedFlavors.includes(flavor.id);
                                    return (
                                        <div
                                            key={flavor.id}
                                            onClick={() => isUnlocked && setSelectedBookFlavor(flavor)}
                                            className={`
                                                relative p-4 rounded-3xl border-2 transition-all cursor-pointer
                                                ${isUnlocked ? 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-lg' : 'bg-gray-50 border-gray-100 opacity-70'}
                                            `}
                                        >
                                            <div className="w-16 h-16 mx-auto mb-3 relative">
                                                {isUnlocked ? renderFilling(flavor) : <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center"><Lock size={20} className="text-gray-400" /></div>}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-black text-gray-800">{isUnlocked ? flavor.romaji : '???'}</h3>
                                                <p className="text-xs font-bold text-gray-400">{isUnlocked ? flavor.meaning : 'Locked'}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {selectedBookFlavor && (
                            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedBookFlavor(null)}>
                                <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                                    <div className="text-center mb-6">
                                        <div className="w-32 h-32 mx-auto mb-4 relative">
                                            {renderFilling(selectedBookFlavor)}
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-800">{selectedBookFlavor.romaji}</h2>
                                        <p className="text-xl font-bold text-pink-500 mb-2">{selectedBookFlavor.meaning}</p>
                                        <p className="text-4xl mb-4 font-black text-gray-200 jp-font">{selectedBookFlavor.kana}</p>
                                        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                                            <p className="text-gray-600 font-medium leading-relaxed">{selectedBookFlavor.desc}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedBookFlavor(null)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'completed' && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 animate-scale-up border border-white/50">
                        <div className="mb-6">
                            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-spin-slow" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 mb-2">Shop Closed!</h1>
                        <p className="text-gray-500 font-medium mb-6">Great work today, Chef!</p>

                        <div className="bg-pink-50 rounded-2xl p-6 mb-8 border border-pink-100 relative overflow-hidden">
                            {/* CUSTOMER REVIEW */}
                            {finalReview && (
                                <div className="absolute top-0 inset-x-0 bg-yellow-100 p-2 text-center text-yellow-700 font-bold text-xs uppercase tracking-wide border-b border-yellow-200">
                                    Customer Review: "{finalReview}"
                                </div>
                            )}

                            <div className="text-5xl font-black text-pink-500 mb-1 mt-6">{score}</div>
                            <div className="text-sm font-bold text-pink-300 uppercase tracking-wider mb-6">Total Score</div>

                            <div className="flex flex-col gap-3">
                                <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center text-gray-600 font-bold border border-pink-100/50">
                                    <span>Orders Served</span>
                                    <span>{ordersCompleted} 🍡</span>
                                </div>
                                <div className="bg-orange-100 rounded-xl p-3 flex justify-between items-center text-orange-600 font-bold border border-orange-200">
                                    <span>Best Combo</span>
                                    <span className="flex items-center gap-1">{highestStreak} <Flame size={18} fill="currentColor" /></span>
                                </div>
                                <div className="bg-amber-100 rounded-xl p-3 flex justify-between items-center text-amber-700 font-bold border border-amber-200 mt-2">
                                    <span>Earnings</span>
                                    <span>+ {score} 💴</span>
                                </div>
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

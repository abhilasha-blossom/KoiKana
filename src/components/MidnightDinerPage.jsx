import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Utensils, Coins, Sparkles } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import useAudio from '../hooks/useAudio';

const INGREDIENTS = {
    broth: [
        { id: 'shoyu', name: 'Shoyu', color: 'bg-amber-900/90', label: 'Shoyu' },
        { id: 'tonkotsu', name: 'Tonkotsu', color: 'bg-orange-100/90', label: 'Tonkotsu' },
        { id: 'miso', name: 'Miso', color: 'bg-amber-500/90', label: 'Miso' },
    ],
    noodle: [
        { id: 'thick', name: 'Thick', label: 'Thick' },
        { id: 'thin', name: 'Thin', label: 'Thin' },
    ],
    topping: [
        { id: 'chashu', name: 'Chashu', label: 'Chashu' },
        { id: 'egg', name: 'Ajitama', label: 'Egg' },
        { id: 'nori', name: 'Nori', label: 'Nori' },
        { id: 'menma', name: 'Menma', label: 'Menma' },
        { id: 'naruto', name: 'Naruto', label: 'Naruto' },
        { id: 'onion', name: 'Negi', label: 'Gr. Onion' },
    ]
};

const ORDERS = [
    { text: "Tonkotsu Ramen, please!", requirements: { broth: 'tonkotsu', noodle: 'thin', topping: ['chashu', 'egg', 'onion'] } },
    { text: "Miso Ramen with extra meat!", requirements: { broth: 'miso', noodle: 'thick', topping: ['chashu', 'chashu', 'egg'] } },
    { text: "Classic Shoyu, simple.", requirements: { broth: 'shoyu', noodle: 'thick', topping: ['menma', 'naruto', 'nori'] } },
    { text: "Chef's Special (Everything!)", requirements: { broth: 'tonkotsu', noodle: 'thick', topping: ['chashu', 'egg', 'nori', 'menma', 'naruto'] } },
];

const MidnightDinerPage = () => {
    const { mochiYen, setMochiYen } = useProgressContext(); // Assuming setMochiYen or similar is available or I need to add update logic
    const { playSound } = useAudio();

    const [currentOrder, setCurrentOrder] = useState(null);
    const [bowl, setBowl] = useState({ broth: null, noodle: null, toppings: [] });
    const [gameState, setGameState] = useState('idle'); // idle, cooking, serving, result
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    // Audio: Rain ambience
    useEffect(() => {
        const rainAudio = new Audio('/music/rain_ambience_placeholder.mp3'); // Need to handle this if missing, maybe CSS rain enough?
        // Let's rely on CSS rain visual for now + maybe existing lofi
    }, []);

    // Start New Customer
    const nextCustomer = () => {
        setBowl({ broth: null, noodle: null, toppings: [] });
        const randomOrder = ORDERS[Math.floor(Math.random() * ORDERS.length)];
        setCurrentOrder(randomOrder);
        setGameState('cooking');
        setFeedback(null);
    };

    useEffect(() => {
        nextCustomer();
    }, []);

    const handleIngredientClick = (type, item) => {
        if (gameState !== 'cooking') return;
        playSound('pop');

        if (type === 'broth') {
            setBowl(prev => ({ ...prev, broth: item.id }));
        } else if (type === 'noodle') {
            if (!bowl.broth) return; // Need broth first? Or bowl first? Let's say Broth -> Noodle logic
            setBowl(prev => ({ ...prev, noodle: item.id }));
        } else if (type === 'topping') {
            if (!bowl.noodle) return;
            if (bowl.toppings.length >= 5) return;
            setBowl(prev => ({ ...prev, toppings: [...prev.toppings, item.id] }));
        }
    };

    const handleServe = () => {
        if (!bowl.broth || !bowl.noodle) return;

        // Check Logic
        // Simple check: Broth/Noodle match + visual toppings roughly? 
        // For MVP, strict check might be hard if "Extra meat" means 2 chashu.
        // Let's check Main components match

        const correctBroth = bowl.broth === currentOrder.requirements.broth;
        const correctNoodle = bowl.noodle === currentOrder.requirements.noodle;

        // Topping check: Check if all required toppings are present
        const reqToppings = currentOrder.requirements.topping;
        const hasToppings = reqToppings.every(t => bowl.toppings.includes(t));

        if (correctBroth && correctNoodle && hasToppings) {
            setFeedback('perfect');
            setScore(prev => prev + 100);
            // Award Yen?
            // updateYen(50);
        } else {
            setFeedback('wrong');
        }

        setGameState('result');
        setTimeout(() => {
            nextCustomer();
        }, 2000);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-slate-100 font-sans selection:bg-amber-900">

            {/* BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0">
                {/* Rain on Window Effect */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516475429286-465d815a0df7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>

                {/* Rain Animation CSS */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent,white)] h-full w-full" style={{ backgroundSize: '2px 100px', animation: 'rain 0.5s linear infinite' }}></div>
            </div>

            {/* UI - TOP BAR */}
            <div className="relative z-50 p-6 flex justify-between items-start">
                <Link to="/start" className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all hover:scale-105">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex gap-4">
                    <div className="bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-bold">{mochiYen} ¥</span>
                    </div>
                </div>
            </div>

            {/* GAME AREA */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto -mt-20">

                {/* 1. CUSTOMER ORDER */}
                <div className="mb-8 w-full flex justify-center">
                    <div className="bg-white text-slate-900 px-6 py-4 rounded-[2rem] rounded-bl-none shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-bounce-in max-w-md relative">
                        <p className="font-black text-xl italic text-center">"{currentOrder?.text}"</p>
                        <div className="text-xs text-gray-500 mt-2 text-center flex gap-2 justify-center flex-wrap">
                            <span className="bg-gray-200 px-2 py-1 rounded">Base: {currentOrder?.requirements.broth}</span>
                            <span className="bg-gray-200 px-2 py-1 rounded">Noodle: {currentOrder?.requirements.noodle}</span>
                            <span className="bg-gray-200 px-2 py-1 rounded">Toppings: {currentOrder?.requirements.topping.length}</span>
                        </div>
                    </div>
                </div>

                {/* 2. THE BOWL */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex items-center justify-center mb-12 group transition-transform hover:scale-105">
                    {/* Inner Shadow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] z-20 pointer-events-none"></div>

                    {/* Empty State */}
                    {!bowl.broth && <span className="text-slate-700 font-bold z-10 rotate-[-10deg]">Empty Bowl</span>}

                    {/* LAYERS */}
                    {/* Broth */}
                    {bowl.broth && (
                        <div className={`absolute inset-2 md:inset-4 rounded-full ${INGREDIENTS.broth.find(b => b.id === bowl.broth)?.color} animate-liquid-fill z-0`}></div>
                    )}

                    {/* Noodles */}
                    {bowl.noodle && (
                        <div className="absolute inset-8 rounded-full border-[12px] border-yellow-200/80 border-dashed animate-spin-slow-reverse opacity-90 z-10 box-border"></div>
                    )}

                    {/* Toppings - Scattered Randomly? Or Grid? */}
                    <div className="absolute inset-0 z-20">
                        {bowl.toppings.map((t, i) => {
                            // Simple random positions
                            const randX = 20 + (i * 25 + Math.random() * 10) % 60;
                            const randY = 20 + (i * 35 + Math.random() * 10) % 60;
                            return (
                                <div
                                    key={i}
                                    className="absolute bg-white shadow-md rounded-full flex items-center justify-center text-[10px] font-bold text-slate-800 border-2 border-slate-200 animate-drop-in"
                                    style={{ left: `${randX}%`, top: `${randY}%`, width: '40px', height: '40px', transform: 'translate(-50%, -50%) rotate(${Math.random() * 360}deg)' }}
                                >
                                    {t.substring(0, 2)}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 3. CONTROLS / INGREDIENTS */}
                <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-700 p-6 absolute bottom-0 left-0">
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">

                        {/* Tabs / Categories */}
                        <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <span>1. Broth</span>
                            <span>2. Noodles</span>
                            <span>3. Toppings</span>
                        </div>

                        {/* Ingredients Grid */}
                        <div className="grid grid-cols-3 gap-8">
                            {/* Broths */}
                            <div className="flex gap-2 justify-center">
                                {INGREDIENTS.broth.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleIngredientClick('broth', item)}
                                        className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 hover:border-amber-500 hover:bg-slate-700 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                                    >
                                        <div className={`w-6 h-6 rounded-full ${item.color.replace('/90', '')}`}></div>
                                        <span className="text-[10px]">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Noodles */}
                            <div className="flex gap-2 justify-center">
                                {INGREDIENTS.noodle.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleIngredientClick('noodle', item)}
                                        disabled={!bowl.broth}
                                        className={`w-16 h-16 rounded-full border-2 transition-all flex flex-col items-center justify-center gap-1 active:scale-95
                                            ${!bowl.broth ? 'opacity-30 cursor-not-allowed border-slate-700 bg-slate-800' : 'bg-slate-800 border-slate-600 hover:border-yellow-400 hover:bg-slate-700'}
                                        `}
                                    >
                                        <span className="text-xl">🍜</span>
                                        <span className="text-[10px]">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Toppings */}
                            <div className="grid grid-cols-3 gap-2 justify-center">
                                {INGREDIENTS.topping.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleIngredientClick('topping', item)}
                                        disabled={!bowl.noodle}
                                        className={`w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center active:scale-95
                                            ${!bowl.noodle ? 'opacity-30 cursor-not-allowed border-slate-700 bg-slate-800' : 'bg-slate-800 border-slate-600 hover:border-green-400 hover:bg-slate-700'}
                                        `}
                                    >
                                        <span className="text-[10px] leading-tight">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SERVE BUTTON */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleServe}
                                disabled={!bowl.noodle}
                                className={`
                                    px-12 py-3 rounded-full font-black text-xl tracking-widest shadow-lg transition-all
                                    ${!bowl.noodle
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-amber-500 hover:bg-amber-400 text-white hover:scale-105 shadow-amber-900/50'
                                    }
                                `}
                            >
                                SERVE ORDER
                            </button>
                        </div>

                    </div>
                </div>

                {/* FEEDBACK OVERLAY */}
                {feedback && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
                        <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl text-center transform scale-110">
                            {feedback === 'perfect' ? (
                                <>
                                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin-slow" />
                                    <h2 className="text-3xl font-black mb-2 text-amber-500">Delicious!</h2>
                                    <p className="font-medium text-slate-600">The customer looks happy.</p>
                                    <div className="mt-4 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold">+100 Score</div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black mb-2 text-slate-400">Hmm...</h2>
                                    <p className="font-medium text-slate-600">That wasn't quite right.</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MidnightDinerPage;

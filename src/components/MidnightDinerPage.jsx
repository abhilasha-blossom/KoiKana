import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, X, ChevronRight, Star } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import useAudio from '../hooks/useAudio';

// --- DATA ---
const INGREDIENTS = {
    broth: [
        { id: 'shoyu', label: '醤油', romaji: 'Shoyu', en: 'Soy Sauce', color: 'bg-[#3f1908]', ring: 'ring-[#3f1908]', liquidStyle: 'bg-gradient-to-r from-[#2a1005] to-[#5c2a12]' },
        { id: 'tonkotsu', label: '豚骨', romaji: 'Tonkotsu', en: 'Pork Bone', color: 'bg-[#fdf6e3]', ring: 'ring-gray-200', liquidStyle: 'bg-[#fdf6e3] opacity-95' }, // Opaque white for visibility
        { id: 'miso', label: '味噌', romaji: 'Miso', en: 'Soybean', color: 'bg-[#d97706]', ring: 'ring-yellow-600', liquidStyle: 'bg-gradient-to-r from-[#b45309] to-[#d97706]' },
    ],
    noodle: [
        { id: 'thick', label: '太麺', romaji: 'Futomen', en: 'Thick', icon: '🍜' },
        { id: 'thin', label: '細麺', romaji: 'Hosomen', en: 'Thin', icon: '🍜' },
    ],
    topping: [
        { id: 'chashu', label: 'チャーシュー', romaji: 'Chashu', en: 'Pork' },
        { id: 'egg', label: '味玉', romaji: 'Ajitama', en: 'Egg' },
        { id: 'nori', label: '海苔', romaji: 'Nori', en: 'Seaweed' },
        { id: 'menma', label: 'メンマ', romaji: 'Menma', en: 'Bamboo' },
        { id: 'naruto', label: 'ナルト', romaji: 'Naruto', en: 'Fish Cake' },
        { id: 'onion', label: 'ネギ', romaji: 'Negi', en: 'Gr. Onion' },
    ]
};

const ORDERS = [
    {
        text: "I'm hungry! One **Tonkotsu** Ramen, **Futomen** (Thick). Give me **2 Chashu** and **1 Egg**!",
        requirements: { broth: 'tonkotsu', noodle: 'thick', toppings: { chashu: 2, egg: 1 } }
    },
    {
        text: "Light meal. **Shoyu** Ramen with **Hosomen** (Thin). Just **1 Nori** and **2 Naruto** please.",
        requirements: { broth: 'shoyu', noodle: 'thin', toppings: { nori: 1, naruto: 2 } }
    },
    {
        text: "**Miso** Ramen! **Futomen** (Thick). I love toppings: **1 Egg**, **1 Menma**, and **1 Negi**!",
        requirements: { broth: 'miso', noodle: 'thick', toppings: { egg: 1, menma: 1, onion: 1 } }
    },
    {
        text: "**Tonkotsu** Ramen, **Hosomen** (Thin). Make it meaty: **3 Chashu**!",
        requirements: { broth: 'tonkotsu', noodle: 'thin', toppings: { chashu: 3 } }
    },
];

// --- VISUAL COMPONENTS ---

const ToppingVisual = ({ type, index }) => {
    const rotation = (index * 45 + Math.random() * 20) % 360;

    // Slight size bump for "Full Bowl" look
    switch (type) {
        case 'chashu':
            return (
                <div style={{ transform: `rotate(${rotation}deg)` }} className="w-20 h-20 rounded-full bg-[#5d4037] border-4 border-[#3e2723] relative shadow-lg overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="absolute inset-2 rounded-full border-2 border-[#8d6e63] opacity-50"></div>
                    <div className="w-10 h-10 bg-[#8d6e63] rounded-full blur-sm opacity-60"></div>
                </div>
            );
        case 'egg':
            return (
                <div style={{ transform: `rotate(${rotation}deg)` }} className="w-16 h-18 bg-white rounded-[50%] relative shadow-lg overflow-hidden border border-amber-100/50 transform hover:scale-105 transition-transform">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full shadow-inner"></div>
                    <div className="absolute top-4 left-4 w-3 h-2 bg-white rounded-full opacity-80"></div>
                </div>
            );
        case 'nori':
            return (
                <div className="w-16 h-24 bg-[#1a2e1a] border border-[#0f1f0f] shadow-xl relative -rotate-6 transform hover:scale-105 transition-transform origin-bottom">
                    <div className="absolute inset-0 bg-black opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMWEyZTFhIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMTAyMDEwIiAvPgo8L3N2Zz4=')]"></div>
                </div>
            );
        case 'naruto':
            return (
                <div style={{ transform: `rotate(${rotation}deg)` }} className="w-12 h-12 bg-white rounded-full border-2 border-pink-100 shadow-md relative overflow-hidden flex items-center justify-center hover:scale-110 transition-transform">
                    <div className="w-8 h-8 border-[4px] border-pink-500 rounded-full rounded-tr-none rotate-45"></div>
                </div>
            );
        case 'menma':
            return (
                <div className="flex gap-1" style={{ transform: `rotate(${rotation}deg)` }}>
                    <div className="w-4 h-16 bg-[#d4c4a8] border border-[#a1887f] rounded-sm shadow-sm"></div>
                    <div className="w-4 h-16 bg-[#d4c4a8] border border-[#a1887f] rounded-sm shadow-sm"></div>
                </div>
            );
        case 'onion':
            return (
                <div className="relative w-16 h-16 pointer-events-none">
                    <div className="absolute top-2 left-2 w-4 h-4 ring-2 ring-green-600 bg-green-100 rounded-full shadow-sm"></div>
                    <div className="absolute top-6 right-2 w-4 h-4 ring-2 ring-green-600 bg-green-100 rounded-full shadow-sm"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 ring-2 ring-green-600 bg-green-100 rounded-full shadow-sm"></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 ring-2 ring-green-600 bg-green-100 rounded-full shadow-sm"></div>
                </div>
            );
        default:
            return <div className="w-8 h-8 bg-gray-300 rounded-full"></div>;
    }
};

// --- REALISTIC SVG NOODLES ---
const NoodleSVG = ({ type }) => {
    const isThick = type === 'thick';
    const strokeWidth = isThick ? 5 : 2.5;
    const color = isThick ? '#fde047' : '#fef9c3';
    const count = isThick ? 12 : 25;

    // Tighter packing for noodles
    const paths = Array.from({ length: count }).map((_, i) => {
        const startX = 20 + Math.random() * 60;
        const startY = 20 + Math.random() * 60;

        let d = `M ${startX} ${startY}`;
        for (let j = 0; j < 3; j++) {
            const cp1x = startX + (Math.random() - 0.5) * 40;
            const cp1y = startY + (Math.random() - 0.5) * 40;
            const cp2x = startX + (Math.random() - 0.5) * 40;
            const cp2y = startY + (Math.random() - 0.5) * 40;
            const endX = 20 + Math.random() * 60;
            const endY = 20 + Math.random() * 60;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        }

        return (
            <path key={i} d={d} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" className="drop-shadow-sm opacity-90" />
        );
    });

    return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow-reverse" style={{ animationDuration: '60s' }}>
            <circle cx="50" cy="50" r="42" fill={isThick ? '#fef08a' : '#fff9c4'} className="opacity-20 blur-sm" />
            {paths}
        </svg>
    );
}

const SteamParticle = ({ delay }) => (
    <div
        className="absolute bottom-10 w-12 h-12 bg-white rounded-full blur-2xl opacity-0 animate-steam-rise"
        style={{ left: `${20 + Math.random() * 60}%`, animationDelay: `${delay}s`, animationDuration: `${2.5 + Math.random()}s` }}
    />
);

const MidnightDinerPage = () => {
    const { playSound } = useAudio();
    const [currentOrder, setCurrentOrder] = useState(null);
    const [bowl, setBowl] = useState({ broth: null, noodle: null, toppings: [] });
    const [step, setStep] = useState(1);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true);
    const [mascotState, setMascotState] = useState('idle');

    const steamParticles = Array.from({ length: 8 }, (_, i) => i * 0.4);

    useEffect(() => { nextCustomer(); }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) setMascotState('blink');
            else if (Math.random() > 0.95) setMascotState('happy');
            setTimeout(() => setMascotState('idle'), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const nextCustomer = () => {
        setBowl({ broth: null, noodle: null, toppings: [] });
        const randomOrder = ORDERS[Math.floor(Math.random() * ORDERS.length)];
        setCurrentOrder(randomOrder);
        setStep(1);
        setGameState('playing');
        setFeedback(null);
        setMascotState('idle');
    };

    const handleIngredientClick = (type, item) => {
        playSound('pop');
        setMascotState('happy');
        setTimeout(() => setMascotState('idle'), 500);

        if (type === 'broth') {
            setBowl(prev => ({ ...prev, broth: item.id }));
            setStep(2);
        } else if (type === 'noodle') {
            setBowl(prev => ({ ...prev, noodle: item.id }));
            setStep(3);
        } else if (type === 'topping') {
            if (bowl.toppings.length >= 10) return;
            setBowl(prev => ({ ...prev, toppings: [...prev.toppings, item.id] }));
        }
    };

    const handleServe = () => {
        const req = currentOrder.requirements;
        const correctBroth = bowl.broth === req.broth;
        const correctNoodle = bowl.noodle === req.noodle;

        const bowlCounts = bowl.toppings.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
        let toppingsMatch = true;

        // Strict quantity check
        const reqCountTotal = Object.values(req.toppings).reduce((a, b) => a + b, 0);
        const bowlCountTotal = bowl.toppings.length;

        if (reqCountTotal !== bowlCountTotal) toppingsMatch = false;
        else {
            for (const [toppingId, count] of Object.entries(req.toppings)) {
                if (bowlCounts[toppingId] !== count) { toppingsMatch = false; break; }
            }
        }

        if (correctBroth && correctNoodle && toppingsMatch) {
            setFeedback('perfect');
            playSound('success');
            setMascotState('happy');
        } else {
            setFeedback('wrong');
            playSound('error');
        }
        setGameState('result');
    };

    // --- PLATING LOGIC ---
    // Returns style object for absolute positioning
    const getToppingStyle = (type, index, allToppings) => {
        const sameTypeIndices = allToppings.map((t, i) => t === type ? i : -1).filter(i => i !== -1);
        const localIndex = sameTypeIndices.indexOf(index);
        const totalOfType = sameTypeIndices.length;

        // Base centering
        let left = 50;
        let top = 50;
        let zIndex = 20;

        switch (type) {
            case 'chashu':
                // Fan out at bottom (5-7 o'clock)
                // Angle range: 60deg to 120deg (where 90 is bottom)
                const startAngle = 60;
                const endAngle = 120;
                const angleStep = totalOfType > 1 ? (endAngle - startAngle) / (totalOfType - 1) : 0;
                const angle = totalOfType === 1 ? 90 : startAngle + (angleStep * localIndex);
                // Convert angle to cartesian offset
                // Rads
                const rad = (angle * Math.PI) / 180;
                const radius = 25; // % from center
                left = 50 + Math.cos(rad) * radius;
                top = 50 + Math.sin(rad) * radius;
                zIndex = 20 + localIndex;
                break;

            case 'egg':
                // Nest at Top Right (2 o'clock)
                left = 70;
                top = 25 + (localIndex * 15);
                zIndex = 25;
                break;

            case 'nori':
                // Stand at Top Left (11 o'clock), tuck behind noodles ideally but here zIndex 15
                left = 25 - (localIndex * 5);
                top = 15 + (localIndex * 5);
                zIndex = 15; // Behind others
                break;

            case 'naruto':
                // Center accent
                left = 50;
                top = 50;
                zIndex = 30; // On top
                break;

            case 'menma':
                // Right side (3 o'clock)
                left = 80;
                top = 50 + (localIndex * 10);
                zIndex = 18;
                break;

            case 'onion':
                // Scatter center
                left = 40 + Math.random() * 20;
                top = 40 + Math.random() * 20;
                zIndex = 35; // Top garnish
                break;

            default:
                break;
        }

        return { left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)', zIndex };
    }


    return (
        <div className="relative w-full min-h-screen bg-[#1e1b4b] font-sans selection:bg-amber-200 overflow-x-hidden flex flex-col items-center">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 text-yellow-100 opacity-80 animate-pulse">✨</div>
                <div className="absolute -top-10 left-1/4 w-0.5 h-20 bg-gradient-to-b from-transparent to-white rotate-[135deg] animate-[fall_3s_infinite_ease-in-out]"></div>
            </div>

            <div className="w-full p-4 flex justify-between items-center z-50">
                <Link to="/start" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all">
                    <ArrowLeft size={24} />
                </Link>
                <div className="text-white font-bold text-lg tracking-widest opacity-80 font-jp">深夜食堂</div>
                <button onClick={() => setShowTutorial(true)} className="p-2 text-amber-300 hover:text-amber-200 transition-all">
                    <HelpCircle size={24} />
                </button>
            </div>

            <div className="absolute top-0 w-full flex justify-between px-4 sm:px-12 pointer-events-none z-10">
                <div className="w-16 h-24 bg-red-600 rounded-b-xl border-t-8 border-gray-800 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-sway-slow flex items-center justify-center">
                    <span className="text-black font-black text-2xl opacity-60 writing-vertical-rl font-jp">麺</span>
                </div>
                <div className="w-16 h-24 bg-red-600 rounded-b-xl border-t-8 border-gray-800 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-sway-slow-reverse flex items-center justify-center delay-300">
                    <span className="text-black font-black text-2xl opacity-60 writing-vertical-rl font-jp">味</span>
                </div>
            </div>

            <div className="relative mt-8 w-full max-w-md bg-[#fef3c7] border-x-8 border-t-8 border-[#92400e] rounded-t-3xl shadow-2xl flex flex-col min-h-[600px] z-20 mx-4">

                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[110%] h-16 bg-[#92400e] rounded-t-lg shadow-lg flex items-center justify-center">
                    <div className="bg-[#fef3c7] px-8 py-2 rounded border-4 border-[#78350f] shadow-inner">
                        <h1 className="text-[#92400e] font-black text-2xl tracking-widest uppercase">Ramen</h1>
                    </div>
                </div>

                <div className="flex-1 bg-[#fffbeb] p-6 relative flex flex-col items-center">

                    <div className={`relative mt-12 mb-4 w-32 h-32 transition-transform duration-300 ${mascotState === 'happy' ? '-translate-y-2' : ''}`}>
                        <div className="w-full h-full bg-orange-300 rounded-[40%] relative border-4 border-[#78350f] shadow-lg overflow-hidden z-10">
                            <div className={`absolute top-8 left-6 w-4 h-4 bg-black rounded-full transition-all ${mascotState === 'blink' ? 'scale-y-[0.1]' : ''}`}></div>
                            <div className={`absolute top-8 right-6 w-4 h-4 bg-black rounded-full transition-all ${mascotState === 'blink' ? 'scale-y-[0.1]' : ''}`}></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-4 bg-black rounded-full"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full opacity-60"></div>
                        </div>
                        <div className={`absolute -top-2 left-0 w-10 h-10 bg-orange-300 rounded-lg rotate-[-20deg] border-4 border-[#78350f] z-0 ${mascotState === 'happy' ? 'rotate-[-30deg]' : ''} transition-transform`}></div>
                        <div className={`absolute -top-2 right-0 w-10 h-10 bg-orange-300 rounded-lg rotate-[20deg] border-4 border-[#78350f] z-0 ${mascotState === 'happy' ? 'rotate-[30deg]' : ''} transition-transform`}></div>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-md relative w-full mb-4 animate-bounce-in">
                        <p className="text-gray-800 font-medium text-lg leading-snug">
                            {currentOrder?.text.split('**').map((part, i) =>
                                i % 2 === 1 ? <span key={i} className="text-orange-600 font-bold">{part}</span> : part
                            )}
                        </p>
                    </div>

                    {/* 🥣 THE AUTHENTIC BOWL */}
                    {/* Dark Red & Black Gradient for Lacquer look */}
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-b from-[#b91c1c] to-[#450a0a] rounded-full border-[6px] border-[#200000] shadow-2xl flex items-center justify-center overflow-hidden z-30 ring-4 ring-black/20">
                        {/* Rim decoration */}
                        <div className="absolute inset-0 border-[4px] border-[#991b1b] rounded-full opacity-50"></div>

                        {/* Bowl Interior (Broth container) */}
                        <div className="absolute inset-3 bg-[#d7ccc8] rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden">

                            {/* Liquid */}
                            {bowl.broth ? (
                                <div className={`absolute inset-0 ${INGREDIENTS.broth.find(b => b.id === bowl.broth)?.liquidStyle} animate-liquid-fill`}>
                                    {/* Oil Bubbles */}
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="absolute rounded-full bg-white/30 blur-[1px] mix-blend-overlay"
                                            style={{
                                                width: Math.random() * 25 + 5 + 'px',
                                                height: Math.random() * 25 + 5 + 'px',
                                                top: Math.random() * 80 + 10 + '%',
                                                left: Math.random() * 80 + 10 + '%',
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-[#2d2d2d] flex items-center justify-center text-gray-400 font-bold text-xs opacity-20">EMPTY</div>
                            )}

                            {/* Noodles */}
                            {bowl.noodle && (
                                <NoodleSVG type={bowl.noodle} />
                            )}

                            {/* Plated Toppings */}
                            <div className="absolute inset-0 z-20">
                                {bowl.toppings.map((t, i) => {
                                    const style = getToppingStyle(t, i, bowl.toppings);
                                    return (
                                        <div key={`${t}-${i}`} className="absolute transition-all duration-500 ease-out animate-drop-in-bounce" style={style}>
                                            <ToppingVisual type={t} index={i} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* STEAM PARTICLES */}
                            {bowl.broth && steamParticles.map((delay, i) => (
                                <SteamParticle key={i} delay={delay} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🪵 COUNTER */}
                <div className="bg-[#78350f] p-4 text-white relative rounded-t-lg mt-auto min-h-[260px]">

                    {gameState === 'result' ? (
                        <div className="text-center py-8 animate-fade-in-up">
                            <h2 className="text-3xl font-black text-amber-300 mb-2 font-jp">
                                {feedback === 'perfect' ? 'Delicious! (美味しい!)' : 'Oops...'}
                            </h2>
                            {feedback === 'perfect' && <div className="text-5xl mb-4 animate-bounce">😋</div>}
                            {feedback === 'wrong' && <div className="text-5xl mb-4 animate-shake">😖</div>}
                            <button onClick={nextCustomer} className="bg-white text-[#78350f] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                                Next Customer
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Step Indicator */}
                            <div className="flex justify-center gap-4 mb-4 text-xs font-bold uppercase text-amber-200/60">
                                <span className={step === 1 ? 'text-white border-b-2 border-white' : ''}>1. Broth</span>
                                <span className={step === 2 ? 'text-white border-b-2 border-white' : ''}>2. Noodles</span>
                                <span className={step === 3 ? 'text-white border-b-2 border-white' : ''}>3. Toppings</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
                                {step === 1 && INGREDIENTS.broth.map(b => (
                                    <button
                                        key={b.id}
                                        onClick={() => handleIngredientClick('broth', b)}
                                        className="bg-[#fffbeb] text-[#78350f] p-2 rounded-xl border-b-4 border-amber-300/50 flex flex-col items-center justify-between h-24 hover:bg-orange-50 active:scale-95 transition-all"
                                    >
                                        <div className={`w-8 h-8 rounded-full ${b.color} border-2 border-white shadow-sm mt-1`}></div>
                                        <div className="flex flex-col items-center leading-none mb-1">
                                            <span className="text-lg font-black font-jp">{b.label}</span>
                                            <span className="text-[10px] font-bold text-amber-800">{b.romaji}</span>
                                        </div>
                                    </button>
                                ))}

                                {step === 2 && INGREDIENTS.noodle.map(n => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleIngredientClick('noodle', n)}
                                        className="bg-[#fffbeb] text-[#78350f] p-2 rounded-xl border-b-4 border-amber-300/50 flex flex-col items-center justify-center col-span-1.5 h-24 hover:bg-orange-50 active:scale-95 transition-all"
                                    >
                                        <span className="text-3xl">🍜</span>
                                        <span className="text-lg font-black font-jp">{n.label}</span>
                                        <span className="text-xs font-bold text-amber-800">{n.romaji}</span>
                                    </button>
                                ))}

                                {step === 3 && (
                                    <>
                                        {INGREDIENTS.topping.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => handleIngredientClick('topping', t)}
                                                className="bg-[#fffbeb] text-[#78350f] py-1 px-1 rounded-lg border-b-2 border-amber-300/50 flex flex-col items-center justify-center h-20 hover:bg-orange-50 active:scale-95 transition-all relative overflow-hidden group"
                                            >
                                                {/* Badge for count */}
                                                {bowl.toppings.filter(topp => topp === t.id).length > 0 && (
                                                    <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm z-20">
                                                        {bowl.toppings.filter(topp => topp === t.id).length}
                                                    </div>
                                                )}

                                                <div className="scale-50 mb-[-10px] group-hover:scale-60 transition-transform">
                                                    <ToppingVisual type={t.id} index={0} />
                                                </div>
                                                <span className="text-sm font-black font-jp z-10 text-black/80">{t.label}</span>
                                                <span className="text-[9px] font-bold text-amber-900 z-10">{t.romaji}</span>
                                            </button>
                                        ))}
                                        <div className="col-span-3 mt-1">
                                            <button
                                                onClick={handleServe}
                                                disabled={bowl.toppings.length === 0}
                                                className={`w-full bg-green-500 hover:bg-green-400 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 ${bowl.toppings.length === 0 ? 'opacity-50' : ''}`}
                                            >
                                                SERVE ORDER <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* TUTORIAL */}
            {showTutorial && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#fffbeb] border-4 border-[#78350f] rounded-3xl p-6 max-w-sm w-full relative shadow-2xl text-center">
                        <button onClick={() => setShowTutorial(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h2 className="text-2xl font-black text-[#92400e] mb-4">How to Play 🍜</h2>
                        <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                            Authentic Ramen Experience! Match the precise order.
                        </p>
                        <div className="bg-orange-100 p-4 rounded-xl mb-6 text-sm text-[#92400e] font-bold text-left space-y-2">
                            <div className="flex justify-between">
                                <span>"2 Chashu"</span>
                                <span>➔ Tap Chashu 2 times</span>
                            </div>
                            <div className="flex justify-between">
                                <span>"Thick Noodles"</span>
                                <span>➔ Tap Futomen</span>
                            </div>
                        </div>
                        <button onClick={() => setShowTutorial(false)} className="w-full bg-[#f59e0b] text-white font-black py-3 rounded-xl hover:bg-[#d97706] transition-colors">Start Cooking!</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MidnightDinerPage;

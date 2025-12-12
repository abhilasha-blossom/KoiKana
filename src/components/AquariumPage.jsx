import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Fish, Coins } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import PetKoi from './PetKoi';
import useAudio from '../hooks/useAudio';

const AquariumPage = () => {
    const { petData, feedPet, mochiYen } = useProgressContext();
    const { playSound } = useAudio();
    const [bubbles, setBubbles] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'fed', 'poor', 'full'

    // Bubble Generator
    useEffect(() => {
        const interval = setInterval(() => {
            const newBubble = {
                id: Date.now(),
                left: Math.random() * 100,
                size: 10 + Math.random() * 20,
                duration: 5 + Math.random() * 10
            };
            setBubbles(prev => [...prev.slice(-15), newBubble]); // Keep fewer bubbles
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleFeed = () => {
        const result = feedPet();
        if (result) {
            playSound('bloop');
            setFeedback('fed');
        } else {
            if (mochiYen < 10) setFeedback('poor');
            else setFeedback('full');
        }
        setTimeout(() => setFeedback(null), 2000);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-900 selection:bg-cyan-200">

            {/* CSS Aquarium Background - ENHANCED */}
            <div className="absolute inset-0 z-0 pointer-events-none">

                {/* 1. God Rays (Sunbeams) */}
                <div className="absolute inset-0 overflow-hidden opacity-40 mix-blend-overlay">
                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,white_10deg,transparent_20deg,white_30deg,transparent_40deg,white_50deg,transparent_60deg)] animate-spin-slow origin-center blur-3xl"></div>
                </div>

                {/* 2. Floating Particles (Dust/Plankton) */}
                <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={`p-${i}`}
                            className="absolute bg-white rounded-full animate-float-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4}px`,
                                height: `${Math.random() * 4}px`,
                                animationDuration: `${10 + Math.random() * 20}s`,
                                opacity: Math.random()
                            }}
                        />
                    ))}
                </div>

                {/* 3. Seaweed / Plants (CSS Drawn) */}
                <div className="absolute bottom-0 w-full flex justify-around items-end opacity-80 mix-blend-multiply">
                    {/* Plant 1 */}
                    <div className="w-8 h-48 bg-gradient-to-t from-green-800 to-green-400 rounded-t-full origin-bottom animate-sway-slow delay-0"></div>
                    <div className="w-12 h-64 bg-gradient-to-t from-teal-800 to-teal-400 rounded-t-full origin-bottom animate-sway-slow delay-[1000ms]"></div>
                    <div className="w-6 h-32 bg-gradient-to-t from-emerald-800 to-emerald-400 rounded-t-full origin-bottom animate-sway-slow delay-[2000ms]"></div>
                    <div className="w-10 h-56 bg-gradient-to-t from-green-900 to-lime-500 rounded-t-full origin-bottom animate-sway-slow delay-[500ms]"></div>
                </div>

                {/* 4. Sand Bed Texture */}
                <div className="absolute bottom-0 h-40 w-full bg-[#E6D5AC] opacity-100">
                    <div className="w-full h-full bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:4px_4px]"></div>
                    {/* Rounded Hill Effect */}
                    <div className="absolute -top-16 left-0 right-0 h-32 bg-[#E6D5AC] rounded-[100%] scale-x-125 blur-sm"></div>
                </div>

                {/* 5. Bubbles (Foreground) */}
                {bubbles.map(b => (
                    <div
                        key={b.id}
                        className="absolute bottom-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] animate-rise-wobble"
                        style={{
                            left: `${b.left}%`,
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            animationDuration: `${b.duration}s`
                        }}
                    >
                        {/* Bubble Highlight */}
                        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/40 rounded-full blur-[1px]"></div>
                    </div>
                ))}
            </div>

            {/* UI Layer */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none">
                {/* Back Button */}
                <Link
                    to="/start"
                    className="pointer-events-auto p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-blue-900 hover:scale-110 group"
                >
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>

                {/* Stats & Yen */}
                <div className="pointer-events-auto flex flex-col items-end gap-2">
                    <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-500 fill-amber-300" />
                        <span className="font-bold text-blue-900">{mochiYen} Yen</span>
                    </div>
                </div>
            </div>

            {/* Pet Layer */}
            {petData && (
                <PetKoi
                    stats={petData}
                    onFeed={() => { }}
                    onClick={() => handleFeed()}
                />
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-sm px-4">

                {/* Feedback Message */}
                {feedback && (
                    <div className={`
                        px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce
                        ${feedback === 'fed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                    `}>
                        {feedback === 'fed' && "Yummy! (+XP, -Hunger)"}
                        {feedback === 'poor' && "Not enough Yen! (Need 10¥)"}
                        {feedback === 'full' && "I'm full!"}
                    </div>
                )}

                {/* Main Feed Button */}
                <button
                    onClick={handleFeed}
                    className="pointer-events-auto group relative px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow-[0_8px_0_rgb(180,83,9)] active:shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 transition-all flex items-center gap-3 font-black text-xl"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Fish className="w-6 h-6 animate-pulse" />
                    <span className="relative drop-shadow-md">FEED (10¥)</span>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce shadow-sm">
                        XP UP!
                    </div>
                </button>
            </div>

        </div>
    );
};

export default AquariumPage;

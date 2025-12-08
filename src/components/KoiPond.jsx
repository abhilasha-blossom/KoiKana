import React, { useState, useEffect, useRef } from 'react';
import useAudio from '../hooks/useAudio';

// Individual Fish Component to handle local hover state
const Fish = ({ f }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);
    const { playSound } = useAudio();

    // Speed up tail wagging on hover
    useEffect(() => {
        if (videoRef.current) {
            // Normal speed 1.0, Hover speed 4.0
            videoRef.current.playbackRate = isHovered ? 4.0 : 1.0;
        }
        if (isHovered) {
            playSound('splash'); // Gentle splash on interaction
        }
    }, [isHovered, playSound]);

    return (
        <div
            className="absolute mix-blend-multiply"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                top: f.top,
                width: f.size,
                height: 'auto',
                animation: `${f.direction === 'left' ? 'swim' : 'swim-reverse'} ${f.duration} linear infinite`,
                animationDelay: f.delay,
                opacity: f.opacity,
                // On hover, bring to VERY front (50) so it's not blocked by others
                zIndex: isHovered ? 50 : 20,
                pointerEvents: 'auto',
                cursor: 'pointer',
                // Scale effect on hover
                transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.3s ease-out, z-index 0s'
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                // Time Trim to avoid grey start
                onTimeUpdate={(e) => {
                    if (e.target.currentTime < 0.1) e.target.currentTime = 0.1;
                }}
                className="w-full h-full object-contain"
                style={{
                    // Dark Mode Visibility Boost (+ Hover Boost)
                    filter: isHovered
                        ? 'contrast(1.5) brightness(1.6) saturate(1.8)' // Super bright on hover
                        : 'contrast(1.4) brightness(1.3) saturate(1.5)',
                    // Soft Mask
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
                }}
            >
                <source src="/assets/pond_bg.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

const KoiPond = () => {
    const [ripples, setRipples] = useState([]);
    const [fish, setFish] = useState([]);
    const { playSound } = useAudio();

    // Initialize fish with random properties
    useEffect(() => {
        // Reduced to 6 fish to prevent overcrowded layers blocking interactions
        const initialFish = Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            direction: Math.random() > 0.5 ? 'left' : 'right',
            top: `${Math.random() * 85}%`, // Keep them a bit more centered vertically
            size: `${180 + Math.random() * 100}px`, // Slightly larger to be easier to hit
            duration: `${15 + Math.random() * 20}s`,
            delay: `${Math.random() * -20}s`,
            opacity: 0.8 + Math.random() * 0.2
        }));
        setFish(initialFish);
    }, []);

    // Global click listener for ripples
    useEffect(() => {
        const handleGlobalClick = (e) => {
            const ripple = {
                id: Date.now(),
                x: e.pageX,
                y: e.pageY
            };
            setRipples(prev => [...prev, ripple]);
            playSound('splash'); // Sound of water click
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== ripple.id));
            }, 1000);
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [playSound]);

    return (
        <div
            className="fixed inset-0 w-full h-full overflow-hidden"
            style={{ zIndex: 0, pointerEvents: 'none' }}
        >
            {/* Base Gradient Background - Lighter Slate for visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0F5] to-blue-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-1000 -z-30" />

            {/* Swimming Video Koi Layer */}
            {fish.map((f) => (
                <Fish key={f.id} f={f} />
            ))}

            {/* Ripples Layer - On Top */}
            {ripples.map(r => (
                <div
                    key={r.id}
                    className="absolute rounded-full pointer-events-none animate-ripple"
                    style={{
                        left: r.x,
                        top: r.y,
                        width: '50px',
                        height: '50px',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                    }}
                />
            ))}
        </div>
    );
};

export default KoiPond;

import React, { useState, useRef } from 'react';
import { X, Trophy, Play, RefreshCw } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import { hiragana, katakana } from '../data/kanaData';

// Constants
const GAME_WIDTH = 800; // Virtual coordinate system
const GAME_HEIGHT = 600;
const GRAVITY = 0.12; // Even Floatier for smoother gameplay
const SPAWN_RATE = 1500; // Slower
const MAX_LIVES = 3;

// Kawaii Colors
const PALETTE = {
    target: { body: ['#FFB7B2', '#FF9AA2'], cap: '#FFDAC1', text: '#FFF' }, // Pastel Red/Pink
    distractor: { body: ['#B5EAD7', '#C7CEEA'], cap: '#E2F0CB', text: '#FFF' }, // Pastel Blue/Green
    glowTarget: '#FF9AA2',
    glowDistractor: '#A0E7E5'
};

const KanaSlice = ({ onExit, scriptType = 'hiragana' }) => {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [targetChar, setTargetChar] = useState(null);
    const [slashLine, setSlashLine] = useState([]); // [{x,y}, ...]

    // Refs for Loop & Physics
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const objectsRef = useRef([]);
    const particlesRef = useRef([]);
    const lastSpawnTime = useRef(0);
    const isMouseDown = useRef(false);
    const scoreRef = useRef(0);
    const livesRef = useRef(MAX_LIVES);

    // Loop Control Refs (To avoid stale closures)
    const isPlayingRef = useRef(false);
    const gameOverRef = useRef(false);
    const targetCharRef = useRef(null); // Fix for stale target logic

    const { playSound } = useAudio();

    // Data Pool
    const getPool = () => {
        let pool = [];
        if (scriptType === 'hiragana' || scriptType === 'mix') pool = [...pool, ...hiragana];
        if (scriptType === 'katakana' || scriptType === 'mix') pool = [...pool, ...katakana];
        return pool.filter(k => k.char);
    };

    const pool = getPool();

    // --- GAME LOOP ---
    const animate = (time) => {
        if (!isPlayingRef.current || gameOverRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const scaleX = canvas.width / GAME_WIDTH;
        const scaleY = canvas.height / GAME_HEIGHT;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. SPAWN LOGIC
        if (time - lastSpawnTime.current > SPAWN_RATE) {
            spawnLantern();
            lastSpawnTime.current = time;
        }

        // 2. UPDATE PHYSICS
        // Update Objects
        objectsRef.current.forEach(obj => {
            obj.x += obj.vx;
            obj.y += obj.vy;
            obj.vy += GRAVITY; // Gravity
            obj.rotation += 0.01; // Gentle rotation
        });

        // Remove off-screen objects (Bottom)
        objectsRef.current = objectsRef.current.filter(obj => {
            if (obj.y > GAME_HEIGHT + 100) {
                // DROP LOGIC: No penalty for missing dropped lanterns
                // This makes the game friendlier as per user request
                return false;
            }
            return true;
        });

        // Update Particles
        particlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
        });
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);


        // 3. RENDER
        // Draw Lanterns
        objectsRef.current.forEach(obj => {
            if (obj.hit) return;

            const cx = obj.x * scaleX;
            const cy = obj.y * scaleY;
            const r = obj.radius * scaleX;
            const isTgt = obj.char === targetCharRef.current?.char;
            const colors = isTgt ? PALETTE.target : PALETTE.distractor;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(obj.baseRotation + Math.sin(time / 400) * 0.15); // Slower, swayier

            // Glow
            ctx.shadowColor = isTgt ? PALETTE.glowTarget : PALETTE.glowDistractor;
            ctx.shadowBlur = isTgt ? 30 : 15;

            // Lantern Body (Kawaii Round Shape)
            const grad = ctx.createLinearGradient(0, -r, 0, r);
            grad.addColorStop(0, colors.body[0]);
            grad.addColorStop(1, colors.body[1]);
            ctx.fillStyle = grad;

            // Draw Main Body (Wider/Squashier)
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 1.3, r * 1.0, 0, 0, Math.PI * 2);
            ctx.fill();

            // Ribs (Horizontal lines)
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 2;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.ellipse(0, (i * r * 2 / 5) - r, r * 0.9, r * 0.1, 0, 0, Math.PI * 2); // Curved lines
                ctx.stroke();
            }

            // Top Cap (Black/Gold)
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.roundRect(-r * 0.4, -r * 1.2, r * 0.8, r * 0.2, 5);
            ctx.fill();

            // Bottom Cap
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.roundRect(-r * 0.4, r * 1.0, r * 0.8, r * 0.2, 5);
            ctx.fill();

            // Tassel (Simple line + blob)
            ctx.fillStyle = isTgt ? "#FF6B6B" : "#4ECDC4";
            ctx.beginPath(); // String
            ctx.moveTo(0, r * 1.2);
            ctx.lineTo(0, r * 1.8);
            ctx.stroke();
            ctx.beginPath(); // Blob
            ctx.arc(0, r * 1.8, 5, 0, Math.PI * 2);
            ctx.fill();

            // Text (Cute Font)
            ctx.shadowBlur = 0; // Clear shadow for text
            ctx.fillStyle = colors.text;
            ctx.font = `bold ${r}px "M PLUS Rounded 1c", sans-serif`; // Use a rounder font if available, fallback sans
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obj.char, 0, 0);

            ctx.restore();
        });

        // Draw Particles (Confetti style)
        particlesRef.current.forEach(p => {
            const cx = p.x * scaleX;
            const cy = p.y * scaleY;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            // Star or Circle? Circle is kawaii enough
            ctx.arc(cx, cy, p.size || 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        });

        // Draw Slash Line (TRUE NEON FRUIT NINJA STYLE)
        if (slashLine.length > 1) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // 1. Outer Glow (Colored)
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#00FFFF'; // Bright Neon Cyan
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#00FFFF';

            ctx.beginPath();
            const trail = slashLine.slice(-20); // Longer history
            trail.forEach((pt, i) => {
                const tx = pt.x * scaleX;
                const ty = pt.y * scaleY;
                if (i === 0) ctx.moveTo(tx, ty);
                else ctx.lineTo(tx, ty);
            });
            ctx.stroke();

            // 2. Inner Core (White)
            ctx.shadowBlur = 0;
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke(); // Re-stroke the same path
        }

        // Decay Slash
        if (slashLine.length > 0) {
            setSlashLine(prev => prev.slice(1));
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    const spawnLantern = () => {
        // Use Ref for target comparison logic
        const currentTarget = targetCharRef.current;
        const isTarget = Math.random() > 0.3; // 70% chance of target (More frequent)
        let charData;

        if (isTarget && currentTarget) {
            charData = currentTarget;
        } else {
            // Pick random distractor != target
            do {
                charData = pool[Math.floor(Math.random() * pool.length)];
            } while (charData.char === currentTarget?.char);
        }

        const radius = 65;
        const x = radius + Math.random() * (GAME_WIDTH - radius * 2);
        const y = GAME_HEIGHT + radius;
        // Toss Upwards slower
        const vx = (GAME_WIDTH / 2 - x) * 0.002 + (Math.random() - 0.5) * 2;
        const vy = -(10 + Math.random() * 4);

        const newObj = {
            id: Date.now() + Math.random(),
            x, y, vx, vy,
            char: charData.char,
            romaji: charData.romaji,
            radius,
            hit: false,
            baseRotation: (Math.random() - 0.5) * 0.2,
            rotation: 0
        };

        objectsRef.current.push(newObj);
    };

    const startGame = () => {
        const t = pool[Math.floor(Math.random() * pool.length)];
        setTargetChar(t);
        targetCharRef.current = t; // Sync Ref!

        setScore(0);
        scoreRef.current = 0;
        setLives(MAX_LIVES);
        livesRef.current = MAX_LIVES;
        objectsRef.current = [];
        particlesRef.current = [];
        setGameOver(false);
        gameOverRef.current = false;

        setIsPlaying(true);
        isPlayingRef.current = true;

        lastSpawnTime.current = performance.now();

        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(animate);
    };

    const endGame = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;

        setGameOver(true);
        gameOverRef.current = true;

        cancelAnimationFrame(requestRef.current);
    };

    // --- INPUT HANDLERS ---
    const handlePointerDown = (e) => {
        e.preventDefault();
        isMouseDown.current = true;
        updateSlash(e);
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        // Safety: If buttons is 0, user is NOT clicking, force false
        if (e.buttons === 0) {
            isMouseDown.current = false;
            setSlashLine([]);
            return;
        }

        if (isMouseDown.current) {
            updateSlash(e);
            checkCollision();
        }
    };

    const handlePointerUp = () => {
        isMouseDown.current = false;
        setSlashLine([]);
    };

    const updateSlash = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = GAME_WIDTH / rect.width;
        const scaleY = GAME_HEIGHT / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setSlashLine(prev => [...prev, { x, y }]);
    };

    const checkCollision = () => {
        if (slashLine.length < 2) return;

        const p1 = slashLine[slashLine.length - 2];
        const p2 = slashLine[slashLine.length - 1];

        // VELOCITY CHECK: Prevent slow drag/hover kills
        const speed = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (speed < 10) return;

        objectsRef.current.forEach(obj => {
            if (obj.hit) return;

            const dist = pointToSegmentDistance(obj.x, obj.y, p1.x, p1.y, p2.x, p2.y);

            // SUPER FORGIVING HITBOX
            if (dist < obj.radius * 1.5) {
                // SLICE!
                obj.hit = true;
                const isCorrect = obj.char === targetCharRef.current?.char;
                createParticles(obj.x, obj.y, isCorrect ? '#FF9AA2' : '#C7CEEA'); // Pastel particles

                if (isCorrect) {
                    playSound('success');
                    scoreRef.current += 10;
                    setScore(scoreRef.current);

                    // New Target (Fix Repetition)
                    let t;
                    do {
                        t = pool[Math.floor(Math.random() * pool.length)];
                    } while (t.char === targetCharRef.current?.char && pool.length > 1);

                    setTargetChar(t);
                    targetCharRef.current = t; // Sync Ref
                } else {
                    playSound('incorrect');
                    livesRef.current -= 1;
                    setLives(livesRef.current);
                    if (livesRef.current <= 0) endGame();
                }
            }
        });
    };

    const createParticles = (x, y, color) => {
        for (let i = 0; i < 12; i++) {
            particlesRef.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1.0,
                color,
                size: Math.random() * 5 + 2
            });
        }
    };

    const pointToSegmentDistance = (px, py, ax, ay, bx, by) => {
        const l2 = (bx - ax) ** 2 + (by - ay) ** 2;
        if (l2 === 0) return Math.hypot(px - ax, py - ay);
        let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)));
    };

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden touch-none select-none">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent flex items-center justify-between px-6 z-10 pointer-events-none">
                <div className="flex flex-col">
                    <span className="text-pink-200 text-xs uppercase tracking-wider font-bold">Target</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm filter drop-shadow-[0_0_10px_rgba(249,168,212,0.5)]">
                        {isPlaying ? targetChar?.romaji : "---"}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-pink-200 text-xs font-bold">Score</span>
                    <span className="text-2xl font-bold text-white drop-shadow-md">{score}</span>
                </div>

                <div className="flex gap-1 text-2xl filter drop-shadow-lg">
                    {Array.from({ length: MAX_LIVES }).map((_, i) => (
                        <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>❤️</span>
                    ))}
                </div>

                <button onClick={onExit} className="pointer-events-auto p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6 text-pink-100" />
                </button>
            </div>

            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-crosshair"
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            />

            {/* Start Overlay */}
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center animate-fade-in">
                    <div className="mb-6 animate-bounce-slow">
                        <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(249,168,212,0.6)]">🏮</span>
                    </div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-4 drop-shadow-lg">
                        KANA <span className="text-white">SLICE</span>
                    </h1>
                    <p className="text-pink-100 mb-8 max-w-sm text-lg font-medium">
                        Swipe to clear the <span className="text-white">Kawaii Lanterns</span>!
                    </p>
                    <button
                        onClick={startGame}
                        className="px-10 py-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full font-black text-xl text-white shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group ring-2 ring-white/20"
                    >
                        <Play className="fill-current w-6 h-6 group-hover:ml-1 transition-all" /> START FESTIVAL
                    </button>
                </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center animate-fade-in-up">
                    <Trophy className="w-24 h-24 text-yellow-300 mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
                    <h2 className="text-4xl font-bold text-white mb-2">Good Effort!</h2>
                    <p className="text-xl text-pink-200 mb-8">Score: <span className="text-white font-black text-4xl ml-2">{score}</span></p>

                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors flex items-center gap-2 shadow-xl shadow-pink-500/20"
                    >
                        <RefreshCw className="w-5 h-5" /> Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default KanaSlice;

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Eraser, CheckCircle, Wind } from 'lucide-react';
import useProgress from '../hooks/useProgress';
import useAudio from '../hooks/useAudio';

const ZenGardenCanvas = ({ char }) => {
    const canvasRef = useRef(null);
    const targetCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [score, setScore] = useState(0);

    const { markMastered } = useProgress();
    const { playSound } = useAudio();
    const lastSoundTime = useRef(0);

    useEffect(() => {
        const initCanvas = (canvas, isTarget = false) => {
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            if (isTarget) {
                // Render the Target Character
                const fontSize = rect.width * 0.6;
                ctx.font = `bold ${fontSize}px "Noto Sans JP", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000000';
                ctx.fillText(char, rect.width / 2, rect.height / 2 + (fontSize * 0.1));
            } else {
                // Setup Rake Brush
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = rect.width * 0.12; // Thicker rake

                // Rake Style: Dark Grey for depth in sand
                ctx.strokeStyle = '#4b5563';
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(0,0,0,0.2)';
            }
        };

        if (canvasRef.current) initCanvas(canvasRef.current, false);
        if (targetCanvasRef.current) initCanvas(targetCanvasRef.current, true);

        // Reset state on char change
        setIsCorrect(false);
        setIsWrong(false);
        setHasDrawn(false);
        setScore(0);

    }, [char]);

    const playRakeSound = () => {
        const now = Date.now();
        if (now - lastSoundTime.current > 150) { // Throttle sound
            // We don't have a specific rake sound, so we use a subtle pop or existing sound for feedback
            // Ideal would be a white noise burst, but 'hover' might work as a placeholder
        }
    };

    const startDrawing = (e) => {
        if (isCorrect) return;
        setIsWrong(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
        playRakeSound();
    };

    const draw = (e) => {
        if (!isDrawing || isCorrect) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        playRakeSound();
    };

    const validateDrawing = () => {
        const userCanvas = canvasRef.current;
        const targetCanvas = targetCanvasRef.current;
        if (!userCanvas || !targetCanvas) return;

        const userCtx = userCanvas.getContext('2d');
        const targetCtx = targetCanvas.getContext('2d');

        const width = userCanvas.width;
        const height = userCanvas.height;

        const userImg = userCtx.getImageData(0, 0, width, height);
        const targetImg = targetCtx.getImageData(0, 0, width, height);

        let targetPixels = 0;
        let overlapPixels = 0;
        let outsidePixels = 0;

        for (let i = 0; i < targetImg.data.length; i += 4) {
            const targetAlpha = targetImg.data[i + 3];
            const userAlpha = userImg.data[i + 3];

            if (targetAlpha > 50) {
                targetPixels++;
                if (userAlpha > 50) overlapPixels++;
            } else if (userAlpha > 50) {
                outsidePixels++;
            }
        }

        const coverage = targetPixels > 0 ? (overlapPixels / targetPixels) : 0;
        const totalUserPixels = overlapPixels + outsidePixels;
        const precision = totalUserPixels > 0 ? (overlapPixels / totalUserPixels) : 0;

        if (coverage > 0.35 && precision > 0.4) {
            setIsCorrect(true);
            setScore(100);
            markMastered(char);
            playSound('success');
        } else {
            setIsWrong(true);
            setScore(Math.round(coverage * 100));
            playSound('error');
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        setHasDrawn(false);
        setIsCorrect(false);
        setIsWrong(false);
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center w-full animate-fade-in space-y-4">

            {/* ZEN GARDEN FRAME */}
            <div className={`
                relative w-full aspect-square max-w-[300px] rounded-[2rem] overflow-hidden 
                shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] border-8 border-[#D7C4BB] 
                transition-all duration-500 transform 
                ${isCorrect ? 'border-green-300 ring-4 ring-green-100' : isWrong ? 'border-red-300 shake-animation' : 'border-[#e5d5ce]'}
            `}>

                {/* SAND TEXTURE BACKGROUND */}
                <div className={`
                    absolute inset-0 transition-all duration-500 
                    bg-[#fdfcf8]
                    ${isCorrect ? 'bg-green-50' : ''}
                `}
                    style={{
                        backgroundImage: `url('https://www.transparenttextures.com/patterns/sand-mountain.png')`,
                        backgroundBlendMode: 'multiply'
                    }}
                ></div>

                {/* Hidden Guide Grid */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-30">
                    {!isCorrect && (
                        <>
                            <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-stone-300"></div>
                            <div className="absolute h-full w-px bg-stone-200"></div>
                            <div className="absolute w-full h-px bg-stone-200"></div>
                        </>
                    )}
                </div>

                {/* Target Canvas (Ghost) */}
                <canvas
                    ref={targetCanvasRef}
                    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none mix-blend-multiply"
                />

                {/* User Rake Canvas */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full ${isCorrect ? 'cursor-default pointer-events-none' : 'cursor-none'}`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {/* Custom Cursor Indicator (The Rake Point) */}
                {!isCorrect && !hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-300 animate-pulse text-sm font-medium">
                        Draw here
                    </div>
                )}

                {/* Success Overlay */}
                {isCorrect && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce-in z-20">
                        <div className="bg-white/90 backdrop-blur-md rounded-full p-6 shadow-2xl border-4 border-green-200">
                            <Wind className="w-12 h-12 text-green-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between w-full max-w-[300px] h-14 px-2">
                {!isCorrect ? (
                    <>
                        <div className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            {isWrong ? (
                                <span className="text-red-400 animate-pulse">Try Again</span>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                                    Zen Mode
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {hasDrawn && (
                                <>
                                    <button
                                        onClick={clearCanvas}
                                        className="p-3 bg-[#efebe9] hover:bg-[#e7e1de] text-stone-500 rounded-full transition-colors shadow-sm"
                                        title="Rake Sand (Clear)"
                                    >
                                        <Eraser className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={validateDrawing}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-transform active:scale-95 shadow-md font-bold text-sm text-white
                                            ${isWrong ? 'bg-red-400 hover:bg-red-500' : 'bg-stone-500 hover:bg-stone-600'}
                                        `}
                                    >
                                        Check
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full gap-4 animate-fade-in">
                        <span className="text-green-600 font-bold text-lg drop-shadow-sm font-serif italic">Beautiful!</span>
                        <button
                            onClick={clearCanvas}
                            className="flex items-center gap-2 px-5 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors font-bold text-sm shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> New Paper
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZenGardenCanvas;

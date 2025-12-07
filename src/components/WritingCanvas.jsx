import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Eraser, CheckCircle } from 'lucide-react';

const WritingCanvas = ({ char }) => {
    const canvasRef = useRef(null);
    const targetCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [score, setScore] = useState(0);

    // Initialize Canvases
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
                ctx.font = 'bold 200px "Noto Sans JP", sans-serif'; // Must match CSS
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000000';
                ctx.fillText(char, rect.width / 2, rect.height / 2 + 20); // Adjust Y for font baseline
            } else {
                // Setup Drawing Canvas
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 20; // Thicker brush for easier filling
                ctx.strokeStyle = '#4A3B52';
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

    const startDrawing = (e) => {
        if (isCorrect) return; // Disable drawing if already correct
        setIsWrong(false); // Reset error state on new stroke
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
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
    };

    const validateDrawing = () => {
        const userCanvas = canvasRef.current;
        const targetCanvas = targetCanvasRef.current;
        if (!userCanvas || !targetCanvas) return;

        const userCtx = userCanvas.getContext('2d');
        const targetCtx = targetCanvas.getContext('2d');

        const width = userCanvas.width;
        const height = userCanvas.height;

        // Get pixel data
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
                if (userAlpha > 50) {
                    overlapPixels++;
                }
            } else if (userAlpha > 50) {
                outsidePixels++;
            }
        }

        const coverage = targetPixels > 0 ? (overlapPixels / targetPixels) : 0;
        const totalUserPixels = overlapPixels + outsidePixels;
        const precision = totalUserPixels > 0 ? (overlapPixels / totalUserPixels) : 0;

        // Strictness Update
        if (coverage > 0.35 && precision > 0.4) {
            setIsCorrect(true);
            setScore(100);
        } else {
            // Failed
            setIsWrong(true);
            setScore(Math.round(coverage * 100));
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Nuking the canvas correctly: Reset transform, clear, then restore setup
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore(); // Restore context state

        setHasDrawn(false);
        setIsCorrect(false);
        setIsWrong(false);
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center w-full animate-fade-in space-y-4">

            <div className={`relative w-full aspect-square max-w-[300px] rounded-3xl overflow-hidden shadow-inner border-4 transition-all duration-500 transform ${isCorrect ? 'border-green-400 scale-105 shadow-green-200' : isWrong ? 'border-red-400 shake-animation' : 'border-[#E6E6E6]'}`}>
                {/* Background Color */}
                <div className={`absolute inset-0 transition-colors duration-500 ${isCorrect ? 'bg-green-50' : isWrong ? 'bg-red-50' : 'bg-[#F9F7F2]'}`}></div>

                {/* Hidden Tracing Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    {/* Grid Lines */}
                    {!isCorrect && !isWrong && (
                        <>
                            <div className="absolute inset-0 border-t border-b border-dashed border-red-100 top-1/2 left-0 w-full h-0"></div>
                            <div className="absolute inset-0 border-l border-r border-dashed border-red-100 left-1/2 top-0 w-0 h-full"></div>
                        </>
                    )}
                </div>

                {/* Target Canvas */}
                <canvas
                    ref={targetCanvasRef}
                    className="absolute inset-0 w-full h-full opacity-20 pointer-events-none transition-opacity duration-500"
                />

                {/* User Canvas */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full ${isCorrect ? 'cursor-default pointer-events-none' : 'cursor-crosshair active:cursor-none'}`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {/* Success Overlay */}
                {isCorrect && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce-in">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* Controls & Feedback */}
            <div className="flex items-center justify-between w-full max-w-[300px] h-14 px-2">
                {!isCorrect ? (
                    <>
                        <div className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            {isWrong ? (
                                <span className="text-red-500 animate-pulse font-bold">Try Again!</span>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Zen Mode
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {hasDrawn && (
                                <>
                                    <button
                                        onClick={clearCanvas}
                                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                                        title="Clear"
                                    >
                                        <Eraser className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={validateDrawing}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-lg font-bold text-sm ${isWrong ? 'bg-red-500 hover:bg-red-600 shadow-red-200 text-white' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200 text-white'}`}
                                    >
                                        <CheckCircle className="w-5 h-5" /> Check
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full gap-4 animate-fade-in">
                        <span className="text-green-500 font-bold text-xl drop-shadow-sm">Excellent!</span>
                        <button
                            onClick={clearCanvas}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors font-bold text-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> Again
                        </button>
                    </div>
                )}
            </div>

            {/* Debug Score */}
            <div className="text-xs text-gray-300">Accuracy: {score}%</div>
        </div>
    );
};

export default WritingCanvas;

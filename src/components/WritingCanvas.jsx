import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Eraser } from 'lucide-react';

const WritingCanvas = ({ char }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#4A3B52'; // Ink color

        // Prevent scrolling when touching canvas
        canvas.style.touchAction = 'none';

    }, [char]);

    const startDrawing = (e) => {
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
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full aspect-square max-w-[300px] bg-[#F9F7F2] rounded-3xl overflow-hidden shadow-inner border-4 border-[#E6E6E6]">

                {/* Tracing Guide (Background Character) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[200px] font-bold text-gray-200 jp-font opacity-60">
                        {char}
                    </span>
                    {/* Grid Lines for precision */}
                    <div className="absolute inset-0 border-t border-b border-dashed border-red-100 top-1/2 left-0 w-full h-0"></div>
                    <div className="absolute inset-0 border-l border-r border-dashed border-red-100 left-1/2 top-0 w-0 h-full"></div>
                </div>

                {/* The Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair active:cursor-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Zen Mode
                </div>

                {hasDrawn && (
                    <button
                        onClick={clearCanvas}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors font-bold text-sm"
                    >
                        <Eraser className="w-4 h-4" /> Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default WritingCanvas;

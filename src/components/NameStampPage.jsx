import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, RefreshCw, PenTool, Sparkles, Type as TypeIcon } from 'lucide-react'; // Added type icon
import { Link } from 'react-router-dom';
import { toKatakana, toHiragana } from '../utils/romajiToKatakana';
import useAudio from '../hooks/useAudio';

const NameStampPage = () => {
    const { playSound } = useAudio();
    const [name, setName] = useState('');
    const [style, setStyle] = useState('katakana'); // 'katakana' | 'hiragana'
    const [showInfo, setShowInfo] = useState(false);
    const canvasRef = useRef(null);

    const convertedName = style === 'katakana' ? toKatakana(name) : toHiragana(name);
    // Dynamic color based on style? Hankos are red, but let's subtly shift shade maybe
    const mainColor = style === 'katakana' ? 'bg-red-500' : 'bg-rose-400';
    const borderColor = style === 'katakana' ? 'border-red-700' : 'border-rose-600';
    const glowColor = style === 'katakana' ? 'bg-red-100' : 'bg-rose-100';

    const handleDownload = () => {
        playSound('pop');
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Clear and preset
        ctx.clearRect(0, 0, 300, 300);

        // Draw Stamp Circle
        ctx.beginPath();
        ctx.arc(150, 150, 130, 0, 2 * Math.PI);
        ctx.fillStyle = style === 'katakana' ? '#ef4444' : '#fb7185'; // Red-500 vs Rose-400
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = style === 'katakana' ? '#b91c1c' : '#e11d48'; // Red-700 vs Rose-600
        ctx.stroke();

        // Draw Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Vertical Text Logic (simplistic for 2-4 chars, else horizontal)
        const text = convertedName || (style === 'katakana' ? 'アナタ' : 'あなた');
        if (text.length <= 3) {
            // Vertical approximation
            let startY = 150 - ((text.length - 1) * 40);
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], 150, startY + (i * 85));
            }
        } else {
            // Just horizontal scale
            ctx.fillText(text, 150, 150);
        }

        // Save
        const link = document.createElement('a');
        link.download = `my-name-stamp-${style}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#FFF0F5] relative overflow-hidden flex flex-col items-center p-6 pb-20 selection:bg-pink-200">
            {/* Background Decorations */}
            <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] ${style === 'katakana' ? 'bg-red-100/40' : 'bg-pink-100/40'} rounded-full blur-[100px] pointer-events-none mix-blend-multiply transition-colors duration-500`}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            {/* Back Button */}
            <Link to="/start" className="absolute top-6 left-6 p-4 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-[#4A3B52] z-50 hover:scale-110 group sticky">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <div className="max-w-md w-full mt-12 relative z-10 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm text-sm font-medium ${style === 'katakana' ? 'text-red-500' : 'text-rose-500'} mb-6 shadow-sm`}>
                    <PenTool className="w-3 h-3" /> Digital Hanko Maker
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[#4A3B52] mb-3 leading-tight">
                    Your Name inside <br />
                    <span className={`${style === 'katakana' ? 'text-red-500' : 'text-rose-400'} transition-colors duration-300`}>
                        {style === 'katakana' ? 'Katakana' : 'Hiragana'}
                    </span>
                </h1>
                <p className="text-[#7A6B82] mb-8">
                    Type your name to create a traditional Japanese seal stamp.
                </p>

                {/* STYLE TOGGLE */}
                <div className="flex justify-center gap-2 mb-8 bg-white/50 p-1.5 rounded-full backdrop-blur-sm inline-flex">
                    <button
                        onClick={() => setStyle('katakana')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${style === 'katakana' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-white/50'}`}
                    >
                        Katakana (Official)
                    </button>
                    <button
                        onClick={() => setStyle('hiragana')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${style === 'hiragana' ? 'bg-rose-400 text-white shadow-md' : 'text-gray-500 hover:bg-white/50'}`}
                    >
                        Hiragana (Cute)
                    </button>
                </div>

                {/* Input Area */}
                <div className="mb-12">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type name (e.g. Sarah)..."
                        className="w-full text-center text-3xl font-bold p-4 rounded-2xl bg-white/70 border-2 border-white focus:border-red-400 focus:outline-none shadow-sm text-[#4A3B52] placeholder:text-gray-300 transition-all"
                        maxLength={12}
                    />
                    <div className="mt-2 text-sm text-gray-400 font-medium">
                        {convertedName ? `Translates to: ${convertedName}` : 'Start typing...'}
                    </div>
                </div>

                {/* STAMP PREVIEW */}
                <div className="relative w-64 h-64 mx-auto mb-12 group perspective">
                    <div className={`absolute inset-0 ${glowColor} rounded-full blur-3xl opacity-50 animate-pulse-slow transition-colors duration-500`}></div>

                    {/* The Stamp Itself */}
                    <div
                        className={`
                            relative w-full h-full rounded-full border-[8px] ${borderColor} ${mainColor} shadow-xl 
                            flex items-center justify-center text-white font-black overflow-hidden
                            transition-all duration-500 hover:rotate-6 hover:scale-105
                            ${!name ? 'opacity-50 grayscale' : 'opacity-100'}
                        `}
                    >
                        {/* Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grunge-wall.png')] opacity-30 mix-blend-overlay"></div>

                        <div className={`leading-none flex flex-col items-center justify-center ${convertedName.length > 3 ? 'text-5xl' : 'text-7xl space-y-2'}`}>
                            {convertedName.length > 0 ? (
                                convertedName.length <= 3 ? (
                                    // Vertical text for short names
                                    convertedName.split('').map((char, i) => <span key={i}>{char}</span>)
                                ) : (
                                    // Horizontal/Wrap for long names
                                    <span className="break-all px-4 leading-normal">{convertedName}</span>
                                )
                            ) : (
                                <span className="opacity-50 text-4xl">???</span>
                            )}
                        </div>
                    </div>

                    {/* Hidden Canvas for Export */}
                    <canvas ref={canvasRef} width="300" height="300" className="hidden"></canvas>
                </div>

                {/* Actions */}
                <button
                    onClick={handleDownload}
                    disabled={!name}
                    className={`w-full py-4 rounded-2xl ${style === 'katakana' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-rose-400 to-pink-400'} text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 mb-6`}
                >
                    <Download className="w-6 h-6" /> Download Stamp
                </button>

                {/* Fun Fact Toggle */}
                <button
                    onClick={() => setShowInfo(true)}
                    className="text-[#7A6B82] text-sm font-medium hover:text-pink-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    <Sparkles className="w-4 h-4" /> Why these letters? (Fun Fact)
                </button>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border-4 border-pink-100">
                        <button
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" /> {/* Close icon visual */}
                        </button>

                        <h2 className="text-2xl font-black text-[#4A3B52] mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            Did you know?
                        </h2>

                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                <h3 className="font-bold text-red-500 mb-1 flex items-center gap-2">
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">ア</span>
                                    Katakana
                                </h3>
                                <p className="text-sm text-[#7A6B82] leading-relaxed">
                                    Reserved for <strong>Foreign Names</strong> and Loan Words. Since your name isn't originally Japanese, this is the <strong>grammatically correct</strong> choice! A real shop in Japan would use this.
                                </p>
                            </div>

                            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                                <h3 className="font-bold text-pink-500 mb-1 flex items-center gap-2">
                                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded">あ</span>
                                    Hiragana
                                </h3>
                                <p className="text-sm text-[#7A6B82] leading-relaxed">
                                    Used for native Japanese words. It's much <strong>softer and curvier</strong> (Style Choice). We added this so you can have a "Cute" version!
                                </p>
                            </div>

                            <div className="pl-2 border-l-4 border-indigo-200">
                                <p className="text-xs text-gray-500 italic">
                                    <strong>Note on Kanji (亜):</strong> We don't use Kanji for names here because assigning them (Ateji) is complex and can accidentally mean something strange!
                                </p>
                            </div>

                            <div className="p-3 bg-indigo-50 rounded-xl text-center">
                                <p className="text-sm font-bold text-indigo-600">
                                    🗣️ Pro Tip: Vowels!
                                </p>
                                <p className="text-xs text-indigo-400 mt-1">
                                    Japanese sounds always end in a vowel (a, i, u, e, o) or 'n'. That's why names like <strong>"Robert"</strong> become <strong>"Ro-baa-to"</strong>!
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInfo(false)}
                            className="mt-6 w-full py-3 bg-[#4A3B52] text-white rounded-xl font-bold hover:bg-[#2d2432] transition-colors"
                        >
                            Got it! 🎓
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NameStampPage;

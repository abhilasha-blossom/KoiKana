import React from 'react';
import { X, Volume2, Sparkles, BookOpen, Quote, Circle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const KanaGuideModal = ({ onClose }) => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative w-full max-w-4xl max-h-[90vh] ${theme.colors.bg} rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-fade-in-up flex flex-col`}>

                {/* Header */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-pink-400 to-rose-400 text-white shrink-0 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black">Special Kana Marks</h2>
                    </div>
                    <p className="text-pink-50 text-lg font-medium opacity-90">Decoding Dakuten, Handakuten & Combinations</p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-12">

                    {/* 1. DAKUTEN */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-6xl font-black text-gray-200 select-none">1</div>
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-pink-600">
                                    Dakuten (゛)
                                    <span className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium">Common</span>
                                </h3>
                                <p className="text-gray-500 font-medium">"Two little dots that make the sound stronger"</p>
                            </div>
                        </div>

                        <div className="bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm mb-4">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="shrink-0 text-center">
                                    <div className="text-8xl font-black text-gray-800 mb-2 relative">
                                        か<span className="text-pink-500 absolute -top-1 -right-4">゛</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">ka → ga</p>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <p className="text-gray-700 leading-relaxed">
                                        Looks like two tiny quotation marks. It makes the sound <strong>voiced</strong> (vibrate more).
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                            <span className="block text-xs uppercase text-gray-400 tracking-wider font-bold">Base</span>
                                            <span className="text-xl font-bold text-gray-700">Ka / Sa / Ta / Ha</span>
                                        </div>
                                        <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-center">
                                            <span className="block text-xs uppercase text-pink-400 tracking-wider font-bold">With Dakuten</span>
                                            <span className="text-xl font-bold text-pink-600">Ga / Za / Da / Ba</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { romaji: 'Gakusei', kana: 'がくせい', m: 'Student' },
                                { romaji: 'Zasshi', kana: 'ざっし', m: 'Magazine' },
                                { romaji: 'Daigaku', kana: 'だいがく', m: 'University' },
                                { romaji: 'Bangohan', kana: 'ばんごはん', m: 'Dinner' }
                            ].map((w, i) => (
                                <div key={i} className="p-3 bg-white/40 rounded-2xl border border-white text-center">
                                    <div className="text-lg font-bold text-gray-800">{w.kana}</div>
                                    <div className="text-xs font-bold text-pink-400 uppercase">{w.romaji}</div>
                                    <div className="text-xs text-gray-500">{w.m}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. HANDAKUTEN */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-6xl font-black text-gray-200 select-none">2</div>
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
                                    Handakuten (゜)
                                    <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">H-Series Only</span>
                                </h3>
                                <p className="text-gray-500 font-medium">"The small circle for the P sound"</p>
                            </div>
                        </div>

                        <div className="bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm mb-4">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="shrink-0 text-center">
                                    <div className="text-8xl font-black text-gray-800 mb-2 relative">
                                        は<span className="text-indigo-500 absolute -top-1 -right-4">゜</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">ha → pa</p>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <p className="text-gray-700 leading-relaxed">
                                        A small circle mark. It <strong>only</strong> works with H-series characters (Ha, Hi, Fu, He, Ho) to turn them into <strong>P</strong> sounds.
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-sm font-bold text-gray-600">
                                        <span className="px-3 py-1 bg-white rounded-full border">Ha → Pa</span>
                                        <span className="px-3 py-1 bg-white rounded-full border">Hi → Pi</span>
                                        <span className="px-3 py-1 bg-white rounded-full border">Fu → Pu</span>
                                        <span className="px-3 py-1 bg-white rounded-full border">He → Pe</span>
                                        <span className="px-3 py-1 bg-white rounded-full border">Ho → Po</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. COMBINATION KANA */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-6xl font-black text-gray-200 select-none">3</div>
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-amber-600">
                                    Combination Kana
                                    <span className="text-sm bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-medium">Blended Sounds</span>
                                </h3>
                                <p className="text-gray-500 font-medium">Small ya (ゃ), yu (ゅ), yo (ょ)</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm">
                                <h4 className="font-bold text-gray-700 mb-2">The Formula</h4>
                                <div className="flex items-center justify-center gap-4 text-2xl font-black text-gray-800 bg-white p-4 rounded-xl border border-gray-100">
                                    <span>Ki</span>
                                    <span className="text-gray-300">+</span>
                                    <span className="text-sm text-amber-500">small ya</span>
                                    <span className="text-gray-300">=</span>
                                    <span className="text-amber-600">Kya</span>
                                </div>
                                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                                    You take a normal kana (ending in -i) and add a small ゃ, ゅ, or ょ. It blends into one smooth beat.
                                </p>
                            </div>

                            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50">
                                <h4 className="font-bold text-amber-700 mb-3">Common Examples</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                                        <span className="font-bold text-gray-800">Kyō (Today)</span>
                                        <span className="font-mono text-amber-600">きょう</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                                        <span className="font-bold text-gray-800">Shashin (Photo)</span>
                                        <span className="font-mono text-amber-600">しゃしん</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Chotto (Little)</span>
                                        <span className="font-mono text-amber-600">ちょっと</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4 & 5 Extra */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
                                <span className="bg-blue-200 text-blue-700 rounded-md w-6 h-6 flex items-center justify-center text-xs">4</span>
                                Small Tsu (っ)
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">Creates a short pause (double consonant).</p>
                            <div className="bg-white p-3 rounded-xl text-center">
                                <div className="text-xl font-bold mb-1">Ki <span className="text-blue-500">tt</span> e</div>
                                <div className="text-gray-400 text-xs">Stamp</div>
                            </div>
                        </section>

                        <section className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                            <h3 className="text-lg font-bold text-green-600 mb-2 flex items-center gap-2">
                                <span className="bg-green-200 text-green-700 rounded-md w-6 h-6 flex items-center justify-center text-xs">5</span>
                                Long Vowel (ー)
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">Extends the sound (Katakana mostly).</p>
                            <div className="bg-white p-3 rounded-xl text-center">
                                <div className="text-xl font-bold mb-1">Ke <span className="text-green-500">ee</span> ki</div>
                                <div className="text-gray-400 text-xs">Cake</div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KanaGuideModal;

import React from 'react';
import { ArrowLeft, BookOpen, Star, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#FFF0F5] relative overflow-x-hidden p-6 pb-20">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            {/* Header / Nav */}
            <div className="max-w-4xl mx-auto mb-8 relative z-10">
                <Link to="/start" className="inline-flex items-center gap-2 p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm text-[#4A3B52] mb-6">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold">Back</span>
                </Link>

                <h1 className="text-3xl md:text-5xl font-bold text-[#4A3B52] leading-tight mb-4 drop-shadow-sm text-center">
                    Let’s Talk About Japanese Alphabets <br />
                    <span className="text-pink-500 text-2xl md:text-4xl">Cute, Simple & Beginner-Friendly 🌸</span>
                </h1>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">

                {/* Intro Card */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-pink-100 rounded-full text-pink-500 hidden sm:block">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-lg text-[#4A3B52] leading-relaxed font-medium">
                                Japanese doesn’t really have ABCD like English. <br />
                                Instead, the language uses three main writing systems that work together beautifully:
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className="px-4 py-2 bg-pink-100/80 text-pink-600 rounded-full font-bold">Hiragana</span>
                                <span className="px-4 py-2 bg-indigo-100/80 text-indigo-600 rounded-full font-bold">Katakana</span>
                                <span className="px-4 py-2 bg-amber-100/80 text-amber-600 rounded-full font-bold">Kanji</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 italic">
                                (There’s also Romaji, but that’s mostly for learners and keyboards!)
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white/50">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-8 h-8 text-[#9370DB]" />
                        <h2 className="text-2xl font-bold text-[#4A3B52]">FAQ — Easy Answers 🎌</h2>
                    </div>

                    <div className="space-y-8">
                        {/* Q1 */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-pink-500">1. What is the ABC of Japanese?</h3>
                            <p className="text-[#4A3B52] leading-relaxed">
                                Think of <span className="font-bold">Hiragana</span> as the base alphabet of Japanese.
                                There are 46 basic characters, arranged from left ➜ right and top ➜ bottom.
                            </p>
                            <div className="bg-white/50 p-4 rounded-2xl border border-white/60 font-mono text-center text-lg text-[#4A3B52]">
                                <div className="mb-2">あ (a), い (i), う (u), え (e), お (o)</div>
                                <div>か (ka), き (ki), く (ku), け (ke), こ (ko)</div>
                                <div className="text-sm text-gray-400 mt-2">...and so on!</div>
                            </div>
                        </div>

                        {/* Q2 */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-pink-500">2. Are there really 3 Japanese alphabets?</h3>
                            <p className="text-[#4A3B52]">Yes — but they’re not used separately. They mix together in one sentence!</p>

                            <div className="overflow-hidden rounded-2xl border border-white/40">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-pink-100/50 text-[#4A3B52]">
                                            <th className="p-4 font-bold">Script</th>
                                            <th className="p-4 font-bold hidden sm:table-cell">Look</th>
                                            <th className="p-4 font-bold">Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/40 bg-white/30">
                                        <tr>
                                            <td className="p-4 font-bold text-pink-600">Hiragana</td>
                                            <td className="p-4 hidden sm:table-cell">smooth & curvy</td>
                                            <td className="p-4 text-sm">native words + grammar</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-indigo-600">Katakana</td>
                                            <td className="p-4 hidden sm:table-cell">sharp & angular</td>
                                            <td className="p-4 text-sm">foreign words + names</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-amber-600">Kanji</td>
                                            <td className="p-4 hidden sm:table-cell">complex symbols</td>
                                            <td className="p-4 text-sm">full meanings (like 山 = mountain)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Q3 */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-pink-500">3. Is the Japanese alphabet hard to learn?</h3>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🌸</span>
                                    <div>
                                        <span className="font-bold text-[#4A3B52]">Hiragana + Katakana — surprisingly easy!</span>
                                        <p className="text-sm text-gray-600">Most learners can master them in about 2 weeks with the right practice.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🐉</span>
                                    <div>
                                        <span className="font-bold text-[#4A3B52]">Kanji — more challenging.</span>
                                        <p className="text-sm text-gray-600">There are 2000+ characters. But you don’t need to learn everything at once — slow and steady wins.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-[2.5rem] p-8 shadow-sm border border-white/60">
                    <h3 className="text-xl font-bold text-[#4A3B52] mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-pink-400" /> Tiny Summary
                    </h3>
                    <ul className="space-y-3 text-[#4A3B52] font-medium">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                            Hiragana → everyday Japanese + grammar
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            Katakana → foreign words (e.g., coffee = コーヒー)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            Kanji → meaning-packed characters (e.g., 日 = sun/day)
                        </li>
                    </ul>
                    <p className="mt-6 text-[#7A6B82] text-sm">
                        They might look different, but they work together like pieces of one puzzle — once you understand their roles, everything becomes easier (and way more fun)! ✨
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

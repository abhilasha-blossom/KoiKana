import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Star, Sparkles, HelpCircle, ChevronDown, MoveRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AboutPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    // Accordion state for FAQ
    const [openFaq, setOpenFaq] = useState(0);
    // Modal state for Script Details
    const [selectedScript, setSelectedScript] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    const scriptDetails = {
        hiragana: {
            title: "Hiragana",
            subtitle: "The Heart of Japanese",
            description: "If Japanese writing had a “comfort zone,” this would be it. Hiragana is soft, curvy, gentle — and it’s everywhere.",
            usage: [
                "Used for native Japanese words",
                "Used for grammar endings (like です, ます)",
                "Used when you don’t know the Kanji"
            ],
            insight: "It’s the first script everyone learns, so it’s beginner-friendly. Once you understand Hiragana, Japanese finally starts to feel readable instead of scary.",
            examples: [
                { jp: "ねこ", romaji: "neko", en: "cat" },
                { jp: "ともだち", romaji: "tomodachi", en: "friend" },
                { jp: "ありがとう", romaji: "arigatou", en: "thank you" }
            ],
            footer: "Learning Hiragana is like unlocking the first door.",
            color: "pink",
            gradient: "from-pink-400 to-rose-400",
            bg: "bg-pink-50",
            buttonLink: "/kana",
            buttonText: "Learn Hiragana"
        },
        katakana: {
            title: "Katakana",
            subtitle: "The Cool, Stylish Cousin",
            description: "Katakana is sharp, edgy and angular — the dramatic one in the family. If Hiragana is soft, Katakana is ✨bold✨.",
            usage: [
                "Used for foreign words (borrowed from English etc.)",
                "Used in brand names, menus, anime SFX",
                "Used to emphasize something (like italics)"
            ],
            insight: "Once you learn Katakana, suddenly you start spotting English everywhere in Japanese — and it becomes fun.",
            examples: [
                { jp: "コーヒー", romaji: "kōhī", en: "coffee" },
                { jp: "アイスクリーム", romaji: "aisukurīmu", en: "ice cream" },
                { jp: "ホテル", romaji: "hoteru", en: "hotel" }
            ],
            footer: null,
            color: "indigo",
            gradient: "from-violet-400 to-indigo-400",
            bg: "bg-indigo-50",
            buttonLink: "/kana",
            buttonText: "Learn Katakana"
        },
        kanji: {
            title: "Kanji",
            subtitle: "The Big Boss",
            description: "Kanji is where the magic AND the chaos live. It may look intimidating, but it gives Japanese depth, beauty, and efficiency.",
            usage: [
                "Each character represents a whole idea or concept",
                "One Kanji can have multiple meanings + readings",
                "There are 2000+ commonly used ones"
            ],
            insight: "Kanji turns short words into powerful, meaningful ideas. It’s challenging — but it’s also what makes Japanese feel ancient, poetic and elegant.",
            examples: [
                { jp: "山", romaji: "yama", en: "mountain" },
                { jp: "日", romaji: "hi / nichi", en: "sun / day" },
                { jp: "水", romaji: "mizu", en: "water" }
            ],
            footer: null,
            color: "amber",
            gradient: "from-amber-400 to-orange-400",
            bg: "bg-orange-50",
            buttonLink: "/kanji",
            buttonText: "Explore Kanji"
        }
    };

    const scriptCards = [
        {
            key: "hiragana",
            title: "Hiragana",
            char: "あ",
            desc: "The smooth, curvy alphabet used for native words.",
            purpose: "Native Words",
            color: "from-pink-400 to-rose-400",
            bg: "bg-pink-50"
        },
        {
            key: "katakana",
            title: "Katakana",
            char: "ア",
            desc: "The sharp, angular alphabet used for foreign words.",
            purpose: "Foreign Words",
            color: "from-violet-400 to-indigo-400",
            bg: "bg-indigo-50"
        },
        {
            key: "kanji",
            title: "Kanji",
            char: "愛",
            desc: "Complex symbols borrowed from China for meanings.",
            purpose: "Meanings",
            color: "from-amber-400 to-orange-400",
            bg: "bg-orange-50"
        }
    ];

    const faqs = [
        {
            q: "What is the 'ABC' of Japanese?",
            a: (
                <div className="space-y-3">
                    <p>Think of <span className="font-bold text-pink-500">Hiragana</span> as the foundation. It has 46 basic characters representing sounds.</p>
                    <div className="p-4 bg-white/50 rounded-xl font-mono text-center text-gray-600 border border-white">
                        a (あ) · i (い) · u (う) · e (え) · o (お)
                    </div>
                </div>
            )
        },
        {
            q: "Are there really 3 alphabets?",
            a: "Yes! But they work together as a team. You don't choose one or the other—you mix them in a single sentence to give context and clarity."
        },
        {
            q: "Is it hard to learn?",
            a: (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span><strong>Hiragana & Katakana:</strong> Surprisingly easy (~2 weeks).</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <span><strong>Kanji:</strong> A lifelong journey, but you start small!</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className={`min-h-screen ${theme.colors.bg} relative overflow-x-hidden p-6 pb-20 selection:bg-pink-200 transition-colors duration-500`}>
            {/* Soft Background Decor */}
            <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] ${theme.colors.blob1} rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow`}></div>
            <div className={`absolute top-[20%] left-[-10%] w-[400px] h-[400px] ${theme.colors.blob2} rounded-full blur-[100px] pointer-events-none mix-blend-multiply`}></div>

            <div className="max-w-5xl mx-auto pt-10 relative z-10">
                {/* Navigation & Header - Matching KanaPage */}
                <div className="flex flex-col items-center mb-8 gap-6 transition-all duration-500">
                    <div className="w-full flex items-center justify-between px-4 sm:px-0">
                        <Link to="/start" className="p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-[#4A3B52] z-40 hover:scale-110 group sticky top-4">
                            <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${theme.colors.primary}`} />
                        </Link>
                    </div>
                </div>

                {/* HERO SECTION */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm text-sm font-medium text-pink-500 mb-6 shadow-sm">
                        <Sparkles className="w-3 h-3" /> The Secret Logic
                    </div>
                    <h1 className={`text-4xl md:text-6xl font-black ${theme.colors.primary} mb-6 drop-shadow-sm leading-tight`}>
                        Japanese is a <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Trio of Scripts</span>
                    </h1>
                    <p className="text-lg text-[#7A6B82] max-w-xl mx-auto leading-relaxed">
                        Unlike English, Japanese uses three writing systems that dance together to create meaning.
                    </p>
                </div>

                {/* THE TRIO CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {scriptCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedScript(scriptDetails[card.key])}
                            className={`relative group p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer`}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700`}></div>

                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-4xl font-black shadow-md mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                    {card.char}
                                </div>
                                <h3 className="text-xl font-bold text-[#4A3B52] mb-2 group-hover:text-pink-600 transition-colors">{card.title}</h3>
                                <p className="text-sm text-[#7A6B82] leading-relaxed mb-4 flex-grow">
                                    {card.desc}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${card.bg} text-gray-600 group-hover:bg-gray-100 transition-colors`}>
                                    Tap to Learn More
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ ACCORDION */}
                <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/50 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white rounded-full shadow-sm text-purple-500">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#4A3B52]">Curious Minds Ask</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                onClick={() => toggleFaq(i)}
                                className={`
                                    group rounded-3xl p-6 transition-all duration-300 cursor-pointer border border-transparent
                                    ${openFaq === i ? 'bg-white shadow-md border-white/50' : 'bg-white/30 hover:bg-white/50'}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className={`font-bold text-lg transition-colors ${openFaq === i ? 'text-pink-600' : 'text-[#4A3B52]'}`}>
                                        {faq.q}
                                    </h3>
                                    <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden text-[#7A6B82] leading-relaxed">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FUN FOOTER */}
                <div className="text-center mt-12 mb-8 animate-fade-in text-[#7A6B82] text-sm">
                    <p>Designed with <span className="text-pink-400">♥</span> for your journey</p>
                </div>
            </div>

            {/* DETAIL MODAL */}
            {selectedScript && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedScript(null)}
                    ></div>

                    <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Modal Header */}
                        <div className={`relative px-8 pt-12 pb-8 bg-gradient-to-r ${selectedScript.gradient} text-white`}>
                            <button
                                onClick={() => setSelectedScript(null)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-4xl md:text-5xl font-black mb-2">{selectedScript.title}</h2>
                            <p className="text-white/90 font-medium text-lg">{selectedScript.subtitle}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8">

                            {/* Description */}
                            <div className="prose prose-lg text-[#4A3B52]">
                                <p className="font-medium text-xl leading-relaxed">
                                    {selectedScript.description}
                                </p>
                            </div>

                            {/* Usage List */}
                            <div className="space-y-4">
                                <h3 className={`text-sm font-bold uppercase tracking-widest text-${selectedScript.color}-500 mb-2`}>
                                    When is it used?
                                </h3>
                                <ul className="space-y-3">
                                    {selectedScript.usage.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[#7A6B82] font-medium">
                                            <span className={`w-2 h-2 mt-2 rounded-full bg-${selectedScript.color}-400 shrink-0`}></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Examples */}
                            <div className={`p-6 rounded-3xl ${selectedScript.bg} border border-${selectedScript.color}-100`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className={`w-5 h-5 text-${selectedScript.color}-500`} />
                                    <h3 className={`font-bold text-${selectedScript.color}-600`}>Examples</h3>
                                </div>
                                <div className="grid gap-3">
                                    {selectedScript.examples.map((ex, i) => (
                                        <div key={i} className="bg-white/60 p-3 rounded-xl flex items-center justify-between border border-white shadow-sm">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-xl font-bold text-[#4A3B52]">{ex.jp}</span>
                                                <span className="text-sm text-gray-400 font-mono">{ex.romaji}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{ex.en}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Insight/Footer */}
                            <div className="space-y-6">
                                <p className="text-[#4A3B52] italic border-l-4 border-gray-200 pl-4 py-1">
                                    "{selectedScript.insight}"
                                </p>
                                {selectedScript.footer && (
                                    <p className="font-medium text-center text-pink-500">
                                        {selectedScript.footer}
                                    </p>
                                )}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate(selectedScript.buttonLink)}
                                className={`w-full py-4 rounded-2xl bg-gradient-to-r ${selectedScript.gradient} text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2`}
                            >
                                {selectedScript.buttonText} <MoveRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutPage;

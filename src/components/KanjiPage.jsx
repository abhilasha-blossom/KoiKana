import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { kanjiData } from '../data/kanjiData';
import KanjiCard from './KanjiCard';
import KanjiModal from './KanjiModal';

const KanjiPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKanji, setSelectedKanji] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    // Get unique categories
    const categories = ['All', ...new Set(kanjiData.map(k => k.category))];

    // Filter Logic
    const filteredKanji = useMemo(() => {
        return kanjiData.filter(k => {
            const matchesSearch = (
                k.char.includes(searchTerm) ||
                k.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                k.onyomi.some(r => r.includes(searchTerm.toLowerCase())) ||
                k.kunyomi.some(r => r.includes(searchTerm.toLowerCase()))
            );
            const matchesCategory = activeCategory === 'All' || k.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="min-h-screen bg-[#FFF0F5] dark:bg-slate-900 relative overflow-x-hidden transition-colors duration-500">

            {/* Background Atmosphere */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-100/40 dark:bg-pink-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

            {/* Header Section */}
            <div className="relative z-10 pt-8 pb-6 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link to="/start" className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors backdrop-blur-sm shadow-sm text-[#4A3B52] dark:text-gray-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#4A3B52] dark:text-white flex items-center gap-3">
                                <ScrollText className="text-amber-500" />
                                Kanji Library
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">N5 Collection • {kanjiData.length} Characters</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by meaning, reading..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-slate-700 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 sm:text-sm transition-all shadow-sm backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200/50 scale-105'
                                    : 'bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Kanji Grid */}
                {filteredKanji.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pb-20 animate-fade-in-up">
                        {filteredKanji.map((kanji) => (
                            <KanjiCard
                                key={kanji.char}
                                kanji={kanji}
                                onClick={() => setSelectedKanji(kanji)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-60">
                        <p className="text-2xl font-bold text-gray-400">No Kanji found...</p>
                        <p className="text-gray-400">Try a different search term.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedKanji && (
                <KanjiModal
                    kanji={selectedKanji}
                    onClose={() => setSelectedKanji(null)}
                />
            )}

        </div>
    );
};

export default KanjiPage;

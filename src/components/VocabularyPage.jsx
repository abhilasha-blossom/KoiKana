import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Volume2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hiragana, katakana } from '../data/kanaData';
import useAudio from '../hooks/useAudio';

const VocabularyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'hiragana', 'katakana'
    const { playSound } = useAudio();

    // Extract all vocabulary
    const getAllVocabulary = () => {
        const vocab = [];
        const processKana = (list, type) => {
            list.forEach(k => {
                if (k.examples) {
                    k.examples.forEach(ex => {
                        // Avoid duplicates
                        if (!vocab.some(v => v.word === ex.word)) {
                            vocab.push({ ...ex, type });
                        }
                    });
                }
            });
        };

        if (filter === 'all' || filter === 'hiragana') processKana(hiragana, 'Hiragana');
        if (filter === 'all' || filter === 'katakana') processKana(katakana, 'Katakana');

        return vocab.filter(v =>
            v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const vocabularyList = getAllVocabulary();

    return (
        <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center p-6 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[80px] animate-blob mix-blend-multiply pointer-events-none z-0"></div>

            {/* Header */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-8 relative z-10">
                <Link to="/start" className="p-3 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors shadow-sm border border-white/50">
                    <ArrowLeft className="text-[#4A3B52]" />
                </Link>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-white/50">
                    <BookOpen className="text-pink-500" />
                    <span className="font-bold text-[#4A3B52]">Vocabulary Book</span>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Search & Filter */}
            <div className="w-full max-w-2xl mb-12 relative z-10 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search words..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-[#4A3B52] placeholder-gray-400 font-medium"
                    />
                </div>
                <div className="flex bg-white/30 backdrop-blur-md p-1 rounded-2xl">
                    {['all', 'hiragana', 'katakana'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl relative z-10 pb-20">
                {vocabularyList.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,209,220,0.3)] border border-white/60 hover:scale-105 transition-transform duration-300 group cursor-pointer"
                        onClick={() => playSound('pop')} // Placeholder for TTS
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-pink-100/50 text-pink-600 uppercase tracking-wider">{item.type}</span>
                            <button className="p-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-pink-500 transition-colors">
                                <Volume2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-center mb-4">
                            <h3 className="text-4xl font-bold text-[#4A3B52] mb-1 jp-font">{item.kana}</h3>
                            <p className="text-sm font-bold text-pink-400">{item.word}</p>
                        </div>

                        <div className="text-center border-t border-gray-100 pt-3">
                            <p className="text-[#7A6B82] font-medium">{item.meaning}</p>
                        </div>
                    </div>
                ))}
            </div>

            {vocabularyList.length === 0 && (
                <div className="text-center text-gray-400 mt-12 relative z-10">
                    <p className="text-xl">No words found...</p>
                </div>
            )}

        </div>
    );
};

export default VocabularyPage;

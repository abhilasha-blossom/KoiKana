
import React, { useState } from 'react';
import { ArrowLeft, Search, Book, Loader2, Volume2, Tag, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAudio from '../hooks/useAudio';

const DictionaryPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { playSound } = useAudio();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const PROXIES = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://api.codetabs.com/v1/proxy?quest='
    ];

    const API_URL = 'https://jisho.org/api/v1/search/words?keyword=';

    const fetchJisho = async (keyword) => {
        const targetUrl = API_URL + encodeURIComponent(keyword);

        // Try each proxy in order
        for (const proxy of PROXIES) {
            try {
                const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`);
                if (!response.ok) continue; // Try next proxy

                const data = await response.json();
                if (data.meta && data.meta.status === 200) {
                    return data.data;
                }
            } catch (err) {
                console.warn(`Proxy ${proxy} failed:`, err);
                continue;
            }
        }
        throw new Error('All connection methods failed. Please try again.');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        playSound('pop');
        setSearched(true);
        setResults([]);

        try {
            const data = await fetchJisho(query);
            setResults(data);
        } catch (error) {
            console.error("Dictionary Search Error:", error);
            setError("Could not connect to the dictionary service. This might be a temporary network issue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${theme.background} p-6 pb-24 font-sans transition-colors duration-500`}>
            {/* Header */}
            <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/start')}
                    className="p-3 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all shadow-sm hover:shadow-md group"
                >
                    <ArrowLeft className={`w-6 h-6 ${theme.colors.text} group-hover:scale-110 transition-transform`} />
                </button>
                <h1 className={`text-3xl font-black ${theme.colors.primary} flex items-center gap-3`}>
                    <Book className="w-8 h-8" />
                    Kotoba Library
                </h1>
                <div className="w-12"></div>
            </div>

            {/* Search Section */}
            <div className="max-w-xl mx-auto mb-10">
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search English, Japanese, or Romaji..."
                        className="w-full h-16 pl-6 pr-14 rounded-2xl bg-white/70 backdrop-blur-xl border-2 border-white/50 focus:border-pink-400 focus:bg-white/90 shadow-lg transition-all text-lg font-bold text-gray-700 placeholder:text-gray-400 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-3 w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-md hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 animate-bump">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {/* Results Grid */}
            <div className="max-w-4xl mx-auto space-y-4">
                {searched && results.length === 0 && !loading && !error && (
                    <div className="text-center py-10 opacity-70">
                        <p className="text-xl font-bold text-gray-500">No results found for "{query}"</p>
                        <p className="text-sm text-gray-400 mt-2">Try checking the spelling (e.g. "neko" instead of "necco")</p>
                    </div>
                )}

                {results.map((item, index) => {
                    const japanese = item.japanese[0]; // Primary reading
                    const senses = item.senses;

                    return (
                        <div
                            key={index}
                            className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 animate-bump"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left: Japanese Word */}
                                <div className="flex-shrink-0 min-w-[120px] text-center md:text-left">
                                    <div className="text-sm font-medium text-gray-500 mb-1">{japanese.reading}</div>
                                    <div className={`text-4xl font-black ${theme.colors.primary} mb-2`}>
                                        {japanese.word || japanese.reading}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                                        {item.is_common && (
                                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Common</span>
                                        )}
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Meanings */}
                                <div className="flex-grow space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    {senses.map((sense, sIndex) => (
                                        <div key={sIndex} className="group">
                                            <div className="flex gap-2 items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xs font-bold mt-[-2px]">
                                                    {sIndex + 1}
                                                </span>
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800 leading-snug">
                                                        {sense.english_definitions.join(', ')}
                                                    </p>
                                                    <div className="flex gap-2 mt-1 flex-wrap">
                                                        {sense.parts_of_speech.map((pos) => (
                                                            <span key={pos} className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100">
                                                                {pos}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DictionaryPage;

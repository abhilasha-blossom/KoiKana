import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import KanaCard from './KanaCard';
import KoiPond from './KoiPond';
import ThemeToggle from './ThemeToggle';
import MnemonicModal from './MnemonicModal';
import { hiragana, katakana } from '../data/kanaData';

const KanaPage = () => {
    const [activeTab, setActiveTab] = useState('hiragana');
    const [selectedCard, setSelectedCard] = useState(null);

    const data = activeTab === 'hiragana' ? hiragana : katakana;

    const handleCardClick = (item) => {
        setSelectedCard(item);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const handleNext = () => {
        if (!selectedCard) return;
        const currentIndex = data.indexOf(selectedCard);
        const nextIndex = (currentIndex + 1) % data.length;
        setSelectedCard(data[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedCard) return;
        const currentIndex = data.indexOf(selectedCard);
        const prevIndex = (currentIndex - 1 + data.length) % data.length;
        setSelectedCard(data[prevIndex]);
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Background: The Koi Pond (Day/Night handled inside it) */}
            <KoiPond />

            {/* Content Container - z-50 to stay above pond */}
            <div className="relative z-50 p-6 pb-20">

                {/* Navigation & Header */}
                <div className="flex flex-col items-center mb-8 max-w-5xl mx-auto gap-6">

                    <div className="w-full flex items-center justify-between">
                        <Link to="/" className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors backdrop-blur-sm shadow-sm group">
                            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                        </Link>

                        {/* Theme Toggle Button */}
                        <ThemeToggle />
                    </div>

                    {/* TAB SWITCH */}
                    <div className="flex bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/50 dark:border-slate-600 relative w-full max-w-[300px]">
                        {/* Sliding Pill Background */}
                        <div className={`
                            absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full 
                            bg-white dark:bg-slate-700 shadow-sm transition-all duration-500 ease-out 
                            ${activeTab === 'hiragana' ? 'left-1.5' : 'left-[50%]'}
                        `}></div>

                        <button
                            onClick={() => setActiveTab('hiragana')}
                            className={`relative z-10 flex-1 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${activeTab === 'hiragana' ? 'text-pink-500 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Hiragana
                        </button>
                        <button
                            onClick={() => setActiveTab('katakana')}
                            className={`relative z-10 flex-1 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${activeTab !== 'hiragana' ? 'text-[#9370DB] dark:text-[#a78bfa]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Katakana
                        </button>
                    </div>

                    <h1 className={`text-center text-xl font-medium tracking-wide transition-colors duration-500 ${activeTab === 'hiragana' ? 'text-pink-400 dark:text-pink-300' : 'text-[#B19CD9] dark:text-[#a78bfa]'}`}>
                        {activeTab === 'hiragana' ? "The Garden of Sounds" : "The Sky of Shapes"}
                    </h1>
                </div>

                {/* Grid */}
                <div className="max-w-5xl mx-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
                    {data.map((item, index) => (
                        item.char ? (
                            <KanaCard
                                key={`${activeTab}-${index}`}
                                char={item.char}
                                romaji={item.romaji}
                                type={activeTab}
                                onClick={() => handleCardClick(item)}
                            />
                        ) : (
                            <div key={index} className="w-20 sm:w-24"></div>
                        )
                    ))}
                </div>

                {/* Mnemonic Modal */}
                <MnemonicModal
                    item={selectedCard}
                    onClose={handleCloseModal}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            </div>
        </div>
    );
};

export default KanaPage;

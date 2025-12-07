import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import KanaCard from './KanaCard';
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
        <div className="min-h-screen p-6 pb-20 bg-[#FFF0F5] transition-colors duration-700 relative overflow-x-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[80px] animate-blob mix-blend-multiply pointer-events-none z-0"></div>
            <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none z-0"></div>

            {/* Navigation */}
            <div className="relative z-10 flex flex-col items-center mb-8 max-w-5xl mx-auto gap-6 transition-all duration-500">

                <div className="w-full flex items-center justify-between">
                    <Link to="/" className="p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm group">
                        <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                    </Link>
                    <div className="w-12"></div> {/* Spacer */}
                </div>

                {/* CUTE TOGGLE SWITCH */}
                <div className="flex bg-white/40 p-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/50 relative w-full max-w-[300px]">
                    {/* Sliding Pill Background */}
                    <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm transition-all duration-500 ease-out ${activeTab === 'hiragana' ? 'left-1.5' : 'left-[50%]'}`}></div>

                    <button
                        onClick={() => setActiveTab('hiragana')}
                        className={`relative z-10 flex-1 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${activeTab === 'hiragana' ? 'text-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Hiragana
                    </button>
                    <button
                        onClick={() => setActiveTab('katakana')}
                        className={`relative z-10 flex-1 py-2 rounded-full font-bold text-lg transition-colors duration-300 ${activeTab !== 'hiragana' ? 'text-[#9370DB]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Katakana
                    </button>
                </div>

                <h1 className={`text-center text-xl font-medium tracking-wide transition-colors duration-500 ${activeTab === 'hiragana' ? 'text-pink-400' : 'text-[#B19CD9]'}`}>
                    {activeTab === 'hiragana' ? "The Garden of Sounds" : "The Sky of Shapes"}
                </h1>
            </div>

            {/* Grid */}
            <div className="relative z-20 max-w-5xl mx-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
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
    );
};

export default KanaPage;

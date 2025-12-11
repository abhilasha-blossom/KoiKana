import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, Mic, ScrollText, Sparkles, Flower2, Palette, Settings, Coffee, Feather, Quote, User, Brain, Gamepad2, Ghost } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import OmikujiModal from './OmikujiModal';
import SettingsModal from './SettingsModal';
import KanaGuideModal from './KanaGuideModal';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const StartMenu = () => {
    const { playSound } = useAudio();
    const { theme } = useTheme();
    const { user } = useAuth();

    // UI States
    const [activeTab, setActiveTab] = useState('Study'); // 'Study', 'Create', 'Relax'
    const [showFortune, setShowFortune] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    // Menu Configuration
    const MENU_ITEMS = [
        // STUDY CATEGORY
        {
            id: 'kana',
            category: 'Study',
            title: 'Master Kana',
            subtitle: 'Hiragana & Katakana',
            icon: PenTool,
            color: 'pink',
            to: '/kana',
            big: true // 2x2
        },
        {
            id: 'kanji',
            category: 'Study',
            title: 'Kanji Module',
            subtitle: 'Unlock meanings',
            icon: Brain,
            color: 'amber',
            to: '/kanji'
        },
        {
            id: 'vocab',
            category: 'Study',
            title: 'Vocabulary',
            subtitle: 'Expand words',
            icon: Sparkles,
            color: 'rose',
            to: '/vocabulary'
        },
        {
            id: 'speaking',
            category: 'Study',
            title: 'Speaking',
            subtitle: 'Phrases & audio',
            icon: Mic,
            color: 'teal',
            to: '/speaking'
        },
        {
            id: 'guide',
            category: 'Study',
            title: 'Special Marks',
            subtitle: 'Dakuten & rules',
            icon: Quote,
            color: 'fuchsia',
            action: () => setShowGuide(true)
        },
        {
            id: 'about',
            category: 'Study',
            title: 'About Japanese',
            subtitle: 'The 3 alphabets & History',
            icon: BookOpen,
            color: 'indigo',
            to: '/about',
            full: true // 4x1 (Full Width)
        },

        // CREATE CATEGORY
        {
            id: 'stamp',
            category: 'Create',
            title: 'Name Stamp',
            subtitle: 'Design your Hanko',
            icon: PenTool,
            color: 'red',
            to: '/name-stamp',
            big: true
        },
        {
            id: 'haiku',
            category: 'Create',
            title: 'Haiku Garden',
            subtitle: 'Write poetry',
            icon: Feather,
            color: 'pink',
            to: '/haiku',
            big: true
        },

        // RELAX CATEGORY
        {
            id: 'yokai',
            category: 'Relax',
            title: 'Yokai Collection',
            subtitle: 'Japanese Spirits',
            icon: Ghost,
            color: 'slate',
            to: '/yokai',
            big: true
        },
        {
            id: 'onsen',
            category: 'Relax',
            title: 'Onsen Mode',
            subtitle: 'Breathe & Relax',
            icon: Coffee,
            color: 'sky',
            to: '/onsen',
            wide: true
        },
        {
            id: 'shop',
            category: 'Relax',
            title: 'Theme Shop',
            subtitle: 'Customize look',
            icon: Palette,
            color: 'emerald',
            to: '/shop',
            wide: true
        }
    ];

    const filteredItems = MENU_ITEMS.filter(item => item.category === activeTab);

    // Helper to render card
    const renderCard = (item) => {
        const Wrapper = item.to ? Link : 'button';
        const props = item.to ? { to: item.to } : { onClick: item.action };

        // Dynamic Color Classes
        const colorMap = {
            pink: 'text-pink-500 bg-pink-50 shadow-pink-100 from-pink-300 to-rose-300',
            amber: 'text-amber-600 bg-amber-50 shadow-amber-100 from-amber-300 to-orange-300',
            rose: 'text-rose-500 bg-rose-50 shadow-rose-100 from-rose-300 to-pink-300',
            teal: 'text-teal-600 bg-teal-50 shadow-teal-100 from-teal-300 to-emerald-300',
            fuchsia: 'text-fuchsia-600 bg-fuchsia-50 shadow-fuchsia-100 from-fuchsia-300 to-purple-300',
            indigo: 'text-indigo-600 bg-indigo-50 shadow-indigo-100 from-indigo-300 to-blue-300',
            red: 'text-red-500 bg-red-50 shadow-red-100 from-red-300 to-orange-300',
            slate: 'text-slate-600 bg-slate-50 shadow-slate-100 from-slate-300 to-gray-300',
            sky: 'text-sky-500 bg-sky-50 shadow-sky-100 from-sky-300 to-blue-300',
            emerald: 'text-emerald-500 bg-emerald-50 shadow-emerald-100 from-emerald-300 to-teal-300',
        };

        const themeClasses = colorMap[item.color] || colorMap.pink;
        // Split for icon text vs background gradient
        const gradientColors = themeClasses.split(' ').filter(c => c.startsWith('from-')).join(' ');

        // Grid Span Logic
        let gridClasses = 'aspect-square md:aspect-auto';
        if (item.big) gridClasses = 'md:col-span-2 md:row-span-2 aspect-[1.5/1] md:aspect-auto';
        else if (item.wide) gridClasses = 'md:col-span-2 aspect-[2/1] md:aspect-auto';
        else if (item.full) gridClasses = 'md:col-span-4 aspect-[2.5/1] md:aspect-auto';

        return (
            <Wrapper
                key={item.id}
                {...props}
                onMouseEnter={() => playSound('pop')}
                className={`group relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-5 border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between ${gridClasses}`}
            >
                {/* 1. Subtle Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-100/30 via-white/10 to-${item.color}-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* 2. THE ORB ANIMATION (Floating Blob) */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 md:w-48 md:h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-125 bg-gradient-to-br ${gradientColors}`}></div>

                <div className={`relative z-10 flex ${item.full ? 'flex-row items-center gap-6 h-full' : 'flex-col h-full justify-between'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.full ? '' : 'mb-3'} group-hover:scale-110 transition-transform duration-500 ${themeClasses.split(' ').slice(0, 2).join(' ')}`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div className={item.full ? 'flex-grow' : ''}>
                        <h3 className={`text-lg md:text-xl font-bold ${theme.colors.primary}`}>{item.title}</h3>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">{item.subtitle}</p>
                    </div>
                </div>

                {/* Decorative Arrow (Only for links) */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <div className={`w-8 h-8 rounded-full ${themeClasses.split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                </div>
            </Wrapper>
        );
    };

    return (
        <div className="h-screen bg-[#FFF0F5] relative overflow-hidden flex flex-col items-center p-4 selection:bg-pink-200">
            {/* Modals */}
            {showFortune && <OmikujiModal onClose={() => setShowFortune(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showGuide && <KanaGuideModal onClose={() => setShowGuide(false)} />}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-teal-200/40 to-emerald-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply animate-blob animation-delay-4000"></div>

            {/* Back Button */}
            <Link to="/home" className="absolute top-4 left-4 p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-[#4A3B52] z-50 hover:scale-110 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
                {/* Daily Fortune (Restored) */}
                <button
                    onClick={() => setShowFortune(true)}
                    className="p-1.5 pr-3 rounded-full bg-red-50 hover:bg-red-100/80 transition-all duration-300 backdrop-blur-md shadow-sm border border-red-200 text-red-500 hover:scale-105 group flex items-center gap-2"
                >
                    <div className="w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                        <Flower2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs hidden md:block">Daily Fortune</span>
                </button>

                {/* Profile Button REMOVED as requested */}

                {/* Settings */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-300 backdrop-blur-md shadow-sm border border-white/50 text-[#4A3B52] hover:scale-110 group"
                >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            {/* Spacer for aesthetics */}
            <div className="h-12 flex-shrink-0"></div>

            {/* Header Area */}
            <div className="text-center mb-6 relative z-10 flex-shrink-0">
                <h1 className={`text-3xl md:text-5xl font-black ${theme.colors.primary} mb-1 drop-shadow-sm tracking-tight`}>
                    Choose Your Path
                </h1>

                {/* CATEGORY TABS */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {['Study', 'Create', 'Relax'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === tab
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105'
                                    : 'bg-white/50 text-gray-500 hover:bg-white hover:text-pink-400'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID CONTENT */}
            <div className="w-full max-w-5xl flex-grow overflow-y-auto no-scrollbar px-4 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(120px,auto)] pb-8">
                    {filteredItems.map(renderCard)}
                </div>
            </div>

        </div>
    );
};

export default StartMenu;

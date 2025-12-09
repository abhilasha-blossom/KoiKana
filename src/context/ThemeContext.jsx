import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    default: {
        id: 'default',
        name: 'Sakura Pink',
        cost: 0,
        colors: {
            bg: 'bg-[#FFF0F5]',
            primary: 'text-[#4A3B52]',
            accent: 'text-pink-500',
            button: 'from-pink-400 to-pink-500',
            blob1: 'bg-pink-200/40',
            blob2: 'bg-purple-200/40'
        }
    },
    night_bloom: {
        id: 'night_bloom',
        name: 'Night Bloom',
        cost: 500,
        colors: {
            bg: 'bg-[#1a1a2e]',
            primary: 'text-[#e94560]',
            accent: 'text-[#16213e]',
            button: 'from-[#e94560] to-[#c70039]',
            blob1: 'bg-[#0f3460]/40',
            blob2: 'bg-[#533483]/40'
        }
    },
    zen_garden: {
        id: 'zen_garden',
        name: 'Zen Garden',
        cost: 1000,
        colors: {
            bg: 'bg-[#F0F4E8]',
            primary: 'text-[#2C3E2C]',
            accent: 'text-[#6B8E23]',
            button: 'from-[#8FBC8F] to-[#2E8B57]',
            blob1: 'bg-[#98FB98]/40',
            blob2: 'bg-[#F0E68C]/40'
        }
    },
    cyberpunk: {
        id: 'cyberpunk',
        name: 'Neon Tokyo',
        cost: 2000,
        colors: {
            bg: 'bg-[#000000]',
            primary: 'text-[#0ff]',
            accent: 'text-[#f0f]',
            button: 'from-[#f0f] to-[#0ff]',
            blob1: 'bg-[#f0f]/30',
            blob2: 'bg-[#0ff]/30'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentThemeId, setCurrentThemeId] = useState('default');

    useEffect(() => {
        const storedTheme = localStorage.getItem('koiKana_theme');
        if (storedTheme && THEMES[storedTheme]) {
            setCurrentThemeId(storedTheme);
        }
    }, []);

    const setTheme = (themeId) => {
        if (THEMES[themeId]) {
            setCurrentThemeId(themeId);
            localStorage.setItem('koiKana_theme', themeId);
        }
    };

    const value = {
        theme: THEMES[currentThemeId],
        currentThemeId,
        setTheme,
        availableThemes: THEMES
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

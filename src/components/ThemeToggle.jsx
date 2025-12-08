import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    // Initialize state from local storage or system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return true;
            }
        }
        return false;
    });

    // Update class and storage when state changes
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 backdrop-blur-sm shadow-sm group border border-white/20 dark:border-slate-600"
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                <Moon className="w-6 h-6 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
            ) : (
                <Sun className="w-6 h-6 text-amber-500 group-hover:text-amber-400 transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;

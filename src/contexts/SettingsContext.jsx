
import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    // Initialize state from localStorage or defaults
    const [musicVolume, setMusicVolume] = useState(() => {
        const saved = localStorage.getItem('koiInfo_musicVol');
        return saved !== null ? parseFloat(saved) : 0.4;
    });

    const [sfxVolume, setSfxVolume] = useState(() => {
        const saved = localStorage.getItem('koiInfo_sfxVol');
        return saved !== null ? parseFloat(saved) : 0.5;
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('koiInfo_musicVol', musicVolume);
    }, [musicVolume]);

    useEffect(() => {
        localStorage.setItem('koiInfo_sfxVol', sfxVolume);
    }, [sfxVolume]);

    // Reset Progress Function
    const resetProgress = () => {
        // List all keys related to game progress
        const keysToRemove = [
            'koiInfo_musicVol', // Optional: reset settings too? Maybe keep them.
            'koiInfo_sfxVol',
            // Add other app-specific keys here as we find them
            // For now, let's assume we might clear specific ones or all
            // But clearing ALL might define "reset app" better
            // 'gameState', 'highScores', 'unlockedItems' etc.
        ];

        // Actually, safer to clear specific known keys or use a prefix.
        // For this app, let's look at what we use. 
        // We know we use 'koiInfo_...' for settings.
        // Other components might use their own. 
        // Let's clear everything *except* what we want to keep, or just clear all.
        // "Reset Progress" usually implies everything.

        localStorage.clear();

        // Re-initialize defaults if needed, or just reload page
        window.location.reload();
    };

    const value = {
        musicVolume,
        setMusicVolume,
        sfxVolume,
        setSfxVolume,
        resetProgress
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

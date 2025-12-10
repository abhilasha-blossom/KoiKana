/* eslint-disable react-refresh/only-export-components */
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

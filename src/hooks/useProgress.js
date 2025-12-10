import { useState } from 'react';

// Helper for safe JSON parsing
const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return fallback;
    }
};

const useProgress = () => {
    // Lazy initialization for all state variables
    const [streak] = useState(() => {
        try {
            const storedStreak = parseInt(localStorage.getItem('koiKana_streak') || '0');
            const storedLastVisit = localStorage.getItem('koiKana_lastVisit');
            const today = new Date().toDateString();

            if (storedLastVisit !== today) {
                if (storedLastVisit) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (storedLastVisit === yesterday.toDateString()) {
                        // Consecutive day
                        const newStreak = (isNaN(storedStreak) ? 0 : storedStreak) + 1;
                        localStorage.setItem('koiKana_streak', newStreak);
                        localStorage.setItem('koiKana_lastVisit', today);
                        return newStreak;
                    } else {
                        // Check if streak broken (more than 1 day gap)
                        const last = new Date(storedLastVisit);
                        const diffTime = Math.abs(new Date() - last);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays > 1) {
                            // Reset streak
                            localStorage.setItem('koiKana_streak', 1);
                            localStorage.setItem('koiKana_lastVisit', today);
                            return 1;
                        } else {
                            // Should be covered by yesterday check, but fallback to increment if strictly < 2 days but not "yesterday" string match (edge cases)
                            const newStreak = (isNaN(storedStreak) ? 0 : storedStreak) + 1;
                            localStorage.setItem('koiKana_streak', newStreak);
                            localStorage.setItem('koiKana_lastVisit', today);
                            return newStreak;
                        }
                    }
                } else {
                    // First visit ever (or cleared)
                    localStorage.setItem('koiKana_streak', 1);
                    localStorage.setItem('koiKana_lastVisit', today);
                    return 1;
                }
            }
            // Same day, return stored
            return isNaN(storedStreak) ? 0 : storedStreak;
        } catch (err) {
            console.error("Error initializing streak:", err);
            return 0;
        }
    });

    const [xp, setXp] = useState(() => {
        const storedXp = parseInt(localStorage.getItem('koiKana_xp') || '0');
        return isNaN(storedXp) ? 0 : storedXp;
    });

    const [mastery, setMastery] = useState(() => safeParse('koiKana_mastery', {}));
    const [srsData, setSRSData] = useState(() => safeParse('koiKana_srs', {}));
    const [unlockedThemes, setUnlockedThemes] = useState(() => safeParse('koiKana_unlockedThemes', ['default']));
    const [username, setUsername] = useState(() => localStorage.getItem('koiKana_username'));

    const markMastered = (char) => {
        const newMastery = { ...mastery, [char]: true };
        setMastery(newMastery);
        localStorage.setItem('koiKana_mastery', JSON.stringify(newMastery));
    };

    const addXP = (amount) => {
        const newXp = xp + amount;
        setXp(newXp);
        localStorage.setItem('koiKana_xp', newXp);
    };

    const updateUsername = (name) => {
        setUsername(name);
        localStorage.setItem('koiKana_username', name);
    };

    // SRS Logic
    // Intervals: 1, 3, 7, 14, 30, 60 days
    const SRS_INTERVALS = [1, 3, 7, 14, 30, 60];

    const updateSRS = (char, isCorrect) => {
        setSRSData(prev => {
            const current = prev[char] || { interval: 0, nextReview: Date.now(), streak: 0 };

            let newItem;
            if (isCorrect) {
                const nextIndex = Math.min(current.streak, SRS_INTERVALS.length - 1);
                const daysToAdd = SRS_INTERVALS[nextIndex];

                newItem = {
                    streak: current.streak + 1,
                    interval: daysToAdd,
                    nextReview: Date.now() + (daysToAdd * 24 * 60 * 60 * 1000)
                };
            } else {
                newItem = {
                    streak: 0,
                    interval: 0,
                    nextReview: Date.now()
                };
            }

            const newData = { ...prev, [char]: newItem };
            localStorage.setItem('koiKana_srs', JSON.stringify(newData));
            return newData;
        });
    };

    const buyTheme = (themeId, cost) => {
        if (unlockedThemes.includes(themeId)) return true; // Already owned
        if (xp >= cost) {
            const newXp = xp - cost;
            setXp(newXp);
            localStorage.setItem('koiKana_xp', newXp);

            const newUnlocked = [...unlockedThemes, themeId];
            setUnlockedThemes(newUnlocked);
            localStorage.setItem('koiKana_unlockedThemes', JSON.stringify(newUnlocked));
            return true;
        }
        return false;
    };

    const getDueItems = () => {
        const now = Date.now();
        return Object.keys(srsData).filter(char => {
            return srsData[char].nextReview <= now;
        });
    };

    return { streak, xp, addXP, mastery, markMastered, srsData, updateSRS, getDueItems, unlockedThemes, buyTheme, username, updateUsername };
};

export default useProgress;

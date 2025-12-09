import { useState, useEffect } from 'react';

const useProgress = () => {
    const [streak, setStreak] = useState(0);
    const [xp, setXp] = useState(0); // Experience Points
    const [mastery, setMastery] = useState({}); // { 'あ': true, 'い': false, ... }
    const [lastVisit, setLastVisit] = useState(null);

    // SRS System: { char: { interval: number (days), nextReview: timestamp, streak: number } }
    const [srsData, setSRSData] = useState({});
    const [unlockedThemes, setUnlockedThemes] = useState(['default']);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        try {
            // Load data from localStorage with safety checks
            const storedStreak = parseInt(localStorage.getItem('koiKana_streak') || '0');
            const storedXp = parseInt(localStorage.getItem('koiKana_xp') || '0');
            const storedLastVisit = localStorage.getItem('koiKana_lastVisit');
            const storedName = localStorage.getItem('koiKana_username');

            // Safe JSON parsing helper
            const safeParse = (key, fallback) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : fallback;
                } catch (e) {
                    console.error(`Error parsing ${key}:`, e);
                    return fallback;
                }
            };

            const storedMastery = safeParse('koiKana_mastery', {});
            const storedSRS = safeParse('koiKana_srs', {});
            const storedUnlockedThemes = safeParse('koiKana_unlockedThemes', ['default']);

            setStreak(isNaN(storedStreak) ? 0 : storedStreak);
            setXp(isNaN(storedXp) ? 0 : storedXp);
            setLastVisit(storedLastVisit);
            setMastery(storedMastery);
            setSRSData(storedSRS);
            if (storedName) setUsername(storedName);
            setUnlockedThemes(storedUnlockedThemes);

            // Daily Streak Logic
            const today = new Date().toDateString();
            if (storedLastVisit !== today) {
                if (storedLastVisit) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (storedLastVisit === yesterday.toDateString()) {
                        const newStreak = (isNaN(storedStreak) ? 0 : storedStreak) + 1;
                        setStreak(newStreak);
                        localStorage.setItem('koiKana_streak', newStreak);
                    } else {
                        // Streak broken
                        const last = new Date(storedLastVisit);
                        const diffTime = Math.abs(new Date() - last);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays > 1) {
                            setStreak(1);
                            localStorage.setItem('koiKana_streak', 1);
                        } else {
                            const newStreak = (isNaN(storedStreak) ? 0 : storedStreak) + 1;
                            setStreak(newStreak);
                            localStorage.setItem('koiKana_streak', newStreak);
                        }
                    }
                } else {
                    setStreak(1);
                    localStorage.setItem('koiKana_streak', 1);
                }
                setLastVisit(today);
                localStorage.setItem('koiKana_lastVisit', today);
            }
        } catch (err) {
            console.error("Critical error loading progress:", err);
            // Fallback to safe defaults to prevent white screen
            setStreak(0);
            setXp(0);
            setMastery({});
        }
    }, []);

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

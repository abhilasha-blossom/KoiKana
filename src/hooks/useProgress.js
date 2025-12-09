import { useState, useEffect } from 'react';


const useProgress = () => {
    const [streak, setStreak] = useState(0);
    const [xp, setXp] = useState(0); // Experience Points
    const [mastery, setMastery] = useState({}); // { 'あ': true, 'い': false, ... }
    const [lastVisit, setLastVisit] = useState(null);

    // SRS System: { char: { interval: number (days), nextReview: timestamp, streak: number } }
    const [srsData, setSRSData] = useState({});
    const [unlockedThemes, setUnlockedThemes] = useState(['default']);

    useEffect(() => {
        // Load data from localStorage
        const storedStreak = parseInt(localStorage.getItem('koiKana_streak') || '0');
        const storedXp = parseInt(localStorage.getItem('koiKana_xp') || '0');
        const storedLastVisit = localStorage.getItem('koiKana_lastVisit');
        const storedMastery = JSON.parse(localStorage.getItem('koiKana_mastery') || '{}');
        const storedSRS = JSON.parse(localStorage.getItem('koiKana_srs') || '{}');

        setStreak(storedStreak);
        setXp(storedXp);
        setLastVisit(storedLastVisit);
        setMastery(storedMastery);
        setSRSData(storedSRS);

        const storedUnlockedThemes = JSON.parse(localStorage.getItem('koiKana_unlockedThemes') || '["default"]');
        setUnlockedThemes(storedUnlockedThemes);

        // Daily Streak Logic
        const today = new Date().toDateString();
        if (storedLastVisit !== today) {
            if (storedLastVisit) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (storedLastVisit === yesterday.toDateString()) {
                    const newStreak = storedStreak + 1;
                    setStreak(newStreak);
                    localStorage.setItem('koiKana_streak', newStreak);
                } else {
                    // Streak broken if not yesterday (and not today, which is covered by outer if)
                    // But wait, if storedLastVisit was 2 days ago, streak breaks.
                    // Simple check: difference in days > 1 -> reset.
                    const last = new Date(storedLastVisit);
                    const diffTime = Math.abs(new Date() - last);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 1) {
                        setStreak(1);
                        localStorage.setItem('koiKana_streak', 1);
                    } else {
                        // Consecutive day
                        const newStreak = storedStreak + 1;
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

    // SRS Logic
    // Intervals: 1, 3, 7, 14, 30, 60 days
    const SRS_INTERVALS = [1, 3, 7, 14, 30, 60];

    const updateSRS = (char, isCorrect) => {
        setSRSData(prev => {
            const current = prev[char] || { interval: 0, nextReview: Date.now(), streak: 0 };
            let newIntervalIndex = current.streak; // Current streak index logic

            let newItem;
            if (isCorrect) {
                // Increase interval
                // If previously wrong (streak 0), moving to index 0 (1 day). 
                // If new, moving to index 0 (1 day).
                // Logic: next interval is based on current streak + 1
                // Wait, interval vs streak.
                // Let's use 'streak' as the index in SRS_INTERVALS.

                const nextIndex = Math.min(current.streak, SRS_INTERVALS.length - 1);
                const daysToAdd = SRS_INTERVALS[nextIndex];

                newItem = {
                    streak: current.streak + 1,
                    interval: daysToAdd,
                    nextReview: Date.now() + (daysToAdd * 24 * 60 * 60 * 1000)
                };
            } else {
                // Reset on failure
                newItem = {
                    streak: 0,
                    interval: 0,
                    nextReview: Date.now() // Due immediately/tomorrow? detailed method says tomorrow usually, but let's make it available again soon.
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

    return { streak, xp, addXP, mastery, markMastered, srsData, updateSRS, getDueItems, unlockedThemes, buyTheme };
};

export default useProgress;

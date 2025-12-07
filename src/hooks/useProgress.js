import { useState, useEffect } from 'react';

const useProgress = () => {
    const [streak, setStreak] = useState(0);
    const [mastery, setMastery] = useState({}); // { 'あ': true, 'い': false, ... }
    const [lastVisit, setLastVisit] = useState(null);

    useEffect(() => {
        // Load data from localStorage
        const storedStreak = parseInt(localStorage.getItem('koiKana_streak') || '0');
        const storedLastVisit = localStorage.getItem('koiKana_lastVisit');
        const storedMastery = JSON.parse(localStorage.getItem('koiKana_mastery') || '{}');

        setStreak(storedStreak);
        setLastVisit(storedLastVisit);
        setMastery(storedMastery);

        // Check Streak Logic
        const today = new Date().toDateString();

        if (storedLastVisit !== today) {
            // It's a new day!
            if (storedLastVisit) {
                const lastDate = new Date(storedLastVisit);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate.toDateString() === yesterday.toDateString()) {
                    // Visited yesterday? Increment streak
                    const newStreak = storedStreak + 1;
                    setStreak(newStreak);
                    localStorage.setItem('koiKana_streak', newStreak);
                } else {
                    // Missed a day? Reset streak (or keep at 1 if just starting)
                    setStreak(1);
                    localStorage.setItem('koiKana_streak', 1);
                }
            } else {
                // First ever visit
                setStreak(1);
                localStorage.setItem('koiKana_streak', 1);
            }
            // Update last visit
            localStorage.setItem('koiKana_lastVisit', today);
        }
    }, []);

    const markMastered = (char) => {
        const newMastery = { ...mastery, [char]: true };
        setMastery(newMastery);
        localStorage.setItem('koiKana_mastery', JSON.stringify(newMastery));
    };

    return { streak, mastery, markMastered };
};

export default useProgress;

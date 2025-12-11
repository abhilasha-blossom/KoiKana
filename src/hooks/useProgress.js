import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();

    // 1. State Initialization (Lazy LocalStorage read)
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('koiKana_streak') || '0'));
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('koiKana_xp') || '0'));
    const [lastVisit, setLastVisit] = useState(() => localStorage.getItem('koiKana_lastVisit'));
    const [username, setUsername] = useState(() => localStorage.getItem('koiKana_username'));

    const [mastery, setMastery] = useState(() => safeParse('koiKana_mastery', {}));
    const [srsData, setSRSData] = useState(() => safeParse('koiKana_srs', {}));
    const [unlockedThemes, setUnlockedThemes] = useState(() => safeParse('koiKana_unlockedThemes', ['default']));

    // 2. Local Daily Streak Logic (Run once on mount)
    useEffect(() => {
        const today = new Date().toDateString();
        if (lastVisit !== today) {
            let newStreak = streak;
            if (lastVisit) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastVisit === yesterday.toDateString()) {
                    // Consecutive
                    // logic handled in sync or separate effect usually, but here we just update for display
                    // We don't auto-increment here to avoid double counting with DB sync logic potentially
                    // But for visual consistency we should.
                } else {
                    // Reset check
                    const last = new Date(lastVisit);
                    const diffTime = Math.abs(new Date() - last);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 1) {
                        newStreak = 0; // Reset
                        setStreak(0);
                        localStorage.setItem('koiKana_streak', '0');
                    }
                }
            } else {
                // First visit
                newStreak = 1;
                setStreak(1);
                localStorage.setItem('koiKana_streak', '1');
            }
            setLastVisit(today);
            localStorage.setItem('koiKana_lastVisit', today);
        }
    }, []);

    // 3. Supabase Sync Logic
    useEffect(() => {
        if (!user) return;

        const syncProfile = async () => {
            try {
                // Fetch remote profile
                let { data: profile, error } = await supabase
                    .from('profiles')
                    .select('xp, streak, username')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                    return;
                }

                if (!profile) {
                    // Create profile if not exists (using local data)
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: user.id,
                            xp: xp,
                            streak: streak,
                            username: username || user.email?.split('@')[0]
                        }]);

                    if (insertError) console.error('Error creating profile:', insertError);
                } else {
                    // Merge Strategy: Max(Local, Remote)
                    // If remote matches local, do nothing.
                    // If remote > local, update local.
                    // If local > remote, update remote.

                    let needsRemoteUpdate = false;
                    let newLocalXp = xp;
                    let newLocalStreak = streak;

                    if (profile.xp > xp) {
                        newLocalXp = profile.xp;
                        setXp(newLocalXp);
                        localStorage.setItem('koiKana_xp', newLocalXp);
                    } else if (xp > profile.xp) {
                        needsRemoteUpdate = true;
                    }

                    if (profile.streak > streak) {
                        newLocalStreak = profile.streak;
                        setStreak(newLocalStreak);
                        localStorage.setItem('koiKana_streak', newLocalStreak);
                    } else if (streak > profile.streak) {
                        needsRemoteUpdate = true;
                    }

                    if (profile.username && profile.username !== username) {
                        setUsername(profile.username);
                        localStorage.setItem('koiKana_username', profile.username);
                    }

                    if (needsRemoteUpdate) {
                        await supabase.from('profiles').update({
                            xp: xp,
                            streak: streak,
                            updated_at: new Date()
                        }).eq('id', user.id);
                    }
                }
            } catch (err) {
                console.error("Sync error:", err);
            }
        };

        syncProfile();
    }, [user]); // Run when user logs in

    // 4. Action Handlers (Update Local + Remote)

    const addXP = async (amount) => {
        const newXp = xp + amount;
        setXp(newXp);
        localStorage.setItem('koiKana_xp', newXp);

        if (user) {
            await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
        }
    };

    const updateUsername = async (name) => {
        setUsername(name);
        localStorage.setItem('koiKana_username', name);
        if (user) {
            await supabase.from('profiles').update({ username: name }).eq('id', user.id);
        }
    };

    const markMastered = (char) => {
        const newMastery = { ...mastery, [char]: true };
        setMastery(newMastery);
        localStorage.setItem('koiKana_mastery', JSON.stringify(newMastery));
        // Mastery sync pending schema update
    };

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
                newItem = { streak: 0, interval: 0, nextReview: Date.now() };
            }
            const newData = { ...prev, [char]: newItem };
            localStorage.setItem('koiKana_srs', JSON.stringify(newData));
            return newData;
        });
    };

    const buyTheme = (themeId, cost) => {
        if (unlockedThemes.includes(themeId)) return true;
        if (xp >= cost) {
            const newXp = xp - cost;
            setXp(newXp);
            localStorage.setItem('koiKana_xp', newXp);
            const newUnlocked = [...unlockedThemes, themeId];
            setUnlockedThemes(newUnlocked);
            localStorage.setItem('koiKana_unlockedThemes', JSON.stringify(newUnlocked));

            if (user) {
                // Sync XP decrease
                supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
                // Theme sync pending schema update
            }
            return true;
        }
        return false;
    };

    const getDueItems = () => {
        const now = Date.now();
        return Object.keys(srsData).filter(char => srsData[char].nextReview <= now);
    };

    return { streak, xp, addXP, mastery, markMastered, srsData, updateSRS, getDueItems, unlockedThemes, buyTheme, username, updateUsername };
};

export default useProgress;

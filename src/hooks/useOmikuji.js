import { useState } from 'react';

const FORTUNES = [
    { type: 'Daikichi', label: 'Great Luck', color: 'text-red-500', desc: 'A perfect day for learning!', icon: '🌸' },
    { type: 'Chukichi', label: 'Middle Luck', color: 'text-pink-500', desc: 'Good progress is on the way.', icon: '🎋' },
    { type: 'Shokichi', label: 'Small Luck', color: 'text-blue-500', desc: 'Steady steps lead to success.', icon: '✨' },
    { type: 'Suekichi', label: 'Future Luck', color: 'text-green-500', desc: 'Your efforts will pay off later.', icon: '🌱' },
];

const useOmikuji = () => {
    const [hasDrawn, setHasDrawn] = useState(() => {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('omikuji_date');
        const storedFortune = localStorage.getItem('omikuji_result');
        return storedDate === today && !!storedFortune;
    });

    const [fortune, setFortune] = useState(() => {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('omikuji_date');
        const storedFortune = localStorage.getItem('omikuji_result');

        if (storedDate === today && storedFortune) {
            try {
                return JSON.parse(storedFortune);
            } catch {
                return null;
            }
        }
        return null;
    });

    const drawFortune = () => {
        if (hasDrawn) return fortune;

        const random = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        const today = new Date().toDateString();

        localStorage.setItem('omikuji_date', today);
        localStorage.setItem('omikuji_result', JSON.stringify(random));

        setFortune(random);
        setHasDrawn(true);
        return random;
    };

    return { hasDrawn, fortune, drawFortune };
};

export default useOmikuji;

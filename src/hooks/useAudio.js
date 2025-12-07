import { useCallback } from 'react';

const useAudio = () => {
    const playSound = useCallback((soundName) => {
        try {
            const audio = new Audio(`/sounds/${soundName}.mp3`);
            audio.volume = 0.5; // Reasonable default volume
            audio.play().catch(e => {
                // Gracefully fail if file doesn't exist or user interaction policy blocks it
                console.log(`Audio file '${soundName}' not found or blocked.`);
            });
        } catch (error) {
            console.error("Audio Error:", error);
        }
    }, []);

    return { playSound };
};

export default useAudio;

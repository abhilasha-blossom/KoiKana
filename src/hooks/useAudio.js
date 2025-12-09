import { useCallback } from 'react';

// Singleton AudioContext to prevent browser limit exhaustion (usually max 6)
let globalAudioContext = null;

const getGlobalContext = () => {
    if (!globalAudioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            globalAudioContext = new AudioContext();
        }
    }
    return globalAudioContext;
};

const useAudio = () => {
    const playSound = useCallback((type) => {
        const ctx = getGlobalContext();
        if (!ctx) return;

        // Resume context if suspended (browser policy requires user interaction first)
        if (ctx.state === 'suspended') {
            ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'pop': // Bubble Pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'splash': // Ripple - Low gentle thud
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'correct': // Chime (Major Arpeggio)
                const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C Major
                frequencies.forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.05);
                    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.5);
                    o.start(now + i * 0.05);
                    o.stop(now + i * 0.05 + 0.5);
                });
                break;

            case 'incorrect': // Soft Error Buzz
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'hover': // High high tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gainNode.gain.setValueAtTime(0.005, now); // Much quieter
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            default:
                break;
        }
    }, []);

    return { playSound };
};

export default useAudio;

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX, Music, Maximize2, Minimize2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const RADIO_STATIONS = [
    { title: "Sakura Chill", src: "/music/peaceful.mp3", vibe: "Relaxing" },
    { title: "Kyoto Flows", src: "/music/traditional.mp3", vibe: "Traditional" },
    { title: "Midnight Tokyo", src: "/music/lofi_placeholder.mp3", vibe: "Focus" }, // Placeholder
];

const RadioPlayer = () => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStationIndex, setCurrentStationIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const { musicVolume } = useSettings();
    const [volume, setVolume] = useState(musicVolume); // Local volume override if needed, or sync?
    // Let's sync local state for slider but effect updates global ref

    const [visualizerHeight, setVisualizerHeight] = useState([20, 40, 60, 30, 50]);

    // Sync volume with global settings initially
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = musicVolume;
        setVolume(musicVolume);
    }, [musicVolume]);

    // Handle Track Change
    useEffect(() => {
        const audio = audioRef.current;
        const station = RADIO_STATIONS[currentStationIndex];

        // Only change src if different (to prevent restart on re-render)
        // Actually, we should check if src matches
        const url = station.src;
        // Simple check: if audio.src ends with url
        if (!audio.src.includes(url)) {
            audio.src = url;
            audio.loop = true;
            if (isPlaying) {
                audio.play().catch(e => console.log("Playback error", e));
            }
        }
    }, [currentStationIndex]);

    // Handle Play/Pause
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play().catch(e => {
                console.warn("Autoplay blocked", e);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Fake Visualizer Animation
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setVisualizerHeight(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
        }, 200);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleNext = () => {
        setCurrentStationIndex((prev) => (prev + 1) % RADIO_STATIONS.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentStationIndex((prev) => (prev - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length);
        setIsPlaying(true);
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        audioRef.current.volume = newVol;
    };

    return (
        <div className={`
            fixed bottom-4 left-4 z-[9999] transition-all duration-500 ease-in-out
            ${isExpanded ? 'w-72' : 'w-14'}
        `}>
            <div className={`
                bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden
                transition-all duration-500
                ${isExpanded ? 'h-80' : 'h-14 rounded-full'}
            `}>
                {/* Collapsed View (Mini Player) */}
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full h-full flex items-center justify-center text-pink-500 hover:bg-pink-50 transition-colors"
                    >
                        {isPlaying ? (
                            <div className="flex items-end gap-0.5 h-4">
                                <div className="w-1 bg-pink-500 animate-music-bar-1 h-3"></div>
                                <div className="w-1 bg-pink-500 animate-music-bar-2 h-full"></div>
                                <div className="w-1 bg-pink-500 animate-music-bar-3 h-2"></div>
                            </div>
                        ) : (
                            <Music size={20} />
                        )}
                    </button>
                )}

                {/* Expanded View */}
                {isExpanded && (
                    <div className="flex flex-col h-full bg-gradient-to-b from-white/40 to-white/90">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100/50">
                            <div className="flex items-center gap-2 text-pink-500">
                                <Music size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Lo-Fi Radio</span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Minimize2 size={16} />
                            </button>
                        </div>

                        {/* Visualizer / Art area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                            {/* Animated BG Blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl animate-pulse-slow"></div>

                            {/* Track Info */}
                            <div className="relative z-10 text-center mb-4">
                                <h3 className="font-black text-xl text-gray-800 mb-1">{RADIO_STATIONS[currentStationIndex].title}</h3>
                                <p className="text-sm font-medium text-pink-500 bg-pink-50/80 px-3 py-1 rounded-full inline-block">
                                    {RADIO_STATIONS[currentStationIndex].vibe}
                                </p>
                            </div>

                            {/* Visualizer Bars */}
                            <div className="flex items-end gap-1 h-12">
                                {visualizerHeight.map((h, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${isPlaying ? h : 10}%` }}
                                        className="w-2 bg-gradient-to-t from-pink-500 to-violet-500 rounded-t-full transition-all duration-200 ease-linear"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-4 bg-white/50 backdrop-blur-md pb-6">
                            {/* Progress Bar (Fake) */}
                            <div className="w-full h-1 bg-gray-200 rounded-full mb-4 overflow-hidden">
                                <div className={`h-full bg-pink-500 rounded-full ${isPlaying ? 'animate-progress-loading w-full' : 'w-0'}`}></div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <button onClick={handlePrev} className="text-gray-400 hover:text-pink-500 transition-colors transform active:scale-95">
                                    <SkipBack size={24} />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-14 h-14 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full shadow-lg shadow-pink-200 transform hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                </button>

                                <button onClick={handleNext} className="text-gray-400 hover:text-pink-500 transition-colors transform active:scale-95">
                                    <SkipForward size={24} />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className="flex items-center gap-2 px-2">
                                {volume === 0 ? <VolumeX size={16} className="text-gray-400" /> : <Volume2 size={16} className="text-gray-400" />}
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadioPlayer;

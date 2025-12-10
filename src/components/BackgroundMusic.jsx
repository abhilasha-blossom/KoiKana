import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const BackgroundMusic = () => {
    const location = useLocation();
    const audioRef = useRef(new Audio());
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { musicVolume } = useSettings();
    const [currentTrack, setCurrentTrack] = useState(null);

    // Track Definitions
    // Note: User must provide these files in public/music/
    const TRACKS = {
        TRADITIONAL: '/music/traditional.mp3',
        PEACEFUL: '/music/peaceful.mp3',
    };

    // 2. Handle Track Switching
    const handleTrackChange = (newSrc) => {
        const audio = audioRef.current;

        // Fade out? For now, simple switch.
        audio.pause();

        if (newSrc) {
            audio.src = newSrc;
            audio.loop = true;
            audio.volume = isMuted ? 0 : musicVolume;

            // Attempt to play
            // Browser might block this if no interaction yet, but we'll try.
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                        console.log("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
            }
            setCurrentTrack(newSrc);
        } else {
            setCurrentTrack(null);
            setIsPlaying(false);
        }
    };

    // 1. Determine Track based on Route (Now after handleTrackChange is defined)
    useEffect(() => {
        const path = location.pathname;
        let newTrack = null;

        if (path === '/') {
            // Sign In / Torii Gate -> Traditional
            newTrack = TRACKS.TRADITIONAL;
        } else if (path === '/kana' || path === '/speaking' || path === '/loading') {
            // Study Modes / Voiceover Pages -> Silence
            newTrack = null;
        } else {
            // Home, Shop, Quiz, etc -> Peaceful
            newTrack = TRACKS.PEACEFUL;
        }

        if (newTrack !== currentTrack) {
            handleTrackChange(newTrack);
        }
    }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // 3. Handle Mute Toggle
    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        if (audioRef.current) {
            audioRef.current.volume = newState ? 0 : musicVolume;
        }
    };

    // 4. Handle User Interaction (Unlock Audio Context)
    // We add a global click listener once to unlock audio if blocked
    useEffect(() => {
        const unlockAudio = () => {
            if (currentTrack && audioRef.current.paused && !isMuted) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log("Still blocked", e));
            }
        };
        window.addEventListener('click', unlockAudio, { once: true });
        return () => window.removeEventListener('click', unlockAudio);
    }, [currentTrack, isMuted]);


    // React to volume changes from Settings
    useEffect(() => {
        if (audioRef.current && !isMuted) {
            audioRef.current.volume = musicVolume;
        }
    }, [musicVolume, isMuted]);

    // Don't render controls if in silent mode (optional, but keep for unmuting?)
    // Actually, user might want to force music even in study modes later, 
    // but for now we follow requirements: "must be calm... but NOT in master kana and speaking".
    // We'll hide the player if no track is selected.
    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] animate-fade-in">
            <button
                onClick={toggleMute}
                className={`
                    p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
                    flex items-center justify-center group overflow-hidden relative
                    ${isMuted
                        ? 'bg-gray-200/50 text-gray-500 hover:bg-gray-300/60'
                        : 'bg-white/40 hover:bg-white/60 text-pink-500 border border-white/50 animate-pulse-slow'
                    }
                `}
                title={isMuted ? "Unmute Music" : "Mute Music"}
            >
                {/* Icon Layer */}
                <div className="relative z-10 w-6 h-6 flex items-center justify-center">
                    {isMuted ? <VolumeX size={20} /> : <MediaIcon isPlaying={isPlaying} />}
                </div>

                {/* Label (Slide In) */}
                <span className={`
                    absolute left-12 whitespace-nowrap text-xs font-bold bg-white/80 px-2 py-1 rounded-md text-[#4A3B52]
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-sm
                `}>
                    {isMuted ? "Music Off" : "Music On"}
                </span>
            </button>

            {/* Hidden Audio Element (Managed by ref, but we could use <audio> tag too. Ref is finer control) */}
        </div>
    );
};

const MediaIcon = ({ isPlaying }) => (
    <div className="relative w-full h-full flex items-center justify-center">
        <Music size={20} className={isPlaying ? "animate-bounce" : ""} />
        {isPlaying && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
        )}
    </div>
);

export default BackgroundMusic;

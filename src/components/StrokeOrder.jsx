import React, { useMemo, useEffect, useState } from 'react';
import hiraganaData from '../data/allHiragana.json';
import katakanaData from '../data/allKatakana.json';

const StrokeOrder = ({ char, className = "w-24 h-24", animate = true }) => {
    const charData = useMemo(() => {
        const code = char.charCodeAt(0);
        // Check Hiragana range (approx)
        if (code >= 0x3040 && code <= 0x309F) {
            return hiraganaData.find(c => c.charCode === code);
        }
        // Check Katakana range
        if (code >= 0x30A0 && code <= 0x30FF) {
            return katakanaData.find(c => c.charCode === code);
        }
        return null;
    }, [char]);

    const paths = useMemo(() => {
        return charData ? charData.strokes.map(s => s.value) : [];
    }, [charData]);

    if (!charData) return null;

    return (
        <svg
            viewBox="0 0 1024 1024"
            className={`${className}`}
        >
            {/* Background Guide (Ghost) */}
            <g className="opacity-10">
                {paths.map((d, i) => (
                    <path
                        key={`bg-${i}`}
                        d={d}
                        fill="currentColor"
                        className="text-gray-900"
                    />
                ))}
            </g>

            {/* Animated Strokes */}
            {animate && (
                <g>
                    {paths.map((d, i) => (
                        <Stroke
                            key={`stroke-${i}`}
                            d={d}
                            index={i}
                            total={paths.length}
                        />
                    ))}
                </g>
            )}
        </svg>
    );
};

const Stroke = ({ d, index }) => {
    const [length, setLength] = useState(0);
    const ref = React.useRef(null);

    useEffect(() => {
        if (ref.current) {
            setLength(ref.current.getTotalLength());
        }
    }, [d]);

    return (
        <path
            ref={ref}
            d={d}
            fill="transparent"
            stroke="#4F46E5" // Indigo-600
            strokeWidth="50" // Adjust based on viewBox 1024
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={length}
            strokeDashoffset={length}
            className="animate-stroke"
            style={{
                animationDelay: `${index * 0.8}s`,
                animationDuration: '1s',
                animationFillMode: 'forwards'
            }}
        />
    );
};

export default StrokeOrder;

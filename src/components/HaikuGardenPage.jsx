import React, { useState, useRef, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
    horizontalListSortingStrategy,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Download, Image as ImageIcon, Sparkles, RefreshCw, Type, CircleHelp, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hiragana, katakana } from '../data/kanaData';

// --- Sub-components for DnD ---

const SortableWord = ({ id, word, type, isOverlay }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { word, type } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                px-3 py-1.5 rounded-lg font-bold text-sm cursor-grab active:cursor-grabbing select-none shadow-sm flex flex-col items-center justify-center min-w-[60px] text-center
                ${type === 'bank' ? 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300' : ''}
                ${type === 'line' ? 'bg-white/90 backdrop-blur-sm text-[#4A3B52] border border-white/50 shadow-md' : ''}
                ${isOverlay ? 'scale-110 shadow-xl ring-2 ring-pink-400 z-50' : ''}
                ${word.type === 'particle' ? 'bg-pink-50 border-pink-100' : ''}
            `}
        >
            <span className="text-base leading-none mb-0.5">{word.kana}</span>
            <span className="block text-[9px] text-gray-400 font-normal leading-tight">{word.word}</span>
            {word.meaning && <span className="block text-[9px] text-pink-400 font-normal leading-tight max-w-[80px] truncate">{word.meaning}</span>}
        </div>
    );
};

const DroppableLine = ({ id, items }) => {
    const { setNodeRef } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            className="min-h-[60px] flex flex-wrap items-center justify-center gap-2 p-2 border-b-2 border-dashed border-gray-300/50 hover:bg-white/10 transition-colors rounded-lg mb-4"
        >
            <SortableContext items={items} strategy={horizontalListSortingStrategy}>
                {items.map((item) => (
                    <SortableWord key={item.id} id={item.id} word={item} type="line" />
                ))}
            </SortableContext>
            {items.length === 0 && (
                <span className="text-gray-300/50 text-sm italic pointer-events-none">Drop words here</span>
            )}
        </div>
    );
};

// --- Main Component ---

const HaikuGardenPage = () => {
    const [wordBank, setWordBank] = useState([]);
    // Lines: top (5), middle (7), bottom (5)
    // We store items as objects with unique IDs for DnD
    const [lines, setLines] = useState({
        line1: [],
        line2: [],
        line3: []
    });
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [background, setBackground] = useState('bg-gradient-to-br from-pink-100 to-blue-100');
    const poemRef = useRef(null);

    const [showHelp, setShowHelp] = useState(false);
    const [activeTab, setActiveTab] = useState('vocabulary'); // 'vocabulary' | 'particles'

    // Initialize Word Bank
    useEffect(() => {
        const allWords = [];

        // Add Particles (Grammar Glue)
        const particles = [
            { kana: 'は', word: 'wa', meaning: '(topic)', type: 'particle' },
            { kana: 'が', word: 'ga', meaning: '(subject)', type: 'particle' },
            { kana: 'を', word: 'wo', meaning: '(object)', type: 'particle' },
            { kana: 'に', word: 'ni', meaning: 'to/at', type: 'particle' },
            { kana: 'で', word: 'de', meaning: 'by/at', type: 'particle' },
            { kana: 'の', word: 'no', meaning: '\'s/of', type: 'particle' },
            { kana: 'と', word: 'to', meaning: 'and/with', type: 'particle' },
            { kana: 'も', word: 'mo', meaning: 'also', type: 'particle' },
            { kana: 'か', word: 'ka', meaning: '?', type: 'particle' },
            { kana: 'よ', word: 'yo', meaning: '!', type: 'particle' },
            { kana: 'ね', word: 'ne', meaning: 'right?', type: 'particle' },
        ];

        particles.forEach(p => {
            allWords.push({
                id: `particle-${p.word}-${Math.random().toString(36).substr(2, 9)}`,
                ...p
            });
        });

        const process = (list) => {
            list.forEach(char => {
                if (char.examples) {
                    char.examples.forEach(ex => {
                        // Simple deduplication based on reading
                        if (!allWords.some(w => w.word === ex.word)) {
                            allWords.push({
                                id: `word-${ex.word}-${Math.random().toString(36).substr(2, 9)}`,
                                ...ex
                            });
                        }
                    });
                }
            });
        };
        process(hiragana);
        process(katakana);

        // Shuffle and take a subset for now
        // Prioritize particles at the top? No, shuffle all or keep particles separate? 
        // Let's shuffle all for discoverability but maybe keep particles accessible. 
        // For now, random shuffle.
        setWordBank(allWords.sort(() => 0.5 - Math.random()).slice(0, 80)); // Increased limit
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        // Find the item details
        let item = wordBank.find(w => w.id === active.id);
        if (!item) {
            Object.values(lines).forEach(line => {
                const found = line.find(w => w.id === active.id);
                if (found) item = found;
            });
        }
        setActiveItem(item);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        // Logic to move between containers (Bank <-> Lines) is tricky with dnd-kit's simple sortable
        // For a simpler MVP, let's just use dragEnd to handle moves?
        // Actually, for visual feedback `onDragOver` is better for moving between lists.

        // For now, let's stick to a simpler model:
        // We will implement `onDragEnd` to handle the final drop logic.
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;

        setActiveId(null);
        setActiveItem(null);

        if (!overId) return;

        // Find source and destination
        let sourceList = 'bank';
        let destList = null;

        // Where is it coming from?
        if (wordBank.find(w => w.id === activeId)) sourceList = 'bank';
        else if (lines.line1.find(w => w.id === activeId)) sourceList = 'line1';
        else if (lines.line2.find(w => w.id === activeId)) sourceList = 'line2';
        else if (lines.line3.find(w => w.id === activeId)) sourceList = 'line3';

        // Where is it going?
        // Check if over a container ID directly
        if (overId === 'bank-container') destList = 'bank';
        else if (overId === 'line1') destList = 'line1';
        else if (overId === 'line2') destList = 'line2';
        else if (overId === 'line3') destList = 'line3';
        else {
            // Or over an item in a list
            if (wordBank.find(w => w.id === overId)) destList = 'bank';
            else if (lines.line1.find(w => w.id === overId)) destList = 'line1';
            else if (lines.line2.find(w => w.id === overId)) destList = 'line2';
            else if (lines.line3.find(w => w.id === overId)) destList = 'line3';
        }

        if (!destList || (sourceList === destList && !overId)) return;

        // Move the item
        let itemToMove;

        // Remove from source
        if (sourceList === 'bank') {
            itemToMove = wordBank.find(w => w.id === activeId);
            // If moving within bank, just reorder? 
            // If moving to line, remove from bank (or COPY? Let's move for now to consume words)
            if (destList !== 'bank') {
                setWordBank(prev => prev.filter(w => w.id !== activeId));
            }
        } else {
            // Remove from line
            const list = lines[sourceList];
            itemToMove = list.find(w => w.id === activeId);
            setLines(prev => ({
                ...prev,
                [sourceList]: prev[sourceList].filter(w => w.id !== activeId)
            }));
        }

        // Add to dest
        if (destList === 'bank') {
            if (sourceList !== 'bank') {
                setWordBank(prev => [...prev, itemToMove]);
            }
        } else {
            // Add to a specific line
            setLines(prev => ({
                ...prev,
                [destList]: [...prev[destList], itemToMove]
            }));
        }
    };

    const countSyllables = (text) => {
        // Very rough approximation: number of characters
        // Refine later for small ya/yu/yo etc.
        let count = 0;
        for (let i = 0; i < text.length; i++) {
            if (['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'].includes(text[i])) continue;
            count++;
        }
        return count;
    };

    const getLineSyllables = (lineItems) => {
        return lineItems.reduce((acc, item) => acc + countSyllables(item.kana), 0);
    };

    const downloadImage = async () => {
        if (poemRef.current) {
            // Need to import html2canvas dynamically if server-side, but this is client Vite.
            // Check top import.
            const canvas = await import('html2canvas').then(m => m.default(poemRef.current, {
                backgroundColor: null,
                scale: 2
            }));
            const link = document.createElement('a');
            link.download = 'my-haiku.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const backgrounds = [
        'bg-gradient-to-br from-pink-100 to-blue-100', // Default
        'bg-[#FFF0F5]', // Sakuramochi
        'bg-slate-100', // Monochrome
        'bg-amber-50', // Traditional Washi
        'bg-gradient-to-r from-violet-200 to-pink-200', // Twilight
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center relative overflow-hidden font-sans text-slate-800">
            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-scale-up border-4 border-pink-100">
                        <button
                            onClick={() => setShowHelp(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-[#4A3B52] mb-1">How to Haiku 🌸</h2>
                            <p className="text-gray-400 text-sm">Express yourself in Japanese!</p>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="bg-pink-50 p-4 rounded-2xl">
                                <h3 className="font-bold text-pink-600 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Structure
                                </h3>
                                <p className="text-sm text-gray-600">
                                    A Haiku has 3 lines with a rhythm of <strong>5, 7, 5</strong> syllables.
                                    <br /><span className="text-xs text-gray-400 mt-1 block">(Don't worry about being perfect, just have fun!)</span>
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Sentence Glue
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Use <strong>particles</strong> to connect words:
                                </p>
                                <ul className="text-sm grid grid-cols-2 gap-2">
                                    <li className="flex items-center gap-2"><span className="font-bold bg-white px-1.5 rounded text-blue-500">no</span> <span className="text-gray-500">'s / of</span></li>
                                    <li className="flex items-center gap-2"><span className="font-bold bg-white px-1.5 rounded text-blue-500">to</span> <span className="text-gray-500">and / with</span></li>
                                    <li className="flex items-center gap-2"><span className="font-bold bg-white px-1.5 rounded text-blue-500">wa</span> <span className="text-gray-500">topic marker</span></li>
                                    <li className="flex items-center gap-2"><span className="font-bold bg-white px-1.5 rounded text-blue-500">ka</span> <span className="text-gray-500">question ?</span></li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowHelp(false)}
                            className="w-full mt-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" /> Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/start" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        Haiku Garden <span className="text-sm font-normal text-gray-400 ml-2 hidden sm:inline">Creative Mode</span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHelp(true)}
                        className="p-2 rounded-full bg-white border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors shadow-sm"
                        title="How to make Haiku"
                    >
                        <CircleHelp className="w-5 h-5" />
                    </button>
                    <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg shadow-pink-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 w-full max-w-4xl flex flex-col gap-6 p-6 pb-20">

                    {/* Top: Word Bank */}
                    <div className="w-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-64 shrink-0">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
                                <RefreshCw className="w-4 h-4" /> Word Bank
                            </h2>
                            {/* Tabs */}
                            <div className="flex bg-gray-200/50 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('vocabulary')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'vocabulary' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Vocabulary
                                </button>
                                <button
                                    onClick={() => setActiveTab('particles')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'particles' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Particles
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                            <SortableContext items={wordBank} strategy={rectSortingStrategy} id="bank-container">
                                <div className="flex flex-wrap gap-2 content-start">
                                    {wordBank
                                        .filter(w => activeTab === 'particles' ? w.type === 'particle' : w.type !== 'particle')
                                        .map(word => (
                                            <SortableWord key={word.id} id={word.id} word={word} type="bank" />
                                        ))}
                                </div>
                            </SortableContext>
                            {wordBank.filter(w => activeTab === 'particles' ? w.type === 'particle' : w.type !== 'particle').length === 0 && (
                                <div className="text-center text-gray-400 text-xs mt-4 italic">
                                    No words available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Canvas */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                        {/* Controls */}
                        <div className="mb-6 flex gap-3 backdrop-blur-sm bg-white/50 p-2 rounded-full border border-white/50">
                            {backgrounds.map((bg, i) => (
                                <button
                                    key={i}
                                    className={`w-8 h-8 rounded-full border-2 ${bg} ${background === bg ? 'border-pink-500 shadow-md scale-110' : 'border-transparent hover:scale-110'}`}
                                    onClick={() => setBackground(bg)}
                                />
                            ))}
                        </div>

                        {/* The Poem Card */}
                        <div
                            ref={poemRef}
                            id="poem-card"
                            className={`
                                relative w-full max-w-lg aspect-[3/4] md:aspect-[4/3] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-500
                                ${background}
                                border-[8px] border-white
                            `}
                        >
                            <div className="text-center mb-8 opacity-50">
                                <Sparkles className="w-8 h-8 mx-auto text-pink-400 mb-2" />
                                <span className="font-serif italic text-gray-500">My Haiku</span>
                            </div>

                            <div className="w-full space-y-6">
                                {/* Line 1 (5 syllables) */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 px-2 uppercase tracking-widest">
                                        <span>First Line</span>
                                        <span className={getLineSyllables(lines.line1) === 5 ? 'text-green-500' : 'text-gray-400'}>
                                            {getLineSyllables(lines.line1)} / 5
                                        </span>
                                    </div>
                                    <DroppableLine id="line1" items={lines.line1} />
                                </div>

                                {/* Line 2 (7 syllables) */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 px-2 uppercase tracking-widest">
                                        <span>Second Line</span>
                                        <span className={getLineSyllables(lines.line2) === 7 ? 'text-green-500' : 'text-gray-400'}>
                                            {getLineSyllables(lines.line2)} / 7
                                        </span>
                                    </div>
                                    <DroppableLine id="line2" items={lines.line2} />
                                </div>

                                {/* Line 3 (5 syllables) */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 px-2 uppercase tracking-widest">
                                        <span>Third Line</span>
                                        <span className={getLineSyllables(lines.line3) === 5 ? 'text-green-500' : 'text-gray-400'}>
                                            {getLineSyllables(lines.line3)} / 5
                                        </span>
                                    </div>
                                    <DroppableLine id="line3" items={lines.line3} />
                                </div>
                            </div>

                            <div className="mt-8 text-right w-full">
                                <div className="inline-block mt-4 border-t border-gray-400/30 pt-2 pr-4">
                                    <p className="font-serif italic text-gray-500 text-sm">Created with KoiKana 🌸</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <DragOverlay>
                    {activeItem ? <SortableWord id={activeId} word={activeItem} type="bank" isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default HaikuGardenPage;

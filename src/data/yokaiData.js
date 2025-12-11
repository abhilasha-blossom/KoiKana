export const YOKAI_DATA = [
    {
        id: 'kodama',
        name: 'Kodama',
        kanji: '木霊',
        description: 'A gentle spirit that lives in trees. It indicates a healthy forest and a healthy mind.',
        unlockHint: 'Begin your journey.',
        condition: (stats) => stats.xp >= 0, // Unlocked by default/start
        type: 'Nature',
        color: 'text-green-500',
        BgColor: 'bg-green-100',
        emoji: '🌿'
    },
    {
        id: 'kappa',
        name: 'Kappa',
        kanji: '河童',
        description: 'A water-dwelling cryptid. Loves cucumbers and sumo wrestling. Watch out for the dish on its head!',
        unlockHint: 'Reach 100 XP to prove your consistency.',
        condition: (stats) => stats.xp >= 100,
        type: 'Water',
        color: 'text-blue-500',
        BgColor: 'bg-blue-100',
        emoji: '🥒'
    },
    {
        id: 'tanuki',
        name: 'Tanuki',
        kanji: '狸',
        description: 'A shapeshifting raccoon dog known for being jolly and slightly mischievous. Bringer of prosperity.',
        unlockHint: 'Master at least 5 characters.',
        condition: (stats) => Object.keys(stats.mastery || {}).length >= 5,
        type: 'Trickster',
        color: 'text-orange-600',
        BgColor: 'bg-orange-100',
        emoji: '🍃'
    },
    {
        id: 'kitsune',
        name: 'Kitsune',
        kanji: '狐',
        description: 'A wise fox spirit with magical abilities. The more tails, the older and wiser it is.',
        unlockHint: 'Maintain a streak of 3 days.',
        condition: (stats) => stats.streak >= 3,
        type: 'Divine',
        color: 'text-red-500',
        BgColor: 'bg-red-100',
        emoji: '🦊'
    },
    {
        id: 'tengu',
        name: 'Tengu',
        kanji: '天狗',
        description: 'A powerful mountain warrior with a long nose. Master of the wind and martial arts.',
        unlockHint: 'Master 46 characters (Hiragana Complete).',
        condition: (stats) => Object.keys(stats.mastery || {}).length >= 46,
        type: 'Warrior',
        color: 'text-red-700',
        BgColor: 'bg-red-200',
        emoji: '👺'
    },
    {
        id: 'tsukumogami',
        name: 'Tsukumogami',
        kanji: '付喪神',
        description: 'Tools that have acquired a spirit after 100 years of service. Treat your tools well!',
        unlockHint: 'Accumulate 1000 XP.',
        condition: (stats) => stats.xp >= 1000,
        type: 'Object',
        color: 'text-purple-500',
        BgColor: 'bg-purple-100',
        emoji: '☂️'
    },
    {
        id: 'kirin',
        name: 'Kirin',
        kanji: '麒麟',
        description: 'A mythical hooved chimerical creature. It is said to appear with the imminent arrival of a sage.',
        unlockHint: 'A true master... (Master 92 characters)',
        condition: (stats) => Object.keys(stats.mastery || {}).length >= 92,
        type: 'Legendary',
        color: 'text-yellow-600',
        BgColor: 'bg-yellow-100',
        emoji: '🐉'
    }
];

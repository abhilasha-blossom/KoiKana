/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'sakura-pink': 'var(--color-sakura-pink)',
                'lavender': 'var(--color-lavender)',
            }
        },
    },
    plugins: [],
}

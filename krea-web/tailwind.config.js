/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'krea-black': '#050505',
                'krea-purple': '#8b5cf6', // Violet 500
                'krea-green': '#39ff14', // Neon Green
            },
            fontFamily: {
                'impact': ['Oswald', 'Impact', 'sans-serif'],
                'sans': ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#2e4088',
                    dark: '#1a2555',
                    light: '#3a52a8',
                },
                accent: {
                    DEFAULT: '#f0c14b',
                    light: '#ffeeba',
                },
                cream: '#fdf6e3',
            },
            fontFamily: {
                kanit: ['Kanit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    keyframes: {
      fadeIn: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
      pop: { '0%': { opacity: 0, transform: 'scale(.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
    },
    animation: { 'fade-in': 'fadeIn .35s ease-out both', pop: 'pop .2s ease-out both' },
  } },
  plugins: [],
}

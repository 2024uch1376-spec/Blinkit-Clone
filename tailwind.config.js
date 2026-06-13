/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        blinkit: {
          yellow: '#F7EC13',
          green: '#0C831F',
          greenHover: '#096E19',
          lightGreen: '#F3FAF5',
          dark: '#1C1C1C',
          gray: '#666666',
        }
      }
    },
  },
  plugins: [],
}

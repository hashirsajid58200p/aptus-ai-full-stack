/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FFFDF9',
          100: '#F7F4EC',
          200: '#EFEBE0',
          800: '#292524',
          900: '#1C1917',
        },
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
        },
        emerald: {
          50: '#ecfdf5',
          600: '#059669',
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        discord: '#5865F2',
        dark: '#1e1f22',
        darker: '#2b2d31',
        darkest: '#111214',
        accent: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}

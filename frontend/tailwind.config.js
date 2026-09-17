/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12151C',
        paper: '#FAFAF7',
        surface: '#FFFFFF',
        brand: {
          DEFAULT: '#0E7C5A',
          dark: '#0B5F45',
          light: '#E6F4EE',
        },
        loss: {
          DEFAULT: '#D6453D',
          light: '#FBEAE9',
        },
        line: '#E6E4DD',
        muted: '#6B7280',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};

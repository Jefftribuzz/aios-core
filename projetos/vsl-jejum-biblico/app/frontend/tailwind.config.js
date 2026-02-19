/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5F2D',      // Verde crescimento
        secondary: '#D4A574',    // Ouro espiritual
        accent: '#E74C3C',       // Vermelho ação
        background: '#F9F7F4',   // Off-white
        text: '#2C3E50',         // Charcoal
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      spacing: {
        0: '0',
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '48px',
      },
    },
  },
  plugins: [],
};

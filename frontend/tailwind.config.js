/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spatial: {
          bg: '#030712',
          card: 'rgba(15, 23, 42, 0.45)',
          'card-hover': 'rgba(30, 41, 59, 0.55)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-focus': 'rgba(34, 211, 238, 0.4)',
        },
        cyan: {
          glow: '#22d3ee',
          neon: '#06b6d4',
          dim: 'rgba(6, 182, 212, 0.15)',
        },
        crimson: {
          neon: '#f43f5e',
          glow: '#fb7185',
          dim: 'rgba(244, 63, 94, 0.15)',
        },
        brand: {
          cream: '#fbfaf7',
          navy: '#0b132b',
          dark: '#0f172a',
          emerald: '#059669',
          yellow: '#f5c344',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'antigravity': '0 20px 50px -12px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'antigravity-hover': '0 25px 60px -10px rgba(0, 0, 0, 0.75), 0 0 20px -2px rgba(34, 211, 238, 0.25), 0 0 1px 1px rgba(255, 255, 255, 0.15)',
        'antigravity-dock': '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glow-cyan': '0 0 24px 2px rgba(34, 211, 238, 0.35)',
        'glow-crimson': '0 0 24px 2px rgba(244, 63, 94, 0.35)',
        'glow-emerald': '0 0 24px 2px rgba(16, 185, 129, 0.35)',
      },
      backdropBlur: {
        '3xl': '40px',
        '4xl': '60px',
      },
      animation: {
        'orb-slow': 'orbFloat 18s ease-in-out infinite alternate',
        'orb-reverse': 'orbFloatReverse 22s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        orbFloat: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(60px, 40px) scale(1.15)' },
          '100%': { transform: 'translate(-40px, 70px) scale(0.95)' },
        },
        orbFloatReverse: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-50px, -40px) scale(1.1)' },
          '100%': { transform: 'translate(40px, -60px) scale(0.9)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}




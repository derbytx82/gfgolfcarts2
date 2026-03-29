import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#1A1A1A',
          900: '#1B4332',
          800: '#285341',
          700: '#3D6555',
          500: '#6F7F78',
          400: '#A2ADA8',
          300: '#D9D2C5',
          200: '#EAE5DB',
          100: '#F8F5F0',
        },
        accent: {
          gold: '#C9A84C',
          emerald: '#1B4332',
          steel: '#2F5D4B',
          ember: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 60px -24px rgba(26, 26, 26, 0.35)',
        glow: '0 10px 30px rgba(201, 168, 76, 0.28)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 15% 10%, rgba(201, 168, 76, 0.18), transparent 42%), radial-gradient(circle at 85% 0%, rgba(248, 245, 240, 0.1), transparent 36%), linear-gradient(180deg, #1B4332 0%, #173B2D 45%, #1A1A1A 100%)',
        'soft-grid':
          'linear-gradient(to right, rgba(26, 26, 26, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(26, 26, 26, 0.08) 1px, transparent 1px)',
        'mesh-gradient':
          'radial-gradient(at 0% 0%, rgba(27, 67, 50, 0.18) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(201, 168, 76, 0.16) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(26, 26, 26, 0.1) 0, transparent 50%)',
      },
      spacing: {
        18: '4.5rem',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [typography],
}

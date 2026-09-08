/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        porcelain: '#FFFFF6',
        bone: '#E8E2D4',
        lilac: '#AAA0BB',
        lavender: '#B57DDA',
        french: '#41478B',
        darkFrench: '#2D2A4A',
        surface: '#FAF8FD',
      },
      transitionTimingFunction: {
        'spring-cinematic': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'spring-snappy': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'bezel-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'bezel-outer': '0 10px 30px -10px rgba(65, 71, 139, 0.08), 0 0 0 1px rgba(232, 226, 212, 0.8)',
        'glow-lavender': '0 0 25px -5px rgba(181, 125, 218, 0.4)',
        'glow-french': '0 0 25px -5px rgba(65, 71, 139, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

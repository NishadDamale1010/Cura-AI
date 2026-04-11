/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 16px 0 rgba(14, 165, 233, 0.06)',
        'soft-lg': '0 4px 24px 0 rgba(14, 165, 233, 0.08)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.03)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.06)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
        'glow-cyan': '0 0 20px 0 rgba(6, 182, 212, 0.4)',
        'glow-violet': '0 0 20px 0 rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.25)' },
          '50%': { boxShadow: '0 0 0 12px rgba(34,197,94,0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      },
    },
  },
  plugins: [],
};

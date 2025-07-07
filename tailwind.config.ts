import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}', // Pour tous tes composants React TS/TSX
  ],
  darkMode: 'class', // Mode sombre activé via classe "dark"
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // bleu 500
          dark: '#2563eb',   // bleu 600
        },
      },
    },
  },
  plugins: [typography],
};

export default config;

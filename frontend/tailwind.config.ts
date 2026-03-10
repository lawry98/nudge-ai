import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#1A1A2E',
        'sidebar-active': '#2A2A4A',
        nudge: '#7C6EF0',
        'nudge-dark': '#6358D4',
      },
    },
  },
  plugins: [],
}
export default config

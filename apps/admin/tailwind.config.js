/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e6e6ff',
          200: '#e6dcf5',  // rgb(230, 220, 245) - Soft lavender
          300: '#d4c7ed',
          400: '#c2b3e5',
          500: '#b09fdd',  // rgb(176, 159, 221) - Muted purple
          600: '#9e8bd5',
          700: '#8c77cd',
          800: '#7a63c5',
          900: '#684fbd',
          950: '#563bb5',
        },
        green: {
          50: '#f0fff4',
          100: '#e5fff0',  // rgb(229, 255, 235) - Soft mint
          200: '#dcffe6',
          300: '#d3ffdc',
          400: '#caffd2',
          500: '#c1ffc8',  // Light mint
          600: '#b8ffbe',
          700: '#afffb4',
          800: '#a6ffaa',
          900: '#9dffa0',
          950: '#94ff96',
        },
        mint: {
          50: '#f0fff4',
          100: '#e5fff0',  // rgb(229, 255, 235) - Exact mint from image
          200: '#dcffe6',
          300: '#d3ffdc',
          400: '#caffd2',
          500: '#c1ffc8',
          600: '#b8ffbe',
          700: '#afffb4',
          800: '#a6ffaa',
          900: '#9dffa0',
          950: '#94ff96',
        },
        lavender: {
          50: '#faf9ff',
          100: '#f5f3ff',
          200: '#e6dcf5',  // rgb(230, 220, 245) - Exact lavender from image
          300: '#d7c5eb',
          400: '#c8aee1',
          500: '#b997d7',
          600: '#aa80cd',
          700: '#9b69c3',
          800: '#8c52b9',
          900: '#7d3baf',
          950: '#6e24a5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
